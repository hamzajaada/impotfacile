import { FileText, Clock, CheckCircle, Users } from 'lucide-react'

export default function AdvisorDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <p className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-1">Conseiller</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Tableau de bord</h1>
        <p className="text-sm text-slate-500 mt-1">Gerez les dossiers qui vous sont assigns</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Dossiers assigns', value: '0', icon: FileText, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'En attente', value: '0', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'En cours', value: '0', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Complete', value: '0', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon size={18} className={stat.color} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-extrabold text-slate-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 flex items-center gap-2"><FileText size={18} className="text-teal-600" /> Dossiers recents</h2>
        </div>
        <div className="p-12 text-center">
          <FileText className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="text-slate-400">Aucun dossier pour le moment.</p>
        </div>
      </div>
    </div>
  )
}
