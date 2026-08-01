import type { StepProps } from '../FormWizard'

export default function Step3Residence({ data }: StepProps) {
  const s = data.data.step3
  const update = <K extends keyof typeof s>(key: K, val: (typeof s)[K]) =>
    data.updateStep('step3', (prev) => ({ ...prev, [key]: val }))

  const radio = (label: string, key: keyof typeof s) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name={`s3_${key}`} checked={s[key] === true} onChange={() => update(key, true as never)} className="text-teal-600" />
          Oui
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name={`s3_${key}`} checked={s[key] === false} onChange={() => update(key, false as never)} className="text-teal-600" />
          Non
        </label>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {radio('Votre adresse postale est-elle la meme que votre residence ?', 'sameAsMailing')}
      {radio("Avez-vous change de province durant l'annee ?", 'provinceChangeDuringYear')}
      {radio('Etes-vous citoyen canadien ?', 'canadianCitizenship')}
    </div>
  )
}
