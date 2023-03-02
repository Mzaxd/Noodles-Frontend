<script setup>
import { useTheme } from 'vuetify'
import RealTimeInstanceAnalytics from '@/views/dashboards/analytics/RealTimeInstanceAnalytics.vue'
import OfflineInstanceServir from '@/views/dashboards/analytics/OfflineInstanceServir.vue'
import RecentConsole from '@/views/dashboards/analytics/RecentConsole.vue'
import AnalyticsJvmOverview from '@/views/dashboards/analytics/AnalyticsJvmOverview.vue'
import AnalyticsClusterMemoryState from '@/views/dashboards/analytics/AnalyticsClusterMemoryState.vue'
import InstanceHistoryAnalytics from '@/views/dashboards/analytics/InstanceHistoryAnalytics.vue'
import AuditCountCardStatisticsVertical from '@/views/dashboards/analytics/AuditCountCardStatisticsVertical.vue'
import { onBeforeMount } from '@vue/runtime-core'

const vuetifyTheme = useTheme()
const currentTheme = vuetifyTheme.current.value.colors

</script>

<template>
  <VRow class="match-height">
    <!-- 👉 Website analytics -->
    <VCol
      cols="12"
      md="6"
    >
      <InstanceHistoryAnalytics />
    </VCol>

    <!-- 👉 Sales Overview -->
    <VCol
      cols="12"
      md="3"
      sm="6"
    >
      <AnalyticsJvmOverview />
    </VCol>

    <!-- 👉 Statistics Vertical -->
    <VCol
      cols="12"
      md="3"
      sm="6"
    >
      <AuditCountCardStatisticsVertical />
    </VCol>

    <!-- 👉 Earning Reports Weekly Overview -->
    <VCol
      cols="12"
      md="6"
    >
      <RealTimeInstanceAnalytics />
    </VCol>

    <!-- 👉 Support Tracker -->
    <VCol
      cols="12"
      md="6"
    >
      <AnalyticsClusterMemoryState />
    </VCol>

    <!-- 👉 Sales by Countries -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <RecentConsole />
    </VCol>

    <!-- 👉 Project Table -->
    <VCol
      cols="12"
      lg="8"
    >
      <OfflineInstanceServir />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
