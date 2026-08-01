import { useState, useEffect, useCallback } from 'react'
import {
  Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Settings, Eye, EyeOff,
  X, AlertCircle, Check, RotateCcw
} from 'lucide-react'
import { formApi } from '@/services/api'
import type { FormTemplate, FormSection, FormChamp, FormRegle } from '@/services/api'

const FIELD_TYPES = [
  { value: 'TEXTE', label: 'Texte court' },
  { value: 'ZONE_TEXTE', label: 'Texte long' },
  { value: 'NOMBRE', label: 'Nombre' },
  { value: 'DATE', label: 'Date' },
  { value: 'CHOIX_UNIQUE', label: 'Choix unique' },
  { value: 'CHOIX_MULTIPLE', label: 'Choix multiple' },
  { value: 'LISTE_DEROULANTE', label: 'Liste deroulante' },
  { value: 'UPLOAD_FICHIER', label: 'Upload fichier' },
  { value: 'UPLOAD_IMAGE', label: 'Upload image' },
  { value: 'GROUPE_REPETABLE', label: 'Groupe repetable' },
]

const RULE_TYPES = [
  { value: 'EGAL', label: 'Egal a' },
  { value: 'NON_VIDE', label: 'Non vide' },
  { value: 'CONTIENT', label: 'Contient' },
]

const CLIENT_PROFILES = [
  { value: 'STUDENT', label: 'Etudiant' },
  { value: 'INDIVIDUAL', label: 'Particulier' },
  { value: 'SELF_EMPLOYED', label: 'Trav. autonome' },
  { value: 'SENIOR', label: 'Aine' },
  { value: 'NEWCOMER', label: 'Nouvel arrivant' },
  { value: 'MILITARY', label: 'Militaire' },
  { value: 'EXPATRIATE', label: 'Expatrie' },
]

