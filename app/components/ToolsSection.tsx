import type {SiteData} from '@/lib/sanity/types'

export default function ToolsSection({tools}: {tools: SiteData['tools']}) {
  return (
    <section id="tools" className="section about-tools" aria-label="Tools und Fähigkeiten">
      <div className="container">
        <p className="kicker reveal" aria-hidden="true">Background</p>
        <h2 className="sectionTitle reveal">TOOLS &amp; SKILLS</h2>
        <div className="about-tools__grid">
          {tools.map((tool) => (
            <div key={tool.name} className="tool-card reveal">
              <span className="tool-card__label">{tool.label}</span>
              <span className="tool-card__name">{tool.name}</span>
              <span className="tool-card__detail">{tool.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
