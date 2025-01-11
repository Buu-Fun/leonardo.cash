// tailwind.config.js
import { nextui } from '@nextui-org/theme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // ...
    // make sure it's pointing to the ROOT node_module
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [
    nextui({
      layout: {
        disabledOpacity: '0.3', // opacity-[0.3]
        radius: {
          small: '0px', // rounded-small
          medium: '0px', // rounded-medium
          large: '0px', // rounded-large
        },
        borderWidth: {
          small: '1px', // border-small
          medium: '1px', // border-medium
          large: '2px', // border-large
        },
      },
      themes: {
        light: {
          colors: {
            default: '#000000',
            primary: '#803BF1',
          },
        },
        dark: {
          colors: {
            default: '#000000',
            primary: '#803BF1',
          },
        },
      },
    }),
  ],
};
