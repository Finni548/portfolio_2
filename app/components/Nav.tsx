'use client'

import {useState, useEffect} from 'react'

const NAV_LINKS = [
  {href: '#home', label: 'Home'},
  {href: '#about', label: 'About'},
  {href: '#projects', label: 'Projects'},
  {href: '#contact-page', label: 'Contact'},
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState('home')

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('section[id]'))
    if (!sections.length || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      {threshold: 0.45},
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onOutside = (e: MouseEvent) => {
      const nav = document.querySelector('.nav')
      if (nav && !nav.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('click', onOutside)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onOutside)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setOpen(false)
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({behavior: 'smooth', block: 'start'})
  }

  return (
    <header className={`nav${open ? ' nav--open' : ''}`}>
      <nav className="nav__inner" aria-label="Hauptnavigation">
        <a
          className="nav__brand"
          href="#home"
          aria-label="Startseite — Finnja Krämer"
          onClick={(e) => handleLinkClick(e, '#home')}
        >
          <span className="nav__logo" aria-hidden="true">FK</span>
          <span className="nav__name">Finnja Krämer</span>
        </a>
        <ul className="nav__links" role="list" id="nav-links">
          {NAV_LINKS.map(({href, label}) => (
            <li key={href}>
              <a
                className={`nav__link${activeId === href.slice(1) ? ' is-active' : ''}`}
                href={href}
                onClick={(e) => handleLinkClick(e, href)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <button
          className="nav__hamburger"
          aria-label={open ? 'Navigationsmenü schließen' : 'Navigationsmenü öffnen'}
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </nav>
    </header>
  )
}
