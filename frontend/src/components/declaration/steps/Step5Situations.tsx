import type { StepProps } from '../FormWizard'
import { SITUATIONS } from '@/types/declaration'
import { useAuth } from '@/hooks/useAuth'

const SITUATION_PROFILS: Record<string, string[]> = {
  'Etudiant(e)': ['STUDENT'],
  'Travailleur(se) autonome': ['SELF_EMPLOYED'],
  'Revenus UBER, SkipTheDishes, DoorDash, Lyft...': ['SELF_EMPLOYED'],
}

export default function Step5Situations({ data }: StepProps) {
  const { user } = useAuth()
  const s = data.data.step5
  const update = (val: string[]) => data.updateStep('step5', (prev) => ({ ...prev, situations: val }))

  const toggle = (val: string) => {
    const current = s.situations
    update(current.includes(val) ? current.filter((v) => v !== val) : [...current, val])
  }

  const visibleSituations = SITUATIONS.filter((sit) => {
    const profils = SITUATION_PROFILS[sit]
    if (!profils) return true
    return !!user?.taxProfile && profils.includes(user.taxProfile)
  })

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Selectionnez toutes les situations qui s'appliquent a vous pour 2025 :</p>
      <div className="grid grid-cols-1 gap-2">
        {visibleSituations.map((sit) => (
          <label key={sit} className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm cursor-pointer transition ${
            s.situations.includes(sit)
              ? 'bg-teal-50 border-teal-500 text-teal-700 font-medium'
              : 'border-gray-300 hover:bg-gray-50'
          }`}>
            <input type="checkbox" className="sr-only" checked={s.situations.includes(sit)} onChange={() => toggle(sit)} />
            <span className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
              s.situations.includes(sit) ? 'bg-teal-600 border-teal-600' : 'border-gray-300'
            }`}>
              {s.situations.includes(sit) && <span className="text-white text-xs">&#10003;</span>}
            </span>
            {sit}
          </label>
        ))}
      </div>
    </div>
  )
}
