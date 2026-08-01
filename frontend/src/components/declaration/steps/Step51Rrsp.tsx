import type { StepProps } from '../FormWizard'

export default function Step51Rrsp({ data }: StepProps) {
  const s = data.data.step51
  const update = <K extends keyof typeof s>(key: K, val: (typeof s)[K]) =>
    data.updateStep('step51', (prev) => ({ ...prev, [key]: val }))

  const radio = (label: string, key: keyof typeof s) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name={`s51_${String(key)}`} checked={s[key] === true} onChange={() => update(key, true as never)} className="text-teal-600" />
          Oui
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name={`s51_${String(key)}`} checked={s[key] === false} onChange={() => update(key, false as never)} className="text-teal-600" />
          Non
        </label>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {radio('Avez-vous fait des cotisations au REER en 2025 ?', 'rrspContributions')}
      {radio('Avez-vous fait des cotisations au REER au cours des 60 premiers jours de 2026 ?', 'rrspFirst60Days')}
      {radio('Avez-vous fait des cotisations au CELIAPP ?', 'celiappContributions')}
    </div>
  )
}
