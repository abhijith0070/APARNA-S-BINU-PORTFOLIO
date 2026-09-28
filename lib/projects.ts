export interface Project {
  id: string
  number: string
  title: string
  category: string
  year: string
  location: string
  description: string
  disciplines: string[]
  image: string
  slug: string
  imagePosition?: string
}

/**
 * Centralised project data for the /work page.
 * 
 * REPLACING IMAGES:
 * Simply swap the files at /public/projects/<slug>.jpg
 * No component code changes required.
 */
export const projects: Project[] = [
  {
    id: 'community-centre',
    number: '01',
    title: 'Community Centre',
    category: 'Public',
    year: '2026',
    location: 'Kochi, Kerala',
    description: 'A civic gathering space weaving together local craft traditions with contemporary spatial strategies. The design centres on a permeable courtyard that mediates between the street and a series of interlocking programme volumes.',
    disciplines: ['Architecture', 'Spatial Design'],
    image: '/projects/community-centre.jpg',
    slug: 'community-centre',
    imagePosition: 'center 45%',
  },
  {
    id: 'cafe',
    number: '02',
    title: 'Café',
    category: 'Interior',
    year: '2025',
    location: 'Trivandrum, Kerala',
    description: 'An interior intervention within a heritage shophouse, exploring the interplay of natural light, exposed materiality and intimate scale. The spatial sequence unfolds from a narrow threshold into a double-height dining hall.',
    disciplines: ['Interior', 'Spatial Design'],
    image: '/projects/cafe.jpg',
    slug: 'cafe',
    imagePosition: 'center 50%',
  },
  {
    id: 'hospital',
    number: '03',
    title: 'Hospital',
    category: 'Healthcare',
    year: '2025',
    location: 'Alappuzha, Kerala',
    description: 'A primary healthcare centre designed around the experience of healing. Courtyards, controlled daylight and a restrained material palette create an environment of quiet reassurance for patients, staff and families.',
    disciplines: ['Architecture', 'Healthcare Design'],
    image: '/projects/hospital.jpg',
    slug: 'hospital',
    imagePosition: 'center 50%',
  },
  {
    id: 'campus',
    number: '04',
    title: 'Campus',
    category: 'Masterplanning',
    year: '2024',
    location: 'Thrissur, Kerala',
    description: 'An educational campus masterplan structured by a hierarchy of shared landscapes — from the intimate tutorial garden to the ceremonial commons. Buildings are arranged to frame views and encourage chance encounter.',
    disciplines: ['Masterplanning', 'Architecture'],
    image: '/projects/campus.jpg',
    slug: 'campus',
    imagePosition: 'center 45%',
  },
  {
    id: 'residence',
    number: '05',
    title: 'Residence',
    category: 'Residential',
    year: '2024',
    location: 'Kozhikode, Kerala',
    description: 'A private dwelling that negotiates between the dense tropical site and the desire for openness. Deep verandahs, pivoting timber screens and a fragmented plan dissolve the boundary between interior and garden.',
    disciplines: ['Residential', 'Architecture'],
    image: '/projects/residence.jpg',
    slug: 'residence',
    imagePosition: 'center 50%',
  },
]

/** All unique disciplines across the project collection */
export const allDisciplines: string[] = Array.from(
  new Set(projects.flatMap((p) => p.disciplines))
)
