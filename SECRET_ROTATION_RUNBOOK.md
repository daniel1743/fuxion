# Runbook de rotación de credenciales

Este documento no contiene valores. Retirar un valor del código no lo revoca.

## Credenciales comprometidas

- Supabase `service_role`, localizada históricamente en tres rutas.
- Supabase `anon`, localizada históricamente en dos rutas.

Debe confirmarse en el panel si los JWT encontrados pertenecen al mismo proyecto
y si representan una o más generaciones de claves.

## Procedimiento administrativo

1. Declarar una ventana de mantenimiento y responsable.
2. Inventariar Vercel, tareas locales, automatizaciones y servicios que usen las claves.
3. Exportar configuración y logs necesarios sin copiar secretos a tickets/chat.
4. Rotar/revocar primero la `service_role` desde Supabase.
5. Actualizar el nuevo valor solo en almacenes de secretos de servidor.
6. Reiniciar/reimplementar consumidores autorizados.
7. Verificar que la clave anterior ya no autentica mediante una prueba administrativa segura.
8. Rotar la clave `anon` si Supabase lo permite/requiere y actualizar clientes legítimos.
9. Revisar Auth/API/Database logs desde la primera fecha de exposición.
10. Investigar lecturas, escrituras, borrados o IP/agents inesperados.
11. Rotar otras credenciales si estuvieron almacenadas o compartidas en el mismo contexto.

## Servicios potencialmente afectados

- scripts locales y automatizaciones con Supabase;
- despliegues Vercel;
- aplicación React que utiliza la clave anónima;
- tareas externas no visibles en el repositorio;
- procesos de sitemap o administración.

## Verificación posterior

- la clave anterior es rechazada;
- las funciones legítimas operan con la nueva clave;
- no existe `service_role` en variables `VITE_` ni bundle frontend;
- el escaneo local y CI terminan sin hallazgos;
- logs posteriores no muestran uso de la clave anterior;
- se registra fecha, operador y evidencia en un sistema privado.

## Criterio para declarar rotación completada

Solo un administrador con evidencia del panel puede marcarla completada. Hasta
entonces el estado es **pendiente humano**, aunque el árbol actual esté limpio.
