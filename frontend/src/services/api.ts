import api from '@/lib/axios'
import type { User, UserRole, TaxProfile } from '@/types'

interface BackendUser {
  id: string
  email: string
  prenom: string
  nom: string
  role: string
  telephone?: string
  profilFiscal?: string
  dateCreation?: string
}

interface BackendAuthResponse {
  token: string
  user: BackendUser
}

interface BackendDeclaration {
  id: string
  anneeFiscale: number
  statut: string
  dateSoumission: string
  avecConjoint: boolean
  donneesFormulaire?: string
  clientId?: string
  clientNom?: string
  clientEmail?: string
}

const ROLE_MAP: Record<string, UserRole> = {
  CLIENT: 'CLIENT',
  ADMINISTRATEUR: 'ADMIN',
}

const STATUS_MAP: Record<string, 'PENDING' | 'REVIEWING' | 'VALIDATED' | 'REJECTED'> = {
  EN_ATTENTE: 'PENDING',
  VALIDEE: 'VALIDATED',
  REJETEE: 'REJECTED',
  DECLARATION_A_TRAITER: 'PENDING',
  EN_COURS_DE_TRAITEMENT: 'REVIEWING',
  DECLARATION_COMPLETEE: 'REVIEWING',
  DECLARATION_FINALISEE: 'VALIDATED',
  DECLARATION_ANNULEE: 'REJECTED',
}

function mapUser(u: BackendUser): User {
  return {
    id: u.id,
    email: u.email,
    firstName: u.prenom || '',
    lastName: u.nom || '',
    role: ROLE_MAP[u.role] || 'CLIENT',
    taxProfile: (u.profilFiscal as TaxProfile) || undefined,
    phone: u.telephone || undefined,
    createdAt: u.dateCreation || new Date().toISOString(),
  }
}

export interface DynamicTemplateChamp {
  label: string
  type: string
  nomChamp: string
  options?: string
}

export interface DynamicTemplateSnapshot {
  nom?: string
  sections: {
    titre: string
    champs: DynamicTemplateChamp[]
  }[]
}

function flattenDeclarationData(raw: Record<string, unknown>): Record<string, unknown> {
  const reponses = raw.reponses as Record<string, unknown> | undefined
  if (reponses) {
    return {
      templateId: raw.templateId as string | undefined,
      template: raw.template as DynamicTemplateSnapshot | undefined,
      reponses,
    }
  }

  const step1 = (raw.step1 || {}) as Record<string, unknown>
  const step2 = (raw.step2 || {}) as Record<string, unknown>
  const step3 = (raw.step3 || {}) as Record<string, unknown>
  const step4 = (raw.step4 || {}) as Record<string, unknown>
  const step51 = (raw.step51 || {}) as Record<string, unknown>
  const step5 = (raw.step5 || {}) as Record<string, unknown>
  const step7 = (raw.step7 || {}) as Record<string, unknown>

  return {
    firstName: step1.firstName || '',
    lastName: step1.lastName || '',
    sin: step1.sin || '',
    dateOfBirth: step1.dateOfBirth || '',
    sex: step1.sex || '',
    phone: step1.phone || '',
    email: step1.email || '',
    maritalStatus: step1.maritalStatus || '',
    maritalStatusChange: step1.maritalStatusChange || '',
    provinceOfResidence: step1.provinceOfResidence || 'Quebec',
    printLanguage: step1.printLanguage || 'Francais',
    yearsToDeclare: step1.yearsToDeclare || [],
    insurances: step1.insurances || [],
    messageToExpert: step1.messageToExpert || '',
    arcDownloadAuth: step1.arcDownloadAuth || false,
    firstDeclarationCanada: step1.firstDeclarationCanada || false,
    newcomer: step1.newcomer || false,
    civicNumber: step2.civicNumber || '',
    streetName: step2.streetName || '',
    apartment: step2.apartment || '',
    city: step2.city || '',
    province: step2.province || 'Quebec',
    postalCode: step2.postalCode || '',
    sameAsMailing: step3.sameAsMailing || true,
    provinceChangeDuringYear: step3.provinceChangeDuringYear || false,
    canadianCitizenship: step3.canadianCitizenship || true,
    processingSpouse: step4.processingSpouse || false,
    familyStatusChanged: step4.familyStatusChanged || false,
    foreignAssetsOver100k: step4.foreignAssetsOver100k || false,
    principalResidenceSale: step4.principalResidenceSale || false,
    numberOfDependents: step4.numberOfDependents || 0,
    dependents: step4.dependents || [],
    rrspContributions: step51.rrspContributions || false,
    rrspFirst60Days: step51.rrspFirst60Days || false,
    celiappContributions: step51.celiappContributions || false,
    situations: step5.situations || [],
    spouseLastName: step7.lastName || '',
    spouseFirstName: step7.firstName || '',
    spouseDateOfBirth: step7.dateOfBirth || '',
    spouseSex: step7.sex || '',
    spouseSin: step7.sin || '',
    spousePhone: step7.phone || '',
    spouseEmail: step7.email || '',
    spouseProvinceOfResidence: step7.provinceOfResidence || '',
  }
}

