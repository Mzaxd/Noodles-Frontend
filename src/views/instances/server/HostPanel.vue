<script setup>
import { onMounted } from "@vue/runtime-core"
import { kFormatter } from '@core/utils/formatters'

const props = defineProps({
  host: {
    type: null,
    required: true,
  },
  hostDetail: {
    type: null,
    required: true,
  },
})

const standardPlan = {
  plan: 'Standard',
  price: 99,
  benefits: [
    '10 Users',
    'Up to 10GB storage',
    'Basic Support',
  ],
}

const isUserInfoEditDialogVisible = ref(false)
const isUpgradePlanDialogVisible = ref(false)

const resolveHostStatusVariant = (state) => {
  if (state === 0) return "success";
  if (state === 1) return "error";
  if (state === 2) return "warning";
  return "secondary";
};

const resolveHostStatus = (state) => {
  if (state === 0) return "Online";
  if (state === 1) return "Offline";
  if (state === 2) return "Sleep";

  return "Unknown";
};

</script>

<template>
  <VRow>
    <!-- SECTION User Details -->
    <VCol cols="12">
      <VCard v-if="props.host">
        <VCardText class="text-center pt-15">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            :size="120"
            color="primary"
            variant="tonal"
          >
            <VImg
              v-if="props.host.avatar"
              :src="props.host.avatar"
            />
            <span
              v-else
              class="text-5xl font-weight-semibold"
            >
              {{ props.host.name }}
            </span>
          </VAvatar>

          <!-- 👉 User fullName -->
          <h6 class="text-h6 mt-4">
            {{ props.host.name }}
          </h6>

          <!-- 👉 Role chip -->
          <VChip
            label
            size="small"
            class="text-capitalize mt-4"
          >
            {{ props.host.description  }}
          </VChip>
        </VCardText>

        <VCardText class="d-flex justify-center flex-wrap mt-3">
          <!-- 👉 Done task -->
          <div class="d-flex align-center me-8 mb-2">
            <VAvatar
              :size="38"
              rounded
              color="primary"
              variant="tonal"
              class="me-3"
            >
              <VIcon
                size="24"
                icon="tabler-server"
              />
            </VAvatar>

            <div>
              <h6 class="text-base font-weight-semibold">
                {{ kFormatter(props.host.vmCount) }}
              </h6>
              <span class="text-sm">VM</span>
            </div>
          </div>

          <!-- 👉 Done Project -->
          <div class="d-flex align-center me-4 mb-2">
            <VAvatar
              :size="38"
              rounded
              color="primary"
              variant="tonal"
              class="me-3"
            >
              <VIcon
                size="24"
                icon="tabler-brand-docker"
              />
            </VAvatar>

            <div>
              <h6 class="text-base font-weight-semibold">
                {{ kFormatter(props.host.containerCount) }}
              </h6>
              <span class="text-sm">Container</span>
            </div>
          </div>
        </VCardText>

        <VDivider />

        <!-- 👉 Details -->
        <VCardText>
          <p class="text-sm text-uppercase text-disabled">
            Details
          </p>

          <!-- 👉 User Details list -->
          <VList class="card-list mt-2">
            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  CPU：
                  <span class="text-body-2">
                    {{ props.hostDetail.cpu.cpuName }}
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  核心/线程：
                  <span class="text-body-2">
                    {{ props.hostDetail.cpu.physicalProcessorCount }} 核
                  </span>
                  /
                  <span class="text-body-2">
                    {{ props.hostDetail.cpu.logicalProcessorCount }} 线程
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  主板制造商：
                  <span class="text-body-2">{{ props.hostDetail.sys.manufacturer }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  主板型号：
                  <span class="text-body-2">{{ props.hostDetail.sys.model }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  操作系统：
                  <span class="text-body-2">{{ props.hostDetail.os.osName }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  Status：

                  <VChip
                    label
                    size="small"
                    :color="resolveHostStatusVariant(props.host.hostMachineState)"
                    class="text-capitalize"
                    :text="resolveHostStatus(props.host.hostMachineState)"
                  >
                  </VChip>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  启动时间：
                  <span class="text-body-2">{{ props.hostDetail.os.booted }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  运行时间：
                  <span class="text-body-2">{{ props.hostDetail.os.uptime }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>
          </VList>
        </VCardText>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.7rem;
}

.text-capitalize {
  text-transform: capitalize !important;
}
</style>
