# Design System Specification: The Clinical Precision Framework

## 1. Overview & Creative North Star: "The Digital Surgeon"
This design system moves away from the "generic SaaS dashboard" and towards a high-fidelity, medical-grade interface. The Creative North Star is **"The Digital Surgeon"**: an aesthetic defined by extreme precision, tonal depth, and a high-density information architecture that feels calm under pressure.

To break the "template" look, we employ **Intentional Asymmetry**. Rather than a rigid, centered grid, we use a weighted layout where primary data streams are anchored to the left, while contextual "observer" panels float on the right. We prioritize "Breathing Density"—stacking massive amounts of data using sophisticated typographic scales to ensure the UI feels professional and clinical, never cluttered.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
The palette is rooted in deep obsidian tones, utilizing the primary green as a surgical laser—precise, meaningful, and sparingly used to denote life and stability.

### Surface Hierarchy & Nesting
We do not use borders to define space. We use **Tonal Layering**.
- **Base Layer:** `surface` (#131313) is the operating table.
- **Sectioning:** Use `surface_container_low` (#1c1b1b) for large structural areas (like a sidebar or a secondary feed).
- **Primary Data Containers:** Use `surface_container` (#201f1f) for main dashboard cards.
- **Floating Actions:** Use `surface_container_highest` (#353534) for modals or pop-overs.

### Rules of Engagement
*   **The "No-Line" Rule:** Prohibit 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. A `surface_container_low` card sitting on a `surface` background creates a natural, sophisticated edge.
*   **The "Glass & Gradient" Rule:** For high-level summaries (e.g., Patient Vitals), use a `surface_variant` with a 12px `backdrop-blur`. Apply a subtle linear gradient (from `primary` at 10% opacity to `surface` at 0%) to give the container a "soul" and medical-grade polish.
*   **Signature Textures:** For primary CTAs or critical status bars, use a gradient transition from `primary` (#4be277) to `primary_container` (#22c55e). This adds a "vibrant life" quality to the green that flat hex codes lack.

---

## 3. Typography: The Editorial Scale
We use a dual-font strategy to balance human readability with technical authority. **Manrope** provides a modern, geometric headline feel, while **Inter** ensures data legibility at small sizes.

*   **Display & Headlines (Manrope):** High-contrast sizing. `display-lg` (3.5rem) is reserved for critical KPIs (e.g., Heart Rate). This creates an "Editorial" look that breaks the standard dashboard monotony.
*   **Titles & Body (Inter):** Used for clinical notes and data labels. The `title-sm` (1rem) is the workhorse for card headers.
*   **Labels (Inter):** `label-sm` (0.6875rem) in `on_surface_variant` is essential for "Metadata Density"—use this for timestamps and secondary units.

---

## 4. Elevation & Depth: Tonal Layering
In a clinical environment, shadows can feel "muddy." We achieve lift through light, not shadow.

*   **The Layering Principle:** Depth is achieved by stacking. Place a `surface_container_highest` element over a `surface_container` to indicate it is "closer" to the user.
*   **Ambient Shadows:** If a floating element (like a context menu) requires a shadow, use a blur of `24px` with a 4% opacity of `#000000`. It should be felt, not seen.
*   **The "Ghost Border" Fallback:** For high-density data tables where boundaries are required for eye-tracking, use the `outline_variant` token at **15% opacity**. This creates a "Ghost Border" that provides structure without breaking the tonal flow.
*   **Glassmorphism:** Use `surface_container_low` with a 60% opacity and a `backdrop-filter: blur(8px)` for side navigation. This allows the dashboard data to subtly bleed through, maintaining a sense of spatial awareness.

---

## 5. Components: Clinical Primitives

### Buttons & Interaction
*   **Primary:** A solid `primary_container` fill. Use `on_primary_container` for text. Border radius is fixed at `md` (0.375rem) for a technical look.
*   **Secondary:** No fill. A "Ghost Border" (`outline_variant` at 20%) with `primary` text.
*   **Action Chips:** Used for "Patient Status" (e.g., *Stable*, *Critical*). Use `surface_container_high` as the base. No borders. Use a 4px `primary` dot (Lucide `Circle` icon) to indicate status.

### Data Inputs & Fields
*   **Text Inputs:** Use `surface_container_lowest`. Forgo the bottom line or full border. Use a subtle 2px left-accent bar of `primary` only when the field is focused.
*   **Lucide Icons:** Use a consistent `1.25pt` stroke weight. Icons in navigation should be `on_surface_variant`, shifting to `primary` only when active.

### Cards & Lists
*   **The Divider Forbiddance:** Never use `<hr>` or border-bottom to separate list items. Use **Vertical White Space** (16px) or a alternating tonal shift (`surface` to `surface_container_low`).
*   **Medical Sparklines:** Embed small, monochromatic line charts within list items using the `primary` color with a 10% area fill.

---

## 6. Do’s and Don’ts

### Do
*   **Do** embrace high density. Healthcare professionals need to see more data at once, not less.
*   **Do** use `tertiary` (#ffba61) for "Warning" states instead of just red. It provides a more nuanced clinical warning level.
*   **Do** use asymmetrical layouts (e.g., a 2-column grid where the left is 70% and the right is 30%).

### Don’t
*   **Don’t** use pure white (#ffffff). It causes eye strain in dark-themed clinical environments. Always use `on_surface` (#e5e2e1).
*   **Don’t** use large border-radii. Anything above `xl` (0.75rem) starts to look "bubbly" and consumer-grade. Stick to `sm` and `md`.
*   **Don’t** use heavy dropshadows. They look "dirty" against the #0c0c0c background. Use background color shifts instead.