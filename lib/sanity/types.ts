export interface SiteData {
  hero: {title: string; subtitle: string; copy: string; portrait: string}
  about: {title: string; bio: {text: string}[]; image: string}
  skills: string[]
  tools: {label: string; name: string; detail: string}[]
  contact: {email: string; instagram: string; linkedin: string}
}

export interface ProjectImage {
  src: string
  phone?: boolean
  wide?: boolean
  half?: boolean
}

export interface Project {
  id: string
  title: string
  category: string
  group: string
  desc: string
  cardDesc?: string
  cover: string
  tech: string
  year: string
  accent?: string
  images: ProjectImage[]
  video?: string
}

export interface ProjectGroup {
  name: string
  sub: string
}

export interface ProjectsData {
  groups: ProjectGroup[]
  items: Project[]
}
