import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'

export default defineNuxtPlugin(() => {
  Chart.register(CategoryScale, Filler, LinearScale, Title, Tooltip, Legend, PointElement, LineElement)
})
