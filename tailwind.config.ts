import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customYellow: "#f9bd05",
        customText: "#E89000",
        customGreen: "#67C17E",
        customGrey: "#747474",
        customBlue: "#0161D3",
        customRed: "#FF1515",
        customBlack: "#262626",
        customInputBackground: "#F0F3F6",
        customBackGround: "#F5F7FD",
        customBlueButton: '#247fe6',
        customYellowButton: '#f0d066',
        disableCustomGreen: "#81e9a7",
        customBorder: "#C1C1D6",
        progressBar:"#2EA6DE",
        paragraphText: "#6C6C6C",
        buttonBorder:"#707070"
      },
    },
  },
  plugins: [],
} satisfies Config;