function mapDeclarationToRequest(d: BackendDeclaration) {
  let declarationData: Record<string, unknown> = {}
  if (d.donneesFormulaire) {
    try {
      const raw = JSON.parse(d.donneesFormulaire)
      declarationData = flattenDeclarationData(raw)
    } catch { /* ignore */ }
  }
  const nameParts = (d.clientNom || '').split(' ')
  const prenom = nameParts[0] || ''
  const nom = nameParts.slice(1).join(' ') || ''
  return {
    id: d.id,
    userId: d.clientId || '',
    userFirstName: prenom,
    userLastName: nom,
    userEmail: d.clientEmail || '',
    taxYear: d.anneeFiscale,
    profile: 'INDIVIDUAL' as TaxProfile,
    status: STATUS_MAP[d.statut] || 'PENDING',
    submittedAt: d.dateSoumission || new Date().toISOString(),
    reviewedAt: undefined as string | undefined,
    reviewerNote: undefined as string | undefined,
    declarationData,
    documents: [] as { name: string; type: string }[],
  }
}

export type TaxRequest = ReturnType<typeof mapDeclarationToRequest>

export const authApi = {
  login: async (data: { email: string; password: string }) => {
    const res = await api.post<BackendAuthResponse>('/auth/login', data)
    return { data: { token: res.data.token, user: mapUser(res.data.user) } }
  },
  register: async (data: { email: string; password: string; firstName: string; lastName: string; taxProfile: string }) => {
    const res = await api.post<BackendAuthResponse>('/auth/register', {
      email: data.email,
      password: data.password,
      prenom: data.firstName,
      nom: data.lastName,
      role: 'CLIENT',
      profilFiscal: data.taxProfile,
    })
    return { data: { token: res.data.token, user: mapUser(res.data.user) } }
  },
  getProfile: async () => {
    const res = await api.get<BackendUser>('/auth/me')
    return { data: mapUser(res.data) }
  },
}

interface BackendClientDeclaration {
  id: string
  anneeFiscale: number
  statut: string
  dateSoumission: string
  avecConjoint: boolean
  donneesFormulaire?: string
}

export interface ClientDeclaration {
  id: string
  taxYear: number
  status: 'PENDING' | 'REVIEWING' | 'VALIDATED' | 'REJECTED'
  submittedAt: string
  withSpouse: boolean
  declarationData: Record<string, unknown>
}

function mapClientDeclaration(d: BackendClientDeclaration): ClientDeclaration {
  let declarationData: Record<string, unknown> = {}
  if (d.donneesFormulaire) {
    try {
      const raw = JSON.parse(d.donneesFormulaire)
      declarationData = flattenDeclarationData(raw)
    } catch { /* ignore */ }
  }
  return {
    id: d.id,
    taxYear: d.anneeFiscale,
    status: STATUS_MAP[d.statut] || 'PENDING',
    submittedAt: d.dateSoumission || new Date().toISOString(),
    withSpouse: d.avecConjoint || false,
    declarationData,
  }
}

export const fileApi = {
  getMyFiles: async (page = 0, size = 10) => {
    const res = await api.get<{ content: BackendClientDeclaration[]; totalElements: number; totalPages: number }>('/declarations/my', { params: { page, size } })
    return {
      data: {
        content: res.data.content.map(mapClientDeclaration),
        totalElements: res.data.totalElements,
        totalPages: res.data.totalPages,
      },
    }
  },
  createDeclaration: async (data: { anneeFiscale: number; avecConjoint: boolean; donneesFormulaire: string }) => {
    const res = await api.post('/declarations', data)
    return { data: res.data }
  },
  getDeclaration: async (id: string) => {
    const res = await api.get<BackendClientDeclaration>(`/declarations/${id}`)
    return { data: mapClientDeclaration(res.data) }
  },
}

export const advisorApi = {
  getAssignedFiles: async () => ({ data: { content: [], totalElements: 0 } }),
}

export interface FormTemplate {
  id: string
  nom: string
  anneeFiscale: number
  version: number
  actif: boolean
  sections: FormSection[]
}

export interface FormSection {
  id: string
  titre: string
  ordre: number
  repetable: boolean
  profilsCibles: string[]
  champs: FormChamp[]
}

export interface FormChamp {
  id: string
  label: string
  type: string
  obligatoire: boolean
  ordre: number
  nomChamp: string
  options?: string
  profilsCibles: string[]
  regles: FormRegle[]
}

export interface FormRegle {
  id?: string
  champCible: string
  typeRegle: 'EGAL' | 'NON_VIDE' | 'CONTIENT'
  valeurAttendue: string
}

