import type {SiteData} from '@/lib/sanity/types'

export default function HeroSection({hero}: {hero: SiteData['hero']}) {
  return (
    <section id="home" className="section hero" aria-label="Startseite">
      <div className="hero__backtype" aria-hidden="true">
        <span>FINNJA</span>
        <span>KRAEMER</span>
      </div>

      <div className="container hero__grid">
        <div className="hero__content">
          <h1 className="hero__title reveal">{hero.title}</h1>
          <p className="hero__subtitle reveal">{hero.subtitle}</p>
          <p className="hero__copy reveal">{hero.copy}</p>
        </div>

        <div className="hero__portraitWrap reveal">
          <div className="hero__portraitGlass">
            {hero.portrait && (
              <img
                className="hero__portrait"
                src={hero.portrait}
                alt="Portrait von Finnja Krämer"
                width={440}
                height={550}
              />
            )}
          </div>
          <a href="#about" className="btn hero__aboutBtn">
            About Me <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div className="hero__floaters" aria-hidden="true">
        <div className="floater floater--a" />
        <div className="floater floater--b" />
      </div>
    </section>
  )
}
