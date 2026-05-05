/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "54px",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        gray: {
          50: "#F9FAFB",
          100: "#F2F4F7",
          200: "#EAECF0",
          300: "#D0D5DD",
          400: "#98A2B3",
          500: "#667085",
          600: "#475467",
          700: "#344054",
          800: "#1D2939",
          900: "#101828",
        },
        indigo: {
          50: "#EFF0FD",
          300: "#A2A4F6",
          600: "#343DE5",
        },
        rose: {
          400: "#FD6F8E",
        },
        primary200: "#B2CCFF",
        lime: {
          DEFAULT: "#D6FF3A",
          dark: "#5A7A0F",
        },
        magenta: {
          DEFAULT: "#FF3EB5",
          dark: "#6E1D5E",
        },
        ink: {
          DEFAULT: "#0A0A0A",
          dim: "#9B988F",
          faint: "#3A382F",
        },
        cream: "#F5F3EE",
        border: "#EAECF0",
        input: "#EAECF0",
        ring: "#343DE5",
        background: "#FFFFFF",
        foreground: "#101828",
        primary: {
          DEFAULT: "#343DE5",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F2F4F7",
          foreground: "#101828",
        },
        destructive: {
          DEFAULT: "#F04438",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F2F4F7",
          foreground: "#667085",
        },
        accent: {
          DEFAULT: "#F2F4F7",
          foreground: "#101828",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#101828",
        },
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
      boxShadow: {
        xs: "0px 1px 2px 0px rgba(16,24,40,0.05)",
        sm: "0px 1px 3px 0px rgba(16,24,40,0.10), 0px 1px 2px 0px rgba(16,24,40,0.06)",
        md: "0px 4px 8px -2px rgba(16,24,40,0.10), 0px 2px 4px -2px rgba(16,24,40,0.06)",
        lg: "0px 12px 16px -4px rgba(16,24,40,0.08), 0px 4px 6px -2px rgba(16,24,40,0.03)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
