import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Portfolio',
  basePath: '/studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'b3k4pncg',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'portfolio',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
