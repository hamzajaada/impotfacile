import type { User, TaxFile, TaxProfile, FileStatus } from '@/types'

export interface TaxRequest {
  id: string
  userId: string
  userFirstName: string
  userLastName: string
  userEmail: string
  taxYear: number
  profile: TaxProfile
  status: 'PENDING' | 'REVIEWING' | 'VALIDATED' | 'REJECTED'
  submittedAt: string
  reviewedAt?: string
  reviewerNote?: string
  declarationData: Record<string, unknown>
  documents: { name: string; type: string }[]
  estimatedRefund: number
}

const DEMO_USER: User = {
  id: '1',
  email: 'jean@example.com',
  firstName: 'Jean',
  lastName: 'Tremblay',
  role: 'CLIENT',
  taxProfile: 'INDIVIDUAL',
  phone: '514-555-0123',
  createdAt: '2025-01-15T10:00:00Z',
}

const DEMO_ADVISOR: User = {
  id: '2',
  email: 'conseiller@example.com',
  firstName: 'Marie',
  lastName: 'Gagnon',
  role: 'ADVISOR',
  createdAt: '2025-01-10T10:00:00Z',
}

const DEMO_ADMIN: User = {
  id: '3',
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'System',
  role: 'ADMIN',
  createdAt: '2025-01-01T10:00:00Z',
}

const ALL_USERS: User[] = [
  DEMO_USER,
  DEMO_ADVISOR,
  DEMO_ADMIN,
  { id: '4', email: 'sophie@example.com', firstName: 'Sophie', lastName: 'Arsenault', role: 'CLIENT', taxProfile: 'STUDENT', phone: '418-555-0456', createdAt: '2025-02-20T08:00:00Z' },
  { id: '5', email: 'pierre@example.com', firstName: 'Pierre', lastName: 'Lefebvre', role: 'CLIENT', taxProfile: 'SELF_EMPLOYED', phone: '514-555-0789', createdAt: '2025-03-05T14:30:00Z' },
  { id: '6', email: 'fatima@example.com', firstName: 'Fatima', lastName: 'Benali', role: 'CLIENT', taxProfile: 'NEWCOMER', phone: '438-555-1011', createdAt: '2025-04-10T09:15:00Z' },
  { id: '7', email: 'luc@example.com', firstName: 'Luc', lastName: 'Beaulieu', role: 'CLIENT', taxProfile: 'SENIOR', phone: '819-555-1213', createdAt: '2025-05-01T11:00:00Z' },
  { id: '8', email: 'anick@example.com', firstName: 'Anick', lastName: 'Duval', role: 'ADVISOR', createdAt: '2025-01-20T10:00:00Z' },
]

const DEMO_FILES: TaxFile[] = [
  {
    id: 'f1', clientId: '1', advisorId: '2', taxYear: 2025, profile: 'INDIVIDUAL',
    status: 'VERIFIED' as unknown as FileStatus, estimatedRefund: 1250.50,
    formData: { firstName: 'Jean', lastName: 'Tremblay', sin: '123-456-789' },
    documents: [
      { id: 'd1', fileName: 'T4_2025.pdf', fileType: 'application/pdf', uploadedAt: '2026-02-10T14:00:00Z', verified: true },
      { id: 'd2', fileName: 'Releve1_2025.pdf', fileType: 'application/pdf', uploadedAt: '2026-02-10T14:05:00Z', verified: true },
    ],
    messages: [],
    createdAt: '2026-02-10T13:00:00Z', updatedAt: '2026-02-11T09:00:00Z',
  },
  { id: 'f2', clientId: '1', taxYear: 2024, profile: 'INDIVIDUAL', status: 'COMPLETED' as unknown as FileStatus, estimatedRefund: 890.00, formData: {}, documents: [], messages: [], createdAt: '2025-03-01T10:00:00Z', updatedAt: '2025-04-10T16:00:00Z' },
]

