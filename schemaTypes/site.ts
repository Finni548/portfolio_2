import { defineField, defineType } from "sanity";

export default defineType({
  name: "site",
  title: "Website-Inhalte",
  type: "document",
  fields: [
    // ── Hero ──────────────────────────────────────
    defineField({
      name: "hero",
      title: "Hero-Bereich",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Überschrift", type: "string" }),
        defineField({ name: "subtitle", title: "Untertitel", type: "string" }),
        defineField({ name: "copy", title: "Fließtext", type: "text", rows: 3 }),
        defineField({
          name: "portrait",
          title: "Portrait-Bild",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),

    // ── About ─────────────────────────────────────
    defineField({
      name: "about",
      title: "About-Bereich",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Überschrift", type: "string" }),
        defineField({
          name: "image",
          title: "About-Bild",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "bio",
          title: "Bio-Absätze",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "text", title: "Absatz", type: "text", rows: 4 }),
              ],
              preview: { select: { title: "text" } },
            },
          ],
        }),
      ],
    }),

    // ── Skills (Pills) ────────────────────────────
    defineField({
      name: "skills",
      title: "Skills (Pills)",
      type: "array",
      of: [{ type: "string" }],
      description: "Jeder Eintrag erscheint als Pill-Badge.",
    }),

    // ── Tools-Karten ──────────────────────────────
    defineField({
      name: "tools",
      title: "Tools & Skills (Karten)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Kategorie", type: "string" }),
            defineField({ name: "name", title: "Tool-Name", type: "string" }),
            defineField({ name: "detail", title: "Detail-Text", type: "string" }),
          ],
          preview: { select: { title: "name", subtitle: "label" } },
        },
      ],
    }),

    // ── Kontakt ───────────────────────────────────
    defineField({
      name: "contact",
      title: "Kontakt",
      type: "object",
      fields: [
        defineField({ name: "email", title: "E-Mail", type: "string" }),
        defineField({ name: "instagram", title: "Instagram-URL", type: "url" }),
        defineField({ name: "linkedin", title: "LinkedIn-URL", type: "url" }),
      ],
    }),
  ],

  preview: {
    prepare() {
      return { title: "Website-Inhalte" };
    },
  },
});
