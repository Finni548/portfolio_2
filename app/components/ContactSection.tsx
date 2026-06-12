import type {SiteData} from '@/lib/sanity/types'
import ContactForm from './ContactForm'

export default function ContactSection({contact}: {contact: SiteData['contact']}) {
  return (
    <section id="contact-page" className="section contactPage" aria-label="Kontakt">
      <div className="container contactPage__grid">
        <div>
          <p className="kicker reveal" aria-hidden="true">Contact</p>
          <h2 className="sectionTitle reveal">LET&apos;S WORK TOGETHER</h2>
          <div className="contactPage__links reveal" aria-label="Kontaktlinks">
            {contact.email && (
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            )}
            {contact.instagram && (
              <a href={contact.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            )}
            {contact.linkedin && (
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            )}
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  )
}
