<script setup>
import freebsd from "@/assets/images/pics/freebsd.png";
import linux from "@/assets/images/pics/linux.png";
import windows7 from "@/assets/images/pics/windows7.png";
import AddNewVmDrawer from "@/views/instances/vm/AddNewVmDrawer.vue";
import UpdateVmDialog from "@/views/instances/vm/UpdateVmDialog.vue";
import VmStatisticsTransactions from "@/views/instances/vm/VmStatisticsTransactions.vue";
import axios from "@axios";
import qs from "qs";
import { ref } from "vue";

const vmStatistics = ref();
const waitDeleteId = ref();
const waitUpdateVmId = ref();
const isDialogVisible = ref(false);
const searchQuery = ref();
const selectedKernel = ref();
const selectedHost = ref();
const selectedStatus = ref();
const rowPerPage = ref(5);
const currentPage = ref(1);
const totalPage = ref(1);
const total = ref(0);
const vms = ref([]);
const allHost = ref([]);

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

onBeforeMount(() => {
  axios.get("/host/drawer").then((r) => {
    allHost.value = r.data;
  });
});

// 👉 Fetching vms
const fetchVms = () => {
  //拼接url
  const url =
    "/host/vmList?" +
    qs.stringify(
      {
        perPage: rowPerPage.value,
        currentPage: currentPage.value,
        q: searchQuery.value,
        selectedKernel: selectedKernel.value,
        selectedHost: selectedHost.value,
        selectedStatus: selectedStatus.value,
      },
      { arrayFormat: "repeat" }
    );

  axios
    .get(url)
    .then((response) => {
      vms.value = response.data.list;
      totalPage.value = response.data.pages;
      total.value = response.data.total;
      vmStatistics.value.update();
    })
    .catch((error) => {
      console.error(error);
    });
};

// 👉 add vm
const addNewVm = (vmData) => {
  axios
    .post("/host/addVm", {
      vm: vmData,
    })
    .then((r) => {
      Message(r);

      // refetch Vms
      fetchVms();
    });
};

const updateVm = (vmData) => {
  axios
    .post("/host/updateVm", {
      vm: vmData,
    })
    .then((r) => {
      Message(r);

      // refetch Vms
      fetchVms();
    });
};

const deleteVm = () => {
  const id = waitDeleteId.value;

  axios.delete("/host/deleteVm/" + id).then((r) => {
    Message(r);

    // refetch Vms
    fetchVms();
  });
};

watchEffect(fetchVms);

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value) currentPage.value = totalPage.value;
});

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

const isAddNewVmDrawerVisible = ref(false);
const isUpdateVmDialogVisible = ref(false);

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = vms.value.length
    ? (currentPage.value - 1) * rowPerPage.value + 1
    : 0;
  const lastIndex =
    vms.value.length + (currentPage.value - 1) * rowPerPage.value;

  return `Showing ${firstIndex} to ${lastIndex} of ${total.value} entries`;
});

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

const resolveNotifyVariant = (notify) => {
  if (notify === 0) return "secondary";
  if (notify === 1) return "info";
  if (notify === 2) return "success";
  return "primary";
};

const newPage = url => {
  window.open(url)
}
const newTerminalPage = (sshId) => {
  const protocol = window.location.protocol
  const host = window.location.host
  const url = protocol + "//" + host+"/terminal/" + sshId
  window.open(url);
};
</script>

