import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  title: "Projekte",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titel", type: "string" }),
    defineField({
      name: "order",
      title: "Reihenfolge",
      type: "number",
      description: "Niedrigere Zahl = weiter oben",
    }),
    defineField({
      name: "category",
      title: "Kategorie",
      type: "string",
      description: 'z. B. "Editorial", "3D", "Branding"',
    }),
    defineField({
      name: "group",
      title: "Gruppe",
      type: "reference",
      to: [{ type: "projectGroup" }],
      description: "Unter welcher Gruppe erscheint das Projekt?",
    }),
    defineField({
      name: "cover",
      title: "Cover-Bild",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "desc",
      title: "Beschreibung (Modal)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "cardDesc",
      title: "Kurzbeschreibung (Karte)",
      type: "text",
      rows: 2,
      description: "Optional – falls leer, wird die normale Beschreibung verwendet.",
    }),
    defineField({ name: "tech", title: "Tools / Technologien", type: "string" }),
    defineField({ name: "year", title: "Jahr", type: "string" }),
    defineField({
      name: "accent",
      title: "Akzentfarbe",
      type: "string",
      description: 'CSS-Farbe für das Modal, z. B. "#ff9fc0"',
    }),
    defineField({
      name: "images",
      title: "Galerie-Bilder",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "asset", title: "Bild", type: "image", options: { hotspot: true } }),
            defineField({ name: "phone", title: "Hochformat (Phone)", type: "boolean" }),
            defineField({ name: "wide", title: "Breit", type: "boolean" }),
            defineField({ name: "half", title: "Halb-breit", type: "boolean" }),
          ],
          preview: { select: { media: "asset" } },
        },
      ],
    }),
    defineField({
      name: "video",
      title: "Video",
      type: "file",
      options: { accept: "video/*" },
    }),
  ],

  preview: {
    select: { title: "title", subtitle: "category", media: "cover" },
  },
});
