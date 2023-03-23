<script setup>
import AddNewContainerDrawer from "@/views/instances/container/AddNewContainerDrawer.vue";
import ContainerStatisticsTransactions from "@/views/instances/container/ContainerStatisticsTransactions.vue";
import UpdateContainerDialog from "@/views/instances/container/UpdateContainerDialog.vue";
import axios from "@axios";
import qs from "qs";
import { ref } from "vue";
import { avatarText } from '@core/utils/formatters'

const snackBarlocation = ref("top");
const snackBarColor = ref();
const containerStatistics = ref();
const waitDeleteId = ref();
const waitUpdateContainerId = ref();
const isDialogVisible = ref(false);
const isSnackbarVisible = ref(false);
const msg = ref("");
const searchQuery = ref();
const selectedHost = ref();
const selectedStatus = ref();
const rowPerPage = ref(5);
const currentPage = ref(1);
const totalPage = ref(1);
const total = ref(0);
const containers = ref([]);
const allHost = ref([]);

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
  axios.get("/container/allHost").then((r) => {
    allHost.value = r.data;
  });
});

// 👉 Fetching Containers
const fetchContainers = () => {
  //拼接url
  const url =
    "/container/containerList?" +
    qs.stringify(
      {
        perPage: rowPerPage.value,
        currentPage: currentPage.value,
        q: searchQuery.value,
        selectedHost: selectedHost.value,
        selectedStatus: selectedStatus.value,
      },
      { arrayFormat: "repeat" }
    );

  axios
    .get(url)
    .then((response) => {
      containers.value = response.data.list;
      totalPage.value = response.data.pages;
      total.value = response.data.total;
      containerStatistics.value.update();
    })
    .catch((error) => {
      console.error(error);
    });
};

// 👉 add Container
const addNewContainer = (containerData) => {
  axios
    .post("/container/addContainer", {
      container: containerData,
    })
    .then((r) => {
      Message(r);

      // refetch Containers
      fetchContainers();
    });
};

const updateContainer = (containerData) => {
  axios
    .post("/container/updateContainer", {
      container: containerData,
    })
    .then((r) => {
      Message(r);

      // refetch Containers
      fetchContainers();
    });
};

const deleteContainer = () => {
  const id = waitDeleteId.value;

  axios.delete("/container/delete/" + id).then((r) => {
    Message(r);

    // refetch Containers
    fetchContainers();
  });
};

watchEffect(fetchContainers);

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value) currentPage.value = totalPage.value;
});

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = containers.value.length
    ? (currentPage.value - 1) * rowPerPage.value + 1
    : 0;
  const lastIndex =
    containers.value.length + (currentPage.value - 1) * rowPerPage.value;

  return `Showing ${firstIndex} to ${lastIndex} of ${total.value} entries`;
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
    title: "正在运行",
    value: "0",
  },
  {
    title: "已关闭",
    value: "1",
  },
  {
    title: "暂停",
    value: "2",
  },
];

const resolveContainerUrl = (imageName) => {
  return "https://hub.docker.com/r/" + imageName;
};

const isAddNewContainerDrawerVisible = ref(false);
const isUpdateContainerDialogVisible = ref(false);

const resolveContainerStatusVariant = (state) => {
  if (state === 0) return "success";
  if (state === 1) return "error";
  if (state === 2) return "warning";

  return "secondary";
};

const resolveContainerStatus = (state) => {
  if (state === 0) return "Running";
  if (state === 1) return "Exited";
  if (state === 2) return "Paused";

  return "Unknown";
};

