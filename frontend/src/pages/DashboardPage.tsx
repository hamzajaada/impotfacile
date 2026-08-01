import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Eye, CheckCircle, XCircle, FileText, Plus, X, TrendingUp, MapPin, Users, User } from 'lucide-react'
import { fileApi } from '@/services/api'
import type { ClientDeclaration } from '@/services/api'

const STATUS_CONFIG: Record<ClientDeclaration['status'], { label: string; color: string; icon: React.ElementType }> = {
  PENDING: { label: 'En attente', color: 'bg-amber-50 text-amber-700 border border-amber-200', icon: Clock },
  REVIEWING: { label: 'En cours', color: 'bg-teal-50 text-teal-700 border border-teal-200', icon: Eye },
  VALIDATED: { label: 'Validee', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200', icon: CheckCircle },
  REJECTED: { label: 'Rejetee', color: 'bg-red-50 text-red-700 border border-red-200', icon: XCircle },
}

const STATUS_FALLBACK = { label: 'Inconnu', color: 'bg-slate-100 text-slate-600 border border-slate-200', icon: Clock }

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value || '—'}</p>
    </div>
  )
}

export default function DashboardPage() {
  const [declarations, setDeclarations] = useState<ClientDeclaration[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ClientDeclaration | null>(null)

  useEffect(() => {
    fileApi.getMyFiles(0, 50).then((res) => {
      setDeclarations(res.data.content)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const pending = declarations.filter((d) => d.status === 'PENDING').length
  const validated = declarations.filter((d) => d.status === 'VALIDATED').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-1">Tableau de bord</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Mes declarations</h1>
        </div>
        <Link to="/declaration" className="btn-primary">
          <Plus size={16} />
          Nouvelle declaration
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="card p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{declarations.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">En attente</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{pending}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Validees</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{validated}</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 flex items-center gap-2"><FileText size={18} className="text-teal-600" /> Declarations</h2>
        </div>
        {loading ? (
          <div className="text-center py-16 text-slate-400">
            <svg className="animate-spin h-6 w-6 mx-auto mb-3 text-teal-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            Chargement...
          </div>
        ) : declarations.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 mb-4">Aucune declaration pour le moment.</p>
            <Link to="/declaration" className="btn-primary inline-flex">
              <Plus size={16} />
              Soumettre une declaration
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Annee fiscale</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Statut</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Conjoint</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date de soumission</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {declarations.map((decl) => {
                  const st = STATUS_CONFIG[decl.status] || STATUS_FALLBACK
                  const Icon = st.icon
                  return (
                    <tr key={decl.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900">{decl.taxYear}</td>
                      <td className="px-6 py-4">
                        <span className={`badge ${st.color}`}>
                          <Icon size={12} />
                          {st.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{decl.withSpouse ? 'Oui' : 'Non'}</td>
                      <td className="px-6 py-4 text-slate-500">{new Date(decl.submittedAt).toLocaleDateString('fr-CA')}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setSelected(decl)} className="btn-secondary text-xs py-1.5 px-3">
                          <Eye size={14} />
                          Voir
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && <DetailModal declaration={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function DetailModal({ declaration: decl, onClose }: { declaration: ClientDeclaration; onClose: () => void }) {
  const st = STATUS_CONFIG[decl.status] || STATUS_FALLBACK
  const Icon = st.icon
  const d = decl.declarationData

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-modal max-w-3xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Declaration {decl.taxYear}</h2>
            <p className="text-sm text-slate-500 mt-0.5">Soumise le {new Date(decl.submittedAt).toLocaleDateString('fr-CA')}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center gap-3">
            <span className={`badge ${st.color}`}><Icon size={12} />{st.label}</span>
            <span className="text-sm text-slate-500">Conjoint : {decl.withSpouse ? 'Oui' : 'Non'}</span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2"><User size={16} className="text-teal-600" /> Informations personnelles</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Info label="Prenom" value={String(d.firstName || '')} />
              <Info label="Nom" value={String(d.lastName || '')} />
              <Info label="NAS" value={String(d.sin || 'Non fourni')} />
              <Info label="Date naissance" value={String(d.dateOfBirth || 'Non fourni')} />
              <Info label="Sexe" value={String(d.sex || 'Non precise')} />
              <Info label="Telephone" value={String(d.phone || 'Non fourni')} />
              <Info label="Courriel" value={String(d.email || '')} />
              <Info label="Etat civil" value={String(d.maritalStatus || 'Non precise')} />
              <Info label="Province" value={String(d.provinceOfResidence || 'Quebec')} />
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2"><MapPin size={16} className="text-teal-600" /> Adresse postale</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Info label="Adresse" value={[String(d.civicNumber || ''), String(d.streetName || ''), String(d.apartment || '')].filter(Boolean).join(' ') || 'Non fournie'} />
              <Info label="Ville" value={String(d.city || 'Non fournie')} />
              <Info label="Code postal" value={String(d.postalCode || 'Non fourni')} />
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2"><Users size={16} className="text-teal-600" /> Famille / Personnes a charge</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Info label="Declaration conjoint" value={Boolean(d.processingSpouse) ? 'Oui' : 'Non'} />
              <Info label="Nb personnes a charge" value={String(d.numberOfDependents || 0)} />
              <Info label="REER" value={Boolean(d.rrspContributions) ? 'Oui' : 'Non'} />
              <Info label="CELIAPP" value={Boolean(d.celiappContributions) ? 'Oui' : 'Non'} />
              <Info label="Situations" value={Array.isArray(d.situations) ? (d.situations as string[]).join(', ') || 'Aucune' : 'Aucune'} />
            </div>
          </div>

          {Boolean(d.processingSpouse) && (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2"><TrendingUp size={16} className="text-teal-600" /> Conjoint</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Info label="Prenom" value={String(d.spouseFirstName || '')} />
                <Info label="Nom" value={String(d.spouseLastName || '')} />
                <Info label="NAS" value={String(d.spouseSin || '')} />
                <Info label="Date naissance" value={String(d.spouseDateOfBirth || '')} />
                <Info label="Telephone" value={String(d.spousePhone || '')} />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-slate-100">
          <button onClick={onClose} className="btn-secondary">Fermer</button>
        </div>
      </div>
    </div>
  )
}
