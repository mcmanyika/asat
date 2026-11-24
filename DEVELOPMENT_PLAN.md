# ASAT Technologies — Development Plan

## Overview

Premium informational corporate website for ASAT Technologies. Enquiry-driven only — no e-commerce.

## Phases

### Phase One — Public Website (current)

1. Project foundation (Next.js App Router, TypeScript, Tailwind)
2. Design system and centralized site configuration
3. Image asset integration (temporary fallbacks until supplied assets arrive)
4. Header, navigation, footer
5. Homepage (all sections)
6. Product, systems, solutions, consulting, industries pages
7. Contact and enquiry form interfaces
8. Responsive design and SEO

### Phase Two — Backend Integration

- Supabase enquiry storage (`enquiries` table)
- Email notifications (optional next)
- Supabase Storage media management (optional next)
- Row Level Security policies

### Phase Three — Admin Dashboard (after approval)

- Authentication, CMS, enquiry management, company settings

## Brand Colors

- Deep Navy: `#0B1628`
- Gold: `#C9A227`
- Accent Gold: `#D4AF37`
- Gold Dark (hover): `#A8871C`

## Asset Status

Supplied photography is mapped under `public/images/`. Source originals are kept in `public/images/reference/`.

## Contact Information

All contact and social fields in `src/config/site.ts` are empty until verified. UI hides empty fields.

## Exit Criteria (Phase One)

- [ ] Production build succeeds
- [ ] Lint and TypeScript checks pass
- [ ] All routes navigate correctly
- [ ] Homepage visual review against brand brief
- [ ] Forms validate without fake success messages
- [ ] Missing assets and unverified info documented
