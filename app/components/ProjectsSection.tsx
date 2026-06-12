'use client'

import {useState, useEffect, useRef} from 'react'
import type {ProjectsData, Project, ProjectImage} from '@/lib/sanity/types'

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <line x1="1" y1="1" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="17" y1="1" x2="1" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export default function ProjectsSection({projects}: {projects: ProjectsData}) {
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)

  const {groups, items} = projects

  const allGroups = [...groups]
  items.forEach((p) => {
    if (p.group && !allGroups.some((g) => g.name === p.group)) {
      allGroups.push({name: p.group, sub: ''})
    }
  })

  const openProject = (p: Project, trigger: HTMLElement) => {
    lastFocusedRef.current = trigger
    setActiveProject(p)
    document.body.style.overflow = 'hidden'
  }

  const closeProject = () => {
    const vid = document.querySelector<HTMLVideoElement>('.pModal__panel video')
    if (vid) vid.pause()
    setActiveProject(null)
    document.body.style.overflow = ''
    lastFocusedRef.current?.focus()
  }

  const openLightbox = (src: string) => setLightboxSrc(src)

  const closeLightbox = () => setLightboxSrc(null)

  // Focus close button when modal opens
  useEffect(() => {
    if (activeProject) {
      setTimeout(() => closeButtonRef.current?.focus(), 50)
    }
  }, [activeProject])

  // Escape key handling
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (lightboxSrc) {
        closeLightbox()
      } else if (activeProject) {
        closeProject()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lightboxSrc, activeProject])

  const isPhone = activeProject?.images?.some((img) => img.phone) ?? false

  return (
    <>
      <section id="projects" className="section allProjects" aria-label="Alle Projekte">
        <div className="container">
          <div className="sectionHead">
            <p className="kicker reveal" aria-hidden="true">All Projects</p>
            <h2 className="sectionTitle reveal">PROJECT ARCHIVE</h2>
            <p className="projects-count reveal" aria-live="polite">
              {items.length} Projekte
            </p>
          </div>
          <div aria-live="polite" aria-label="Projektliste">
            {allGroups.map((group) => {
              const inGroup = items.filter((p) => p.group === group.name)
              if (!inGroup.length) return null
              return (
                <div key={group.name} className="categoryBlock">
                  <div className="categoryHead">
                    <h3>{group.name}</h3>
                    <span>{group.sub}</span>
                  </div>
                  <div className="projectGrid">
                    {inGroup.map((p) => (
                      <article
                        key={p.id}
                        className="projectCard reveal"
                        role="button"
                        tabIndex={0}
                        aria-label={`Projekt ansehen: ${p.title}`}
                        onClick={(e) => openProject(p, e.currentTarget)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            openProject(p, e.currentTarget)
                          }
                        }}
                      >
                        <div className="projectCard__media">
                          <img
                            src={p.cover}
                            alt={`${p.title} — ${p.category}`}
                            loading="lazy"
                          />
                        </div>
                        <div className="projectCard__body">
                          <p className="projectCard__category">{p.category}</p>
                          <h3 className="projectCard__title">{p.title}</h3>
                          <p className="projectCard__desc">{p.cardDesc || p.desc}</p>
                          <p className="projectCard__tech">{p.tech}</p>
                        </div>
                        <div className="projectCard__cta" aria-hidden="true">
                          Projekt ansehen <span>→</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Project Modal */}
      {activeProject && (
        <div
          className="pModal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pModal-title"
          style={
            activeProject.accent
              ? ({'--modal-accent': activeProject.accent} as React.CSSProperties)
              : undefined
          }
        >
          <div className="pModal__backdrop" onClick={closeProject} />
          <div className="pModal__panel" role="document">
            <button
              ref={closeButtonRef}
              className="pModal__close"
              aria-label="Projekt schließen"
              onClick={closeProject}
            >
              <CloseIcon />
            </button>
            <div className="pModal__inner">
              <div className="pModal__header">
                <p className="pModal__category">{activeProject.category}</p>
                <h2 className="pModal__title" id="pModal-title">
                  {activeProject.title}
                </h2>
                <p className="pModal__tech">
                  {activeProject.tech}
                  {activeProject.year ? ` · ${activeProject.year}` : ''}
                </p>
              </div>
              <div className="pModal__body">
                <p className="pModal__desc">{activeProject.desc}</p>
              </div>
              <div
                className={`pModal__gallery${isPhone ? ' pModal__gallery--phone' : ''}`}
                role="list"
                aria-label="Projektbilder"
              >
                {(activeProject.images ?? []).map((img: ProjectImage, i: number) => {
                  const src = img.src
                  const wide = img.wide || img.half
                  return (
                    <div
                      key={i}
                      className={`pGallery__item${isPhone && wide ? ' pGallery__item--wide' : ''}`}
                      role="listitem"
                      onClick={() => openLightbox(src)}
                    >
                      <img src={src} alt={activeProject.title} loading="lazy" />
                    </div>
                  )
                })}
              </div>
              {activeProject.video && (
                <div className="pModal__video">
                  <video controls preload="none" playsInline poster={activeProject.cover ?? ''}>
                    <source src={activeProject.video} type="video/mp4" />
                    <source src={activeProject.video} type="video/quicktime" />
                  </video>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Bildansicht"
          onClick={(e) => {
            const t = e.target as HTMLElement
            if (t.classList.contains('lightbox__bg') || t.classList.contains('lightbox')) {
              closeLightbox()
            }
          }}
        >
          <div className="lightbox__bg" />
          <button className="lightbox__close" aria-label="Bild schließen" onClick={closeLightbox}>
            <CloseIcon />
          </button>
          <div className="lightbox__wrap">
            <img className="lightbox__img" src={lightboxSrc} alt="" />
          </div>
        </div>
      )}
    </>
  )
}
