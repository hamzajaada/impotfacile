import type { StepProps } from '../FormWizard'
import { MARITAL_STATUSES, PROVINCES, INSURANCE_OPTIONS } from '@/types/declaration'

export default function Step1Personal({ data }: StepProps) {
  const s = data.data.step1
  const update = <K extends keyof typeof s>(key: K, val: (typeof s)[K]) =>
    data.updateStep('step1', (prev) => ({ ...prev, [key]: val }))

  const toggleInsurance = (val: string) => {
    const current = s.insurances
    update('insurances', current.includes(val) ? current.filter((v) => v !== val) : [...current, val])
  }

  const toggleYear = (year: number) => {
    const current = s.yearsToDeclare
    update('yearsToDeclare', current.includes(year) ? current.filter((v) => v !== year) : [...current, year])
  }

  const input = (label: string, key: keyof typeof s, opts?: { required?: boolean; placeholder?: string; type?: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {opts?.required !== false && <span className="text-red-500">*</span>}
      </label>
      <input
        type={opts?.type || 'text'}
        value={String(s[key])}
        onChange={(e) => update(key as never, (opts?.type === 'checkbox' ? e.target.checked : e.target.value) as never)}
        placeholder={opts?.placeholder}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm"
      />
    </div>
  )

  const select = (label: string, key: keyof typeof s, options: string[]) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <select
        value={String(s[key])}
        onChange={(e) => update(key as never, e.target.value as never)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm"
      >
        <option value="">-- Selectionner --</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )

  const radio = (label: string, key: keyof typeof s) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name={key as string} checked={s[key] === true} onChange={() => update(key as never, true as never)} className="text-teal-600" />
          Oui
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name={key as string} checked={s[key] === false} onChange={() => update(key as never, false as never)} className="text-teal-600" />
          Non
        </label>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {radio('Etes-vous un nouveau client ?', 'isNewClient')}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {input('Nom', 'lastName', { required: true })}
        {input('Prenom', 'firstName', { required: true })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {input('Date de naissance', 'dateOfBirth', { type: 'date' })}
        {select('Etat civil', 'maritalStatus', MARITAL_STATUSES)}
        {input("Changement d'etat civil durant l'annee", 'maritalStatusChange')}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sexe <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="sex" value="Masculin" checked={s.sex === 'Masculin'} onChange={() => update('sex', 'Masculin')} className="text-teal-600" />
            Masculin
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="sex" value="Feminin" checked={s.sex === 'Feminin'} onChange={() => update('sex', 'Feminin')} className="text-teal-600" />
            Feminin
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {input("Numero d'assurance sociale", 'sin', { placeholder: '000-000-000' })}
        {input('Telephone', 'phone', { placeholder: '514-555-0000' })}
      </div>

      {input('Telephone etranger', 'foreignPhone', { required: false })}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cochez les annees a declarer <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 12 }, (_, i) => 2026 - i).map((year) => (
            <label key={year} className={`px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition ${
              s.yearsToDeclare.includes(year)
                ? 'bg-teal-50 border-teal-500 text-teal-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}>
              <input type="checkbox" className="sr-only" checked={s.yearsToDeclare.includes(year)} onChange={() => toggleYear(year)} />
              {year}
            </label>
          ))}
        </div>
      </div>

      {select('Province ou territoire de residence au 31 decembre', 'provinceOfResidence', PROVINCES)}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Langue d'impression de la declaration <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="printLang" checked={s.printLanguage === 'Francais'} onChange={() => update('printLanguage', 'Francais')} className="text-teal-600" />
            Francais
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="printLang" checked={s.printLanguage === 'Anglais'} onChange={() => update('printLanguage', 'Anglais')} className="text-teal-600" />
            Anglais
          </label>
        </div>
      </div>

      {input('Courriel', 'email', { type: 'email' })}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Assurance(s)</label>
        <div className="grid grid-cols-2 gap-2">
          {INSURANCE_OPTIONS.map((opt) => (
            <label key={opt} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition ${
              s.insurances.includes(opt)
                ? 'bg-teal-50 border-teal-500 text-teal-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}>
              <input type="checkbox" className="sr-only" checked={s.insurances.includes(opt)} onChange={() => toggleInsurance(opt)} />
              <span className={`w-4 h-4 rounded border flex items-center justify-center ${s.insurances.includes(opt) ? 'bg-teal-600 border-teal-600' : 'border-gray-300'}`}>
                {s.insurances.includes(opt) && <span className="text-white text-xs">&#10003;</span>}
              </span>
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message pour votre expert</label>
        <textarea
          value={s.messageToExpert}
          onChange={(e) => update('messageToExpert', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm h-24 resize-none"
          placeholder="Instructions ou informations complementaires..."
        />
      </div>

      {radio("Autorisez-vous le telechargement des donnees fiscales via l'ARC ?", 'arcDownloadAuth')}
      {radio('Est-ce votre premiere declaration au Canada ?', 'firstDeclarationCanada')}
      {radio('Etes-vous un nouvel arrivant ?', 'newcomer')}
    </div>
  )
}
