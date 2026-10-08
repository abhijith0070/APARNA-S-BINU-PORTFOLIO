/**
 * ARCHIVE — Centralized image data for Aparna's architectural photo archive.
 *
 * Uses ONLY the 23 real photographs from /public.
 * Order is strictly deterministic (01 -> 23).
 * No dummy images. No external URLs. No Unsplash.
 */

export interface ArchiveImage {
  id: number
  src: string
  alt: string
  width: number
  height: number
  aspect: 'portrait' | 'landscape'
}

export const archiveImages: ArchiveImage[] = [
  {
    id: 1,
    src: '/WhatsApp Image 2026-10-08 at 19.38.10.jpeg',
    alt: 'Architectural photograph',
    width: 987,
    height: 1600,
    aspect: 'portrait',
  },
  {
    id: 2,
    src: '/WhatsApp Image 2026-10-08 at 19.38.10 (1).jpeg',
    alt: 'Architectural photograph',
    width: 1079,
    height: 1439,
    aspect: 'portrait',
  },
  {
    id: 3,
    src: '/WhatsApp Image 2026-10-08 at 19.38.10 (2).jpeg',
    alt: 'Architectural photograph',
    width: 1079,
    height: 1426,
    aspect: 'portrait',
  },
  {
    id: 4,
    src: '/WhatsApp Image 2026-10-08 at 19.38.11.jpeg',
    alt: 'Architectural photograph',
    width: 1080,
    height: 1408,
    aspect: 'portrait',
  },
  {
    id: 5,
    src: '/WhatsApp Image 2026-10-08 at 19.38.11 (1).jpeg',
    alt: 'Architectural photograph',
    width: 1129,
    height: 1393,
    aspect: 'portrait',
  },
  {
    id: 6,
    src: '/WhatsApp Image 2026-10-08 at 19.38.11 (2).jpeg',
    alt: 'Architectural photograph',
    width: 1920,
    height: 2560,
    aspect: 'portrait',
  },
  {
    id: 7,
    src: '/WhatsApp Image 2026-10-08 at 19.38.11 (3).jpeg',
    alt: 'Architectural photograph',
    width: 944,
    height: 1600,
    aspect: 'portrait',
  },
  {
    id: 8,
    src: '/WhatsApp Image 2026-10-08 at 19.38.12.jpeg',
    alt: 'Architectural photograph',
    width: 1280,
    height: 852,
    aspect: 'landscape',
  },
  {
    id: 9,
    src: '/WhatsApp Image 2026-10-08 at 19.38.12 (1).jpeg',
    alt: 'Architectural photograph',
    width: 1280,
    height: 692,
    aspect: 'landscape',
  },
  {
    id: 10,
    src: '/WhatsApp Image 2026-10-08 at 19.38.12 (2).jpeg',
    alt: 'Architectural photograph',
    width: 1920,
    height: 2560,
    aspect: 'portrait',
  },
  {
    id: 11,
    src: '/WhatsApp Image 2026-10-08 at 19.38.13.jpeg',
    alt: 'Architectural photograph',
    width: 2560,
    height: 1920,
    aspect: 'landscape',
  },
  {
    id: 12,
    src: '/WhatsApp Image 2026-10-08 at 19.38.13 (1).jpeg',
    alt: 'Architectural photograph',
    width: 1920,
    height: 2560,
    aspect: 'portrait',
  },
  {
    id: 13,
    src: '/WhatsApp Image 2026-10-08 at 19.38.13 (2).jpeg',
    alt: 'Architectural photograph',
    width: 1441,
    height: 1790,
    aspect: 'portrait',
  },
  {
    id: 14,
    src: '/WhatsApp Image 2026-10-08 at 19.38.13 (3).jpeg',
    alt: 'Architectural photograph',
    width: 1079,
    height: 1402,
    aspect: 'portrait',
  },
  {
    id: 15,
    src: '/WhatsApp Image 2026-10-08 at 19.38.14.jpeg',
    alt: 'Architectural photograph',
    width: 1195,
    height: 2560,
    aspect: 'portrait',
  },
  {
    id: 16,
    src: '/WhatsApp Image 2026-10-08 at 19.38.14 (1).jpeg',
    alt: 'Architectural photograph',
    width: 1280,
    height: 718,
    aspect: 'landscape',
  },
  {
    id: 17,
    src: '/18.jpeg',
    alt: 'Architectural photograph',
    width: 1280,
    height: 976,
    aspect: 'landscape',
  },
  {
    id: 18,
    src: '/27.jpeg',
    alt: 'Architectural photograph',
    width: 1079,
    height: 806,
    aspect: 'landscape',
  },
  {
    id: 19,
    src: '/25.jpeg',
    alt: 'Architectural photograph',
    width: 2560,
    height: 1920,
    aspect: 'landscape',
  },
  {
    id: 20,
    src: '/24.jpeg',
    alt: 'Architectural photograph',
    width: 1240,
    height: 1600,
    aspect: 'portrait',
  },
  {
    id: 21,
    src: '/23.jpeg',
    alt: 'Architectural photograph',
    width: 1216,
    height: 1600,
    aspect: 'portrait',
  },
  {
    id: 22,
    src: '/22.jpeg',
    alt: 'Architectural photograph',
    width: 2340,
    height: 4160,
    aspect: 'portrait',
  },
  {
    id: 23,
    src: '/WhatsApp Image 2026-10-08 at 20.10.59.jpeg',
    alt: 'Architectural photograph',
    width: 2340,
    height: 4160,
    aspect: 'portrait',
  },
]
