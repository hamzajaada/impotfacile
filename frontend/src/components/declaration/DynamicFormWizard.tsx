import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { adminApi, formApi } from '@/services/api'
import type { FormTemplate, FormSection, FormChamp, FormRegle, DynamicTemplateSnapshot } from '@/services/api'
import { ChevronLeft, ChevronRight, Check, Save, Plus, Trash2, AlertCircle, FileText } from 'lucide-react'
import FormWizard from './FormWizard'

const STORAGE_KEY = 'impotfacile_dynamic_draft'

function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true
  if (Array.isArray(value)) return value.length === 0
  return String(value).trim() === ''
}

function evalRegles(regles: FormRegle[], reponses: Record<string, unknown>): boolean {
  if (!regles || regles.length === 0) return true
  return regles.every((r) => {
    const v = reponses[r.champCible]
    switch (r.typeRegle) {
      case 'EGAL':
        return v !== undefined && String(v) === r.valeurAttendue
      case 'NON_VIDE':
        return v !== undefined && String(v).trim() !== ''
      case 'CONTIENT':
        return v !== undefined && String(v).includes(r.valeurAttendue)
      default:
        return true
    }
  })
}

function parseOptions(champ: FormChamp): string[] {
  return (champ.options || '').split('\n').map((o) => o.trim()).filter(Boolean)
}

function FieldControl({ champ, value, onChange }: {
  champ: FormChamp
  value: unknown
  onChange: (v: unknown) => void
}) {
  const options = parseOptions(champ)
  const text = String(value ?? '')
  const list = Array.isArray(value) ? value : []

  switch (champ.type) {
    case 'ZONE_TEXTE':
      return (
        <textarea value={text} onChange={(e) => onChange(e.target.value)}
          className="input-field h-28 resize-none" placeholder={champ.label} />
      )
    case 'NOMBRE':
      return (
        <input type="number" value={text} onChange={(e) => onChange(e.target.value)}
          className="input-field" placeholder={champ.label} />
      )
    case 'DATE':
      return (
        <input type="date" value={text} onChange={(e) => onChange(e.target.value)}
          className="input-field" />
      )
    case 'CHOIX_UNIQUE':
      return (
        <div className="space-y-2">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
              <input type="radio" name={champ.nomChamp} checked={text === opt}
                onChange={() => onChange(opt)} className="accent-teal-600" />
              <span className="text-sm text-slate-700">{opt}</span>
            </label>
          ))}
        </div>
      )
    case 'CHOIX_MULTIPLE':
      return (
        <div className="space-y-2">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={list.includes(opt)}
                onChange={(e) => {
                  const nv = e.target.checked ? [...list, opt] : list.filter((x) => x !== opt)
                  onChange(nv)
                }} className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
              <span className="text-sm text-slate-700">{opt}</span>
            </label>
          ))}
        </div>
      )
    case 'LISTE_DEROULANTE':
      return (
        <select value={text} onChange={(e) => onChange(e.target.value)} className="input-field">
          <option value="">Selectionnez...</option>
          {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      )
    case 'UPLOAD_FICHIER':
    case 'UPLOAD_IMAGE':
      return (
        <div className="flex items-center gap-3">
          <label className="btn-secondary text-sm cursor-pointer">
            <FileText size={14} />
            {text ? 'Changer le fichier' : 'Choisir un fichier'}
            <input type="file" className="hidden"
              accept={champ.type === 'UPLOAD_IMAGE' ? 'image/*' : undefined}
              onChange={(e) => onChange(e.target.files?.[0]?.name || '')} />
          </label>
          {text && <span className="text-xs text-slate-500 truncate max-w-[180px]">{text}</span>}
        </div>
      )
    case 'GROUPE_REPETABLE': {
      const values = list as string[]
      return (
        <div className="space-y-2">
          {values.map((v, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="text" value={v} onChange={(e) => {
                const nv = [...values]
                nv[i] = e.target.value
                onChange(nv)
              }} className="input-field flex-1" placeholder={`Entree ${i + 1}`} />
              <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))}
                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => onChange([...values, ''])}
            className="text-xs font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1">
            <Plus size={12} /> Ajouter une entree
          </button>
        </div>
      )
    }
    default:
      return (
        <input type="text" value={text} onChange={(e) => onChange(e.target.value)}
          className="input-field" placeholder={champ.label} />
      )
  }
}

