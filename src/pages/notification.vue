<script setup>
import LogDetailDialog from "@/views/auditLog/LogDetailDialog.vue";
import axios from "@axios";
import { avatarText } from "@core/utils/formatters";
import qs from "qs";
import { formatDateToMonthShort } from "@core/utils/formatters";

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

const affirm = (id) => {
  axios.put("notification/" + id).then((r) => {
    Message(r);
    fetchNotifications();
  });
};

// 👉 Fetching notifications
const fetchNotifications = () => {
  //拼接url
  const url =
    "/notification/notificationList?" +
    qs.stringify(
      {
        tab: currentTab.value,
        perPage: rowPerPage.value,
        currentPage: currentPage.value,
      },
      { arrayFormat: "repeat" }
    );

  axios
    .get(url)
    .then((response) => {
      notifications.value = response.data.list;
      totalPage.value = response.data.pages;
      total.value = response.data.total;
    })
    .catch((error) => {
      console.error(error);
    });
  fetchNotificationCount();
};

const fetchNotificationCount = () => {
  axios
    .get("/notification/count")
    .then((response) => {
      count.value = response.data;
    });
}

const resolveNoticeVariant = (type) => {
  if (type == 0)
    return {
      color: "error",
      icon: "tabler-face-id-error",
    };
  if (type == 1)
    return {
      color: "info",
      icon: "tabler-face-id",
    };
  return {
    color: "primary",
    icon: "tabler-settings",
  };
};

const resolveButtonColor = (affirm) => {
  if (affirm == 0) return "secondary";
  if (affirm == 1) return "success";
};

const resolveBtnDisable = (affirm) => {
  if (affirm == 0) return false;
  if (affirm == 1) return true;
};

// 👉 Fetch Invoices
watchEffect(fetchNotifications);

// 👉 Fetch Invoices
watchEffect(() => {
  if (currentPage.value > totalPage.value) {
    currentPage.value = totalPage.value;
  }
});

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = notifications.value.length
    ? (currentPage.value - 1) * rowPerPage.value + 1
    : 0;
  const lastIndex =
    notifications.value.length + (currentPage.value - 1) * rowPerPage.value;

  return `Showing ${firstIndex} to ${lastIndex} of ${total.value} entries`;
});
</script>

<template>
  <section>
    <VCard title="消息中心" v-if="notifications" id="server-list">
      <VDivider />
      <VRow>
        <VCol cols="3" sm="2">
          <VTabs v-model="currentTab" direction="vertical">
            <VCol cols="6" sm="6">
              <VChip color="primary" variant="elevated"> 时效 </VChip>
            </VCol>

            <VTab>
              <VIcon start icon="tabler-user" />
              <VBadge offset-x="-15" offset-y="9" :content="count">
                <span class="text-base">最新</span>
              </VBadge>
            </VTab>
            <VTab>
              <VIcon start icon="tabler-user" />
              <span class="text-base">已处理</span>
            </VTab>

            <VTab>
              <VIcon start icon="tabler-user" />
              <span class="text-base">全部</span>
            </VTab>

            <VCol cols="6" sm="6">
              <VChip color="info" variant="elevated"> 分类 </VChip>
            </VCol>

            <VTab>
              <VAvatar rounded="sm" size="20" color="error" variant="tonal">
                <VIcon size="33" icon="tabler-face-id-error" />
              </VAvatar>
              <h6 class="mx-2">
                离线提醒
              </h6>
            </VTab>

            <VTab>
              <VAvatar rounded="sm" size="20" color="info" variant="tonal">
                <VIcon size="33" icon="tabler-face-id" />
              </VAvatar>
              <h6 class="mx-2">
                统计信息
              </h6>
            </VTab>
          </VTabs>
        </VCol>
        <VDivider vertical />
        <VCol cols="9" sm="10">
          <!-- SECTION Table -->
          <VTable class="text-no-wrap server-list-table">
            <thead>
              <tr>
                <th scope="col">内容</th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody>
              <tr v-for="notice in notifications" :key="notice.id" style="height: 3.75rem">
                <!-- 👉 Name -->
                <td>
                  <div class="d-flex align-center">
                    <VBadge location="top start" dot :color="resolveNoticeVariant(notice.type).color">
                      <VAvatar rounded="lg" variant="tonal" class="me-3" size="38">
                        <VImg :src="notice.instanceAvatar" />
                      </VAvatar>
                    </VBadge>
                    <!-- <VAvatar rounded="sm" size="35" :color="resolveNoticeVariant(notice.type).color" variant="tonal">
                      <VIcon size="33" :icon="resolveNoticeVariant(notice.type).icon" />
                    </VAvatar> -->
                    <h6 class="
                        mx-2
                        text-body-1
                        font-weight-medium
                        text-high-emphasis
                      ">
                      {{ notice.title }}
                    </h6>
                    <span class="truncate">{{ notice.content }}</span>
                    <VSpacer />
                  </div>
                </td>

                <!-- 👉 Time -->
                <td style="width: 5rem">
                  <small class="text-disabled ms-2">{{
                    notice.createTime
                  }}</small>
                </td>

                <!-- 👉 Actions -->
                <td style="width: 5rem">
                  <VBtn v-if="notice.affirm == 0" @click="affirm(notice.id, notice.instanceId)" icon="tabler-check" variant="text"
                    color="secondary" />
                  <VBtn v-if="notice.affirm == 1" icon="tabler-check" variant="text" color="success" />
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="!notifications.length">
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
            <VPagination v-model="currentPage" size="small" :total-visible="5" :length="totalPage"
              @next="selectedRows = []" @prev="selectedRows = []" />
          </VCardText>
          <!-- !SECTION -->
        </VCol>
      </VRow>
    </VCard>
    <VSnackbar v-model="isSnackbarVisible" :color="snackBarColor" :location="snackBarlocation" :timeout="3000">
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
