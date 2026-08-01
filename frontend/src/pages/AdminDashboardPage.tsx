import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, FileText, Download, CheckCircle, XCircle, Eye, Search, X, Clock, Settings } from 'lucide-react'
import { adminApi } from '@/services/api'
import { generateRequestPDF } from '@/utils/generatePDF'
import type { TaxRequest } from '@/services/api'
import type { User } from '@/types'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING: { label: 'En attente', color: 'bg-amber-50 text-amber-700 border border-amber-200', icon: Clock },
  REVIEWING: { label: 'En cours', color: 'bg-teal-50 text-teal-700 border border-teal-200', icon: Eye },
  VALIDATED: { label: 'Validee', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200', icon: CheckCircle },
  REJECTED: { label: 'Rejetee', color: 'bg-red-50 text-red-700 border border-red-200', icon: XCircle },
}

const STATUS_FALLBACK = { label: 'Inconnu', color: 'bg-slate-100 text-slate-600 border border-slate-200', icon: Clock }

const PROFILE_LABELS: Record<string, string> = {
  STUDENT: 'Etudiant', INDIVIDUAL: 'Particulier', SELF_EMPLOYED: 'Trav. autonome',
  SENIOR: 'Aine', NEWCOMER: 'Nouvel arrivant', MILITARY: 'Militaire', EXPATRIATE: 'Expatrie',
}

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<'requests' | 'users'>('requests')
  const [users, setUsers] = useState<User[]>([])
  const [requests, setRequests] = useState<TaxRequest[]>([])
  const [stats, setStats] = useState({ totalUsers: 0, totalRequests: 0, pending: 0, validated: 0, rejected: 0 })
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [search, setSearch] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<TaxRequest | null>(null)
  const [rejectModal, setRejectModal] = useState<string | null>(null)
  const [rejectNote, setRejectNote] = useState('')
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    const [u, r, s] = await Promise.all([adminApi.getUsers(), adminApi.getRequests(), adminApi.getStats()])
    setUsers(u.data)
    setRequests(r.data)
    setStats(s.data)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const handleValidate = async (id: string) => {
    await adminApi.validateRequest(id)
    loadData()
    setSelectedRequest(null)
  }

  const handleReject = async () => {
    if (!rejectModal || !rejectNote.trim()) return
    await adminApi.rejectRequest(rejectModal, rejectNote)
    setRejectModal(null)
    setRejectNote('')
    loadData()
  }

  const filteredRequests = requests.filter((r) => {
    if (filterStatus !== 'ALL' && r.status !== filterStatus) return false
    if (search) {
      const q = search.toLowerCase()
      return r.userFirstName.toLowerCase().includes(q) || r.userLastName.toLowerCase().includes(q) || r.userEmail.toLowerCase().includes(q)
    }
    return true
  })

  const filteredUsers = users.filter((u) => {
    if (search) {
      const q = search.toLowerCase()
      return u.firstName.toLowerCase().includes(q) || u.lastName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <p className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-1">Administration</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Gestion des declarations</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center"><Users size={18} className="text-teal-600" /></div>
            <div><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Utilisateurs</p><p className="text-xl font-extrabold text-slate-900">{stats.totalUsers}</p></div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center"><FileText size={18} className="text-teal-600" /></div>
            <div><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Demandes</p><p className="text-xl font-extrabold text-slate-900">{stats.totalRequests}</p></div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center"><Clock size={18} className="text-amber-600" /></div>
            <div><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">En attente</p><p className="text-xl font-extrabold text-slate-900">{stats.pending}</p></div>
          </div>
        </div>
        <Link to="/admin/formulaire" className="card p-5 hover:shadow-soft transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center"><Settings size={18} className="text-purple-600" /></div>
            <div><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Configuration</p><p className="text-sm font-extrabold text-slate-900">Formulaire de declaration</p></div>
          </div>
        </Link>
      </div>

      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
        <button onClick={() => { setTab('requests'); setSearch('') }}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${tab === 'requests' ? 'bg-white shadow-soft text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
          <FileText size={16} /> Demandes
          {stats.pending > 0 && <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">{stats.pending}</span>}
        </button>
        <button onClick={() => { setTab('users'); setSearch('') }}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${tab === 'users' ? 'bg-white shadow-soft text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
          <Users size={16} /> Utilisateurs
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="input-field pl-10" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={14} /></button>}
        </div>
        {tab === 'requests' && (
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field w-auto">
            <option value="ALL">Tous les statuts</option>
            <option value="PENDING">En attente</option>
            <option value="REVIEWING">En cours</option>
            <option value="VALIDATED">Validee</option>
            <option value="REJECTED">Rejetee</option>
          </select>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400">
          <svg className="animate-spin h-6 w-6 mx-auto mb-3 text-teal-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          Chargement...
        </div>
      ) : tab === 'requests' ? (
        <RequestsTable requests={filteredRequests} onSelect={setSelectedRequest} onValidate={handleValidate} onReject={(id) => setRejectModal(id)} onDownload={generateRequestPDF} />
      ) : (
        <UsersTable users={filteredUsers} />
      )}

      {selectedRequest && (
        <RequestDetailModal request={selectedRequest} onClose={() => setSelectedRequest(null)} onValidate={handleValidate} onReject={(id) => setRejectModal(id)} onDownload={generateRequestPDF} />
      )}

      {rejectModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-modal max-w-md w-full p-6">
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mb-1">Rejeter la demande</h3>
            <p className="text-sm text-slate-500 mb-4">Indiquez la raison du rejet :</p>
            <textarea value={rejectNote} onChange={(e) => setRejectNote(e.target.value)}
              className="input-field h-24 resize-none"
              placeholder="Documents manquants, information incorrecte..." />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => { setRejectModal(null); setRejectNote('') }} className="btn-secondary">Annuler</button>
              <button onClick={handleReject} disabled={!rejectNote.trim()} className="btn-danger disabled:opacity-40">Rejeter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function RequestsTable({ requests, onSelect, onValidate, onReject, onDownload }: {
  requests: TaxRequest[]; onSelect: (r: TaxRequest) => void; onValidate: (id: string) => void; onReject: (id: string) => void; onDownload: (r: TaxRequest) => void
}) {
  if (requests.length === 0) return <div className="text-center py-16 text-slate-400 card">Aucune demande trouvee</div>

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Client</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Annee</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Profil</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Statut</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {requests.map((req) => {
              const st = STATUS_CONFIG[req.status] || STATUS_FALLBACK
              const Icon = st.icon
              return (
                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{req.userFirstName} {req.userLastName}</div>
                    <div className="text-xs text-slate-400">{req.userEmail}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{req.taxYear}</td>
                  <td className="px-6 py-4"><span className="badge bg-slate-100 text-slate-600 border border-slate-200">{PROFILE_LABELS[req.profile]}</span></td>
                  <td className="px-6 py-4"><span className={`badge ${st.color}`}><Icon size={12} />{st.label}</span></td>
                  <td className="px-6 py-4 text-slate-500">{new Date(req.submittedAt).toLocaleDateString('fr-CA')}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => onSelect(req)} className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors" title="Voir details"><Eye size={16} /></button>
                      <button onClick={() => onDownload(req)} className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors" title="PDF"><Download size={16} /></button>
                      {req.status === 'PENDING' && (
                        <>
                          <button onClick={() => onValidate(req.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Valider"><CheckCircle size={16} /></button>
                          <button onClick={() => onReject(req.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Rejeter"><XCircle size={16} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function UsersTable({ users }: { users: User[] }) {
  if (users.length === 0) return <div className="text-center py-16 text-slate-400 card">Aucun utilisateur trouve</div>

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nom</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Courriel</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Profil fiscal</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Telephone</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Inscrit le</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-900">{u.firstName} {u.lastName}</td>
                <td className="px-6 py-4 text-slate-500">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`badge ${
                    u.role === 'ADMIN' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                    u.role === 'ADVISOR' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                    'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {u.role === 'ADMIN' ? 'Admin' : u.role === 'ADVISOR' ? 'Conseiller' : 'Client'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{PROFILE_LABELS[u.taxProfile || ''] || '—'}</td>
                <td className="px-6 py-4 text-slate-500">{u.phone || '—'}</td>
                <td className="px-6 py-4 text-slate-500">{new Date(u.createdAt).toLocaleDateString('fr-CA')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RequestDetailModal({ request: req, onClose, onValidate, onReject, onDownload }: {
  request: TaxRequest; onClose: () => void; onValidate: (id: string) => void; onReject: (id: string) => void; onDownload: (r: TaxRequest) => void
}) {
  const st = STATUS_CONFIG[req.status] || STATUS_FALLBACK
  const Icon = st.icon
  const d = req.declarationData

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-modal max-w-3xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{req.userFirstName} {req.userLastName}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{req.userEmail} &middot; {req.taxYear}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center gap-3">
            <span className={`badge ${st.color}`}><Icon size={14} />{st.label}</span>
            <span className="text-sm text-slate-500">Soumise le {new Date(req.submittedAt).toLocaleDateString('fr-CA')}</span>
          </div>

          {req.reviewerNote && (
            <div className={`p-3 rounded-xl text-sm ${req.status === 'REJECTED' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-teal-50 text-teal-700 border border-teal-200'}`}>
              <strong>Note :</strong> {req.reviewerNote}
            </div>
          )}

          {(d as Record<string, unknown>).reponses ? <DynamicAnswers data={d as Record<string, unknown>} /> : null}

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 mb-3">Informations personnelles</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <Info label="Prenom" value={String((d as Record<string, unknown>).firstName || '')} />
              <Info label="Nom" value={String((d as Record<string, unknown>).lastName || '')} />
              <Info label="NAS" value={String((d as Record<string, unknown>).sin || 'Non fourni')} />
              <Info label="Date naissance" value={String((d as Record<string, unknown>).dateOfBirth || 'Non fourni')} />
              <Info label="Sexe" value={String((d as Record<string, unknown>).sex || 'Non precise')} />
              <Info label="Telephone" value={String((d as Record<string, unknown>).phone || 'Non fourni')} />
              <Info label="Courriel" value={String((d as Record<string, unknown>).email || '')} />
              <Info label="Etat civil" value={String((d as Record<string, unknown>).maritalStatus || 'Non precise')} />
              <Info label="Province" value={String((d as Record<string, unknown>).provinceOfResidence || 'Quebec')} />
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 mb-3">Adresse postale</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <Info label="Adresse" value={[String((d as Record<string, unknown>).civicNumber || ''), String((d as Record<string, unknown>).streetName || ''), String((d as Record<string, unknown>).apartment || '')].filter(Boolean).join(' ') || 'Non fournie'} />
              <Info label="Ville" value={String((d as Record<string, unknown>).city || 'Non fournie')} />
              <Info label="Code postal" value={String((d as Record<string, unknown>).postalCode || 'Non fourni')} />
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 mb-3">Famille / Personnes a charge</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <Info label="Declaration conjoint" value={Boolean((d as Record<string, unknown>).processingSpouse) ? 'Oui' : 'Non'} />
              <Info label="Nb personnes a charge" value={String((d as Record<string, unknown>).numberOfDependents || 0)} />
              <Info label="REER" value={Boolean((d as Record<string, unknown>).rrspContributions) ? 'Oui' : 'Non'} />
              <Info label="CELIAPP" value={Boolean((d as Record<string, unknown>).celiappContributions) ? 'Oui' : 'Non'} />
              <Info label="Situations" value={Array.isArray((d as Record<string, unknown>).situations) ? ((d as Record<string, unknown>).situations as string[]).join(', ') || 'Aucune' : 'Aucune'} />
            </div>
          </div>

          {Boolean((d as Record<string, unknown>).processingSpouse) && (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 mb-3">Conjoint</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <Info label="Prenom" value={String((d as Record<string, unknown>).spouseFirstName || '')} />
                <Info label="Nom" value={String((d as Record<string, unknown>).spouseLastName || '')} />
                <Info label="NAS" value={String((d as Record<string, unknown>).spouseSin || '')} />
                <Info label="Date naissance" value={String((d as Record<string, unknown>).spouseDateOfBirth || '')} />
                <Info label="Telephone" value={String((d as Record<string, unknown>).spousePhone || '')} />
              </div>
            </div>
          )}

          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-2">Documents ({req.documents.length})</h3>
            {req.documents.length === 0 ? (
              <p className="text-sm text-slate-400">Aucun document</p>
            ) : (
              <div className="space-y-1">
                {req.documents.map((doc, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <FileText size={14} className="text-slate-400" />
                    <span>{doc.name}</span>
                    <span className="text-xs text-slate-400">({doc.type})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
          <button onClick={() => onDownload(req)} className="btn-secondary">
            <Download size={16} /> Telecharger le PDF
          </button>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary">Fermer</button>
            {req.status === 'PENDING' && (
              <>
                <button onClick={() => onReject(req.id)} className="btn-danger">Rejeter</button>
                <button onClick={() => onValidate(req.id)} className="btn-success">Valider</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <p className="font-medium text-slate-800">{value || '—'}</p>
    </div>
  )
}

interface DynamicSection {
  titre: string
  champs: { label: string; type: string; nomChamp: string; options?: string }[]
}

function DynamicAnswers({ data }: { data: Record<string, unknown> }) {
  const reponses = (data.reponses || {}) as Record<string, unknown>
  const template = data.template as { nom?: string; sections: DynamicSection[] } | undefined
  const sections = template?.sections || []

  const fmt = (v: unknown) => {
    if (v === undefined || v === null) return 'Non fourni'
    if (Array.isArray(v)) return v.length > 0 ? v.map(String).join(', ') : 'Non fourni'
    const s = String(v)
    return s.trim() === '' ? 'Non fourni' : s
  }

  return (
    <div>
      {sections.length > 0 ? sections.map((section, i) => (
        <div key={i} className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
          <h3 className="font-bold text-sm text-slate-900 mb-3">{section.titre}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {section.champs.map((champ) => (
              <Info key={champ.nomChamp} label={champ.label} value={fmt(reponses[champ.nomChamp])} />
            ))}
          </div>
        </div>
      )) : (
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
          <h3 className="font-bold text-sm text-slate-900 mb-3">Reponses du formulaire</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {Object.entries(reponses).map(([k, v]) => (
              <Info key={k} label={k} value={fmt(v)} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
