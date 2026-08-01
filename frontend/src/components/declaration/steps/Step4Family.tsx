import type { StepProps } from '../FormWizard'
import type { Dependent } from '@/types/declaration'
import { Plus, Trash2 } from 'lucide-react'

export default function Step4Family({ data }: StepProps) {
  const s = data.data.step4
  const update = <K extends keyof typeof s>(key: K, val: (typeof s)[K]) =>
    data.updateStep('step4', (prev) => ({ ...prev, [key]: val }))

  const addDependent = () => {
    const newDep: Dependent = { id: String(Date.now()), name: '', link: '', age: 0, income: 0 }
    update('dependents', [...s.dependents, newDep])
    update('numberOfDependents', s.dependents.length + 1)
  }

  const removeDependent = (id: string) => {
    const updated = s.dependents.filter((d) => d.id !== id)
    update('dependents', updated)
    update('numberOfDependents', updated.length)
  }

  const updateDependent = (id: string, field: keyof Dependent, val: string | number) => {
    update('dependents', s.dependents.map((d) => d.id === id ? { ...d, [field]: val } : d))
  }

  const radio = (label: string, key: keyof typeof s) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label} <span className="text-red-500">*</span></label>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name={`s4_${String(key)}`} checked={s[key] === true} onChange={() => update(key, true as never)} className="text-teal-600" />
          Oui
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name={`s4_${String(key)}`} checked={s[key] === false} onChange={() => update(key, false as never)} className="text-teal-600" />
          Non
        </label>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {radio('Traitons-nous la declaration de votre conjoint ?', 'processingSpouse')}

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
        Si vous selectionnez "Oui", des etapes supplementaires s'afficheront pour la declaration de votre conjoint.
      </div>

      {radio("Situation familiale changee durant l'annee ?", 'familyStatusChanged')}
      {radio("Plus de 100 000 $ de biens a l'etranger ?", 'foreignAssetsOver100k')}
      {radio("Achat/vente de residence principale durant l'annee ?", 'principalResidenceSale')}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de personnes a charge</label>
          <input type="number" min={0} value={s.numberOfDependents} onChange={(e) => update('numberOfDependents', Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm" />
        </div>
      </div>

      {s.dependents.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-gray-700">Personnes a charge</h4>
          {s.dependents.map((dep: Dependent, i: number) => (
            <div key={dep.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Personne {i + 1}</span>
                <button onClick={() => removeDependent(dep.id)} className="text-red-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" placeholder="Nom complet" value={dep.name} onChange={(e) => updateDependent(dep.id, 'name', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none" />
                <input type="text" placeholder="Lien de parente" value={dep.link} onChange={(e) => updateDependent(dep.id, 'link', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none" />
                <input type="number" placeholder="Age" value={dep.age || ''} onChange={(e) => updateDependent(dep.id, 'age', Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none" />
                <input type="number" placeholder="Revenu" value={dep.income || ''} onChange={(e) => updateDependent(dep.id, 'income', Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none" />
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={addDependent} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-600 border border-teal-300 rounded-lg hover:bg-teal-50 transition">
        <Plus size={16} />
        Ajouter une personne a charge
      </button>
    </div>
  )
}
