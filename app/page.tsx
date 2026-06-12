import {client} from '@/lib/sanity/client'
import {SITE_QUERY, PROJECTS_QUERY} from '@/lib/sanity/queries'
import type {SiteData, ProjectsData} from '@/lib/sanity/types'
import Nav from './components/Nav'
import CursorGlow from './components/CursorGlow'
import HeroSection from './components/HeroSection'
import SkillsSection from './components/SkillsSection'
import AboutSection from './components/AboutSection'
import ToolsSection from './components/ToolsSection'
import ProjectsSection from './components/ProjectsSection'
import ContactSection from './components/ContactSection'
import RevealObserver from './components/RevealObserver'

export default async function Home() {
  const [site, projects] = await Promise.all([
    client.fetch<SiteData>(SITE_QUERY),
    client.fetch<ProjectsData>(PROJECTS_QUERY),
  ])

  return (
    <>
      <a className="skip-link" href="#main-content">
        Zum Inhalt springen
      </a>
      <div className="noise" aria-hidden="true" />
      <CursorGlow />
      <Nav />
      <main id="main-content">
        {site?.hero && <HeroSection hero={site.hero} />}
        {site?.skills && <SkillsSection skills={site.skills} />}
        {site?.about && <AboutSection about={site.about} />}
        {site?.tools && <ToolsSection tools={site.tools} />}
        {projects && <ProjectsSection projects={projects} />}
        {site?.contact && <ContactSection contact={site.contact} />}
      </main>
      <RevealObserver />
    </>
  )
}
