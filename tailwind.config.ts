// Import necessary types from Tailwind CSS
import type { Config } from "tailwindcss";

// Define your Tailwind CSS configuration
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'green': 'var(--green)',
        'primary-100': 'var(--color-primary-100)',
        'primary-200': 'var(--color-primary-200)',
        'primary-300': 'var(--color-primary-300)',
        'primary-400': 'var(--color-primary-400)',
        'primary-500': 'var(--color-primary-500)',
        'primary-600': 'var(--color-primary-600)',
        'mixed-100': 'var(--color-surface-mixed-100)',
        'mixed-200': 'var(--color-surface-mixed-200)',
        'mixed-300': 'var(--color-surface-mixed-300)',
        'mixed-400': 'var(--color-surface-mixed-400)',
        'mixed-500': 'var(--color-surface-mixed-500)',
        'mixed-600': 'var(--color-surface-mixed-600)',
      },
      fontSize: {
        'heading1': 'var(--fs-heading1)',
        'heading2': 'var(--fs-heading2)',
        'heading3': 'var(--fs-heading3)',
        'heading4': 'var(--fs-heading4)',
        'heading5': 'var(--fs-heading5)',
        'heading6': 'var(--fs-heading6)',
        'body': 'var(--fs-body)',
        'small': 'var(--fs-small)',
        'vsmall': 'var(--fs-vsmall)',
      },
      height: {
        'screen-60': '60vh',
      },
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(200px, 1fr))',
      },
    },
  },
  plugins: [
    
  ],
};

// Export the Tailwind CSS configuration
export default config;
