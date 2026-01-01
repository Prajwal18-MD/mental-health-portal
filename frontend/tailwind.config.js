// tailwind.config.js
module.exports = {
content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"] ,
theme: {
extend: {
colors: {
primary: '#4D2B8C', // Deep Purple
primaryLight: '#85409D', // Medium Purple
accent: '#EEA727', // Golden Orange
accentPale: '#FFEF5F' // Pale Yellow
},
boxShadow: {
soft: '0 6px 18px rgba(20, 20, 40, 0.08)'
},
borderRadius: {
'2xl': '1rem'
}
}
},
plugins: [],
}