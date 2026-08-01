import { Upload } from 'lucide-react'

export default function Step6Documents() {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-sm text-teal-700">
        Vous pourrez joindre vos documents apres la soumission de votre declaration. Aucun document n'est requis pour l'instant.
      </div>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-teal-400 transition-colors cursor-pointer">
        <Upload size={32} className="mx-auto text-gray-400 mb-3" />
        <p className="text-sm font-medium text-gray-600">Glissez vos fichiers ici ou cliquez pour parcourir</p>
        <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG — Max 10 Mo par fichier</p>
      </div>
    </div>
  )
}
