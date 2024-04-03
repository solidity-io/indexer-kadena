<script setup lang="ts">
import { Line } from 'vue-chartjs'

const chartData = ref({
  labels: ['Feb 14', 'Feb 21', 'Feb 28', 'Mar 06', 'Mar 13'],
    datasets: [{
      label: 'Ethereum Price',
      data: [348, 352, 345, 360, 355],
      borderColor: '#00F5AB', // Cor da linha
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 0,
      fill: {
        target: 'origin',
        above: 'rgba(0, 245, 171, 0.2)', // Cor do preenchimento acima (0, 245, 171) com opacidade de 100%
        below: 'rgba(0, 245, 171, 0.1)'
      }
    }]
})
const chartOptions = ref({
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },

    y: {
      ticks: {
        stepSize: 5 // Define o intervalo entre os ticks
    },
      min: 340, // Define o valor mínimo para o eixo y
      grid: {
        display: false
      }
    }
  }
})
</script>

<template>
  <div
    class="w-full h-full"
  >
    <Line
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>
