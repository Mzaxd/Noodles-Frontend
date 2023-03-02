<script setup>
import { avatarText } from "@core/utils/formatters";
import { formatDateToMonthShort, formatDate } from "@core/utils/formatters";
import qs from "qs";
import axios from "@axios";
import {useRouter} from "vue-router";

const props = defineProps({
  notifications: {
    type: Array,
    required: true,
  },
  badgeProps: {
    type: null,
    required: false,
    default: undefined,
  },
  location: {
    type: null,
    required: false,
    default: "bottom end",
  },
});

const router = useRouter();

const notifications = ref([]);
const count = ref(0);
const rowPerPage = ref(5);
const currentPage = ref(1);
const currentTab = ref(0);

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
    })
    .catch((error) => {
      console.error(error);
    });
  fetchNotificationCount();
};

const fetchNotificationCount = () => {
  axios.get("/notification/count").then((response) => {
    count.value = response.data;
  });
};

// 👉 Fetch Invoices
watchEffect(fetchNotifications);

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
</script>

<template>
  <VBadge :model-value="!!props.badgeProps" v-bind="props.badgeProps">
    <VBtn icon variant="text" color="default" size="small">
      <VBadge :model-value="!!count" color="error" :content="count">
        <VIcon icon="tabler-bell" size="24" />
      </VBadge>

      <VMenu
        activator="parent"
        width="380px"
        :location="props.location"
        offset="14px"
      >
        <VList class="py-0">
          <!-- 👉 Header -->
          <VListItem title="消息" class="notification-section" height="48px">
            <template #append>
              <VChip v-if="count" color="primary" size="small">
                {{ count }} New
              </VChip>
            </template>
          </VListItem>

          <VDivider />

          <!-- 👉 Notifications list -->
          <template
            v-for="notification in notifications"
            :key="notification.title"
          >
            <VListItem
              :title="notification.title"
              :subtitle="notification.content"
              link
              lines="one"
              min-height="66px"
            >
              <!-- Slot: Prepend -->
              <!-- Handles Avatar: Image, Icon, Text -->
              <template #prepend>
                <VListItemAction start>
                  <VAvatar
                    rounded="sm"
                    size="35"
                    :color="resolveNoticeVariant(notification.type).color"
                    variant="tonal"
                  >
                    <VIcon
                      size="33"
                      :icon="resolveNoticeVariant(notification.type).icon"
                    />
                  </VAvatar>
                </VListItemAction>
              </template>
              <!-- Slot: Append -->
              <template #append>
                <small class="whitespace-no-wrap text-medium-emphasis">{{
                  formatDate(notification.createTime)
                }}</small>
              </template>
            </VListItem>
            <VDivider />
          </template>

          <!-- 👉 Footer -->
          <VListItem class="notification-section">
            <VBtn @click="router.push('/notification')" block> 查 看 所 有 提 醒 </VBtn>
          </VListItem>
        </VList>
      </VMenu>
    </VBtn>
  </VBadge>
</template>

<style lang="scss">
.notification-section {
  padding: 14px !important;
}
</style>
