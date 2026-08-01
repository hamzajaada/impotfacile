export type UserRole = 'CLIENT' | 'ADVISOR' | 'ADMIN'

export type TaxProfile = 'STUDENT' | 'SENIOR' | 'SELF_EMPLOYED' | 'NEWCOMER' | 'MILITARY' | 'EXPATRIATE' | 'INDIVIDUAL'

export type FileStatus = 'CREATED' | 'RECEIVED' | 'ASSIGNED' | 'VERIFIED' | 'DOCS_MISSING' | 'CALCULATED' | 'VALIDATED' | 'SUBMITTED' | 'COMPLETED'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  taxProfile?: TaxProfile
  phone?: string
  createdAt: string
}

export interface TaxFile {
  id: string
  clientId: string
  advisorId?: string
  taxYear: number
  profile: TaxProfile
  status: FileStatus
  estimatedRefund?: number
  formData: Record<string, unknown>
  documents: Document[]
  messages: Message[]
  createdAt: string
  updatedAt: string
}

export interface Document {
  id: string
  fileName: string
  fileType: string
  uploadedAt: string
  verified: boolean
}

export interface Message {
  id: string
  senderId: string
  content: string
  createdAt: string
  read: boolean
}

export interface Appointment {
  id: string
  clientId: string
  advisorId?: string
  date: string
  timeSlot: string
  type: 'IN_PERSON' | 'VIRTUAL'
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
}

export interface Tariff {
  id: string
  profile: TaxProfile
  basePrice: number
  description: string
}

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  publishedAt: string
  tags: string[]
}

export interface FormField {
  id: string
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'file' | 'textarea'
  label: string
  name: string
  required: boolean
  options?: string[]
  conditions?: FormCondition[]
  section: string
  order: number
}

export interface FormCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'contains'
  value: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  taxProfile: TaxProfile
}

export interface AuthResponse {
  token: string
  user: User
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  page: number
  size: number
}
