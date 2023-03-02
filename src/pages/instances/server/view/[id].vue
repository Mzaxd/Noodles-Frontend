<script setup>
import axios from "@axios";
import HostBioPanel from "@/views/instances/server/HostPanel.vue";
import HostTabVm from "@/views/instances/server/HostTabVm.vue";
import HostTabContainer from "@/views/instances/server/HostTabContainer.vue";
import HostTabDisk from "@/views/instances/server/HostTabDisk.vue";
import HostTabNet from "@/views/instances/server/HostTabNet.vue";
import HostStatisticsTransactions from "@/views/instances/server/HostStatisticsTransactions.vue";

const route = useRoute();
const hostId = ref(route.params.id);
const host = ref();
const hostDetail = ref();
const hostTab = ref(null);


const tabs = [
  {
    icon: "tabler-server",
    title: "关联虚拟机",
  },
  {
    icon: "tabler-brand-docker",
    title: "关联容器",
  },
  {
    icon: "tabler-truck",
    title: "硬盘信息",
  },
  {
    icon: "tabler-world",
    title: "网络信息",
  },
];

const fetchHostById = () => {
  axios
    .get("/host/hostDetail/" + hostId.value)
    .then((response) => {
      host.value = response.data.host;
      hostDetail.value = response.data.hostDetail;
    })
    .catch((error) => {
      console.error(error);
    });
};

watch(route, fetchHostById, { immediate: true });
</script>

<template>
  <VRow v-if="host">
    <VCol cols="12" md="5" lg="4">
      <HostBioPanel :host="host" :host-detail="hostDetail" />
    </VCol>

    <VCol cols="12" md="7" lg="8">
      <HostStatisticsTransactions />

      <VWindow v-model="hostTab" class="mt-6 disable-tab-transition" :touch="false">
        <VTabs v-model="hostTab" class="v-tabs-pill">
          <VTab v-for="tab in tabs" :key="tab.icon">
            <VIcon :size="18" :icon="tab.icon" class="me-1" />
            <span>{{ tab.title }}</span>
          </VTab>
        </VTabs>
      </VWindow>

      <VWindow v-model="hostTab" class="mt-6 disable-tab-transition" :touch="false">
        <VWindowItem>
          <HostTabVm />
        </VWindowItem>

        <VWindowItem>
          <HostTabContainer />
        </VWindowItem>

        <VWindowItem>
          <HostTabDisk />
        </VWindowItem>

        <VWindowItem>
          <HostTabNet />
        </VWindowItem>

      </VWindow>

    </VCol>

  </VRow>
</template>

<route lang="yaml">
  meta:
    navActiveLink: instances-server-view-id
</route>