export default function DynamicFormWizard() {
  const { user } = useAuth()
  const [template, setTemplate] = useState<FormTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [reponses, setReponses] = useState<Record<string, unknown>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)

  const isSectionVisible = (section: FormSection): boolean => {
    const profils = section.profilsCibles || []
    if (profils.length === 0) return true
    return !!user?.taxProfile && profils.includes(user.taxProfile)
  }

  const isChampVisible = (champ: FormChamp): boolean => {
    const profils = champ.profilsCibles || []
    if (profils.length === 0) return true
    return !!user?.taxProfile && profils.includes(user.taxProfile)
  }

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await formApi.getActiveTemplate()
        if (!active) return
        const t = res.data as FormTemplate | null
        if (t && t.id && (t.sections || []).length > 0) {
          setTemplate(t)
          const init: Record<string, unknown> = {}
          t.sections.forEach((s) => s.champs.forEach((c) => {
            if (c.type === 'CHOIX_MULTIPLE' || c.type === 'GROUPE_REPETABLE') init[c.nomChamp] = []
          }))
          try {
            const draft = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
            if (draft.templateId === t.id) {
              Object.assign(init, draft.reponses || {})
            }
          } catch { /* ignore */ }
          setReponses(init)
        }
      } catch { /* no active template -> default form */ }
      finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  const steps = useMemo(() => {
    if (!template) return []
    return (template.sections || [])
      .slice()
      .filter(isSectionVisible)
      .sort((a, b) => a.ordre - b.ordre)
      .map((section) => ({
        section,
        champs: (section.champs || [])
          .slice()
          .sort((a, b) => a.ordre - b.ordre)
          .filter((c) => evalRegles(c.regles || [], reponses))
          .filter(isChampVisible),
      }))
      .filter((step) => step.champs.length > 0)
  }, [template, reponses, user?.taxProfile])

  const currentChamps = steps[currentStep]?.champs || []
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1
  const progress = steps.length === 0 ? 0 : Math.round(((currentStep + 1) / steps.length) * 100)

  const setValue = (nomChamp: string, value: unknown) => {
    setReponses((prev) => ({ ...prev, [nomChamp]: value }))
    setErrors((prev) => {
      if (!prev[nomChamp]) return prev
      const next = { ...prev }
      delete next[nomChamp]
      return next
    })
  }

  const validateStep = (): boolean => {
    const stepErrors: Record<string, string> = {}
    currentChamps.forEach((c) => {
      if (c.obligatoire && isEmpty(reponses[c.nomChamp])) {
        stepErrors[c.nomChamp] = 'Ce champ est obligatoire'
      }
    })
    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

  const goNext = () => {
    if (!validateStep()) return
    setCompletedSteps((prev) => new Set(prev).add(currentStep))
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1))
  }

  const goPrev = () => {
    setCurrentStep((s) => Math.max(s - 1, 0))
  }

  const goTo = (index: number) => {
    if (index <= currentStep || completedSteps.has(index)) {
      setCurrentStep(index)
    }
  }

  const handleSave = () => {
    if (!template) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ templateId: template.id, reponses }))
    setSavedMsg(true)
    setTimeout(() => setSavedMsg(false), 2000)
  }

  const handleSubmit = async () => {
    if (!template || !validateStep()) return
    setSubmitting(true)
    try {
      const snapshot: DynamicTemplateSnapshot = {
        nom: template.nom,
        sections: template.sections
          .filter(isSectionVisible)
          .map((s) => ({
            titre: s.titre,
            champs: s.champs
              .filter(isChampVisible)
              .map((c) => ({
              label: c.label,
              type: c.type,
              nomChamp: c.nomChamp,
              options: c.options,
            })),
          })),
      }
      await adminApi.submitDynamicRequest({
        taxYear: template.anneeFiscale,
        templateId: template.id,
        template: snapshot,
        reponses,
      })
      setCompletedSteps((prev) => new Set(prev).add(currentStep))
      localStorage.removeItem(STORAGE_KEY)
      setSubmitted(true)
    } catch {
      alert('Erreur lors de la soumission')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Chargement du formulaire...</p>
      </div>
    )
  }

  if (!template) {
    return <FormWizard />
  }

  if (steps.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-8 text-center">
          <p className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-3">Formulaire</p>
          <h2 className="text-lg font-extrabold text-slate-900">Aucune section ne s'applique a votre profil</h2>
          <p className="text-sm text-slate-500 mt-1">Le formulaire actif ne contient aucune section destinee a votre profil fiscal.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-1">Formulaire</p>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Declaration d'impots — {template.nom}
          </h1>
          {user && <p className="text-sm text-slate-500 mt-0.5">{user.firstName} {user.lastName}</p>}
        </div>
        <button onClick={handleSave} className="btn-secondary text-sm">
          <Save size={15} />
          {savedMsg ? 'Sauvegarde!' : 'Sauvegarder'}
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span>Etape {currentStep + 1} sur {steps.length}</span>
          <span className="font-semibold">{progress}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex gap-6">
        <nav className="w-56 flex-shrink-0 hidden lg:block">
          <div className="card p-3 sticky top-24">
            <ul className="space-y-0.5">
              {steps.map((step, index) => (
                <li key={step.section.id}>
                  <button
                    onClick={() => goTo(index)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-left transition-all duration-150 ${
                      index === currentStep
                        ? 'bg-teal-50 text-teal-700 font-semibold'
                        : completedSteps.has(index)
                          ? 'text-emerald-600 hover:bg-emerald-50'
                          : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      index === currentStep
                        ? 'bg-teal-600 text-white'
                        : completedSteps.has(index)
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-500'
                    }`}>
                      {completedSteps.has(index) ? <Check size={12} /> : index + 1}
                    </span>
                    <span className="truncate">{step.section.titre}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="flex-1 min-w-0">
          <div className="card p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">{steps[currentStep]?.section.titre}</h2>
              <p className="text-sm text-slate-400 mt-0.5">Etape {currentStep + 1} sur {steps.length}</p>
            </div>

            <div className="space-y-6">
              {currentChamps.map((champ) => (
                <div key={champ.id}>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    {champ.label}
                    {champ.obligatoire && <span className="text-red-400 ml-0.5">*</span>}
                  </label>
                  <FieldControl champ={champ} value={reponses[champ.nomChamp]} onChange={(v) => setValue(champ.nomChamp, v)} />
                  {errors[champ.nomChamp] && (
                    <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5">
                      <AlertCircle size={12} /> {errors[champ.nomChamp]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
              <button onClick={goPrev} disabled={isFirst} className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed">
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
                  <button onClick={handleSubmit} disabled={submitting} className="btn-success">
                    {submitting ? 'Envoi en cours...' : 'Soumettre la declaration'}
                  </button>
                )
              ) : (
                <button onClick={goNext} className="btn-primary">
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
