import jsPDF from 'jspdf'
import type { TaxRequest, DynamicTemplateSnapshot } from '@/services/api'

const PROFILE_LABELS: Record<string, string> = {
  STUDENT: 'Etudiant', INDIVIDUAL: 'Particulier', SELF_EMPLOYED: 'Travailleur autonome',
  SENIOR: 'Aine', NEWCOMER: 'Nouvel arrivant', MILITARY: 'Militaire', EXPATRIATE: 'Expatrie',
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente', REVIEWING: 'En cours de revision', VALIDATED: 'Validee', REJECTED: 'Rejetee',
}

function fmt(val: number | undefined | null): string {
  if (val === undefined || val === null || isNaN(val)) return '0,00 $'
  return val.toLocaleString('fr-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' $'
}

function bool(val: unknown): string {
  return val ? 'Oui' : 'Non'
}

function list(val: unknown): string {
  if (Array.isArray(val) && val.length > 0) return val.join(', ')
  return 'Aucun'
}

function formatValue(v: unknown): string {
  if (v === undefined || v === null) return 'Non fourni'
  if (Array.isArray(v)) return v.length > 0 ? v.map(String).join(', ') : 'Non fourni'
  const s = String(v)
  return s.trim() === '' ? 'Non fourni' : s
}

export function generateRequestPDF(req: TaxRequest): void {
  const doc = new jsPDF()
  const d = req.declarationData
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let y = 20

  const checkPage = (needed: number) => {
    if (y + needed > pageHeight - 25) {
      doc.addPage()
      y = 20
    }
  }

  const field = (label: string, value: string) => {
    checkPage(8)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    doc.text(label, 20, y)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 30, 30)
    const valStr = String(value)
    if (doc.getTextWidth(valStr) > pageWidth - 100) {
      const split = doc.splitTextToSize(valStr, pageWidth - 100)
      doc.text(split, 90, y)
      y += split.length * 5
    } else {
      doc.text(valStr, 90, y)
      y += 6
    }
  }

  const sectionTitle = (title: string) => {
    checkPage(16)
    y += 4
    doc.setFillColor(37, 99, 235)
    doc.roundedRect(15, y - 4, pageWidth - 30, 9, 2, 2, 'F')
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text(title, 20, y + 2)
    y += 10
  }

  const separator = () => {
    checkPage(8)
    doc.setDrawColor(220, 220, 220)
    doc.line(20, y, pageWidth - 20, y)
    y += 5
  }

  // ===== HEADER =====
  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, pageWidth, 45, 'F')

  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('ImpotFacile', 20, 18)

  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.text('Demande de declaration d\'impots', 20, 28)

  doc.setFontSize(10)
  doc.text(`Demande #${req.id}  |  Annee fiscale ${req.taxYear}`, 20, 36)

  doc.setTextColor(200, 220, 255)
  doc.text(`Statut: ${STATUS_LABELS[req.status] || req.status}`, pageWidth - 20, 18, { align: 'right' })
  doc.text(`Soumise le ${new Date(req.submittedAt).toLocaleDateString('fr-CA')}`, pageWidth - 20, 28, { align: 'right' })

  y = 55

  const reponses = d.reponses as Record<string, unknown> | undefined
  const template = d.template as DynamicTemplateSnapshot | undefined

  // ===== FORMULAIRE PERSONNALISE (config admin) =====
  if (reponses) {
    sectionTitle(template?.nom ? template.nom.toUpperCase() : 'FORMULAIRE PERSONNALISE')
    if (template && template.sections && template.sections.length > 0) {
      template.sections.forEach((section) => {
        sectionTitle(section.titre.toUpperCase())
        section.champs.forEach((champ) => {
          field(champ.label + ':', formatValue(reponses[champ.nomChamp]))
        })
        separator()
      })
    } else {
      Object.entries(reponses).forEach(([key, v]) => field(key + ':', formatValue(v)))
    }

    const footerY2 = pageHeight - 15
    doc.setDrawColor(220, 220, 220)
    doc.line(20, footerY2 - 5, pageWidth - 20, footerY2 - 5)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(150, 150, 150)
    doc.text(`Genere le ${new Date().toLocaleDateString('fr-CA')} a ${new Date().toLocaleTimeString('fr-CA')}`, 20, footerY2)
    doc.text('ImpotFacile - Plateforme de declaration d\'impots', pageWidth - 20, footerY2, { align: 'right' })

    doc.save(`Demande_${req.userLastName}_${req.userFirstName}_${req.taxYear}.pdf`)
    return
  }

  // ===== INFORMATIONS PERSONNELLES =====
  sectionTitle('INFORMATIONS PERSONNELLES')
  field('Nom complet:', `${d.firstName || ''} ${d.lastName || ''}`)
  field('NAS:', String(d.sin || 'Non fourni'))
  field('Date de naissance:', String(d.dateOfBirth || 'Non fourni'))
  field('Sexe:', String(d.sex || 'Non precise'))
  field('Telephone:', String(d.phone || 'Non fourni'))
  field('Courriel:', String(d.email || req.userEmail))
  field('Etat civil:', String(d.maritalStatus || 'Non precise'))
  if (d.maritalStatusChange) field('Changement etat civil:', String(d.maritalStatusChange))
  field('Profil fiscal:', PROFILE_LABELS[req.profile] || req.profile)
  field('Province:', String(d.provinceOfResidence || 'Quebec'))
  field('Langue:', String(d.printLanguage || 'Francais'))
  field('Annees declarees:', list(d.yearsToDeclare))
  field('Assurances:', list(d.insurances))
  if (d.messageToExpert) field('Message expert:', String(d.messageToExpert))
  field('Autorisation ARC:', bool(d.arcDownloadAuth))
  field('Premiere declaration Canada:', bool(d.firstDeclarationCanada))
  field('Nouvel arrivant:', bool(d.newcomer))
  separator()

  // ===== ADRESSE POSTALE =====
  sectionTitle('ADRESSE POSTALE')
  const addr = [d.civicNumber, d.streetName, d.apartment].filter(Boolean).join(' ')
  field('Adresse:', addr || 'Non fournie')
  field('Ville:', String(d.city || 'Non fournie'))
  field('Province:', String(d.province || 'Quebec'))
  field('Code postal:', String(d.postalCode || 'Non fourni'))
  separator()

  // ===== RESIDENCE =====
  sectionTitle('LIEU DE RESIDENCE')
  field('Adresse = adresse postale:', bool(d.sameAsMailing))
  field('Changement province:', bool(d.provinceChangeDuringYear))
  field('Citoyennete canadienne:', bool(d.canadianCitizenship))
  separator()

  // ===== FAMILLE =====
  sectionTitle('CONJOINT / FAMILLE / PERSONNES A CHARGE')
  field('Declaration conjoint:', bool(d.processingSpouse))
  field('Situation familiale changee:', bool(d.familyStatusChanged))
  field('Biens etranger >100k$:', bool(d.foreignAssetsOver100k))
  field('Achat/vente residence:', bool(d.principalResidenceSale))
  field('Nombre personnes a charge:', String(d.numberOfDependents || 0))
  if (Array.isArray(d.dependents) && d.dependents.length > 0) {
    d.dependents.forEach((dep: Record<string, unknown>, i: number) => {
      field(`  Personne ${i + 1}:`, `${dep.name || ''} (${dep.link || ''}) - ${dep.age || 0} ans - ${fmt(dep.income as number)}`)
    })
  }
  separator()

  // ===== REER / CELIAPP =====
  sectionTitle('COTISATIONS REER / CELIAPP')
  field('Cotisation REER:', bool(d.rrspContributions))
  field('REER 60 premiers jours:', bool(d.rrspFirst60Days))
  field('CELIAPP:', bool(d.celiappContributions))
  separator()

  // ===== SITUATIONS =====
  sectionTitle('SITUATIONS DE L\'ANNEE')
  field('Situations cochées:', list(d.situations))
  separator()

  // ===== CONJOINT =====
  if (d.processingSpouse) {
    sectionTitle('DECLARATION DU CONJOINT')
    field('Nom conjoint:', String(d.spouseLastName || ''))
    field('Prenom conjoint:', String(d.spouseFirstName || ''))
    field('Date naissance conjoint:', String(d.spouseDateOfBirth || ''))
    field('Sexe conjoint:', String(d.spouseSex || ''))
    field('NAS conjoint:', String(d.spouseSin || ''))
    field('Telephone conjoint:', String(d.spousePhone || ''))
    field('Courriel conjoint:', String(d.spouseEmail || ''))
    field('Province conjoint:', String(d.spouseProvinceOfResidence || ''))
    separator()
  }

  // ===== DOCUMENTS =====
  if (req.documents.length > 0) {
    sectionTitle('DOCUMENTS JOINTS')
    req.documents.forEach((doc2) => {
      checkPage(8)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(30, 30, 30)
      doc.text(`• ${doc2.name}`, 22, y)
      doc.setFontSize(9)
      doc.setTextColor(150, 150, 150)
      doc.text(`(${doc2.type})`, 22 + doc.getTextWidth(`• ${doc2.name}`) + 3, y)
      y += 6
    })
  }

  // ===== NOTE REVIEWEUR =====
  if (req.reviewerNote) {
    separator()
    sectionTitle('NOTE DU REVIEWEUR')
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const rgb: [number, number, number] = req.status === 'REJECTED' ? [200, 30, 30] : [37, 99, 235]
    doc.setTextColor(rgb[0], rgb[1], rgb[2])
    const splitNote = doc.splitTextToSize(req.reviewerNote, pageWidth - 40)
    checkPage(splitNote.length * 5 + 5)
    doc.text(splitNote, 20, y)
    y += splitNote.length * 5 + 5
  }

  // ===== FOOTER =====
  const footerY = pageHeight - 15
  doc.setDrawColor(220, 220, 220)
  doc.line(20, footerY - 5, pageWidth - 20, footerY - 5)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(150, 150, 150)
  doc.text(`Genere le ${new Date().toLocaleDateString('fr-CA')} a ${new Date().toLocaleTimeString('fr-CA')}`, 20, footerY)
  doc.text('ImpotFacile - Plateforme de declaration d\'impots', pageWidth - 20, footerY, { align: 'right' })

  doc.save(`Demande_${req.userLastName}_${req.userFirstName}_${req.taxYear}.pdf`)
}
