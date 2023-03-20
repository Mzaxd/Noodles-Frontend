<script setup>
import AddNewHostDialog from "@/views/instances/server/AddNewHostDialog.vue";
import UpdateHostDialog from "@/views/instances/server/UpdateHostDialog.vue";
import axios from "@axios";
import { avatarText } from "@core/utils/formatters";
import qs from "qs";
import freebsd from "@/assets/images/pics/freebsd.png";
import linux from "@/assets/images/pics/linux.png";
import windows7 from "@/assets/images/pics/windows7.png";

const isDialogVisible = ref(false);
const isAddNewHostDialogVisible = ref(false);
const isUpdateHostDialogVisible = ref(false);
const waitUpdateHostId = ref();
const waitDeleteId = ref();
const searchQuery = ref("");
const selectedStatus = ref();
const rowPerPage = ref(10);
const currentPage = ref(1);
const totalPage = ref(1);
const total = ref(0);
const servers = ref([]);
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

const addNewHost = (hostData) => {
  axios
    .post("/host/addHost", {
      host: hostData,
    })
    .then((r) => {
      Message(r);

      // refetch hosts
      fetchHosts();
    });
};

const updateHost = (hostData) => {
  axios
    .post("/host/updateHost", {
      host: hostData,
    })
    .then((r) => {
      Message(r);

      // refetch Vms
      fetchHosts();
    });
};

const deleteHost = () => {
  const id = waitDeleteId.value;

  axios.delete("/host/deleteHost/" + id).then((r) => {
    Message(r);

    // refetch Vms
    fetchHosts();
  });
};

