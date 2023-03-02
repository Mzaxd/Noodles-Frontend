<script setup>
import LogDetailDialog from "@/views/auditLog/LogDetailDialog.vue";
import axios from "@axios";
import { avatarText } from "@core/utils/formatters";
import qs from "qs";

const isLogDetailDialogVisible = ref(false);
const isDialogVisible = ref(false);
const logId = ref();
const rowPerPage = ref(50);
const currentPage = ref(1);
const totalPage = ref(1);
const total = ref(0);
const logs = ref([]);
const selectedRows = ref([]);

const snackBarlocation = ref("top");
const isSnackbarVisible = ref(false);
const snackBarColor = ref();
const msg = ref("");

const Message = (r) => {
  if (r.code == 200) {
    snackBarColor.value = "success";
    msg.value = 'o(^▽^)o ' + r.msg
  } else {
    snackBarColor.value =  "error";
    msg.value = '╥﹏╥... ' + r.msg;
  }
  isSnackbarVisible.value = true;
};

// 👉 Fetching logs
const fetchLogs = () => {
  //拼接url
  const url =
    "/auditLog/logList?" +
    qs.stringify(
      {
        perPage: rowPerPage.value,
        currentPage: currentPage.value,
      },
      { arrayFormat: "repeat" }
    );

  axios
    .get(url)
    .then((response) => {
      logs.value = response.data.list;
      totalPage.value = response.data.pages;
      total.value = response.data.total;
    })
    .catch((error) => {
      console.error(error);
    });
};

const resolveLogVariant = (operation) => {
  if (operation.includes("删除"))
    return {
      color: "error",
      icon: "tabler-trash",
    };
  if (operation.includes("新增"))
    return {
      color: "success",
      icon: "tabler-layout-grid-add",
    };
  if (operation.includes("修改"))
    return {
      color: "info",
      icon: "tabler-pencil",
    };
  if (operation.includes("用户"))
    return {
      color: "primary",
      icon: "tabler-user",
    };
  if (operation.includes("提醒"))
    return {
      color: "warning",
      icon: "tabler-bell-ringing",
    };
  return {
    color: "primary",
    icon: "tabler-settings",
  };
};

// 👉 Fetch Invoices
watchEffect(fetchLogs);

// 👉 Fetch Invoices
watchEffect(() => {
  if (currentPage.value > totalPage.value) {
    currentPage.value = totalPage.value;
  }
});

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = logs.value.length
    ? (currentPage.value - 1) * rowPerPage.value + 1
    : 0;
  const lastIndex =
    logs.value.length + (currentPage.value - 1) * rowPerPage.value;

  return `Showing ${firstIndex} to ${lastIndex} of ${total.value} entries`;
});
</script>

<template>
  <section>
    <VCard title="操作记录" v-if="logs" id="server-list">
      <VDivider />

      <!-- SECTION Table -->
      <VTable class="text-no-wrap server-list-table">
        <thead>
          <tr>
            <th scope="col">用户</th>
            <th scope="col">事件</th>
            <th class="text-center" scope="col"></th>
          </tr>
        </thead>
        <!-- 👉 table body -->
        <tbody>
          <tr v-for="log in logs" :key="log.id" style="height: 3.75rem">
            <!-- 👉 Name -->
            <td>
              <div class="d-flex align-center">
                <VBadge dot bordered color="success" location="bottom end" :offset-x="13" :offset-y="0">
                  <VAvatar variant="tonal" class="me-3" size="35">
                    <VImg v-if="log.user.avatar" :src="log.user.avatar" />
                  </VAvatar>
                </VBadge>
                <div class="d-flex flex-column">
                  <h6 class="text-base">
                    {{ log.user.userName }}
                  </h6>
                </div>
              </div>
            </td>

            <!-- 👉 Description -->
            <td>
              <div class="d-flex flex-column">
                <span class="text-base">
                  <VAvatar size="25" :color="resolveLogVariant(log.operation).color" variant="tonal">
                    <VIcon size="20" :icon="resolveLogVariant(log.operation).icon" />
                  </VAvatar>
                  {{ log.operation }} —
                  <VChip label color="secondary">
                    {{ log.operationType }}
                  </VChip>
                </span>
                <span class="text-sm text-disabled">{{ log.createTime }}</span>
              </div>
            </td>

            <!-- 👉 Actions -->
            <td style="width: 5rem">
              <VBtn variant="outlined" color="secondary" size="small"
                @click="(isLogDetailDialogVisible = true), (logId = log.id)">
                <h6>详细信息</h6>
              </VBtn>
            </td>
          </tr>
        </tbody>

        <!-- 👉 table footer  -->
        <tfoot v-show="!logs.length">
          <tr>
            <td colspan="8" class="text-center text-body-1">
              No data available
            </td>
          </tr>
        </tfoot>
      </VTable>
      <!-- !SECTION -->

      <VDivider />

      <!-- SECTION Pagination -->
      <VCardText class="d-flex align-center flex-wrap gap-4 py-3">
        <!-- 👉 Pagination meta -->
        <span class="text-sm text-disabled">
          {{ paginationData }}
        </span>

        <VSpacer />

        <!-- 👉 Pagination -->
        <VPagination v-model="currentPage" size="small" :total-visible="5" :length="totalPage" @next="selectedRows = []"
          @prev="selectedRows = []" />
      </VCardText>
      <!-- !SECTION -->
    </VCard>
    <LogDetailDialog v-model:isDrawerOpen="isLogDetailDialogVisible" v-model:logId="logId" />
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
