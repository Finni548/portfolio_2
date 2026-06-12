'use client'

import {useState} from 'react'

export default function ContactForm() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <form
      className="contactForm reveal"
      aria-label="Kontaktformular"
      onSubmit={handleSubmit}
      noValidate
    >
      <label htmlFor="contact-name">
        Name
        <input
          id="contact-name"
          type="text"
          name="name"
          placeholder="Dein Name"
          required
          autoComplete="name"
        />
      </label>
      <label htmlFor="contact-email">
        E-Mail
        <input
          id="contact-email"
          type="email"
          name="email"
          placeholder="deine@email.de"
          required
          autoComplete="email"
        />
      </label>
      <label htmlFor="contact-message">
        Nachricht
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          placeholder="Erzähl mir kurz von deinem Projekt"
        />
      </label>
      <button type="submit" className="btn btn--primary" disabled={sent}>
        {sent ? 'Message Sent ✓' : 'Nachricht senden'}
      </button>
    </form>
  )
}
