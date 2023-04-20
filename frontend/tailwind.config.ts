import type { Config } from "tailwindcss";

export default {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "100" },
                },
            },
            animation: {
                fadeIn: "fadeIn 1s ease-in-out",
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
} satisfies Config;
