import React, { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowLeft, ArrowRight, CheckCircle2, Droplets, HeartPulse, RefreshCw, Salad, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  WELLNESS_OBJECTIVES,
  generateWellnessPlan,
  loadWellnessPlan,
  saveWellnessPlan,
} from '@/services/wellnessPlanService';

const initialAnswers = {
  age: '',
  weight: '',
  height: '',
  objective: '',
  activity: 'inicial',
  days: '3',
  water: '',
  restrictions: '',
  health: 'no',
};

const WellnessPlanDialog = ({ open, onOpenChange, identity, name, onPlanChange }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers);
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    if (!open) return;
    const saved = loadWellnessPlan(identity);
    setPlan(saved);
    if (saved?.answers) setAnswers(saved.answers);
    setStep(saved ? 3 : 0);
  }, [open, identity]);

  const canContinue = useMemo(() => {
    if (step === 0) {
      return Number(answers.age) >= 18 && Number(answers.weight) > 0 && Number(answers.height) > 0;
    }
    if (step === 1) return Boolean(answers.objective && answers.activity && answers.days);
    return true;
  }, [answers, step]);

  const updateAnswer = (field, value) => {
    setAnswers((current) => ({ ...current, [field]: value }));
  };

  const createPlan = () => {
    const nextPlan = generateWellnessPlan(answers, identity);
    saveWellnessPlan(identity, nextPlan);
    setPlan(nextPlan);
    setStep(3);
    onPlanChange?.(nextPlan);
  };

  const restart = () => {
    setPlan(null);
    setStep(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto p-0">
        <div className="border-b border-border bg-fuxion/5 p-5 dark:bg-fuxion/10 sm:p-6">
          <DialogHeader className="text-left">
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-fuxion" />
              Mi plan de bienestar
            </DialogTitle>
            <DialogDescription>
              Orientación general de hábitos durante 4 semanas. Primero entendemos tu situación; los productos son opcionales.
            </DialogDescription>
          </DialogHeader>
          {step < 3 && (
            <div className="mt-5 grid grid-cols-3 gap-2">
              {[0, 1, 2].map((item) => (
                <div key={item} className={`h-2 rounded-full ${item <= step ? 'bg-fuxion' : 'bg-fuxion/20 dark:bg-fuxion/30'}`} />
              ))}
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6">
          {step === 0 && (
            <section>
              <h3 className="text-xl font-bold">Datos básicos</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Estos datos se usan para adaptar la intensidad y una referencia general de hidratación.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <Field label="Edad" required>
                  <Input type="number" min="18" max="100" value={answers.age} onChange={(e) => updateAnswer('age', e.target.value)} placeholder="35" />
                </Field>
                <Field label="Peso (kg)" required>
                  <Input type="number" min="35" max="250" value={answers.weight} onChange={(e) => updateAnswer('weight', e.target.value)} placeholder="85" />
                </Field>
                <Field label="Altura (cm)" required>
                  <Input type="number" min="120" max="230" value={answers.height} onChange={(e) => updateAnswer('height', e.target.value)} placeholder="175" />
                </Field>
              </div>
            </section>
          )}

          {step === 1 && (
            <section>
              <h3 className="text-xl font-bold">Objetivo y actividad</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="¿Qué quieres trabajar?" required>
                  <Select value={answers.objective} onChange={(e) => updateAnswer('objective', e.target.value)}>
                    <option value="">Selecciona un objetivo</option>
                    {WELLNESS_OBJECTIVES.map((objective) => (
                      <option key={objective.value} value={objective.value}>{objective.label}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Actividad actual" required>
                  <Select value={answers.activity} onChange={(e) => updateAnswer('activity', e.target.value)}>
                    <option value="sedentario">Casi no realizo actividad</option>
                    <option value="inicial">Estoy comenzando</option>
                    <option value="regular">Entreno con regularidad</option>
                    <option value="alto">Tengo actividad alta</option>
                  </Select>
                </Field>
                <Field label="Días disponibles por semana" required>
                  <Select value={answers.days} onChange={(e) => updateAnswer('days', e.target.value)}>
                    {[2, 3, 4, 5, 6].map((day) => <option key={day} value={day}>{day} días</option>)}
                  </Select>
                </Field>
                <Field label="Agua aproximada al día">
                  <Select value={answers.water} onChange={(e) => updateAnswer('water', e.target.value)}>
                    <option value="">No lo sé</option>
                    <option value="menos-1">Menos de 1 litro</option>
                    <option value="1-2">Entre 1 y 2 litros</option>
                    <option value="mas-2">Más de 2 litros</option>
                  </Select>
                </Field>
              </div>
            </section>
          )}

          {step === 2 && (
            <section>
              <h3 className="text-xl font-bold">Preferencias y seguridad</h3>
              <div className="mt-5 space-y-5">
                <Field label="Restricciones, alergias o preferencias alimentarias">
                  <Input value={answers.restrictions} onChange={(e) => updateAnswer('restrictions', e.target.value)} placeholder="Ejemplo: vegetariano, sin lactosa" />
                </Field>
                <Field label="¿Tienes una condición de salud, estás embarazada o utilizas medicamentos?">
                  <Select value={answers.health} onChange={(e) => updateAnswer('health', e.target.value)}>
                    <option value="no">No</option>
                    <option value="si">Sí o prefiero revisarlo con un profesional</option>
                  </Select>
                </Field>
                {answers.health === 'si' && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
                    El plan mantendrá sugerencias generales de hábitos y no incluirá productos.
                  </div>
                )}
              </div>
            </section>
          )}

          {step === 3 && plan && (
            <PlanResult plan={plan} name={name} onRestart={restart} />
          )}

          {step < 3 && (
            <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
              <Button variant="outline" disabled={step === 0} onClick={() => setStep((current) => current - 1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver
              </Button>
              {step < 2 ? (
                <Button disabled={!canContinue} onClick={() => setStep((current) => current + 1)}>
                  Continuar <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={createPlan}>
                  Generar mi plan <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Field = ({ label, required, children }) => (
  <div className="space-y-2">
    <Label>{label}{required ? ' *' : ''}</Label>
    {children}
  </div>
);

const Select = (props) => (
  <select
    {...props}
    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  />
);

const PlanResult = ({ plan, name, onRestart }) => (
  <section>
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div>
        <p className="text-sm text-fuxion">Plan para {name}</p>
        <h3 className="text-2xl font-bold">{plan.objective}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Creado el {new Date(plan.createdAt).toLocaleDateString('es-CL')}
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onRestart}>
        <RefreshCw className="mr-2 h-4 w-4" /> Actualizar datos
      </Button>
    </div>

    <PlanBlock icon={Activity} title="Rutina semanal">
      <div className="grid gap-2 sm:grid-cols-2">
        {plan.routine.map((session) => (
          <div key={session.day} className="rounded-lg bg-secondary/60 p-3">
            <p className="font-semibold">{session.day}</p>
            <p className="text-sm text-muted-foreground">{session.activity}</p>
          </div>
        ))}
      </div>
    </PlanBlock>

    <PlanBlock icon={Salad} title="Alimentación">
      <Checklist items={plan.nutrition} />
    </PlanBlock>

    <PlanBlock icon={Droplets} title="Hidratación">
      <p className="text-sm leading-relaxed text-muted-foreground">{plan.hydration}</p>
    </PlanBlock>

    <PlanBlock icon={CheckCircle2} title="Revisión semanal">
      <Checklist items={plan.weeklyCheck} />
    </PlanBlock>

    <PlanBlock icon={HeartPulse} title="Apoyo opcional">
      {plan.products.length > 0 ? (
        <>
          <p className="mb-3 text-sm text-muted-foreground">
            No son necesarios para cumplir el plan. Se muestran únicamente como alternativas relacionadas con tu objetivo.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {plan.products.map((product) => (
              <Link key={product.name} to={`/producto/${product.slug}`} className="rounded-xl border border-border p-4 transition-colors hover:border-emerald-400">
                <p className="font-bold">{product.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{product.reason}</p>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          No incluimos productos en este plan. Puedes revisar cualquier alternativa con un profesional o asesor.
        </p>
      )}
    </PlanBlock>

    <p className="mt-6 rounded-xl border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
      {plan.safetyNote}
    </p>
  </section>
);

const PlanBlock = ({ icon: Icon, title, children }) => (
  <div className="mt-6 rounded-xl border border-border p-4 sm:p-5">
    <h4 className="mb-3 flex items-center gap-2 font-bold">
      <Icon className="h-5 w-5 text-emerald-600" /> {title}
    </h4>
    {children}
  </div>
);

const Checklist = ({ items }) => (
  <ul className="space-y-2">
    {items.map((item) => (
      <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        {item}
      </li>
    ))}
  </ul>
);

export default WellnessPlanDialog;

