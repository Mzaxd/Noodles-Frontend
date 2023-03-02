<script setup>
const props = defineProps({
  data: {
    type: null,
    required: true,
  },
})
</script>

<template>
  <VCard class="mb-4">
    <VCardText>
      <p class="text-xs">
        信息
      </p>

      <VList class="card-list text-medium-emphasis">
        <VListItem>
          <template #prepend>
            <VIcon
              icon="tabler-user"
              size="20"
              class="me-2"
            />
          </template>
          <VListItemTitle>
            <span class="font-weight-semibold me-1">账户名称：</span>
            <span>{{ data.userName }}</span>
          </VListItemTitle>
        </VListItem>
        <VListItem>
          <template #prepend>
            <VIcon
              icon="tabler-tag"
              size="20"
              class="me-2"
            />
          </template>
          <VListItemTitle>
            <span class="font-weight-semibold me-1">昵称：</span>
            <span>{{ data.nickName }}</span>
          </VListItemTitle>
        </VListItem>
        <VListItem>
          <template #prepend>
            <VIcon
              icon="tabler-share"
              size="20"
              class="me-2"
            />
          </template>
          <VListItemTitle>
            <span class="font-weight-semibold me-1">邮箱：</span>
            <span>{{ data.email }}</span>
          </VListItemTitle>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>

  <VCard>
    <VCardText>
      <p class="text-xs">
        统计
      </p>

      <VList class="card-list text-medium-emphasis">
        <VListItem>
          <template #prepend>
            <VIcon
              icon="tabler-servicemark"
              size="20"
              class="me-2"
            />
          </template>
          <VListItemTitle>
            <span class="font-weight-semibold me-1">服务：</span>
            <span>{{ data.servirNumber }}</span>
          </VListItemTitle>
        </VListItem>
        <VListItem>
          <template #prepend>
            <VIcon
              icon="tabler-brand-windows"
              size="20"
              class="me-2"
            />
          </template>
          <VListItemTitle>
            <span class="font-weight-semibold me-1">物理机：</span>
            <span>{{ data.hostNumber }}</span>
          </VListItemTitle>
        </VListItem>
        <VListItem>
          <template #prepend>
            <VIcon
              icon="tabler-brand-ubuntu"
              size="20"
              class="me-2"
            />
          </template>
          <VListItemTitle>
            <span class="font-weight-semibold me-1">虚拟机：</span>
            <span>{{ data.vmNumber }}</span>
          </VListItemTitle>
        </VListItem>
        <VListItem>
          <template #prepend>
            <VIcon
              icon="tabler-brand-docker"
              size="20"
              class="me-2"
            />
          </template>
          <VListItemTitle>
            <span class="font-weight-semibold me-1">容器：</span>
            <span>{{ data.containerNumber }}</span>
          </VListItemTitle>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 16px;
}
</style>
