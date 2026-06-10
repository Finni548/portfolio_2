import { defineField, defineType } from "sanity";

export default defineType({
  name: "projectGroup",
  title: "Projekt-Gruppen",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({
      name: "subtitle",
      title: "Untertitel",
      type: "string",
      description: 'Kleiner Text rechts neben dem Gruppenname, z. B. "2023–2025"',
    }),
    defineField({
      name: "order",
      title: "Reihenfolge",
      type: "number",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "subtitle" },
  },
});
