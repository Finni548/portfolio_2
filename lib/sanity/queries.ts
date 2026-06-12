export const SITE_QUERY = `*[_type == "site"][0]{
  "hero": {
    "title": hero.title,
    "subtitle": hero.subtitle,
    "copy": hero.copy,
    "portrait": hero.portrait.asset->url + "?w=900&auto=format"
  },
  "about": {
    "title": about.title,
    "bio": about.bio[]{ "text": text },
    "image": about.image.asset->url + "?w=900&auto=format"
  },
  "skills": skills[],
  "tools": tools[]{ label, name, detail },
  "contact": {
    "email": contact.email,
    "instagram": contact.instagram,
    "linkedin": contact.linkedin
  }
}`

export const PROJECTS_QUERY = `{
  "groups": *[_type == "projectGroup"] | order(order asc) {
    "name": name,
    "sub": subtitle
  },
  "items": *[_type == "project"] | order(order asc) {
    "id": _id,
    title,
    category,
    "group": group->name,
    desc,
    cardDesc,
    "cover": cover.asset->url + "?w=800&auto=format",
    tech,
    year,
    accent,
    "images": images[]{
      "src": asset.asset->url + "?w=1200&auto=format",
      phone,
      wide,
      half
    },
    "video": video.asset->url
  }
}`
