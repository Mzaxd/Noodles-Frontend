<script setup>
import LogDetailDialog from "@/views/auditLog/LogDetailDialog.vue";
import axios from "@axios";
import { avatarText } from "@core/utils/formatters";
import qs from "qs";
import { formatDateToMonthShort } from "@core/utils/formatters";
import TerminalCore from '@/views/terminal/TerminalCore.vue'
import AuditCountCardStatisticsVertical from '@/views/dashboards/analytics/AuditCountCardStatisticsVertical.vue'
import { onBeforeMount } from "@vue/runtime-core";

const route = useRoute();
const sshId = ref(route.params.sshId)

const count = ref();
const currentTab = ref(0);
const isLogDetailDialogVisible = ref(false);
const isDialogVisible = ref(false);
const rowPerPage = ref(10);
const currentPage = ref(1);
const totalPage = ref(1);
const total = ref(0);
const notifications = ref([]);
const selectedRows = ref([]);

const snackBarlocation = ref("top");
const isSnackbarVisible = ref(false);
const snackBarColor = ref();
const msg = ref("");
const instance = ref()

const rendererType = ref("");
const fontSize = ref();
const cursorBlink = ref();
const foreground = ref("");
const background = ref("");

onBeforeMount(() => {
  axios.get("/sshLink/getInstanceInfo/" + sshId.value).then((r) => {
    instance.value = r.data
  });
  axios.get("/setting/terminal").then((r) => {
    rendererType.value = r.data.rendererType
    fontSize.value = r.data.fontSize
    foreground.value = r.data.foreground
    background.value = r.data.background
    cursorBlink.value = r.data.cursorBlink == 1 ? true : false
  });
})

</script>

<template>
  <section>
    <VCard title="控制台" v-if="instance" id="server-list">
      <VDivider />
      <VRow>
        <VCol cols="3" sm="2">
          <VCardText class="text-center pt-15">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            :size="120"
            color="primary"
            variant="tonal"
          >
            <VImg
              v-if="instance.avatar"
              :src="instance.avatar"
            />
            <span
              v-else
            >
              {{ instance.name }}
            </span>  
          </VAvatar>

          <!-- 👉 User fullName -->
          <h6 class="text-h6 mt-4">
            {{ instance.name }}
          </h6>

          <!-- 👉 Role chip -->
          <VChip
            label
            size="small"
            class="text-capitalize mt-4"
          >
            {{ instance.description }}
          </VChip>
        </VCardText>
        </VCol>
        <VDivider vertical />
        <VCol cols="9" sm="10">
          <!-- SECTION Table -->
          <TerminalCore
            v-model:rendererType="rendererType"
            v-model:fontSize="fontSize"
            v-model:foreground="foreground"
            v-model:background="background"
            v-model:cursorBlink="cursorBlink"
          />
          <!-- !SECTION -->
        </VCol>
      </VRow>
    </VCard>
    <VSnackbar
      v-model="isSnackbarVisible"
      :color="snackBarColor"
      :location="snackBarlocation"
      :timeout="3000"
    >
      {{ msg }}
    </VSnackbar>
  </section>
</template>

<style lang="scss">
#server-list {
  .server-list-actions {
    inline-size: 8rem;
  }

  .server-list-filter {
    inline-size: 12rem;
  }
}
</style>
