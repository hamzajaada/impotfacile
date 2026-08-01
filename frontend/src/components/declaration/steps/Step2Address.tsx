import type { StepProps } from '../FormWizard'
import { PROVINCES } from '@/types/declaration'

export default function Step2Address({ data }: StepProps) {
  const s = data.data.step2
  const update = <K extends keyof typeof s>(key: K, val: (typeof s)[K]) =>
    data.updateStep('step2', (prev) => ({ ...prev, [key]: val }))

  const input = (label: string, key: keyof typeof s, opts?: { placeholder?: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type="text" value={String(s[key])} onChange={(e) => update(key as never, e.target.value as never)} placeholder={opts?.placeholder}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {input('Numero civic', 'civicNumber', { placeholder: '123' })}
        {input('Nom de rue', 'streetName', { placeholder: 'Rue Principale' })}
        {input('Appartement', 'apartment', { placeholder: 'Apt 4B' })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {input('Ville', 'city', { placeholder: 'Montreal' })}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
          <select value={s.province} onChange={(e) => update('province', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm">
            {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        {input('Code postal', 'postalCode', { placeholder: 'H1A 1A1' })}
      </div>
    </div>
  )
}
