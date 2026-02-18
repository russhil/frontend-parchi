# Parchi AI — Landing Page

The public marketing/landing page for Parchi AI. Built with **Vite + React + Tailwind CSS + Framer Motion**.

## Setup

```bash
cd landing
npm install
npm run dev
```

## Deployment Architecture

This landing page is designed to be deployed **separately** from the main Next.js app:

| Domain | Content |
|---|---|
| `parchi.ai` (or `domain.com`) | This landing page |
| `app.parchi.ai` (or `app.domain.com`) | The Next.js dashboard/app |

### Why separate domains?

- **Cookie isolation**: Doctors who bookmark `app.parchi.ai` will have their login cookies saved specifically for the app subdomain, separate from the landing page.
- **Independent deployments**: Update the landing page without affecting the app.
- **Better SEO**: The landing page can be a fast, static site optimized for marketing.

## Configuration

### Environment Variables

Create a `.env` file (or `.env.local`) with:

```env
# The URL of the main Parchi app (dashboard)
# In production: https://app.parchi.ai
VITE_APP_URL=https://app.parchi.ai
```

If `VITE_APP_URL` is not set, login links will fall back to relative paths (`/login`), which is useful during local development.

## Build

```bash
npm run build
```

The built static site will be in `dist/`.

## Tech Stack

- **Vite** — Fast build tool
- **React 18** — UI framework
- **Tailwind CSS v3** — Utility-first styling
- **Framer Motion** — Animations
- **Lucide React** — Icons
- **shadcn/ui** — Pre-built components
