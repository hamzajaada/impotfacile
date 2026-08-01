import type { StepProps } from '../FormWizard'

export default function Step8Privacy({ data }: StepProps) {
  const s = data.data.step8
  const update = (field: string, val: string) => data.updateStep('step8', (prev) => ({ ...prev, [field]: val }))

  const handleSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => update('signatureImage', reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
        En signant ci-dessous, vous confirmez l'exactitude des renseignements fournis dans cette declaration.
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Signature</label>
        {s.signatureImage ? (
          <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <img src={s.signatureImage} alt="Signature" className="max-h-32 mx-auto" />
            <button onClick={() => update('signatureImage', '')} className="text-sm text-red-500 mt-2 hover:underline">Effacer</button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-teal-400 transition-colors">
            <input type="file" accept="image/*" onChange={handleSignature} className="hidden" id="sig-upload" />
            <label htmlFor="sig-upload" className="cursor-pointer">
              <p className="text-sm text-gray-500">Cliquez pour joindre une image de votre signature</p>
            </label>
          </div>
        )}
      </div>
    </div>
  )
}
