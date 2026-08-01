import { ArrowRight } from 'lucide-react'

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-2">Blog</p>
        <h1 className="section-title mb-3">Actualites fiscales</h1>
        <p className="section-subtitle mx-auto">
          Restez informe des derniers changements en fiscalite canadienne.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card overflow-hidden group hover:shadow-elevated transition-shadow duration-200">
            <div className="h-44 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
              <span className="text-4xl font-bold text-slate-200">0{i}</span>
            </div>
            <div className="p-5">
              <span className="badge bg-teal-50 text-teal-700 border border-teal-100 mb-3">Fiscalite</span>
              <h3 className="font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">Article en preparation #{i}</h3>
              <p className="text-sm text-slate-500 mb-4">Contenu bientot disponible...</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-teal-600">
                Lire la suite <ArrowRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
