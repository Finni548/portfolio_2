export default function SkillsSection({skills}: {skills: string[]}) {
  return (
    <section id="skills" className="section skills" aria-label="Skills">
      <div className="container">
        <p className="kicker reveal" aria-hidden="true">Skills</p>
        <h2 className="sectionTitle reveal">TOOLS, SYSTEMS, CRAFT</h2>
        <div className="skills__pills" aria-label="Liste meiner Skills">
          {skills.map((skill) => (
            <span key={skill} className="pill reveal">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
