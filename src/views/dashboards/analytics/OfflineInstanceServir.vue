<script setup>
import { avatarText } from "@core/utils/formatters";
import { ref } from "vue";
import axios from "@axios";
import qs from "qs";

const servirs = ref([]);

const fetchAffectedServir = () => {
  axios.get("/dashboard/getAffectedServirList").then((response) => {
    servirs.value = response.data;
  });
};

// 👉 Fetch servirs
watchEffect(fetchAffectedServir);
</script>

<template>
  <VCard v-if="servirs">
    <VCardItem
      class="servir-header d-flex flex-wrap justify-space-between py-4 gap-4"
    >
      <VCardTitle>异常服务</VCardTitle>
    </VCardItem>

    <VDivider />

    <!-- SECTION Table -->
    <VTable class="text-no-wrap">
      <!-- 👉 Table head -->
      <thead>
        <tr>
          <th scope="col" class="font-weight-semibold">名称</th>
          <th scope="col" class="font-weight-semibold">异常实例</th>
        </tr>
      </thead>

      <!-- 👉 Table Body -->
      <tbody>
        <tr v-for="servir in servirs" :key="servir.name" style="height: 3.5rem">
          <!-- 👉 Name -->
          <td>
            <div class="d-flex align-center gap-3">
              <VAvatar variant="tonal" color="primary" size="38">
                <VImg v-if="servir.avatar" :src="servir.avatar" />
                <span v-else class="font-weight-semibold">{{
                  avatarText(servir.name)
                }}</span>
              </VAvatar>

              <div>
                <h6 class="text-base text-medium-emphasis font-weight-semibold">
                  {{ servir.name }}
                </h6>
                <span class="text-disabled">{{ servir.description }}</span>
              </div>
            </div>
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
        </tr>
      </tbody>

      <!-- 👉 table footer  -->
      <tfoot v-show="!servirs.length">
        <tr>
          <td colspan="8" class="text-center text-body-1">No data available</td>
        </tr>
      </tfoot>
    </VTable>
    <!-- !SECTION -->

    <VDivider />

    <!-- !SECTION -->
  </VCard>
</template>

<style lang="scss">
.servir-header .v-card-item__append {
  padding-inline-start: 0;
}
</style>
