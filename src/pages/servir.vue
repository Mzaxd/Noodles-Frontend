<script setup>
import AddNewServirDialog from "@/views/servir/AddNewServirDialog.vue";
import UpdateServirDialog from "@/views/servir/UpdateServirDialog.vue";
import RemarkDialog from "@/views/servir/remarkDialog.vue";
import axios from "@axios";
import { avatarText } from "@core/utils/formatters";
import qs from "qs";

const isRemarkDialogVisible = ref(false);
const isDialogVisible = ref(false);
const isAddNewServirDialogVisible = ref(false);
const isUpdateServirDialogVisible = ref(false);
const waitUpdateServirId = ref();
const waitDeleteId = ref();
const servirId = ref();
const searchQuery = ref("");
const selectedTags = ref();
const rowPerPage = ref(10);
const currentPage = ref(1);
const totalPage = ref(1);
const total = ref(0);
const servirs = ref([]);
const selectedRows = ref([]);
const tags = ref([]);

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

const addNewServir = (servirData) => {
  axios
    .post("/servir/addServir", {
      servir: servirData,
    })
    .then((r) => {
      Message(r);

      // refetch hosts
      fetchServirs();
    });
};

const updateServir = (servirData) => {
  axios
    .post("/servir/updateServir", {
      servir: servirData,
    })
    .then((r) => {
      Message(r);

      // refetch Vms
      fetchServirs();
    });
};

const deleteServir = () => {
  const id = waitDeleteId.value;

  axios.delete("/servir/deleteServir/" + id).then((r) => {
    Message(r);

    // refetch Vms
    fetchServirs();
  });
};

// 👉 Fetching Servirs
const fetchServirs = () => {
  //拼接url
  const url =
    "/servir/servirList?" +
    qs.stringify(
      {
        perPage: rowPerPage.value,
        currentPage: currentPage.value,
        q: searchQuery.value,
        selectedTags: selectedTags.value,
      },
      { arrayFormat: "repeat" }
    );

  axios
    .get(url)
    .then((response) => {
      servirs.value = response.data.list;
      totalPage.value = response.data.pages;
      total.value = response.data.total;

    })
    .catch((error) => {
      console.error(error);
    });
};

onBeforeMount(() => {
  axios.get("/servir/tags").then((r) => {
    tags.value = r.data;
  });
});

// 👉 Fetch Invoices
watchEffect(fetchServirs);

// 👉 Fetch Invoices
watchEffect(() => {
  if (currentPage.value > totalPage.value) {
    currentPage.value = totalPage.value;
  }
});

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = servirs.value.length
    ? (currentPage.value - 1) * rowPerPage.value + 1
    : 0;
  const lastIndex =
    servirs.value.length + (currentPage.value - 1) * rowPerPage.value;

  return `Showing ${firstIndex} to ${lastIndex} of ${total.value} entries`;
});
</script>



<template>
  <section>
    <VCard v-if="servirs" id="server-list">
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
            @click="isAddNewServirDialogVisible = true"
          >
            添加新服务
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
              v-model="selectedTags"
              label="标签"
              :items="tags"
              item-title="name"
              item-value="id"
              multiple=""
              clearable
              clear-icon="tabler-x"
              prepend-inner-icon="tabler-filter"
            >
              <template #selection="{ item }">
                <VChip>
                  <span>{{ item.title }}</span>
                </VChip>
              </template>
            </VSelect>
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
            <th scope="col">关联实例</th>
            <th class="text-center" scope="col">标签</th>
            <th class="text-center" scope="col">操作</th>
          </tr>
        </thead>
        <!-- 👉 table body -->
        <tbody>
          <tr
            v-for="servir in servirs"
            :key="servir.id"
            style="height: 3.75rem"
          >
            <!-- 👉 Name -->
            <td>
              <div class="d-flex align-center">
                <VAvatar rounded variant="tonal" class="me-3" size="large">
                  <VImg v-if="servir.avatar" :src="servir.avatar" />
                  <span v-else>{{ avatarText(servir.name) }}</span>
                </VAvatar>

                <div class="d-flex flex-column">
                  <h6 class="text-base">
                    {{ servir.name }}
                  </h6>
                </div>
              </div>
            </td>

            <!-- 👉 Description -->
            <td>
              <span class="text-base">{{ servir.description }}</span>
            </td>

            <!-- 👉 Instances -->
            <td>
              <VAvatar
                v-for="host in servir.hosts"
                :key="host.id"
                rounded="lg"
                variant="tonal"
                class="me-3"
                size="small"
              >
                <VImg v-if="host.avatar" :src="host.avatar" />
                <VTooltip
                  location="top"
                  activator="parent"
                  transition="scale-transition"
                >
                  {{ host.name }}({{ host.description }})
                </VTooltip>
              </VAvatar>
              <VAvatar
                v-for="container in servir.containers"
                :key="container.id"
                rounded="lg"
                variant="tonal"
                class="me-3"
                size="small"
              >
                <VImg v-if="container.avatar" :src="container.avatar" />
                <VTooltip
                  location="top"
                  activator="parent"
                  transition="scale-transition"
                >
                  {{ container.name }}({{ container.description }})
                </VTooltip>
              </VAvatar>
            </td>

            <!-- 👉 Tags -->
            <td class="text-center">
              <VChip
                v-for="tag in servir.tags"
                :key="tag.id"
                color="info"
              >
                <span>{{ tag.name }}</span>
              </VChip>
            </td>

            <!-- 👉 Actions -->
            <td style="width: 5rem">
              <VBtn
                icon
                size="x-small"
                color="default"
                variant="text"
                @click="
                  (isRemarkDialogVisible = true),
                    (servirId = servir.id)
                "
              >
                <VIcon size="22" icon="tabler-note" />
              </VBtn>

              <VBtn
                icon
                size="x-small"
                color="default"
                variant="text"
                @click="
                  (isUpdateServirDialogVisible = true),
                    (waitUpdateServirId = servir.id)
                "
              >
                <VIcon size="22" icon="tabler-edit" />
              </VBtn>

              <VBtn
                icon="tabler-trash"
                size="x-xl"
                color="default"
                variant="text"
                @click="
                  (isDialogVisible = !isDialogVisible),
                    (waitDeleteId = servir.id)
                "
              />
            </td>
          </tr>
        </tbody>

        <!-- 👉 table footer  -->
        <tfoot v-show="!servirs.length">
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
    <AddNewServirDialog
      v-model:isDrawerOpen="isAddNewServirDialogVisible"
      @servir-data="addNewServir"
    />
    <UpdateServirDialog
      v-model:isDrawerOpen="isUpdateServirDialogVisible"
      v-model:updateServirId="waitUpdateServirId"
      @servir-data="updateServir"
    />
    <VDialog v-model="isDialogVisible" persistent class="v-dialog-sm">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

      <!-- Dialog Content -->
      <VCard title="╥﹏╥... 您确定要删除此服务吗?">
        <VCardText> 删除此服务不会将其关联的实例删除 </VCardText>

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
            @click="(isDialogVisible = false), deleteServir()"
          >
            删除
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
    <RemarkDialog
      v-model:isDrawerOpen="isRemarkDialogVisible"
      v-model:servirId="servirId"
    />
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