const DEMO_REQUESTS: TaxRequest[] = [
  {
    id: 'r1', userId: '4', userFirstName: 'Sophie', userLastName: 'Arsenault', userEmail: 'sophie@example.com',
    taxYear: 2025, profile: 'STUDENT', status: 'PENDING', submittedAt: '2026-03-15T10:30:00Z',
    declarationData: {
      firstName: 'Sophie', lastName: 'Arsenault', sin: '456-789-012',
      dateOfBirth: '2002-05-12', employmentIncome: 8500, tuitionFees: 4200,
      cppContributions: 320, eiPremiums: 120, incomeTaxDeducted: 650,
      rrspContributions: 0, charitableDonations: 0,
    },
    documents: [{ name: 'T4_2025.pdf', type: 'T4' }, { name: 'Releve8_2025.pdf', type: 'Releve 8' }, { name: 'Reçu_frais_scolaires.pdf', type: 'Frais scolarite' }],
    estimatedRefund: 1380.00,
  },
  {
    id: 'r2', userId: '5', userFirstName: 'Pierre', userLastName: 'Lefebvre', userEmail: 'pierre@example.com',
    taxYear: 2025, profile: 'SELF_EMPLOYED', status: 'REVIEWING', submittedAt: '2026-03-10T14:00:00Z', reviewedAt: '2026-03-12T09:00:00Z',
    declarationData: {
      firstName: 'Pierre', lastName: 'Lefebvre', sin: '789-012-345',
      dateOfBirth: '1985-08-20', employmentIncome: 62000, businessName: 'Lefebvre Tech',
      grossRevenue: 85000, operatingExpenses: 18000, vehicleExpenses: 3200,
      cppContributions: 4200, eiPremiums: 900, incomeTaxDeducted: 8500,
    },
    documents: [{ name: 'T4_2025.pdf', type: 'T4' }, { name: 'Releve1_2025.pdf', type: 'Releve 1' }, { name: 'T2125_2025.pdf', type: 'T2125' }, { name: 'Factures_2025.pdf', type: 'Factures' }],
    estimatedRefund: 2150.75,
  },
  {
    id: 'r3', userId: '6', userFirstName: 'Fatima', userLastName: 'Benali', userEmail: 'fatima@example.com',
    taxYear: 2025, profile: 'NEWCOMER', status: 'VALIDATED', submittedAt: '2026-03-01T09:00:00Z', reviewedAt: '2026-03-05T11:00:00Z',
    declarationData: {
      firstName: 'Fatima', lastName: 'Benali', sin: '321-654-987',
      dateOfBirth: '1990-03-15', employmentIncome: 35000,
      cppContributions: 1500, eiPremiums: 550, incomeTaxDeducted: 4200,
    },
    documents: [{ name: 'T4_2025.pdf', type: 'T4' }, { name: 'Releve1_2025.pdf', type: 'Releve 1' }, { name: 'CIT0002.pdf', type: 'CIT0002' }],
    estimatedRefund: 1890.00,
  },
  {
    id: 'r4', userId: '7', userFirstName: 'Luc', userLastName: 'Beaulieu', userEmail: 'luc@example.com',
    taxYear: 2025, profile: 'SENIOR', status: 'REJECTED', submittedAt: '2026-02-28T16:00:00Z', reviewedAt: '2026-03-03T10:00:00Z',
    reviewerNote: 'Documents manquants : Releve 1 et T4 manquants. Veuillez re soumettre.',
    declarationData: { firstName: 'Luc', lastName: 'Beaulieu', sin: '654-321-098', employmentIncome: 0, pensionIncome: 28000, oldAgeSecurity: 7500 },
    documents: [{ name: 'OAS_Letter.pdf', type: 'OAS' }],
    estimatedRefund: 450.00,
  },
  {
    id: 'r5', userId: '1', userFirstName: 'Jean', userLastName: 'Tremblay', userEmail: 'jean@example.com',
    taxYear: 2025, profile: 'INDIVIDUAL', status: 'PENDING', submittedAt: '2026-03-18T11:00:00Z',
    declarationData: { firstName: 'Jean', lastName: 'Tremblay', sin: '123-456-789', employmentIncome: 52000, cppContributions: 2800, eiPremiums: 850, incomeTaxDeducted: 7200 },
    documents: [{ name: 'T4_2025.pdf', type: 'T4' }, { name: 'Releve1_2025.pdf', type: 'Releve 1' }],
    estimatedRefund: 1250.50,
  },
]

