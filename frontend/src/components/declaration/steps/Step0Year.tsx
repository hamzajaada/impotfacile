import type { StepProps } from '../FormWizard'

const YEARS = Array.from({ length: 12 }, (_, i) => 2026 - i)

export default function Step0Year({ data }: StepProps) {
  const { step0 } = data.data
  const update = (val: number) => data.setStep('step0', { taxYear: val })

  return (
    <div className="max-w-md">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Annee de la declaration d'impots <span className="text-red-500">*</span>
      </label>
      <select
        value={step0.taxYear}
        onChange={(e) => update(Number(e.target.value))}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
      >
        {YEARS.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <p className="text-xs text-gray-400 mt-2">Selectionnez l'annee fiscale pour laquelle vous declarez vos revenus.</p>
    </div>
  )
}
