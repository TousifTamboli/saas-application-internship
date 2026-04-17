/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Clinical Precision Design System — from UI reference
        "surface-container-lowest": "#0e0e0e",
        "surface-dim": "#131313",
        "surface": "#131313",
        "background": "#131313",
        "surface-container-low": "#1c1b1b",
        "surface-container": "#201f1f",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353534",
        "surface-bright": "#3a3939",
        "surface-variant": "#353534",
        "on-surface": "#e5e2e1",
        "on-background": "#e5e2e1",
        "on-surface-variant": "#bccbb9",
        "outline-variant": "#3d4a3d",
        "outline": "#869585",
        // Primary (Green)
        "primary": "#4be277",
        "primary-fixed": "#6bff8f",
        "primary-fixed-dim": "#4ae176",
        "primary-container": "#22c55e",
        "on-primary": "#003915",
        "on-primary-container": "#004b1e",
        "on-primary-fixed": "#002109",
        "on-primary-fixed-variant": "#005321",
        "inverse-primary": "#006e2f",
        "surface-tint": "#4ae176",
        // Tertiary (Amber)
        "tertiary": "#ffba61",
        "tertiary-fixed": "#ffddb8",
        "tertiary-fixed-dim": "#ffb95f",
        "tertiary-container": "#ef9900",
        "on-tertiary": "#472a00",
        "on-tertiary-container": "#5c3800",
        "on-tertiary-fixed": "#2a1700",
        "on-tertiary-fixed-variant": "#653e00",
        // Secondary
        "secondary": "#c6c5cf",
        "secondary-fixed": "#e3e1ec",
        "secondary-fixed-dim": "#c6c5cf",
        "secondary-container": "#4a4b53",
        "on-secondary": "#2f3038",
        "on-secondary-container": "#bcbbc5",
        "on-secondary-fixed": "#1a1b22",
        "on-secondary-fixed-variant": "#46464e",
        // Error
        "error": "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        "on-error-container": "#ffdad6",
        // Inverse
        "inverse-surface": "#e5e2e1",
        "inverse-on-surface": "#313030",
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
};
