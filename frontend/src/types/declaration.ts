export interface Step0Year {
  taxYear: number
}

export interface Step1Personal {
  isNewClient: boolean
  firstName: string
  lastName: string
  dateOfBirth: string
  maritalStatus: string
  maritalStatusChange: string
  sex: string
  sin: string
  phone: string
  foreignPhone: string
  yearsToDeclare: number[]
  provinceOfResidence: string
  printLanguage: string
  email: string
  insurances: string[]
  messageToExpert: string
  arcDownloadAuth: boolean
  firstDeclarationCanada: boolean
  newcomer: boolean
}

export interface Step2MailingAddress {
  civicNumber: string
  streetName: string
  apartment: string
  city: string
  province: string
  postalCode: string
}

export interface Step3Residence {
  sameAsMailing: boolean
  provinceChangeDuringYear: boolean
  canadianCitizenship: boolean
}

export interface Dependent {
  id: string
  name: string
  link: string
  age: number
  income: number
}

export interface Step4Family {
  processingSpouse: boolean
  familyStatusChanged: boolean
  foreignAssetsOver100k: boolean
  principalResidenceSale: boolean
  numberOfDependents: number
  dependents: Dependent[]
}

export interface Step51RrspCeliapp {
  rrspContributions: boolean
  rrspFirst60Days: boolean
  celiappContributions: boolean
}

export interface Step5Situations {
  situations: string[]
}

export interface Step7Spouse {
  lastName: string
  firstName: string
  dateOfBirth: string
  sex: string
  sin: string
  phone: string
  foreignPhone: string
  provinceOfResidence: string
  printLanguage: string
  email: string
  insurances: string[]
  sameMailingAddress: boolean
  firstDeclarationCanada: boolean
  provinceChangeDuringYear: boolean
  residentStatusObtained: boolean
  canadianCitizenship: boolean
  foreignAssetsOver100k: boolean
  principalResidenceSale: boolean
  arcDownloadAuth: boolean
  newcomer: boolean
}

export interface Step72Situations {
  situations: string[]
}

export interface SignatureData {
  signatureImage: string
  signedPdf: string
}

export interface Step9Authorization {
  signatureImage: string
  authorizationPdf: string
}

export interface StepFinalOrigin {
  howFoundUs: string[]
  promoCode: string
}

export interface DeclarationData {
  step0: Step0Year
  step1: Step1Personal
  step2: Step2MailingAddress
  step3: Step3Residence
  step4: Step4Family
  step51: Step51RrspCeliapp
  step5: Step5Situations
  step7: Step7Spouse
  step72: Step72Situations
  step8: SignatureData
  step9: Step9Authorization
  stepFinal: StepFinalOrigin
}

export const PROVINCES = [
  'Alberta', 'Colombie-Britannique', 'Ile-du-Prince-Edouard',
  'Manitoba', 'Nouveau-Brunswick', 'Nouvelle-Ecosse',
  'Ontario', 'Quebec', 'Saskatchewan', 'Terre-Neuve-et-Labrador',
  'Territoires du Nord-Ouest', 'Nunavut', 'Yukon',
]

export const MARITAL_STATUSES = [
  'Celibataire',
  'Marie(e)',
  'Conjoint(e) de fait',
  'Separe(e)',
  'Divorce(e)',
  'Veuf/Veuve',
]

export const SITUATIONS = [
  'J\'ai travaille pour un employeur',
  'Travailleur(se) autonome',
  'Placements ou revenus de placements',
  'Etudiant(e)',
  'Revenus UBER, SkipTheDishes, DoorDash, Lyft...',
  'Aucun revenu',
]

export const INSURANCE_OPTIONS = [
  'Assurance collective',
  'Conjoint/parent',
  'RAMQ',
  'Privee',
  'Autre province',
  'Regime federal',
  'Autre',
]

export const FOUND_US_OPTIONS = [
  'Bouche a oreille',
  'Internet / Google',
  'Reseaux sociaux',
  'Publicite',
  'Autre',
]

export const DEFAULT_declarationData: DeclarationData = {
  step0: { taxYear: 2025 },
  step1: {
    isNewClient: true, firstName: '', lastName: '', dateOfBirth: '',
    maritalStatus: 'Celibataire', maritalStatusChange: '', sex: '',
    sin: '', phone: '', foreignPhone: '', yearsToDeclare: [2025],
    provinceOfResidence: 'Quebec', printLanguage: 'Francais',
    email: '', insurances: [], messageToExpert: '',
    arcDownloadAuth: false, firstDeclarationCanada: false, newcomer: false,
  },
  step2: {
    civicNumber: '', streetName: '', apartment: '', city: '',
    province: 'Quebec', postalCode: '',
  },
  step3: {
    sameAsMailing: true, provinceChangeDuringYear: false, canadianCitizenship: true,
  },
  step4: {
    processingSpouse: false, familyStatusChanged: false,
    foreignAssetsOver100k: false, principalResidenceSale: false,
    numberOfDependents: 0, dependents: [],
  },
  step51: {
    rrspContributions: false, rrspFirst60Days: false, celiappContributions: false,
  },
  step5: { situations: [] },
  step7: {
    lastName: '', firstName: '', dateOfBirth: '', sex: '', sin: '',
    phone: '', foreignPhone: '', provinceOfResidence: 'Quebec',
    printLanguage: 'Francais', email: '', insurances: [],
    sameMailingAddress: true, firstDeclarationCanada: false,
    provinceChangeDuringYear: false, residentStatusObtained: false,
    canadianCitizenship: true, foreignAssetsOver100k: false,
    principalResidenceSale: false, arcDownloadAuth: false, newcomer: false,
  },
  step72: { situations: [] },
  step8: { signatureImage: '', signedPdf: '' },
  step9: { signatureImage: '', authorizationPdf: '' },
  stepFinal: { howFoundUs: [], promoCode: '' },
}
