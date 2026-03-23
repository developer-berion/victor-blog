# MUI Design System

This document defines the admin-facing MUI system for the Victor Garcia blog/CMS.

## Scope

- Applies to the admin surface only.
- The public site keeps its editorial CSS system.
- Use MUI components as the source of truth for admin surfaces, forms, lists, dialogs, and feedback.
- Load the admin UI without CSS layer isolation so global site CSS cannot override MUI component behavior.

## Design Goals

- Calm, operational, and easy to scan.
- One primary action per screen.
- Clear spacing, clear labels, clear hierarchy.
- Prefer robust defaults over one-off styling.

## Foundation

- Spacing scale: 8px base.
- Radius scale: 12px for controls, 16px for cards and dialogs, 20px for elevated panels.
- Surfaces: default background, paper, outlined, elevated.
- Motion: subtle fade and lift only; no decorative motion loops.
- Density: comfortable by default, not cramped.

## Typography

- Headings use the heading font variable.
- Body copy uses the body font variable.
- Use compact admin typography:
  - `h1`/`h2` for page titles
  - `h5`/`h6` for login and small panels
  - `body2` for support text
  - `caption` for low-priority notes
- Keep titles short; avoid hero-style marketing copy in admin surfaces.

## Color Roles

- Primary: dark slate for actions and strong emphasis.
- Secondary: blue for supporting accents and links.
- Background: warm neutral to keep the admin calm.
- Text: high contrast primary and muted secondary.
- Feedback: semantic colors for success, info, warning, and error.

## Component Rules

### Buttons

- Primary action uses contained primary.
- Secondary action uses outlined or text.
- Minimum height: 44px.
- No custom button colors unless the theme owns them.

### Text Fields

- Use `FormControl` or `TextField` with explicit labels.
- Full width by default.
- Prefer layout spacing from `Stack` or `Box` over default field margins.
- Use `TextField` for simple forms and `FormControl` only when the control composition needs it.
- Helper text must sit below the field and should explain the task or error state.
- Keep the field height consistent and accessible.

### Form Rhythm

- One vertical spacing system per screen.
- If the parent uses `Stack spacing`, keep field margins at `none`.
- Do not mix large container padding with dense inner margins without a reason.
- A login screen should usually be: badge, title, short explanation, one field, one action, one note.

### Papers and Panels

- Use `Paper` for admin shells and cards.
- Avoid heavy shadows unless the surface is clearly elevated.
- Let padding do the work before decoration does.

### Alerts and Feedback

- Use `Alert` for blocking issues.
- Use `Snackbar` for lightweight confirmation.
- Keep feedback readable and short.

### Tables and Lists

- Use simple density first.
- Keep action columns aligned and predictable.
- Use dialogs for destructive actions.

## Page Patterns

### Login

- Centered card.
- Short title.
- One field, one action, one small helper note.
- Use `Fade` or another subtle entry animation.

### Editor

- Split layout with clear working area and preview area.
- Keep action buttons near the top or bottom of the work zone.

### Listing

- Header with primary CTA.
- Table or list with predictable row actions.

## Anti-Patterns

- Oversized titles on admin pages.
- Multiple competing CTAs.
- Unstructured padding.
- Custom colors on each component.
- Copy that reads like a landing page instead of a tool.

## MCP

- The repo installs `@mui/mcp` as a dev dependency.
- Run the server locally with `npm run mui:mcp`.
- Use it from a compatible client/editor for MUI-aware assistance.
