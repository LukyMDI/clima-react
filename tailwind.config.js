/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            screens: {
                ldxs: { raw: "(max-height: 530px)" },
            },
        },
        screens: {
            xs: "475px",
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px",
            "3xl": "1750px",
            "4xl": "1936px",
            "5xl": "2280px",
        },
    },
    plugins: [],
};
