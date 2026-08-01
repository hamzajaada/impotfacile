import type { StepProps } from '../FormWizard'

export default function Step9Authorization({ data }: StepProps) {
  const s = data.data.step9
  const update = (field: string, val: string) => data.updateStep('step9', (prev) => ({ ...prev, [field]: val }))

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => update('authorizationPdf', reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-sm text-teal-700">
        Autorisation de communication de renseignements personnels a l'Agence du revenu du Canada (ARC).
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Document d'autorisation (optionnel)</label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-teal-400 transition-colors">
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleUpload} className="hidden" id="auth-upload" />
          <label htmlFor="auth-upload" className="cursor-pointer">
            {s.authorizationPdf ? (
              <p className="text-sm text-teal-600 font-medium">Fichier selectionne</p>
            ) : (
              <p className="text-sm text-gray-500">Cliquez pour joindre un document</p>
            )}
          </label>
        </div>
      </div>
    </div>
  )
}