const resolveNotifyVariant = (notify) => {
  if (notify === 0) return "secondary";
  if (notify === 1) return "info";
  if (notify === 2) return "success";
  return "primary";
};

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
    <VRow>
      <VCol>
        <ContainerStatisticsTransactions ref="containerStatistics" />
      </VCol>

      <VCol cols="12">
        <VCard title="搜索过滤器">
          <!-- 👉 Filters -->
          <VCardText>
            <VRow>
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
              <!-- <VBtn
                variant="tonal"
                color="secondary"
                prepend-icon="tabler-screen-share"
              >
                导出(Excel)
              </VBtn> -->

              <!-- 👉 Add container button -->
              <VBtn
                prepend-icon="tabler-plus"
                @click="isAddNewContainerDrawerVisible = true"
              >
                添加容器
              </VBtn>
            </div>
          </VCardText>

          <VDivider />

          <VTable class="text-no-wrap">
            <!-- 👉 table head -->
            <thead>
              <tr>
                <th scope="col">名称</th>
                <th scope="col">镜像</th>
                <th scope="col">宿主机</th>
                <th class="text-center" scope="col">掉线提醒</th>
                <th class="text-center" scope="col">状态</th>
                <th class="text-center" scope="col">操作</th>
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody>
              <tr
                v-for="container in containers"
                :key="container.id"
                style="height: 3.75rem"
              >
                <!-- 👉 Name -->
                <td>
                  <div class="d-flex align-center">
                    <VAvatar
                      rounded="lg"
                      variant="tonal"
                      class="me-3"
                      size="38"
                    >
                      <VImg v-if="container.avatar" :src="container.avatar" />
                      <span v-else>{{ avatarText(container.name) }}</span>
                    </VAvatar>

                    <div class="d-flex flex-column">
                      <h6 class="text-base">
                        {{ container.name }}
                      </h6>
                      <span class="text-sm text-disabled">{{
                        container.description
                      }}</span>
                    </div>
                  </div>
                </td>

                <!-- 👉 image -->
                <td>
                  <span>{{ container.imageName }}</span>
                </td>

                <!-- 👉 host -->
                <td>
                  <div class="d-flex align-center">
                    <VAvatar
                      rounded="lg"
                      variant="tonal"
                      class="me-3"
                      size="x-small"
                    >
                      <VImg :src="container.hostMachine.avatar" />
                    </VAvatar>

                    <div class="d-flex flex-column">
                      <span class="text-sm text-disabled">{{
                        container.hostMachine.name
                      }}</span>
                    </div>
                  </div>
                </td>

                <td class="text-center">
                  <VAvatar
                    size="25"
                    :color="resolveNotifyVariant(container.notify)"
                    variant="tonal"
                  >
                    <VIcon
                      v-if="container.notify == 0"
                      size="22"
                      icon="tabler-bell-x"
                    />
                    <VIcon
                      v-if="container.notify == 1"
                      size="22"
                      icon="tabler-browser"
                    />
                    <VIcon
                      v-if="container.notify == 2"
                      size="22"
                      icon="tabler-mail"
                    />
                    <VIcon
                      v-if="container.notify == 3"
                      size="22"
                      icon="tabler-browser"
                    />
                  </VAvatar>
                  <VAvatar
                    v-if="container.notify == 3"
                    size="25"
                    :color="resolveNotifyVariant(container.notify)"
                    variant="tonal"
                  >
                    <VIcon
                      v-if="container.notify == 3"
                      size="22"
                      icon="tabler-mail"
                    />
                  </VAvatar>
                </td>

                <!-- 👉 Status -->
                <td class="text-center">
                  <VChip
                    label
                    :color="
                      resolveContainerStatusVariant(container.containerState)
                    "
                    size="small"
                    class="text-capitalize"
                    :text="resolveContainerStatus(container.containerState)"
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
                      (isUpdateContainerDialogVisible = true),
                        (waitUpdateContainerId = container.id)
                    "
                  >
                    <VIcon size="22" icon="tabler-edit" />
                  </VBtn>

                  <VBtn icon size="x-small" color="default" variant="text">
                    <VIcon size="22" icon="tabler-dots-vertical" />

                    <VMenu activator="parent">
                      <VList>
                        <VListItem
                          v-if="container.webUi"
                          @click="newPage(container.webUi)"
                        >
                          <VBtn
                            icon="tabler-brand-chrome"
                            size="x-xl"
                            color="default"
                            variant="text"
                          />
                        </VListItem>
                        <VListItem
                          v-if="container.sshId"
                          @click="newTerminalPage(container.sshId)"
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
                                (waitDeleteId = container.id)
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
            <tfoot v-show="!containers.length">
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
        <VCard title="您确定要删除此容器吗?">
          <VCardText> 删除此容器后将无法监控其状态 </VCardText>

          <VCardText class="d-flex justify-end gap-3 flex-wrap">
            <VBtn
              color="secondary"
              variant="tonal"
              @click="isDialogVisible = false"
            >
              取消
            </VBtn>
            <VBtn
              color="error"
              @click="(isDialogVisible = false), deleteContainer()"
            >
              删除
            </VBtn>
          </VCardText>
        </VCard>
      </VDialog>
    </VRow>

    <!-- 👉 Add New Vm -->
    <AddNewContainerDrawer
      v-model:isDrawerOpen="isAddNewContainerDrawerVisible"
      @container-data="addNewContainer"
    />

    <!-- 👉 Update User -->
    <UpdateContainerDialog
      v-model:isDrawerOpen="isUpdateContainerDialogVisible"
      v-model:updateContainerId="waitUpdateContainerId"
      @container-data="updateContainer"
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
