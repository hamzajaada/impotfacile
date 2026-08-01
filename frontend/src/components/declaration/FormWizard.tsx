import { useMemo, useState } from 'react'
import { useFormWizard } from '@/hooks/useFormWizard'
import { useAuth } from '@/hooks/useAuth'
import { adminApi } from '@/services/api'
import { ChevronLeft, ChevronRight, Check, Save } from 'lucide-react'
import Step0Year from './steps/Step0Year'
import Step1Personal from './steps/Step1Personal'
import Step2Address from './steps/Step2Address'
import Step3Residence from './steps/Step3Residence'
import Step4Family from './steps/Step4Family'
import Step51Rrsp from './steps/Step51Rrsp'
import Step5Situations from './steps/Step5Situations'
import Step6Documents from './steps/Step6Documents'
import Step7Spouse from './steps/Step7Spouse'
import Step72SpouseSituations from './steps/Step72SpouseSituations'
import Step8Privacy from './steps/Step8Privacy'
import Step9Authorization from './steps/Step9Authorization'
import StepFinalOrigin from './steps/StepFinalOrigin'

export interface StepProps {
  data: ReturnType<typeof useFormWizard>
}

const ALL_STEPS = [
  { key: 'step0', label: 'Annee', component: Step0Year },
  { key: 'step1', label: 'Informations', component: Step1Personal },
  { key: 'step2', label: 'Adresse', component: Step2Address },
  { key: 'step3', label: 'Residence', component: Step3Residence },
  { key: 'step4', label: 'Famille', component: Step4Family },
  { key: 'step51', label: 'REER/CELIAPP', component: Step51Rrsp, profils: ['SELF_EMPLOYED', 'INDIVIDUAL'] },
  { key: 'step5', label: 'Situations', component: Step5Situations },
  { key: 'step6', label: 'Documents', component: Step6Documents },
  { key: 'step7', label: 'Conjoint', component: Step7Spouse, conditional: true },
  { key: 'step72', label: 'Situations conjoint', component: Step72SpouseSituations, conditional: true },
  { key: 'step8', label: 'Confidentialite', component: Step8Privacy },
  { key: 'step9', label: 'Autorisation ARC', component: Step9Authorization },
  { key: 'stepFinal', label: 'Origine', component: StepFinalOrigin },
]

export default function FormWizard() {
  const wizard = useFormWizard()
  const { user } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const visibleSteps = useMemo(() => {
    return ALL_STEPS.filter((step) => {
      if (step.conditional && step.key === 'step7') {
        return wizard.data.step4.processingSpouse
      }
      if (step.conditional && step.key === 'step72') {
        return wizard.data.step4.processingSpouse
      }
      if (step.profils && step.profils.length > 0) {
        if (!user?.taxProfile || !step.profils.includes(user.taxProfile)) return false
      }
      return true
    })
  }, [wizard.data.step4.processingSpouse, user?.taxProfile])

  const CurrentStepComponent = visibleSteps[wizard.currentStep]?.component
  const isFirst = wizard.currentStep === 0
  const isLast = wizard.currentStep === visibleSteps.length - 1
  const progress = Math.round(((wizard.currentStep + 1) / visibleSteps.length) * 100)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-1">Formulaire</p>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">Declaration d'impots — {wizard.data.step0.taxYear}</h1>
          {user && <p className="text-sm text-slate-500 mt-0.5">{user.firstName} {user.lastName}</p>}
        </div>
        <button onClick={wizard.save} className="btn-secondary text-sm">
          <Save size={15} />
          Sauvegarder
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span>Etape {wizard.currentStep + 1} sur {visibleSteps.length}</span>
          <span className="font-semibold">{progress}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <nav className="w-56 flex-shrink-0 hidden lg:block">
          <div className="card p-3 sticky top-24">
            <ul className="space-y-0.5">
              {visibleSteps.map((step, index) => (
                <li key={step.key}>
                  <button
                    onClick={() => wizard.goTo(index)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-left transition-all duration-150 ${
                      index === wizard.currentStep
                        ? 'bg-teal-50 text-teal-700 font-semibold'
                        : wizard.completedSteps.has(index)
                          ? 'text-emerald-600 hover:bg-emerald-50'
                          : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      index === wizard.currentStep
                        ? 'bg-teal-600 text-white'
                        : wizard.completedSteps.has(index)
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-500'
                    }`}>
                      {wizard.completedSteps.has(index) ? <Check size={12} /> : index + 1}
                    </span>
                    <span className="truncate">{step.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="card p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">{visibleSteps[wizard.currentStep]?.label}</h2>
              <p className="text-sm text-slate-400 mt-0.5">
                Etape {wizard.currentStep + 1} sur {visibleSteps.length}
              </p>
            </div>

            {CurrentStepComponent && <CurrentStepComponent data={wizard} />}

            <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
              <button onClick={wizard.goPrev} disabled={isFirst} className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft size={16} />
                Precedent
              </button>

              {isLast ? (
                submitted ? (
                  <div className="btn-success pointer-events-none">
                    <Check size={16} />
                    Declaration soumise!
                  </div>
                ) : (
                  <button
                    onClick={async () => {
                      if (!user) return
                      setSubmitting(true)
                      try {
                        await adminApi.submitRequest(wizard.data as unknown as Record<string, unknown>)
                        wizard.markCompleted(wizard.currentStep)
                        wizard.save()
                        setSubmitted(true)
                      } catch {
                        alert('Erreur lors de la soumission')
                      } finally {
                        setSubmitting(false)
                      }
                    }}
                    disabled={submitting}
                    className="btn-success"
                  >
                    {submitting ? 'Envoi en cours...' : 'Soumettre la declaration'}
                  </button>
                )
              ) : (
                <button onClick={() => { wizard.markCompleted(wizard.currentStep); wizard.goNext() }} className="btn-primary">
                  Suivant
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
