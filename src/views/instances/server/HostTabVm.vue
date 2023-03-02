<script setup>
import axios from "@axios";
import qs from "qs";
// Images
import freebsd from "@/assets/images/pics/freebsd.png";
import linux from "@/assets/images/pics/linux.png";
import windows7 from "@/assets/images/pics/windows7.png";
import { onBeforeMount } from "@vue/runtime-core";

const vms = ref([]);
const route = useRoute();
const hostId = ref(route.params.id);

const rowPerPage = ref(5);
const currentPage = ref(1);
const totalPage = ref(1);
const total = ref(0);

watchEffect(() => {
  if (currentPage.value > totalPage.value) currentPage.value = totalPage.value;
});

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = vms.value.length
    ? (currentPage.value - 1) * rowPerPage.value + 1
    : 0;
  const lastIndex =
    vms.value.length + (currentPage.value - 1) * rowPerPage.value;

  return `Showing ${firstIndex} to ${lastIndex} of ${total.value} entries`;
});

const fetchVmByHostId = () => {
  //拼接url
  const url =
    "/host/associatedVms?" +
    qs.stringify(
      {
        hostId: hostId.value,
        perPage: rowPerPage.value,
        currentPage: currentPage.value,
      },
      { arrayFormat: "repeat" }
    );

  axios
    .get(url)
    .then((response) => {
      vms.value = response.data.list;
      totalPage.value = response.data.pages;
      total.value = response.data.total;
    })
    .catch((error) => {
      console.error(error);
    });
};

const allKernel = [
  {
    title: "Linux",
    value: 1,
  },
  {
    title: "WindowsNT",
    value: 2,
  },
  {
    title: "FreeBsd",
    value: 3,
  },
];

const status = [
  {
    title: "启动",
    value: "0",
  },
  {
    title: "关闭",
    value: "1",
  },
  {
    title: "休眠",
    value: "2",
  },
  {
    title: "未知",
    value: "3",
  },
];

const resolveVmStatusVariant = (state) => {
  if (state === 0) return "success";
  if (state === 1) return "error";
  if (state === 2) return "warning";

  return "secondary";
};

const resolveVmStatus = (state) => {
  if (state === 0) return "Online";
  if (state === 1) return "Offline";
  if (state === 2) return "Sleep";

  return "Unknown";
};

const resolveOsAvatar = (kernel) => {
  if (kernel === 1) return linux;
  if (kernel === 2) return windows7;
  if (kernel === 3) return freebsd;
};

watchEffect(fetchVmByHostId);
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Rows per page -->
          <div class="d-flex align-center" style="width: 135px">
            <span class="text-no-wrap me-3">Show:</span>
            <VSelect v-model="rowPerPage" density="compact" :items="[5, 10, 20]" />
          </div>
        </VCardText>
        <VDivider />
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th scope="col">名称</th>
              <th scope="col">分配线程</th>
              <th scope="col">分配内存</th>
              <th scope="col">系统</th>
              <th class="text-center" scope="col">状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="vm in vms" :key="vm.id" style="height: 3.75rem">
              <td>
                <div class="d-flex align-center">
                  <VAvatar :size="38" class="me-3" :image="vm.avatar" />
                  <div>
                    <p class="text-base mb-0">
                      {{ vm.name }}
                    </p>
                    <p class="text-sm text-disabled mb-0">
                      {{ vm.description }}
                    </p>
                  </div>
                </div>
              </td>
              <td>
                {{ vm.threads }}
              </td>

              <td class="text-medium-emphasis">
                {{ vm.memory }} M
              </td>

              <!-- 👉 Os -->
              <td>
                <div class="d-flex align-center">
                  <VAvatar rounded="lg" variant="tonal" class="me-3" size="x-small">
                    <VImg v-if="vm.avatar" :src="resolveOsAvatar(vm.os.kernel)" />
                    <span v-else>{{ vm.name }}</span>
                  </VAvatar>

                  <div class="d-flex flex-column">
                    <span class="text-sm text-disabled">{{ vm.os.name }}</span>
                  </div>
                </div>
              </td>

              <!-- 👉 Status -->
              <td class="text-center">
                <VChip label :color="resolveVmStatusVariant(vm.hostMachineState)" size="small" class="text-capitalize"
                  :text="resolveVmStatus(vm.hostMachineState)" />
              </td>
            </tr>
          </tbody>
        </VTable>
        <VDivider />
        <VCardText class="
          d-flex
          align-center
          flex-wrap
          justify-space-between
          gap-4
          py-3
          px-5
        ">
          <span class="text-sm text-disabled">
            {{ paginationData }}
          </span>

          <VPagination v-model="currentPage" size="small" :total-visible="5" :length="totalPage" />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