// 👉 Fetching hosts
const fetchHosts = () => {
  //拼接url
  const url =
    "/host/hostList?" +
    qs.stringify(
      {
        perPage: rowPerPage.value,
        currentPage: currentPage.value,
        q: searchQuery.value,
        selectedStatus: selectedStatus.value,
      },
      { arrayFormat: "repeat" }
    );

  axios
    .get(url)
    .then((response) => {
      servers.value = response.data.list;
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

const resolveHostNotifyVariant = (notify) => {
  if (notify === 0) return "secondary";
  if (notify === 1) return "info";
  if (notify === 2) return "success";
  return "primary";
};

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

const resolveHostAvatar = (kernel) => {
  if (kernel === 1) return linux;
  if (kernel === 2) return windows7;
  if (kernel === 3) return freebsd;
};

const resolveOsAvatar = (kernel) => {
  if (kernel === 1) return linux;
  if (kernel === 2) return windows7;
  if (kernel === 3) return freebsd;
};
// 👉 Fetch Invoices
watchEffect(fetchHosts);

// 👉 Fetch Invoices
watchEffect(() => {
  if (currentPage.value > totalPage.value) {
    currentPage.value = totalPage.value;
  }
});

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = servers.value.length
    ? (currentPage.value - 1) * rowPerPage.value + 1
    : 0;
  const lastIndex =
    servers.value.length + (currentPage.value - 1) * rowPerPage.value;

  return `Showing ${firstIndex} to ${lastIndex} of ${total.value} entries`;
});

const newPage = (url) => {
  window.open(url);
};

const newTerminalPage = (sshId) => {
  const protocol = window.location.protocol
  const host = window.location.host
  const url = protocol + "//" + host+"/terminal/" + sshId
  window.open(url);
};
</script>
<template>
  <section>
    <VCard v-if="servers" id="server-list">
      <VCardText class="d-flex align-center flex-wrap gap-4">
        <!-- 👉 Rows per page -->
        <div class="d-flex align-center" style="width: 135px">
          <span class="text-no-wrap me-3">Show:</span>
          <VSelect
            v-model="rowPerPage"
            density="compact"
            :items="[10, 20, 30, 50]"
          />
        </div>

        <div class="me-3">
          <!-- 👉 Create server -->
          <VBtn
            prepend-icon="tabler-plus"
            @click="isAddNewHostDialogVisible = true"
          >
            添加新物理机
          </VBtn>
        </div>

        <VSpacer />

        <div class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div class="server-list-filter">
            <VTextField
              v-model="searchQuery"
              placeholder="搜索"
              density="compact"
              prepend-inner-icon="tabler-search"
            />
          </div>

          <!-- 👉 Select status -->
          <div class="server-list-filter">
            <VSelect
              v-model="selectedStatus"
              label="在线状态"
              :items="status"
              multiple=""
              clearable
              clear-icon="tabler-x"
              prepend-inner-icon="tabler-filter"
            />
          </div>
        </div>
      </VCardText>

      <VDivider />

      <!-- SECTION Table -->
      <VTable class="text-no-wrap server-list-table">
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
          <tr v-for="host in servers" :key="host.id" style="height: 3.75rem">
            <!-- 👉 Name -->
            <td>
              <div class="d-flex align-center">
                <VAvatar rounded="lg" variant="tonal" class="me-3" size="large">
                  <VImg v-if="host.avatar" :src="host.avatar" />
                  <span v-else>{{ avatarText(host.name) }}</span>
                </VAvatar>

                <div class="d-flex flex-column">
                  <h6 class="text-base">
                    <RouterLink
                      :to="{
                        name: 'instances-server-view-id',
                        params: { id: host.id },
                      }"
                      class="font-weight-medium user-list-name"
                    >
                      {{ host.name }}
                    </RouterLink>
                  </h6>
                </div>
              </div>
            </td>

            <!-- 👉 Description -->
            <td>
              <span class="text-base">{{ host.description }}</span>
            </td>

            <td>
              <div class="d-flex align-center">
                <VAvatar
                  rounded="lg"
                  variant="tonal"
                  class="me-3"
                  size="x-small"
                >
                  <VImg
                    v-if="host.os.kernel"
                    :src="resolveOsAvatar(host.os.kernel)"
                  />
                  <span v-else>{{ avatarText(host.name) }}</span>
                </VAvatar>

                <div class="d-flex flex-column">
                  <span class="text-sm text-disabled">{{ host.os.name }}</span>
                </div>
              </div>
            </td>

            <!-- 👉 Cpu -->
            <td class="text-center">
              <span class="text-sm">{{ host.threads }}</span>
            </td>

            <!-- 👉 Memory -->
            <td class="text-center">
              <span class="text-sm">{{ host.memory }}</span>
            </td>

            <!-- 👉 Memory -->
            <td class="text-center">
              <VAvatar
                size="25"
                :color="resolveHostNotifyVariant(host.notify)"
                variant="tonal"
              >
                <VIcon v-if="host.notify == 0" size="22" icon="tabler-bell-x" />
                <VIcon
                  v-if="host.notify == 1"
                  size="22"
                  icon="tabler-browser"
                />
                <VIcon v-if="host.notify == 2" size="22" icon="tabler-mail" />
                <VIcon
                  v-if="host.notify == 3"
                  size="22"
                  icon="tabler-browser"
                />
              </VAvatar>
              <VAvatar
                v-if="host.notify == 3"
                size="25"
                :color="resolveHostNotifyVariant(host.notify)"
                variant="tonal"
              >
                <VIcon v-if="host.notify == 3" size="22" icon="tabler-mail" />
              </VAvatar>
            </td>

            <!-- 👉 Status -->
            <td class="text-center">
              <VChip
                label
                :color="resolveHostStatusVariant(host.hostMachineState)"
                size="small"
                class="text-capitalize"
                :text="resolveHostStatus(host.hostMachineState)"
              />
            </td>

            <!-- 👉 Actions -->
            <td style="width: 5rem">
              <VBtn
                icon
                size="x-small"
                color="default"
                variant="text"
                @click="
                  (isUpdateHostDialogVisible = true),
                    (waitUpdateHostId = host.id)
                "
              >
                <VIcon size="22" icon="tabler-edit" />
              </VBtn>

              <VBtn icon size="x-small" color="default" variant="text">
                <VIcon size="22" icon="tabler-dots-vertical" />

                <VMenu activator="parent">
                  <VList>
                    <VListItem
                      v-if="host.manageIp"
                      @click="newPage(host.manageIp)"
                    >
                      <VBtn
                        icon="tabler-brand-chrome"
                        size="x-xl"
                        color="default"
                        variant="text"
                      />
                    </VListItem>
                    <VListItem
                      v-if="host.sshId"
                      @click="newTerminalPage(host.sshId)"
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
                            (waitDeleteId = host.id)
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
        <tfoot v-show="!servers.length">
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
        <VPagination
          v-model="currentPage"
          size="small"
          :total-visible="5"
          :length="totalPage"
          @next="selectedRows = []"
          @prev="selectedRows = []"
        />
      </VCardText>
      <!-- !SECTION -->
    </VCard>
    <VSnackbar
      v-model="isSnackbarVisible"
      :color="snackBarColor"
      :location="snackBarlocation"
      :timeout="3000"
    >
      {{ msg }}
    </VSnackbar>
    <AddNewHostDialog
      v-model:isDrawerOpen="isAddNewHostDialogVisible"
      @host-data="addNewHost"
    />
    <UpdateHostDialog
      v-model:isDrawerOpen="isUpdateHostDialogVisible"
      v-model:updateHostId="waitUpdateHostId"
      @host-data="updateHost"
    />
    <VDialog v-model="isDialogVisible" persistent class="v-dialog-sm">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

      <!-- Dialog Content -->
      <VCard title="╥﹏╥... 您确定要删除此物理机吗?">
        <VCardText> 删除此物理机会将与物理机关联的所有信息删除 </VCardText>

        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <VBtn
            color="secondary"
            variant="tonal"
            @click="isDialogVisible = false"
          >
            取消
          </VBtn>
          <VBtn color="error" @click="(isDialogVisible = false), deleteHost()">
            删除
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
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
