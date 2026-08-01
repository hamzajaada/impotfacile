import { useState } from 'react'
import { Mail, User, MessageSquare, Send } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <p className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-2">Contact</p>
        <h1 className="section-title mb-3">Contactez-nous</h1>
        <p className="section-subtitle mx-auto">
          Notre equipe est disponible pour repondre a vos questions.
        </p>
      </div>
      {submitted ? (
        <div className="card p-10 text-center">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Send className="text-emerald-600" size={24} />
          </div>
          <p className="text-lg font-bold text-slate-900 mb-1">Merci pour votre message!</p>
          <p className="text-sm text-slate-500">Nous vous repondrons dans les plus brefs delais.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card p-8 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field pl-10" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Courriel</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field pl-10" required />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Objet</label>
            <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
            <div className="relative">
              <MessageSquare size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field pl-10 h-32 resize-none" required />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full py-3">
            <Send size={16} />
            Envoyer
          </button>
        </form>
      )}
    </div>
  )
}
