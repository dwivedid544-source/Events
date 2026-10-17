---
name: Heritage Field & Forest
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#434843'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#737973'
  outline-variant: '#c3c8c1'
  surface-tint: '#4d6453'
  primary: '#061b0e'
  on-primary: '#ffffff'
  primary-container: '#1b3022'
  on-primary-container: '#819986'
  inverse-primary: '#b4cdb8'
  secondary: '#78582f'
  on-secondary: '#ffffff'
  secondary-container: '#fed39f'
  on-secondary-container: '#795930'
  tertiary: '#091a0f'
  on-tertiary: '#ffffff'
  tertiary-container: '#1d2f22'
  on-tertiary-container: '#839886'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d0e9d4'
  primary-fixed-dim: '#b4cdb8'
  on-primary-fixed: '#0b2013'
  on-primary-fixed-variant: '#364c3c'
  secondary-fixed: '#ffddb7'
  secondary-fixed-dim: '#eabf8d'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#5e411a'
  tertiary-fixed: '#d3e8d5'
  tertiary-fixed-dim: '#b7ccb9'
  on-tertiary-fixed: '#0e1f13'
  on-tertiary-fixed-variant: '#394b3d'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style
The design system is built upon a foundation of institutional trust, outdoor heritage, and professional precision. It targets an audience that values the outdoors but requires the administrative rigor of a nationwide organization.

The aesthetic follows a **Corporate / Modern** approach with a refined **Tactile** edge. It avoids digital-first trends like glassmorphism or neon in favor of high-legibility, structural stability, and a palette inspired by nature. The emotional response should be one of "quiet confidence"—reliable, established, and easy to navigate under varying field conditions.

The visual signature is defined by:
- **Substantiality:** Deep, solid color blocks and intentional whitespace.
- **Precision:** Sharp alignment and clear information architecture.
- **Warmth:** An off-white foundation that reduces eye strain and feels more organic than pure digital white.

## Colors
The palette is deeply rooted in the natural environment while maintaining the high contrast necessary for administrative tasks.

- **Primary (#1B3022):** "Deep Forest Green." Used for primary actions, navigation headers, and brand-defining moments.
- **Secondary (#C19A6B):** "Highland Tan." An earthy accent used for highlights, progress indicators, or subtle calls to action that require warmth without the aggression of red or orange.
- **Neutral (#2D2D2D):** "Dark Charcoal." Used for primary text to ensure maximum readability against the off-white background.
- **Background (#F9F8F4):** A warm off-white that provides a premium, "paper-like" feel, distinguishing the platform from generic SaaS products.
- **Success/Warning/Error:** Use traditionally muted tones (e.g., Sage for success, Burnt Sienna for error) to maintain the "Heritage" aesthetic.

## Typography
This design system utilizes **Inter** for its exceptional clarity and professional neutrality. The hierarchy is "top-heavy," using bold weights for headlines to convey authority.

- **Headlines:** Should always use the Bold (700) or SemiBold (600) weights. For administrative headers, use `label-md` with uppercase styling to categorize sections.
- **Body Text:** Primarily uses `body-md` for high-density information. `body-lg` is reserved for introductory paragraphs or marketing copy.
- **Readability:** Maintain a line length of 60-80 characters for long-form text. Ensure high contrast (Charcoal on Off-White) at all times.

## Layout & Spacing
The layout follows a **Fluid Grid** model with strict margin constraints to maintain a premium "magazine-like" feel on larger screens.

- **Grid:** Use a 12-column grid for desktop. On mobile, transition to a single-column layout with 16px side margins.
- **Rhythm:** Spacing follows an 8px base unit. Use `lg` (48px) spacing between major sections and `md` (24px) for internal component spacing.
- **Density:** Dashboard views should maintain "Comfortable" density. Do not crowd data; use whitespace to separate administrative modules.

## Elevation & Depth
Elevation is communicated through **Tonal Layers** and subtle, realistic shadows. The goal is to make the UI feel like physical stationery or high-end equipment.

- **Surfaces:** The primary background is `background_hex`. Information "cards" use `surface_hex` (Pure White).
- **Shadows:** Use a single, soft "Ambient Shadow" for floating elements like cards and modals: `0px 4px 20px rgba(27, 48, 34, 0.08)`. Note the subtle Green tint in the shadow to maintain color harmony.
- **Borders:** Use low-contrast 1px outlines (`#E5E5E1`) for input fields and static containers to define boundaries without adding visual weight.

## Shapes
The shape language is **Soft**. It avoids the aggressive sharpness of pure brutalism while rejecting the "bubbly" feel of consumer social apps.

- **Standard Elements:** Buttons, input fields, and small cards use a 0.25rem (4px) corner radius.
- **Large Elements:** Featured cards or dashboard panels use 0.5rem (8px).
- **Icons:** Should be linear, 2px stroke width, with slightly rounded terminal ends to match the UI.

## Components
Consistent application of these components ensures the platform feels like a cohesive professional tool.

- **Buttons:**
    - *Primary:* Solid Forest Green (#1B3022) with White text. No gradient. 4px border-radius.
    - *Secondary:* Transparent background with Forest Green border and text.
    - *Tertiary:* Highland Tan (#C19A6B) text, no border, used for less critical actions.
- **Input Fields:** Pure white background, 1px border (#E5E5E1). On focus, the border shifts to Forest Green with a 2px outer glow of Highland Tan at 20% opacity.
- **Cards:** White background, 1px border, and the "Ambient Shadow" defined in Elevation. Headers within cards should have a subtle bottom border.
- **Chips/Badges:** Use Highland Tan with 10% opacity for backgrounds and the solid Tan for text to indicate status or categories (e.g., "Active License").
- **Lists:** High-density data lists should use alternating row subtle tints or 1px dividers. Header rows should be `label-md` uppercase.
- **Additional Components:**
    - *Status Indicators:* Small circular pips for real-time status (e.g., "Season Open").
    - *Data Visualization:* Graphs should utilize the primary green and secondary tan palette, avoiding typical "bright" chart colors.