export const formApi = {
  getAllTemplates: async () => {
    const res = await api.get<FormTemplate[]>('/formulaires')
    return { data: res.data }
  },
  getTemplate: async (id: string) => {
    const res = await api.get<FormTemplate>(`/formulaires/${id}`)
    return { data: res.data }
  },
  getActiveTemplate: async () => {
    const res = await api.get<FormTemplate>('/formulaires/actif')
    return { data: res.data }
  },
  createTemplate: async (data: { nom: string; anneeFiscale: number }) => {
    const res = await api.post<FormTemplate>('/formulaires', { ...data, version: 1, actif: true, sections: [] })
    return { data: res.data }
  },
  deleteTemplate: async (id: string) => {
    await api.delete(`/formulaires/${id}`)
  },
  toggleActive: async (id: string, actif: boolean) => {
    const res = await api.put<FormTemplate>(`/formulaires/${id}/actif?actif=${actif}`)
    return { data: res.data }
  },
  resetToDefault: async () => {
    await api.put('/formulaires/default')
  },
  addSection: async (templateId: string, data: { titre: string; ordre: number; repetable: boolean; profilsCibles?: string[] }) => {
    const res = await api.post<FormSection>(`/formulaires/${templateId}/sections`, data)
    return { data: res.data }
  },
  updateSection: async (sectionId: string, data: { titre: string; repetable: boolean; ordre: number; profilsCibles: string[] }) => {
    const res = await api.put<FormSection>(`/formulaires/sections/${sectionId}`, data)
    return { data: res.data }
  },
  deleteSection: async (sectionId: string) => {
    await api.delete(`/formulaires/sections/${sectionId}`)
  },
  reorderSections: async (templateId: string, sectionIds: string[]) => {
    await api.put(`/formulaires/${templateId}/sections/reorder`, sectionIds)
  },
  addChamp: async (sectionId: string, data: Partial<FormChamp>) => {
    const res = await api.post<FormChamp>(`/formulaires/sections/${sectionId}/champs`, data)
    return { data: res.data }
  },
  updateChamp: async (champId: string, data: Partial<FormChamp>) => {
    const res = await api.put<FormChamp>(`/formulaires/champs/${champId}`, data)
    return { data: res.data }
  },
  deleteChamp: async (champId: string) => {
    await api.delete(`/formulaires/champs/${champId}`)
  },
  reorderChamps: async (sectionId: string, champIds: string[]) => {
    await api.put(`/formulaires/sections/${sectionId}/champs/reorder`, champIds)
  },
  setRegles: async (champId: string, regles: FormRegle[]) => {
    const res = await api.put<FormRegle[]>(`/formulaires/champs/${champId}/regles`, regles)
    return { data: res.data }
  },
}

export const adminApi = {
  getUsers: async () => {
    const res = await api.get<BackendUser[]>('/admin/utilisateurs')
    return { data: res.data.map(mapUser) }
  },
  getRequests: async () => {
    const res = await api.get<BackendDeclaration[]>('/admin/declarations')
    return { data: res.data.map(mapDeclarationToRequest) }
  },
  submitRequest: async (formData: Record<string, unknown>) => {
    const s0 = (formData.step0 || {}) as Record<string, unknown>
    const s4 = (formData.step4 || {}) as Record<string, unknown>
    const res = await api.post('/declarations', {
      anneeFiscale: (s0.taxYear as number) || new Date().getFullYear(),
      avecConjoint: s4.processingSpouse || false,
      donneesFormulaire: JSON.stringify(formData),
    })
    return { data: mapDeclarationToRequest(res.data) }
  },
  submitDynamicRequest: async (data: { taxYear: number; templateId: string; template: DynamicTemplateSnapshot; reponses: Record<string, unknown> }) => {
    const res = await api.post('/declarations', {
      anneeFiscale: data.taxYear,
      avecConjoint: false,
      donneesFormulaire: JSON.stringify({ templateId: data.templateId, template: data.template, reponses: data.reponses }),
    })
    return { data: mapDeclarationToRequest(res.data) }
  },
  validateRequest: async (id: string) => {
    const res = await api.put<BackendDeclaration>(`/admin/declarations/${id}/valider`)
    return { data: mapDeclarationToRequest(res.data) }
  },
  rejectRequest: async (id: string, _note: string) => {
    const res = await api.put<BackendDeclaration>(`/admin/declarations/${id}/rejeter`)
    return { data: mapDeclarationToRequest(res.data) }
  },
  getStats: async () => {
    const res = await api.get<Record<string, number>>('/admin/stats')
    const d = res.data
    return {
      data: {
        totalUsers: d.totalUtilisateurs || 0,
        totalRequests: d.totalDeclarations || 0,
        pending: d.aTraiter || 0,
        validated: d.finalisees || 0,
        rejected: 0,
      },
    }
  },
}
