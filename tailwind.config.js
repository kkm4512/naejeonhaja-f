/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    // 티어별 테두리 색상 클래스
    "border-gray-200",
    "border-gray-400",
    "border-yellow-600",
    "border-yellow-300",
    "border-green-300",
    "border-teal-300",
    "border-blue-300",
    "border-purple-400",
    "border-red-400",
    "border-blue-400",
    'bg-yellow-300', 
    'text-yellow-800', 
    'bg-gray-300', 
    'text-gray-800', 
    'bg-gray-200', 
    'text-gray-700',
    'top-0',
    '-top-4',
    'left-1/2',
    'transform',
    '-translate-x-1/2',
    '-translate-y-1/2',
    "bg-opacity-50",
    "bg-black",
  ],
}
