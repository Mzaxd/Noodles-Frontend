<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import axios from "@axios";

const vuetifyTheme = useTheme()
const currentTheme = vuetifyTheme.current.value.colors
const stats = ref()

const series = [{
  data: [],
}]

const fetchAuditCount = () => {
  axios.get('/dashboard/getAuditLogCountYesterday').then(r => {
    stats.value = '昨日：' + r.data[6] + ' 次'
    series[0].data = r.data
  })
}

watchEffect(fetchAuditCount);

const statisticsVertical = {
  title: '近7日面板使用频率趋势',
  color: 'success',
  icon: 'tabler-book',
  stats: '昨日: 5 次',
  height: 120,
  series: [{
    data: [
      12,
      12,
      12,
      45,
      45,
      65,
      76,
    ],
  }],
  chartOptions: {
    chart: {
      height: 110,
      type: 'area',
      parentHeightOffset: 0,
      toolbar: { show: false },
      sparkline: { enabled: true },
    },
    tooltip: { enabled: false },
    markers: {
      colors: 'transparent',
      strokeColors: 'transparent',
    },
    grid: { show: false },
    colors: [currentTheme.success],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0.8,
        opacityFrom: 0.6,
        opacityTo: 0.1,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      width: 2,
      curve: 'smooth',
    },
    xaxis: {
      show: true,
      lines: { show: false },
      labels: { show: false },
      stroke: { width: 0 },
      axisBorder: { show: false },
    },
    yaxis: {
      stroke: { width: 0 },
      show: false,
    },
  },
}
</script>

<template>
  <VCard>
    <VCardText class="d-flex flex-column pb-0">
      <VAvatar v-if="statisticsVertical.icon" size="42" variant="tonal" :color="statisticsVertical.color"
        :icon="statisticsVertical.icon" />

      <h6 class="text-h6 mt-3 mb-1">
        {{ stats }}
      </h6>
      <span class="text-sm">{{ statisticsVertical.title }}</span>
    </VCardText>

    <VueApexCharts :series="series" :options="statisticsVertical.chartOptions" :height="statisticsVertical.height" />
  </VCard>
</template>
