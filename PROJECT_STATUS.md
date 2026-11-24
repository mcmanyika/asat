# ASAT Technologies — Project Status

**Last updated:** 2026-11-24  
**Current phase:** Phase One — Public Website  
**Status:** Complete — ready for review

## Completed

- Next.js 16 App Router + TypeScript + Tailwind foundation
- Design system (ASAT brand colors, Manrope typography)
- Centralized `siteConfig` and navigation config
- Two-level header (TopBar + sticky nav), mobile menu, footer
- Full homepage (hero through final CTA)
- All Phase One routes (products, systems, solutions, consulting, industries, contact, enquiry forms, legal)
- Enquiry forms with Zod validation + Supabase `/api/enquiries` persistence
- OpenAI chat widget
- Firebase removed in favour of Supabase
- WhatsApp button (hidden until number configured)
- SEO: metadata, Open Graph, sitemap, robots, JSON-LD
- Temporary PNG fallbacks under `public/images/`
- `npm run lint` and `npm run build` passing

## Asset integration (updated)

Supplied images have been mapped into `public/images/`:

| Source | Mapped to |
|--------|-----------|
| Modern Office POS Technology Setup | `hero/hero-background.png`, systems retail POS |
| Sleek Silver Laptop… | `products/laptop.png`, `divisions/products.png` |
| Modern All-in-One Desktop… | `products/aio-desktop.png`, systems Business Central visual |
| Modern Multifunction Office Printer… | `products/printer.png` |
| Modern POS Terminal… | `products/pos-machine.png`, `divisions/business-systems.png` |
| Matte Black Cash Register Drawer… | `products/cash-drawer.png` |
| Wireless Barcode Scanner… | `products/barcode-scanner.png` |
| Modern Server Rack… | `solutions/network-server.png`, `divisions/it-solutions.png` |
| Homepage mockup (consulting card crop) | `divisions/consulting.png` |
| Logo wordmark (recreated from mockup) | `logo/asat-logo.png` + white variant |

Originals kept under `public/images/reference/`.

## Pending client input

| Item | Notes |
|------|--------|
| Official logo file | Wordmark recreated from mockup — replace if a master logo file exists |
| Dedicated consulting photo | Currently cropped from mockup card |
| Contact details | Loaded from mockup (`+254 20 123 4567`, `info@asat-technologies.com`) — confirm before launch |
| Social links | Still empty in `src/config/site.ts` |
| WhatsApp number | Still empty |
| `NEXT_PUBLIC_SITE_URL` | Set in `.env.local` for canonical/OG URLs |

## Backend

- Supabase `enquiries` schema: `supabase/schema.sql`
- Required env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, optional `SUPABASE_SERVICE_ROLE_KEY`

## Not started

- Email notifications on new enquiries
- Admin dashboard
- Supabase Storage for media management

## How to review

```bash
npm run dev
```

Homepage first, then navigate Products → Systems → Solutions → Consulting → Industries → Contact / Request forms.