const USERS_DB: Record<string, { user: User; password: string }> = {
  'jean@example.com': { user: DEMO_USER, password: 'password123' },
  'conseiller@example.com': { user: DEMO_ADVISOR, password: 'password123' },
  'admin@example.com': { user: DEMO_ADMIN, password: 'password123' },
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

let currentFiles = [...DEMO_FILES]
let fileIdCounter = 3
let currentRequests = [...DEMO_REQUESTS]

export const mockAuth = {
  login: async (email: string, _password: string): Promise<{ token: string; user: User }> => {
    await sleep(500)
    const entry = USERS_DB[email]
    if (!entry) throw new Error('Courriel ou mot de passe incorrect')
    return { token: 'mock-jwt-token-' + Date.now(), user: entry.user }
  },

  register: async (data: { email: string; firstName: string; lastName: string; taxProfile: string }): Promise<{ token: string; user: User }> => {
    await sleep(500)
    const newUser: User = {
      id: String(Date.now()),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'CLIENT',
      taxProfile: data.taxProfile as TaxProfile,
      createdAt: new Date().toISOString(),
    }
    USERS_DB[data.email] = { user: newUser, password: 'xxx' }
    ALL_USERS.push(newUser)
    return { token: 'mock-jwt-token-' + Date.now(), user: newUser }
  },

  getProfile: async (): Promise<User> => {
    await sleep(300)
    return DEMO_USER
  },
}

export const mockAdmin = {
  getUsers: async () => {
    await sleep(300)
    return ALL_USERS
  },

  getRequests: async () => {
    await sleep(300)
    return currentRequests
  },

  submitRequest: async (formData: Record<string, unknown>, user: User) => {
    await sleep(400)
    const s1 = (formData.step1 || {}) as Record<string, unknown>
    const s2 = (formData.step2 || {}) as Record<string, unknown>
    const s3 = (formData.step3 || {}) as Record<string, unknown>
    const s4 = (formData.step4 || {}) as Record<string, unknown>
    const s51 = (formData.step51 || {}) as Record<string, unknown>
    const s5 = (formData.step5 || {}) as Record<string, unknown>
    const s0 = (formData.step0 || {}) as Record<string, unknown>

    const dec: Record<string, unknown> = {
      firstName: s1.firstName || user.firstName,
      lastName: s1.lastName || user.lastName,
      sin: s1.sin || '',
      dateOfBirth: s1.dateOfBirth || '',
      sex: s1.sex || '',
      phone: s1.phone || '',
      email: s1.email || user.email,
      maritalStatus: s1.maritalStatus || '',
      maritalStatusChange: s1.maritalStatusChange || '',
      provinceOfResidence: s1.provinceOfResidence || 'Quebec',
      printLanguage: s1.printLanguage || 'Francais',
      yearsToDeclare: s1.yearsToDeclare || [],
      insurances: s1.insurances || [],
      messageToExpert: s1.messageToExpert || '',
      arcDownloadAuth: s1.arcDownloadAuth || false,
      firstDeclarationCanada: s1.firstDeclarationCanada || false,
      newcomer: s1.newcomer || false,
      civicNumber: s2.civicNumber || '',
      streetName: s2.streetName || '',
      apartment: s2.apartment || '',
      city: s2.city || '',
      province: s2.province || 'Quebec',
      postalCode: s2.postalCode || '',
      sameAsMailing: s3.sameAsMailing ?? true,
      provinceChangeDuringYear: s3.provinceChangeDuringYear || false,
      canadianCitizenship: s3.canadianCitizenship || false,
      processingSpouse: s4.processingSpouse || false,
      familyStatusChanged: s4.familyStatusChanged || false,
      foreignAssetsOver100k: s4.foreignAssetsOver100k || false,
      principalResidenceSale: s4.principalResidenceSale || false,
      numberOfDependents: s4.numberOfDependents || 0,
      dependents: s4.dependents || [],
      rrspContributions: s51.rrspContributions || false,
      rrspFirst60Days: s51.rrspFirst60Days || false,
      celiappContributions: s51.celiappContributions || false,
      situations: s5.situations || [],
    }

    const totalTax = ((dec.cppContributions as number) || 0) + ((dec.eiPremiums as number) || 0) + ((dec.incomeTaxDeducted as number) || 0)
    const estimatedRefund = totalTax * 0.85

    const newReq: TaxRequest = {
      id: 'r' + Date.now(),
      userId: user.id,
      userFirstName: dec.firstName as string,
      userLastName: dec.lastName as string,
      userEmail: dec.email as string,
      taxYear: (s0.taxYear as number) || new Date().getFullYear(),
      profile: user.taxProfile || 'INDIVIDUAL',
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
      declarationData: dec,
      documents: [],
      estimatedRefund: Math.round(estimatedRefund * 100) / 100,
    }
    currentRequests.unshift(newReq)
    return newReq
  },

  validateRequest: async (id: string) => {
    await sleep(400)
    const req = currentRequests.find((r) => r.id === id)
    if (req) {
      req.status = 'VALIDATED'
      req.reviewedAt = new Date().toISOString()
    }
    return req
  },

  rejectRequest: async (id: string, note: string) => {
    await sleep(400)
    const req = currentRequests.find((r) => r.id === id)
    if (req) {
      req.status = 'REJECTED'
      req.reviewedAt = new Date().toISOString()
      req.reviewerNote = note
    }
    return req
  },

  getStats: async () => {
    await sleep(200)
    const pending = currentRequests.filter((r) => r.status === 'PENDING').length
    const validated = currentRequests.filter((r) => r.status === 'VALIDATED').length
    const rejected = currentRequests.filter((r) => r.status === 'REJECTED').length
    const totalRefund = currentRequests.reduce((sum, r) => sum + r.estimatedRefund, 0)
    return {
      totalUsers: ALL_USERS.length,
      totalRequests: currentRequests.length,
      pending,
      validated,
      rejected,
      totalRefund,
    }
  },
}

export const mockFiles = {
  getMyFiles: async () => {
    await sleep(300)
    return { content: currentFiles, totalElements: currentFiles.length, totalPages: 1, page: 0, size: 10 }
  },

  getFile: async (id: string) => {
    await sleep(200)
    const file = currentFiles.find((f) => f.id === id)
    if (!file) throw new Error('Dossier non trouve')
    return file
  },

  createFile: async (data: { taxYear: number; profile: TaxProfile }) => {
    await sleep(400)
    const newFile: TaxFile = {
      id: String(fileIdCounter++),
      clientId: '1',
      taxYear: data.taxYear,
      profile: data.profile,
      status: 'CREATED' as unknown as FileStatus,
      formData: {},
      documents: [],
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    currentFiles.unshift(newFile)
    return newFile
  },

  updateFormData: async (id: string, formData: Record<string, unknown>) => {
    await sleep(300)
    const file = currentFiles.find((f) => f.id === id)
    if (!file) throw new Error('Dossier non trouve')
    file.formData = { ...file.formData, ...formData }
    file.updatedAt = new Date().toISOString()
    return file
  },

  uploadDocument: async (_fileId: string, file: File) => {
    await sleep(800)
    return { id: 'd' + Date.now(), fileName: file.name, fileType: file.type, uploadedAt: new Date().toISOString(), verified: false }
  },

  getAdvisorFiles: async () => {
    await sleep(300)
    return { content: currentFiles, totalElements: currentFiles.length, totalPages: 1, page: 0, size: 20 }
  },

  requestMissingDocs: async (id: string) => {
    await sleep(300)
    const file = currentFiles.find((f) => f.id === id)
    if (file) file.status = 'DOCS_MISSING' as unknown as FileStatus
    return file
  },

  calculate: async (id: string) => {
    await sleep(500)
    const file = currentFiles.find((f) => f.id === id)
    if (file) {
      file.status = 'CALCULATED' as unknown as FileStatus
      file.estimatedRefund = Math.round(Math.random() * 2000 * 100) / 100
    }
    return file
  },

  submit: async (id: string) => {
    await sleep(500)
    const file = currentFiles.find((f) => f.id === id)
    if (file) file.status = 'SUBMITTED' as unknown as FileStatus
    return file
  },
}
