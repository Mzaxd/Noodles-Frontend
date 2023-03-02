<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils'
import axios from "@axios";

const vuetifyTheme = useTheme()
const series = []
const memory = ref([]);

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables

  return {
    labels: ['总内存使用率'],
    chart: { type: 'radialBar' },
    plotOptions: {
      radialBar: {
        offsetY: 10,
        startAngle: -140,
        endAngle: 130,
        hollow: { size: '65%' },
        track: {
          background: currentTheme.surface,
          strokeWidth: '100%',
        },
        dataLabels: {
          name: {
            offsetY: -20,
            color: `rgba(${hexToRgb(currentTheme['on-background'])},${variableTheme['disabled-opacity']})`,
            fontSize: '14px',
            fontWeight: '400',
            fontFamily: 'Public Sans',
          },
          value: {
            offsetY: 10,
            color: `rgba(${hexToRgb(currentTheme['on-background'])},${variableTheme['high-emphasis-opacity']})`,
            fontSize: '38px',
            fontWeight: '600',
            fontFamily: 'Public Sans',
          },
        },
      },
    },
    colors: [currentTheme.primary],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        shadeIntensity: 0.5,
        gradientToColors: [currentTheme.primary],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 0.6,
        stops: [
          30,
          70,
          100,
        ],
      },
    },
    stroke: { dashArray: 10 },
    grid: {
      padding: {
        top: -20,
        bottom: 5,
      },
    },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } },
    },
    responsive: [{
      breakpoint: 960,
      options: { chart: { height: 280 } },
    }],
  }
})

const fetchClusterMemory = () => {
  axios.get("/dashboard/getMemInfo").then((r) => {
    memory.value = r.data;
    supportTicket.value[0].subtitle = Math.round(r.data.memoryUsedMaxRate * 100) + ' %';
    supportTicket.value[1].subtitle = Math.round(r.data.memoryFree) + " GB";
    series.push(Math.round(r.data.memoryUsedAvgRate * 100));
  });
}

watchEffect(fetchClusterMemory);

const supportTicket = ref([
  {
    avatarColor: 'error',
    avatarIcon: 'tabler-circle-check',
    title: '最高使用率',
    subtitle: 'None',
  },
  {
    avatarColor: 'success',
    avatarIcon: 'tabler-clock',
    title: '空闲内存',
    subtitle: 'None',
  },
])

const refresh = () => {
  fetchClusterMemory()
}
</script>

<template>
  <VCard title="内存监控" subtitle="所有物理机的内存状态">
    <template #append>
      <div class="mt-n4 me-n2">
        <VBtn
          icon
          color="default"
          size="x-small"
          variant="plain"
        >
          <VIcon
            size="22"
            icon="tabler-refresh"
            @click="refresh()"
          />
        </VBtn>
      </div>
    </template>
    <VCardText>
      <VRow>
        <VCol cols="12" md="5" sm="6" class="mt-auto">
          <div class="mb-4">
            <h4 class="text-4xl font-weight-semibold mb-2">
              {{ memory.memoryTotal }} GB
            </h4>
            <p class="text-sm">
              总内存资源
            </p>
          </div>

          <VList class="card-list">
            <VListItem v-for="ticket in supportTicket" :key="ticket.title">
              <VListItemTitle class="font-weight-medium">
                {{ ticket.title }}
              </VListItemTitle>
              <VListItemSubtitle class="opacity-100 text-disabled">
                {{ ticket.subtitle }}
              </VListItemSubtitle>
              <template #prepend>
                <VAvatar rounded size="34" :color="ticket.avatarColor" variant="tonal">
                  <VIcon :icon="ticket.avatarIcon" />
                </VAvatar>
              </template>
            </VListItem>
          </VList>
        </VCol>
        <VCol cols="12" md="7" sm="6">
          <VueApexCharts :options="chartOptions" :series="series" height="360" />
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 18px;
}
</style>
