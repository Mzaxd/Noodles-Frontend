<script setup>
import avatar2 from "@images/avatars/avatar-2.png";
import axios from "@axios";

const userLogs = ref([]);

onBeforeMount(() => {
  axios.get("/auditLog/userLog").then((r) => {
    userLogs.value = r.data;
  });
});

const resolveDotColor = (operation) => {
  if (operation.includes("更改密码"))
    return "error"
  if (operation.includes("更改邮箱"))
    return "success"
  if (operation.includes("更改账号信息"))
    return "info"
  if (operation.includes("第一次登录"))
    return "primary"
  return "secondary"
};
</script>

<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="tabler-timeline" />
      </template>
      <VCardTitle>账号活动记录</VCardTitle>
    </VCardItem>

    <VCardText>
      <VTimeline
        v-for="log in userLogs"
        :key="log.id"
        density="compact"
        align="start"
        truncate-line="both"
        class="v-timeline-density-compact"
      >
        <VTimelineItem :dot-color="resolveDotColor(log.operation)" size="x-small">
          <div class="d-flex justify-space-between align-center flex-wrap">
            <h4 class="text-base font-weight-semibold me-1 mb-1">
              {{ log.operation }}
            </h4>
            <span class="text-sm text-disabled text-no-wrap">
              {{ log.createTime }}</span
            >
          </div>
          <p class="mb-1"></p>
        </VTimelineItem>
      </VTimeline>
    </VCardText>
  </VCard>
</template>


