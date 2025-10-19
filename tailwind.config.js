const { light, dark } = require("@charcoal-ui/theme");
/**
 * @type {import('tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  darkMode: true,
  content: ["./src/**/*.tsx", "./src/**/*.html"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        "primary-hover": "#3B82F6",
        "primary-press": "#1D4ED8",
        "primary-disabled": "#2563EB4D",
        secondary: "#10B981",
        "secondary-hover": "#34D399",
        "secondary-press": "#059669",
        "secondary-disabled": "#10B9814D",
        accent: "#8B5CF6",
        "accent-hover": "#A78BFA",
        "accent-press": "#7C3AED",
        base: "#F3F4F6",
        "text-primary": "#1F2937",
        "text-secondary": "#6B7280",
      },
      fontFamily: {
        M_PLUS_2: ["Montserrat", "M_PLUS_2", "sans-serif"],
        Montserrat: ["Montserrat", "sans-serif"],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
