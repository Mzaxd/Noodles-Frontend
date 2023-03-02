<script setup>
import axios from "@axios";
import qs from "qs";

const containers = ref([]);
const route = useRoute();
const hostId = ref(route.params.id);

const rowPerPage = ref(5);
const currentPage = ref(1);
const totalPage = ref(1);
const total = ref(0);

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

const fetchContainerByHostId = () => {
  //拼接url
  const url =
    "/container/associatedContainers?" +
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
      containers.value = response.data.list;
      totalPage.value = response.data.pages;
      total.value = response.data.total;
    })
    .catch((error) => {
      console.error(error);
    });
};

const resolveContainerUrl = (imageName) => {
  return "https://hub.docker.com/r/" + imageName;
};

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

const resolveContainerStatusVariant = (state) => {
  if (state === 0) return "success";
  if (state === 1) return "error";
  if (state === 2) return "warning";

  return "secondary";
};

const resolveContainerStatus = (state) => {
  if (state === 0) return "Online";
  if (state === 1) return "Offline";
  if (state === 2) return "Sleep";

  return "Unknown";
};

watchEffect(fetchContainerByHostId);
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Rows per page -->
          <div class="d-flex align-center" style="width: 135px">
            <span class="text-no-wrap me-3">Show:</span>
            <VSelect
              v-model="rowPerPage"
              density="compact"
              :items="[5, 10, 20]"
            />
          </div>
        </VCardText>
        <VDivider />
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th scope="col">名称</th>
              <th scope="col">镜像</th>
              <th class="text-center" scope="col">状态</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="container in containers"
              :key="container.id"
              style="height: 3.75rem"
            >
              <td>
                <div class="d-flex align-center">
                  <VAvatar :size="38" class="me-3" :image="container.avatar" />
                  <div>
                    <p class="text-base mb-0">
                      {{ container.name }}
                    </p>
                    <p class="text-sm text-disabled mb-0">
                      {{ container.description }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- 👉 image -->
              <td>
                <a
                  style="color: rgb(93, 173, 226)"
                  :href="resolveContainerUrl(container.imageName)"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {{ container.imageName }}
                </a>
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
            </tr>
          </tbody>
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
  </VRow>
</template>
