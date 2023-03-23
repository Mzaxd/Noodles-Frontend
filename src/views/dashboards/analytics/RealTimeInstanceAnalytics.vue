<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils'
import { ref } from "vue"
import axios from "@axios"

const vuetifyTheme = useTheme()

const servirCount = ref()
const hostCount = ref()
const hostOnlineCount = ref()
const vmCount = ref()
const vmOnlineCount = ref()
const containerCount = ref()
const containerOnlineCount = ref()

const dayOne = ref();
const dayTwo = ref();
const dayThree = ref();
const dayFour = ref();
const dayFive = ref();
const daySix = ref();


const panelReports = ref([
  {
    color: 'primary',
    icon: 'tabler-server',
    title: '物理机',
    amount: '',
    progress: '0',
  },
  {
    color: 'info',
    icon: 'tabler-server',
    title: '虚拟机',
    amount: '',
    progress: '0',
  },
  {
    color: 'error',
    icon: 'tabler-brand-docker',
    title: '容器',
    amount: '',
    progress: '0',
  },
])


const fetchInstancesRealTimeData = () => {
  axios.get('/dashboard/getInstancesRealTimeData').then(r => {
    dayOne.value = r.data.servirCountList[0];
    dayTwo.value = r.data.servirCountList[1];
    dayThree.value = r.data.servirCountList[2];
    dayFour.value = r.data.servirCountList[3];
    dayFive.value = r.data.servirCountList[4];
    daySix.value = r.data.servirCountList[5];
    servirCount.value = r.data.servirCountList[6];

    hostCount.value = r.data.hostCount;
    hostOnlineCount.value = r.data.hostOnlineCount;
    vmCount.value = r.data.vmCount;
    vmOnlineCount.value = r.data.vmOnlineCount;
    containerCount.value = r.data.containerCount;
    containerOnlineCount.value = r.data.containerOnlineCount;

    panelReports.value[0].amount = hostOnlineCount.value + "/" + hostCount.value
    panelReports.value[0].progress = hostOnlineCount.value / hostCount.value * 100
    panelReports.value[1].amount = vmOnlineCount.value + "/" + vmCount.value
    panelReports.value[1].progress = vmOnlineCount.value / vmCount.value * 100
    panelReports.value[2].amount = containerOnlineCount.value + "/" + containerCount.value
    panelReports.value[2].progress = containerOnlineCount.value / containerCount.value * 100

    series[0].data = r.data.servirCountList
  })
}

watchEffect(fetchInstancesRealTimeData);

const series = [{
  data: [],
}]

const refresh = () => {
  fetchInstancesRealTimeData()
}

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables

  return {
    chart: {
      parentHeightOffset: 0,
      type: 'bar',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        barHeight: '60%',
        columnWidth: '38%',
        startingShape: 'rounded',
        endingShape: 'rounded',
        borderRadius: 4,
        distributed: true,
      },
    },
    grid: {
      show: false,
      padding: {
        top: -30,
        bottom: 0,
        left: -10,
        right: -10,
      },
    },
    colors: [
      `rgba(${hexToRgb(currentTheme.primary)},${variableTheme['pressed-opacity']})`,
      `rgba(${hexToRgb(currentTheme.primary)},${variableTheme['pressed-opacity']})`,
      `rgba(${hexToRgb(currentTheme.primary)},${variableTheme['pressed-opacity']})`,
      `rgba(${hexToRgb(currentTheme.primary)},${variableTheme['pressed-opacity']})`,
      `rgba(${hexToRgb(currentTheme.primary)},${variableTheme['pressed-opacity']})`,
      `rgba(${hexToRgb(currentTheme.primary)},${variableTheme['pressed-opacity']})`,
      currentTheme.primary,
    ],
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: {
      categories: [
        dayOne.value,
        dayTwo.value,
        dayThree.value,
        dayFour.value,
        dayFive.value,
        daySix.value,
        servirCount.value,
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: `rgba(${hexToRgb(currentTheme['on-surface'])},${variableTheme['disabled-opacity']})`,
          fontSize: '14px',
          fontFamily: 'Public Sans',
        },
      },
    },
    yaxis: { labels: { show: false } },
    tooltip: { enabled: false },
    responsive: [{
      breakpoint: 1025,
      options: { chart: { height: 199 } },
    }],
  }
})


</script>

<template>
  <VCard>
    <VCardItem class="pb-sm-0">
      <VCardTitle>面板统计</VCardTitle>
      <VCardSubtitle>服务&实例</VCardSubtitle>

      <template #append>
        <div class="mt-n4 me-n2">
          <VBtn icon color="default" size="x-small" variant="plain">
            <VIcon size="22" icon="tabler-refresh" @click="refresh()" />
          </VBtn>
        </div>
      </template>

    </VCardItem>

    <VCardText>
      <VRow>
        <VCol cols="12" sm="5" class="d-flex flex-column align-self-end">
          <div class="d-flex align-center gap-2 mb-2 pb-1 flex-wrap">
            <h4 class="text-4xl font-weight-semibold">
              {{ servirCount }}
            </h4>
          </div>

          <p class="text-sm">
            服务总数
          </p>
        </VCol>

        <VCol cols="12" sm="7" class="pt-0">
          <VueApexCharts :options="chartOptions" :series="series" height="190" />
        </VCol>
      </VRow>

      <div class="border rounded mt-3 pa-4">
        <VRow>
          <VCol v-for="report in panelReports" :key="report.title" cols="12" sm="4">
            <div class="d-flex align-center">
              <VAvatar rounded size="30" :color="report.color" variant="tonal" class="me-2">
                <VIcon :icon="report.icon" />
              </VAvatar>

              <h6 class="text-base font-weight-medium">
                {{ report.title }}
              </h6>
            </div>
            <h6 class="text-h6 my-3">
              {{ report.amount }}
            </h6>
            <VProgressLinear :model-value="report.progress" :color="report.color" height="8" rounded rounded-bar />
          </VCol>
        </VRow>
      </div>
    </VCardText>
  </VCard>
</template>
