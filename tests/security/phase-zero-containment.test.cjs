const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { spawnSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..', '..');
const endpointPath = path.join(root, 'api', 'bienestar-pipeline.js');
const polishPath = path.join(root, 'scripts', 'polish-articles.mjs');

async function importEndpoint() {
  return import(`${pathToFileURL(endpointPath).href}?test=${Date.now()}-${Math.random()}`);
}

function createResponse() {
  return {
    statusCode: null,
    headers: {},
    body: null,
    ended: false,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
    end() {
      this.ended = true;
      return this;
    },
  };
}

async function withEnvironment(overrides, callback) {
  const previous = {};
  for (const [key, value] of Object.entries(overrides)) {
    previous[key] = process.env[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    return await callback();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test('endpoint deshabilitado responde 503 sin importar el adaptador', async () => {
  await withEnvironment(
    { NODE_ENV: 'test', BIENESTAR_PIPELINE_ENABLED: undefined },
    async () => {
      const source = fs.readFileSync(endpointPath, 'utf8');
      const gateIndex = source.indexOf('if (!isPipelineEnabled())');
      const importIndex = source.indexOf('await import(');
      assert.ok(gateIndex >= 0 && importIndex > gateIndex);

      const { default: handler } = await importEndpoint();
      const res = createResponse();
      await handler({ method: 'POST', headers: {}, body: {} }, res);
      assert.equal(res.statusCode, 503);
    }
  );
});

test('producción permanece bloqueada incluso con la variable habilitada', async () => {
  await withEnvironment(
    { NODE_ENV: 'production', BIENESTAR_PIPELINE_ENABLED: 'true' },
    async () => {
      const { default: handler } = await importEndpoint();
      const res = createResponse();
      await handler({ method: 'POST', headers: {}, body: {} }, res);
      assert.equal(res.statusCode, 503);
    }
  );
});

test('valores ausentes, falsos o inválidos fallan cerrados', async () => {
  const { isPipelineEnabled } = (await importEndpoint()).__testables;
  assert.equal(isPipelineEnabled({ NODE_ENV: 'test' }), false);
  assert.equal(isPipelineEnabled({ NODE_ENV: 'test', BIENESTAR_PIPELINE_ENABLED: 'false' }), false);
  assert.equal(isPipelineEnabled({ NODE_ENV: 'test', BIENESTAR_PIPELINE_ENABLED: 'TRUE' }), false);
  assert.equal(isPipelineEnabled({ NODE_ENV: 'test', BIENESTAR_PIPELINE_ENABLED: '1' }), false);
  assert.equal(isPipelineEnabled({ NODE_ENV: 'production', BIENESTAR_PIPELINE_ENABLED: 'true' }), false);
});

test('CORS rechaza wildcard y orígenes no autorizados', async () => {
  const { getAllowedOrigins, applyCors } = (await importEndpoint()).__testables;
  const env = {
    BIENESTAR_PIPELINE_ALLOWED_ORIGINS: '*,https://editor.example.com,not-a-url',
  };
  assert.deepEqual(getAllowedOrigins(env), ['https://editor.example.com']);

  const denied = createResponse();
  assert.equal(applyCors({ headers: { origin: 'https://evil.example' } }, denied, env), false);
  assert.equal(denied.headers['Access-Control-Allow-Origin'], undefined);

  const allowed = createResponse();
  assert.equal(applyCors({ headers: { origin: 'https://editor.example.com' } }, allowed, env), true);
  assert.equal(allowed.headers['Access-Control-Allow-Origin'], 'https://editor.example.com');
});

test('OPTIONS bloqueado no importa ni ejecuta proveedores', async () => {
  await withEnvironment(
    { NODE_ENV: 'test', BIENESTAR_PIPELINE_ENABLED: undefined },
    async () => {
      const { default: handler } = await importEndpoint();
      const res = createResponse();
      await handler(
        { method: 'OPTIONS', headers: { origin: 'https://evil.example' } },
        res
      );
      assert.equal(res.statusCode, 503);
      assert.equal(res.headers['Access-Control-Allow-Origin'], undefined);
    }
  );
});

test('origen no autorizado bloquea antes de validar o importar', async () => {
  await withEnvironment(
    {
      NODE_ENV: 'test',
      BIENESTAR_PIPELINE_ENABLED: 'true',
      BIENESTAR_PIPELINE_ALLOWED_ORIGINS: 'https://editor.example.com',
    },
    async () => {
      const { default: handler } = await importEndpoint();
      const res = createResponse();
      await handler(
        {
          method: 'POST',
          headers: { origin: 'https://evil.example' },
          body: { tema_solicitado: 'Tema válido' },
        },
        res
      );
      assert.equal(res.statusCode, 403);
      assert.equal(res.headers['Access-Control-Allow-Origin'], undefined);
    }
  );
});

test('parsing inválido bloquea antes de importar proveedores', async () => {
  await withEnvironment(
    {
      NODE_ENV: 'test',
      BIENESTAR_PIPELINE_ENABLED: 'true',
      BIENESTAR_PIPELINE_ALLOWED_ORIGINS: 'https://editor.example.com',
    },
    async () => {
      const { default: handler } = await importEndpoint();
      const res = createResponse();
      await handler(
        {
          method: 'POST',
          headers: { origin: 'https://editor.example.com' },
          body: { tema_solicitado: 'x', fecha_publicacion: 'fecha-inválida' },
        },
        res
      );
      assert.equal(res.statusCode, 400);
    }
  );
});

test('el script de pulido no contiene JWT ni crea cliente sin configuración', () => {
  const source = fs.readFileSync(polishPath, 'utf8');
  assert.doesNotMatch(
    source,
    /\beyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\b/
  );
  assert.match(source, /process\.env\.SUPABASE_SERVICE_ROLE_KEY/);

  const env = { ...process.env };
  delete env.SUPABASE_URL;
  delete env.SUPABASE_SERVICE_ROLE_KEY;
  const result = spawnSync(process.execPath, [polishPath], {
    cwd: root,
    env,
    encoding: 'utf8',
    timeout: 10000,
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Configuración de servidor incompleta/);
  assert.doesNotMatch(result.stderr, /SUPABASE_SERVICE_ROLE_KEY|eyJ/);
});

test('no hay valores con forma de secreto en fuentes frontend', () => {
  const frontendRoot = path.join(root, 'src');
  const stack = [frontendRoot];
  const jwt = /\beyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\b/;

  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(target);
      else if (/\.(?:js|jsx|ts|tsx|json)$/.test(entry.name)) {
        assert.doesNotMatch(fs.readFileSync(target, 'utf8'), jwt, target);
      }
    }
  }
});

test('package.json no expone comandos editoriales de escritura legacy', () => {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(root, 'package.json'), 'utf8')
  );
  const commands = Object.values(packageJson.scripts || {}).join('\n');
  assert.doesNotMatch(
    commands,
    /convert-biblia-to-articles|enrich-wellness-articles|polish-articles|publish_to_supabase|publish-(?:cirrosis|higado|sintomas)/
  );
  assert.equal(fs.existsSync(path.join(root, 'scripts', 'enrich-article.mjs')), false);
});