export default function AdminFormConfigPage() {
  const [templates, setTemplates] = useState<FormTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [showNewTemplate, setShowNewTemplate] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState('')
  const [newTemplateYear, setNewTemplateYear] = useState(new Date().getFullYear())
  const [showNewSection, setShowNewSection] = useState(false)
  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [editingField, setEditingField] = useState<FormChamp | null>(null)
  const [showNewField, setShowNewField] = useState(false)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadTemplates = useCallback(async () => {
    setLoading(true)
    try {
      const res = await formApi.getAllTemplates()
      setTemplates(res.data)
      if (res.data.length > 0 && !selectedTemplate) {
        const tpl = res.data.find(t => t.actif) || res.data[0]
        if (tpl) await loadTemplate(tpl.id)
      }
    } catch { showToast('Erreur de chargement', 'error') }
    setLoading(false)
  }, [])

  const loadTemplate = async (id: string) => {
    try {
      const res = await formApi.getTemplate(id)
      setSelectedTemplate({ ...res.data, sections: res.data.sections || [] })
      if ((res.data.sections || []).length > 0) {
        setSelectedSectionId(res.data.sections[0]!.id)
      } else {
        setSelectedSectionId(null)
      }
    } catch { showToast('Erreur de chargement du template', 'error') }
  }

  useEffect(() => { loadTemplates() }, [loadTemplates])

  const selectedSection = (selectedTemplate?.sections || []).find(s => s.id === selectedSectionId) || null

  const handleCreateTemplate = async () => {
    if (!newTemplateName.trim()) return
    try {
      const res = await formApi.createTemplate({ nom: newTemplateName.trim(), anneeFiscale: newTemplateYear })
      setShowNewTemplate(false)
      setNewTemplateName('')
      setTemplates(prev => [...prev, res.data])
      await loadTemplate(res.data.id)
      showToast('Template cree')
    } catch { showToast('Erreur lors de la creation', 'error') }
  }

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Supprimer ce template et toutes ses sections/champs ?')) return
    try {
      await formApi.deleteTemplate(id)
      setTemplates(prev => prev.filter(t => t.id !== id))
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(null)
        setSelectedSectionId(null)
      }
      showToast('Template supprime')
    } catch { showToast('Erreur lors de la suppression', 'error') }
  }

  const handleToggleActive = async (id: string, actif: boolean) => {
    try {
      await formApi.toggleActive(id, actif)
      await loadTemplates()
      showToast(actif ? 'Template active' : 'Template desactive')
    } catch { showToast('Erreur', 'error') }
  }

  const handleResetToDefault = async () => {
    if (!confirm('Revenir au formulaire par defaut ? Tous les templates seront desactives. Le client verra a nouveau le formulaire standard.')) return
    try {
      await formApi.resetToDefault()
      await loadTemplates()
      setSelectedTemplate(null)
      setSelectedSectionId(null)
      showToast('Formulaire par defaut restaure')
    } catch { showToast('Erreur lors de la restauration', 'error') }
  }

  const handleAddSection = async () => {
    if (!selectedTemplate || !newSectionTitle.trim()) return
    try {
      const ordre = (selectedTemplate.sections || []).length
      const res = await formApi.addSection(selectedTemplate.id, { titre: newSectionTitle.trim(), ordre, repetable: false, profilsCibles: [] })
      await loadTemplate(selectedTemplate.id)
      setSelectedSectionId(res.data.id)
      setShowNewSection(false)
      setNewSectionTitle('')
      showToast('Section ajoutee')
    } catch { showToast('Erreur lors de l\'ajout', 'error') }
  }

  const handleUpdateSection = async (sectionId: string, data: { titre: string; repetable: boolean; profilsCibles: string[] }) => {
    if (!selectedTemplate) return
    try {
      const section = (selectedTemplate.sections || []).find(s => s.id === sectionId)
      if (!section) return
      await formApi.updateSection(sectionId, { ...data, ordre: section.ordre })
      await loadTemplate(selectedTemplate.id)
      showToast('Section mise a jour')
    } catch { showToast('Erreur de mise a jour', 'error') }
  }

  const handleDeleteSection = async (sectionId: string) => {
    if (!selectedTemplate || !confirm('Supprimer cette section et tous ses champs ?')) return
    try {
      await formApi.deleteSection(sectionId)
      await loadTemplate(selectedTemplate.id)
      if (selectedSectionId === sectionId) {
        setSelectedSectionId((selectedTemplate.sections || []).find(s => s.id !== sectionId)?.id || null)
      }
      showToast('Section supprimee')
    } catch { showToast('Erreur lors de la suppression', 'error') }
  }

  const handleMoveSection = async (sectionId: string, direction: 'up' | 'down') => {
    if (!selectedTemplate) return
    const sections = [...(selectedTemplate.sections || [])].sort((a, b) => a.ordre - b.ordre)
    const idx = sections.findIndex(s => s.id === sectionId)
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === sections.length - 1)) return
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    const ids = sections.map(s => s.id)
    const tmp = ids[idx]!
    ids[idx] = ids[swapIdx]!
    ids[swapIdx] = tmp
    try {
      await formApi.reorderSections(selectedTemplate.id, ids)
      await loadTemplate(selectedTemplate.id)
    } catch { showToast('Erreur de reordonnancement', 'error') }
  }

  const handleAddField = async (data: Partial<FormChamp>) => {
    if (!selectedSection) return
    try {
      const res = await formApi.addChamp(selectedSection.id, {
        ...data,
        ordre: (selectedSection.champs || []).length,
        obligatoire: data.obligatoire ?? true,
        regles: [],
      })
      await loadTemplate(selectedTemplate!.id)
      setShowNewField(false)
      setEditingField(res.data)
      showToast('Champ ajoute')
    } catch { showToast('Erreur lors de l\'ajout', 'error') }
  }

  const handleUpdateField = async (champId: string, data: Partial<FormChamp>) => {
    if (!selectedTemplate) return
    try {
      await formApi.updateChamp(champId, data)
      await loadTemplate(selectedTemplate.id)
      showToast('Champ mis a jour')
    } catch { showToast('Erreur de mise a jour', 'error') }
  }

  const handleDeleteField = async (champId: string) => {
    if (!selectedTemplate || !confirm('Supprimer ce champ ?')) return
    try {
      await formApi.deleteChamp(champId)
      await loadTemplate(selectedTemplate.id)
      setEditingField(null)
      showToast('Champ supprime')
    } catch { showToast('Erreur lors de la suppression', 'error') }
  }

  const handleMoveField = async (champId: string, direction: 'up' | 'down') => {
    if (!selectedSection || !selectedTemplate) return
    const champs = [...(selectedSection.champs || [])].sort((a, b) => a.ordre - b.ordre)
    const idx = champs.findIndex(c => c.id === champId)
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === champs.length - 1)) return
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    const ids = champs.map(c => c.id)
    const tmp = ids[idx]!
    ids[idx] = ids[swapIdx]!
    ids[swapIdx] = tmp
    try {
      await formApi.reorderChamps(selectedSection.id, ids)
      await loadTemplate(selectedTemplate.id)
    } catch { showToast('Erreur de reordonnancement', 'error') }
  }

  const handleSaveRegles = async (champId: string, regles: FormRegle[]) => {
    try {
      await formApi.setRegles(champId, regles)
      await loadTemplate(selectedTemplate!.id)
      showToast('Regles sauvegardees')
    } catch { showToast('Erreur lors de la sauvegarde des regles', 'error') }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Chargement du configurateur...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg flex items-center gap-2 transition-all ${
          toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      <div className="mb-8">
        <p className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-1">Administration</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Configuration du formulaire</h1>
        <p className="text-sm text-slate-500 mt-1">Ajoutez, modifiez ou supprimez des sections et des champs du formulaire de declaration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Templates</h2>
              <button onClick={() => setShowNewTemplate(true)} className="p-1.5 rounded-lg hover:bg-teal-50 text-teal-600 transition-colors" title="Nouveau template">
                <Plus size={16} />
              </button>
            </div>

            <div className="mb-4 p-3 rounded-xl border text-sm">
              {templates.some(t => t.actif) ? (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <p className="font-semibold text-slate-800 text-xs">
                      Template actif : {templates.find(t => t.actif)?.nom}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Le client voit ce formulaire personnalise.</p>
                  <button onClick={handleResetToDefault}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 border border-red-100 rounded-lg px-3 py-1.5 transition-colors">
                    <RotateCcw size={12} /> Revenir au formulaire par defaut
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800 text-xs">Formulaire par defaut</p>
                    <p className="text-xs text-slate-400">Le client voit le formulaire standard.</p>
                  </div>
                </div>
              )}
            </div>

            {showNewTemplate && (
              <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <input type="text" value={newTemplateName} onChange={e => setNewTemplateName(e.target.value)}
                  placeholder="Nom du template" className="input-field text-sm" autoFocus />
                <input type="number" value={newTemplateYear} onChange={e => setNewTemplateYear(Number(e.target.value))}
                  className="input-field text-sm" />
                <div className="flex gap-2">
                  <button onClick={handleCreateTemplate} className="btn-primary text-xs flex-1">Creer</button>
                  <button onClick={() => setShowNewTemplate(false)} className="btn-secondary text-xs">Annuler</button>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              {templates.map(t => (
                <div key={t.id}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    selectedTemplate?.id === t.id
                      ? 'bg-teal-50 border border-teal-200'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                  onClick={() => loadTemplate(t.id)}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{t.nom}</p>
                      <p className="text-xs text-slate-400">{t.anneeFiscale} &middot; v{t.version}</p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      {t.actif && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                      <button onClick={(e) => { e.stopPropagation(); handleToggleActive(t.id, !t.actif) }}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400" title={t.actif ? 'Desactiver' : 'Activer'}>
                        {t.actif ? <Eye size={12} /> : <EyeOff size={12} />}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(t.id) }}
                        className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500" title="Supprimer">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {templates.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">Aucun template. Creez-en un.</p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Sections</h2>
              {selectedTemplate && (
                <button onClick={() => setShowNewSection(true)} className="p-1.5 rounded-lg hover:bg-teal-50 text-teal-600 transition-colors" title="Ajouter une section">
                  <Plus size={16} />
                </button>
              )}
            </div>

            {!selectedTemplate ? (
              <p className="text-sm text-slate-400 text-center py-8">Selectionnez un template</p>
            ) : (selectedTemplate.sections || []).length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">Aucune section. Ajoutez-en une.</p>
            ) : (
              <div className="space-y-1.5">
                {(selectedTemplate.sections || []).sort((a, b) => a.ordre - b.ordre).map((section, idx) => (
                  <SectionItem
                    key={section.id}
                    section={section}
                    index={idx}
                    total={(selectedTemplate.sections || []).length}
                    isSelected={selectedSectionId === section.id}
                    onSelect={() => setSelectedSectionId(section.id)}
                    onUpdate={(data) => handleUpdateSection(section.id, data)}
                    onDelete={() => handleDeleteSection(section.id)}
                    onMove={(dir) => handleMoveSection(section.id, dir)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {selectedSection ? selectedSection.titre : 'Champs'}
              </h2>
              {selectedSection && (
                <button onClick={() => setShowNewField(true)} className="btn-primary text-xs flex items-center gap-1.5">
                  <Plus size={14} /> Ajouter un champ
                </button>
              )}
            </div>

            {!selectedSection ? (
              <p className="text-sm text-slate-400 text-center py-16">Selectionnez une section</p>
            ) : (selectedSection.champs || []).length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-16">Aucun champ dans cette section.</p>
            ) : (
              <div className="space-y-1.5">
                {(selectedSection.champs || []).sort((a, b) => a.ordre - b.ordre).map((champ, idx) => (
                  <FieldItem
                    key={champ.id}
                    champ={champ}
                    index={idx}
                    total={(selectedSection.champs || []).length}
                    onEdit={() => setEditingField(champ)}
                    onDelete={() => handleDeleteField(champ.id)}
                    onMove={(dir) => handleMoveField(champ.id, dir)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showNewSection && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-modal max-w-md w-full p-6">
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mb-1">Ajouter une section</h3>
            <p className="text-sm text-slate-500 mb-4">Donnez un titre a la nouvelle section du formulaire.</p>
            <input type="text" value={newSectionTitle} onChange={e => setNewSectionTitle(e.target.value)}
              className="input-field" placeholder="Ex: Informations personnelles" autoFocus
              onKeyDown={e => { if (e.key === 'Enter') handleAddSection() }} />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => { setShowNewSection(false); setNewSectionTitle('') }} className="btn-secondary">Annuler</button>
              <button onClick={handleAddSection} disabled={!newSectionTitle.trim()} className="btn-primary disabled:opacity-40">Ajouter</button>
            </div>
          </div>
        </div>
      )}

      {showNewField && selectedSection && (
        <FieldEditorModal
          champ={null}
          allChamps={selectedSection.champs || []}
          onSave={handleAddField}
          onClose={() => setShowNewField(false)}
        />
      )}

      {editingField && selectedSection && (
        <FieldEditorModal
          champ={editingField}
          allChamps={(selectedSection.champs || []).filter(c => c.id !== editingField.id)}
          onSave={async (data) => {
            await handleUpdateField(editingField.id, data)
            if (data.regles) {
              await handleSaveRegles(editingField.id, data.regles)
            }
            setEditingField(null)
          }}
          onClose={() => setEditingField(null)}
        />
      )}
    </div>
  )
}

function SectionItem({ section, index, total, isSelected, onSelect, onUpdate, onDelete, onMove }: {
  section: FormSection; index: number; total: number; isSelected: boolean
  onSelect: () => void; onUpdate: (data: { titre: string; repetable: boolean; profilsCibles: string[] }) => void
  onDelete: () => void; onMove: (dir: 'up' | 'down') => void
}) {
  const [editing, setEditing] = useState(false)
  const [titre, setTitre] = useState(section.titre)
  const [repetable, setRepetable] = useState(section.repetable)
  const [profils, setProfils] = useState<string[]>(section.profilsCibles || [])

  const toggleProfil = (value: string) => {
    setProfils((prev) => prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value])
  }

  const handleSave = () => {
    onUpdate({ titre, repetable, profilsCibles: profils })
    setEditing(false)
  }

  return (
    <div className={`group rounded-xl transition-all ${isSelected ? 'bg-teal-50 border border-teal-200' : 'hover:bg-slate-50 border border-transparent'}`}>
      <div className="flex items-center gap-2 p-3 cursor-pointer" onClick={onSelect}>
        <GripVertical size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="space-y-1.5" onClick={e => e.stopPropagation()}>
              <input type="text" value={titre} onChange={e => setTitre(e.target.value)}
                className="input-field text-sm py-1" autoFocus />
              <label className="flex items-center gap-2 text-xs text-slate-600">
                <input type="checkbox" checked={repetable} onChange={e => setRepetable(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                Repetable
              </label>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Profil(s) cible(s) — vide = tous</p>
                <div className="grid grid-cols-1 gap-1">
                  {CLIENT_PROFILES.map((p) => (
                    <label key={p.value} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                      <input type="checkbox" checked={profils.includes(p.value)} onChange={() => toggleProfil(p.value)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                      {p.label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-1.5">
                <button onClick={handleSave} className="btn-primary text-xs py-1 px-2.5">Sauver</button>
                <button onClick={() => { setEditing(false); setTitre(section.titre); setRepetable(section.repetable); setProfils(section.profilsCibles || []) }}
                  className="btn-secondary text-xs py-1 px-2.5">Annuler</button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold text-slate-900 truncate">{section.titre}</p>
              <p className="text-xs text-slate-400">{(section.champs || []).length} champ{(section.champs || []).length !== 1 ? 's' : ''}{section.repetable ? ' (repetable)' : ''}</p>
              {(section.profilsCibles || []).length > 0 && (
                <p className="text-[10px] text-teal-600 font-medium mt-0.5 truncate">
                  {section.profilsCibles.map((p) => CLIENT_PROFILES.find(cp => cp.value === p)?.label || p).join(', ')}
                </p>
              )}
            </>
          )}
        </div>
        {!editing && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => { e.stopPropagation(); onMove('up') }} disabled={index === 0}
              className="p-1 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-20"><ChevronUp size={12} /></button>
            <button onClick={(e) => { e.stopPropagation(); onMove('down') }} disabled={index === total - 1}
              className="p-1 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-20"><ChevronDown size={12} /></button>
            <button onClick={(e) => { e.stopPropagation(); setEditing(true) }}
              className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-teal-600"><Settings size={12} /></button>
            <button onClick={(e) => { e.stopPropagation(); onDelete() }}
              className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={12} /></button>
          </div>
        )}
      </div>
    </div>
  )
}

function FieldItem({ champ, index, total, onEdit, onDelete, onMove }: {
  champ: FormChamp; index: number; total: number
  onEdit: () => void; onDelete: () => void; onMove: (dir: 'up' | 'down') => void
}) {
  const typeLabel = FIELD_TYPES.find(t => t.value === champ.type)?.label || champ.type
  const hasRules = champ.regles && champ.regles.length > 0
  const hasProfils = champ.profilsCibles && champ.profilsCibles.length > 0

  return (
    <div className="group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
      <GripVertical size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-900 truncate">{champ.label}</p>
          {champ.obligatoire && <span className="text-xs text-red-400 font-bold">*</span>}
          {hasRules && (
            <span className="badge bg-teal-50 text-teal-600 border border-teal-200 text-[10px] px-1.5 py-0">
              <Eye size={10} className="inline mr-0.5" />conditionnel
            </span>
          )}
          {hasProfils && (
            <span className="badge bg-amber-50 text-amber-600 border border-amber-200 text-[10px] px-1.5 py-0">
              {champ.profilsCibles.length} profil{champ.profilsCibles.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400">{typeLabel} &middot; {champ.nomChamp || champ.label.toLowerCase().replace(/\s+/g, '_')}</p>
      </div>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onMove('up')} disabled={index === 0}
          className="p-1 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-20"><ChevronUp size={12} /></button>
        <button onClick={() => onMove('down')} disabled={index === total - 1}
          className="p-1 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-20"><ChevronDown size={12} /></button>
        <button onClick={onEdit} className="p-1 rounded hover:bg-teal-50 text-slate-400 hover:text-teal-600"><Settings size={12} /></button>
        <button onClick={onDelete} className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 size={12} /></button>
      </div>
    </div>
  )
}

function FieldEditorModal({ champ, allChamps, onSave, onClose }: {
  champ: FormChamp | null; allChamps: FormChamp[]
  onSave: (data: Partial<FormChamp>) => void; onClose: () => void
}) {
  const [label, setLabel] = useState(champ?.label || '')
  const [type, setType] = useState(champ?.type || 'TEXTE')
  const [obligatoire, setObligatoire] = useState(champ?.obligatoire ?? true)
  const [nomChamp, setNomChamp] = useState(champ?.nomChamp || '')
  const [options, setOptions] = useState(champ?.options || '')
  const [profils, setProfils] = useState<string[]>(champ?.profilsCibles || [])
  const [regles, setRegles] = useState<FormRegle[]>(champ?.regles || [])

  const autoNom = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')

  const showOptions = ['CHOIX_UNIQUE', 'CHOIX_MULTIPLE', 'LISTE_DEROULANTE'].includes(type)

  const handleAddRegle = () => {
    setRegles([...regles, { champCible: '', typeRegle: 'EGAL', valeurAttendue: '' }])
  }

  const handleUpdateRegle = (idx: number, data: Partial<FormRegle>) => {
    setRegles(regles.map((r, i) => i === idx ? { ...r, ...data } : r))
  }

  const handleRemoveRegle = (idx: number) => {
    setRegles(regles.filter((_, i) => i !== idx))
  }

  const handleSave = () => {
    if (!label.trim()) return
    onSave({
      label: label.trim(),
      type,
      obligatoire,
      nomChamp: nomChamp.trim() || autoNom,
      options: showOptions ? options : undefined,
      profilsCibles: profils,
      regles,
    })
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-modal max-w-xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            {champ ? 'Modifier le champ' : 'Nouveau champ'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Label du champ</label>
            <input type="text" value={label} onChange={e => setLabel(e.target.value)}
              className="input-field" placeholder="Ex: Numero d'assurance sociale" autoFocus />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Identifiant technique</label>
            <input type="text" value={nomChamp} onChange={e => setNomChamp(e.target.value)}
              className="input-field text-sm font-mono" placeholder={autoNom || 'nom_du_champ'} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="input-field">
                {FIELD_TYPES.map(ft => <option key={ft.value} value={ft.value}>{ft.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Obligatoire</label>
              <button onClick={() => setObligatoire(!obligatoire)}
                className={`w-full input-field flex items-center gap-2 text-sm ${obligatoire ? 'text-teal-600' : 'text-slate-500'}`}>
                {obligatoire ? <Check size={14} /> : <X size={14} />}
                {obligatoire ? 'Oui' : 'Non'}
              </button>
            </div>
          </div>

          {showOptions && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Options (une par ligne)
              </label>
              <textarea value={options} onChange={e => setOptions(e.target.value)}
                className="input-field h-24 resize-none text-sm font-mono"
                placeholder={"Option 1\nOption 2\nOption 3"} />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Profil(s) cible(s) — vide = tous les clients
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {CLIENT_PROFILES.map((p) => (
                <label key={p.value} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input type="checkbox" checked={profils.includes(p.value)} onChange={() =>
                    setProfils((prev) => prev.includes(p.value) ? prev.filter((v) => v !== p.value) : [...prev, p.value])}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                  {p.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Regles d'affichage</label>
              <button onClick={handleAddRegle} className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
                <Plus size={12} /> Ajouter
              </button>
            </div>
            {regles.length === 0 ? (
              <p className="text-xs text-slate-400">Aucune regle. Le champ est toujours visible.</p>
            ) : (
              <div className="space-y-2">
                {regles.map((regle, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase whitespace-nowrap">Si</span>
                    <select value={regle.champCible} onChange={e => handleUpdateRegle(idx, { champCible: e.target.value })}
                      className="input-field text-xs py-1 flex-1">
                      <option value="">Choisir un champ...</option>
                      {allChamps.map(c => <option key={c.id} value={c.nomChamp}>{c.label}</option>)}
                    </select>
                    <select value={regle.typeRegle} onChange={e => handleUpdateRegle(idx, { typeRegle: e.target.value as FormRegle['typeRegle'] })}
                      className="input-field text-xs py-1 w-28">
                      {RULE_TYPES.map(rt => <option key={rt.value} value={rt.value}>{rt.label}</option>)}
                    </select>
                    {regle.typeRegle !== 'NON_VIDE' && (
                      <input type="text" value={regle.valeurAttendue} onChange={e => handleUpdateRegle(idx, { valeurAttendue: e.target.value })}
                        className="input-field text-xs py-1 w-28" placeholder="Valeur" />
                    )}
                    <button onClick={() => handleRemoveRegle(idx)} className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
          <button onClick={onClose} className="btn-secondary">Annuler</button>
          <button onClick={handleSave} disabled={!label.trim()} className="btn-primary disabled:opacity-40">
            {champ ? 'Sauvegarder' : 'Creer le champ'}
          </button>
        </div>
      </div>
    </div>
  )
}
