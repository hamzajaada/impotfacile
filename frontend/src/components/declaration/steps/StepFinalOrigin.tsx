import type { StepProps } from '../FormWizard'
import { FOUND_US_OPTIONS } from '@/types/declaration'

export default function StepFinalOrigin({ data }: StepProps) {
  const s = data.data.stepFinal
  const update = (field: string, val: unknown) => data.updateStep('stepFinal', (prev) => ({ ...prev, [field]: val }))

  const toggleFound = (val: string) => {
    const current = s.howFoundUs
    update('howFoundUs', current.includes(val) ? current.filter((v) => v !== val) : [...current, val])
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-sm text-teal-700">
        Comment avez-vous decouvert ImpotFacile ?
      </div>
      <div className="grid grid-cols-1 gap-2">
        {FOUND_US_OPTIONS.map((opt) => (
          <label key={opt} className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm cursor-pointer transition ${
            s.howFoundUs.includes(opt) ? 'bg-teal-50 border-teal-500 text-teal-700 font-medium' : 'border-gray-300 hover:bg-gray-50'
          }`}>
            <input type="checkbox" className="sr-only" checked={s.howFoundUs.includes(opt)} onChange={() => toggleFound(opt)} />
            <span className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
              s.howFoundUs.includes(opt) ? 'bg-teal-600 border-teal-600' : 'border-gray-300'
            }`}>
              {s.howFoundUs.includes(opt) && <span className="text-white text-xs">&#10003;</span>}
            </span>
            {opt}
          </label>
        ))}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Code promo (optionnel)</label>
        <input type="text" value={s.promoCode} onChange={(e) => update('promoCode', e.target.value)} placeholder="Entrez votre code promo"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm" />
      </div>
    </div>
  )
}
