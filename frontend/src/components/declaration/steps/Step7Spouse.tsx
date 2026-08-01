import type { StepProps } from '../FormWizard'
import { PROVINCES } from '@/types/declaration'

export default function Step7Spouse({ data }: StepProps) {
  const s = data.data.step7
  const update = <K extends keyof typeof s>(key: K, val: (typeof s)[K]) =>
    data.updateStep('step7', (prev) => ({ ...prev, [key]: val }))

  const input = (label: string, key: keyof typeof s, opts?: { required?: boolean; placeholder?: string; type?: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {opts?.required !== false && <span className="text-red-500">*</span>}
      </label>
      <input type={opts?.type || 'text'} value={String(s[key])} onChange={(e) => update(key as never, e.target.value as never)} placeholder={opts?.placeholder}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm" />
    </div>
  )

  const select = (label: string, key: keyof typeof s, options: string[]) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
      <select value={String(s[key])} onChange={(e) => update(key as never, e.target.value as never)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm">
        <option value="">-- Selectionner --</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">Remplissez les informations de votre conjoint(e).</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {input('Nom', 'lastName', { required: true })}
        {input('Prenom', 'firstName', { required: true })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {input('Date de naissance', 'dateOfBirth', { type: 'date' })}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sexe <span className="text-red-500">*</span></label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="spouseSex" value="Masculin" checked={s.sex === 'Masculin'} onChange={() => update('sex', 'Masculin')} className="text-teal-600" />
              Masculin
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="spouseSex" value="Feminin" checked={s.sex === 'Feminin'} onChange={() => update('sex', 'Feminin')} className="text-teal-600" />
              Feminin
            </label>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {input("Numero d'assurance sociale", 'sin', { placeholder: '000-000-000' })}
        {input('Telephone', 'phone', { placeholder: '514-555-0000' })}
      </div>
      {input('Courriel', 'email', { type: 'email' })}
      {select('Province de residence', 'provinceOfResidence', PROVINCES)}
    </div>
  )
}