<template>
  <section>
    <VRow>
      <VCol>
        <VmStatisticsTransactions ref="vmStatistics" />
      </VCol>

      <VCol cols="12">
        <VCard title="搜索过滤器">
          <!-- 👉 Filters -->
          <VCardText>
            <VRow>
              <!-- 👉 Select Kernel -->
              <VCol cols="12" sm="4">
                <VSelect
                  v-model="selectedKernel"
                  label="系统内核"
                  :items="allKernel"
                  multiple=""
                  clearable
                  clear-icon="tabler-x"
                  prepend-inner-icon="tabler-filter"
                >
                  <template #selection="{ item }">
                    <VChip>
                      <VAvatar start rounded="lg">
                        <VImg :src="resolveOsAvatar(item.value)" />
                      </VAvatar>
                      <span>{{ item.title }}</span>
                    </VChip>
                  </template>
                </VSelect>
              </VCol>
              <!-- 👉 Select Host -->
              <VCol cols="12" sm="4">
                <VSelect
                  v-model="selectedHost"
                  :items="allHost"
                  item-title="name"
                  item-value="id"
                  label="宿主机"
                  multiple=""
                  clearable
                  clear-icon="tabler-x"
                  prepend-inner-icon="tabler-filter"
                >
                  <template #selection="{ item }">
                    <VChip>
                      <VAvatar start rounded="lg" :image="item.raw.avatar" />
                      <span>{{ item.title }}</span>
                    </VChip>
                  </template>
                </VSelect>
              </VCol>
              <!-- 👉 Select Status -->
              <VCol cols="12" sm="4">
                <VSelect
                  v-model="selectedStatus"
                  label="在线状态"
                  :items="status"
                  multiple=""
                  clearable
                  clear-icon="tabler-x"
                  prepend-inner-icon="tabler-filter"
                />
              </VCol>
            </VRow>
          </VCardText>

          <VDivider />

          <VCardText class="d-flex flex-wrap py-4 gap-4">
            <div class="me-3" style="width: 80px">
              <VSelect
                v-model="rowPerPage"
                density="compact"
                variant="outlined"
                :items="[5, 10, 20, 50]"
              />
            </div>

            <VSpacer />

            <div
              class="app-user-search-filter d-flex align-center flex-wrap gap-4"
            >
              <!-- 👉 Search  -->
              <div style="width: 10rem">
                <VTextField
                  v-model="searchQuery"
                  placeholder="搜索"
                  density="compact"
                  prepend-inner-icon="tabler-search"
                />
              </div>

              <!-- 👉 Export button -->
              <VBtn
                variant="tonal"
                color="secondary"
                prepend-icon="tabler-screen-share"
              >
                导出(Excel)
              </VBtn>

              <!-- 👉 Add vm button -->
              <VBtn
                prepend-icon="tabler-plus"
                @click="isAddNewVmDrawerVisible = true"
              >
                添加新虚拟机
              </VBtn>
            </div>
          </VCardText>

          <VDivider />

          <VTable class="text-no-wrap">
            <!-- 👉 table head -->
            <thead>
              <tr>
                <th scope="col">名称</th>
                <th scope="col">说明</th>
                <th scope="col">系统</th>
                <th class="text-center" scope="col">CPU</th>
                <th class="text-center" scope="col">内存</th>
                <th class="text-center" scope="col">掉线提醒</th>
                <th class="text-center" scope="col">状态</th>
                <th class="text-center" scope="col">操作</th>
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody>
              <tr v-for="vm in vms" :key="vm.id" style="height: 3.75rem">
                <!-- 👉 Name -->
                <td>
                  <div class="d-flex align-center">
                    <VAvatar
                      rounded="lg"
                      variant="tonal"
                      class="me-3"
                      size="38"
                    >
                      <VImg v-if="vm.avatar" :src="vm.avatar" />
                      <span v-else>{{ vm.name }}</span>
                    </VAvatar>

                    <div class="d-flex flex-column">
                      <h6 class="text-base">
                        {{ vm.name }}
                      </h6>
                      <span class="text-sm text-disabled"
                        >{{ vm.manageIp }}</span
                      >
                    </div>
                  </div>
                </td>

                <!-- 👉 Description -->
                <td>
                  <span class="text-base">{{ vm.description }}</span>
                </td>

                <!-- 👉 Os -->
                <td>
                  <div class="d-flex align-center">
                    <VAvatar
                      rounded="lg"
                      variant="tonal"
                      class="me-3"
                      size="x-small"
                    >
                      <VImg
                        v-if="vm.avatar"
                        :src="resolveOsAvatar(vm.os.kernel)"
                      />
                      <span v-else>{{ vm.name }}</span>
                    </VAvatar>

                    <div class="d-flex flex-column">
                      <span class="text-sm text-disabled">{{
                        vm.os.name
                      }}</span>
                    </div>
                  </div>
                </td>

                <!-- 👉 Cpu -->
                <td class="text-center">
                  <span class="text-sm">{{ vm.threads }}</span>
                </td>

                <!-- 👉 Memory -->
                <td class="text-center">
                  <span class="text-sm">{{ vm.memory }}M</span>
                </td>

                <td class="text-center">
              <VAvatar
                size="25"
                :color="resolveNotifyVariant(vm.notify)"
                variant="tonal"
              >
                <VIcon v-if="vm.notify == 0" size="22" icon="tabler-bell-x" />
                <VIcon v-if="vm.notify == 1" size="22" icon="tabler-browser" />
                <VIcon v-if="vm.notify == 2" size="22" icon="tabler-mail" />
                <VIcon v-if="vm.notify == 3" size="22" icon="tabler-browser" />
              </VAvatar>
              <VAvatar
                v-if="vm.notify == 3"
                size="25"
                :color="resolveNotifyVariant(vm.notify)"
                variant="tonal"
              >
                <VIcon v-if="vm.notify == 3" size="22" icon="tabler-mail" />
              </VAvatar>
            </td>

                <!-- 👉 Status -->
                <td class="text-center">
                  <VChip
                    label
                    :color="resolveVmStatusVariant(vm.hostMachineState)"
                    size="small"
                    class="text-capitalize"
                    :text="resolveVmStatus(vm.hostMachineState)"
                  />
                </td>

                <!-- 👉 Actions -->
                <td class="text-center" style="width: 5rem">
                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="
                      (isUpdateVmDialogVisible = true), (waitUpdateVmId = vm.id)
                    "
                  >
                    <VIcon size="22" icon="tabler-edit" />
                  </VBtn>

                  <VBtn icon size="x-small" color="default" variant="text">
                    <VIcon size="22" icon="tabler-dots-vertical" />

                    <VMenu activator="parent">
                      <VList>
                        <VListItem 
                          v-if="vm.manageIp" 
                          @click="newPage(vm.manageIp)"
                        >
                          <VBtn
                            icon="tabler-brand-chrome"
                            size="x-xl"
                            color="default"
                            variant="text"
                          />
                        </VListItem>
                        <VListItem
                          v-if="vm.sshId"
                          @click="newTerminalPage(vm.sshId)"
                        >
                          <VBtn
                            icon="tabler-terminal-2"
                            size="x-xl"
                            color="default"
                            variant="text"
                          />
                        </VListItem>
                        <VListItem>
                          <VBtn
                            icon="tabler-trash"
                            size="x-xl"
                            color="default"
                            variant="text"
                            @click="
                              (isDialogVisible = !isDialogVisible),
                                (waitDeleteId = vm.id)
                            "
                          />
                        </VListItem>
                      </VList>
                    </VMenu>
                  </VBtn>
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="!vms.length">
              <tr>
                <td colspan="7" class="text-center">No data available</td>
              </tr>
            </tfoot>
          </VTable>

          <VDivider />

          <VCardText
            class="
              d-flex
              align-center
              flex-wrap
              justify-space-between
              gap-4
              py-3
              px-5
            "
          >
            <span class="text-sm text-disabled">
              {{ paginationData }}
            </span>

            <VPagination
              v-model="currentPage"
              size="small"
              :total-visible="5"
              :length="totalPage"
            />
          </VCardText>
        </VCard>
      </VCol>
      <VSnackbar
        v-model="isSnackbarVisible"
        :color="snackBarColor"
        :location="snackBarlocation"
        :timeout="3000"
      >
        {{ msg }}
      </VSnackbar>

      <VDialog v-model="isDialogVisible" persistent class="v-dialog-sm">
        <!-- Dialog close btn -->
        <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

        <!-- Dialog Content -->
        <VCard title="╥﹏╥... 您确定要删除此虚拟机?">
          <VCardText> 删除此虚拟机会将与虚拟机关联的所有信息删除 </VCardText>

          <VCardText class="d-flex justify-end gap-3 flex-wrap">
            <VBtn
              color="secondary"
              variant="tonal"
              @click="isDialogVisible = false"
            >
              取消
            </VBtn>
            <VBtn color="error" @click="(isDialogVisible = false), deleteVm()">
              删除
            </VBtn>
          </VCardText>
        </VCard>
      </VDialog>
    </VRow>

    <!-- 👉 Add New Vm -->
    <AddNewVmDrawer
      v-model:isDrawerOpen="isAddNewVmDrawerVisible"
      @vm-data="addNewVm"
    />

    <!-- 👉 Update User -->
    <UpdateVmDialog
      v-model:isDrawerOpen="isUpdateVmDialogVisible"
      v-model:updateVmId="waitUpdateVmId"
      @vm-data="updateVm"
    />
  </section>
</template>

<style lang="scss">
.app-user-search-filter {
  inline-size: 31.6rem;
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>
