import type {SiteData} from '@/lib/sanity/types'

export default function AboutSection({about}: {about: SiteData['about']}) {
  return (
    <section id="about" className="section about-hero" aria-label="Über mich">
      <div className="about-hero__backtype" aria-hidden="true">
        <span>ABOUT</span>
      </div>

      <div className="container about-hero__grid">
        <div>
          <p className="kicker reveal" aria-hidden="true">About Me</p>
          <h2 className="about-hero__title reveal">{about.title}</h2>
          <div className="about-hero__bio">
            {about.bio.map((item, i) => (
              <p key={i} className="reveal">
                {item.text}
              </p>
            ))}
          </div>
          <div className="about-hero__actions reveal">
            <a href="#contact-page" className="btn btn--primary">
              Kontakt aufnehmen <span aria-hidden="true">→</span>
            </a>
            <a href="#projects" className="btn">
              Projekte ansehen
            </a>
          </div>
        </div>

        <div className="about-hero__imgCol reveal">
          <div className="about-hero__imgFrame">
            {about.image && (
              <img
                className="about-hero__img"
                src={about.image}
                alt="Finnja Krämer"
                width={900}
                height={1200}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
