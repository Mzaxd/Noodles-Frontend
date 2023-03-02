<script setup>
import axios from "@axios";

const networkIfs = ref();
const route = useRoute();
const hostId = ref(route.params.id);

const fetchNetworkIfByHostId = () => {
  axios
    .get("/host/associatedNetworkIfs/" + hostId.value)
    .then((response) => {
      networkIfs.value = response.data;
    })
    .catch((error) => {
      console.error(error);
    });
};

const resolveDiskProgressVariant = progress => {
  if (progress <= 25)
    return 'error'
  if (progress > 25 && progress <= 50)
    return 'success'
  if (progress > 50 && progress <= 75)
    return 'primary'
  if (progress > 75 && progress <= 100)
    return 'warning'
  
  return 'secondary'
}

watchEffect(fetchNetworkIfByHostId);
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="此物理机的所有网卡">
        <VDivider />
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th scope="col">名称(系统)</th>
              <th scope="col">名称(硬件)</th>
              <th scope="col">IPv4地址</th>
              <th scope="col">别名</th>
              <th scope="col">Mac地址</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="networkIf in networkIfs" :key="networkIf.dirName" style="height: 3.75rem">
              <td class="text-medium-emphasis">
                {{ networkIf.name}}
              </td>

              <td class="text-medium-emphasis">
                {{ networkIf.displayName}}
              </td>

              <td class="text-medium-emphasis">
                {{ networkIf.ipv4addr}}
              </td>

              <td class="text-medium-emphasis">
                {{ networkIf.ifAlias}}
              </td>

              <td class="text-medium-emphasis">
                {{ networkIf.macaddr}}
              </td>

            </tr>
          </tbody>
        </VTable>
      </VCard>
    </VCol>
  </VRow>
</template>
