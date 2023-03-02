<script setup>
import axios from "@axios";

const disks = ref();
const route = useRoute();
const hostId = ref(route.params.id);

const fetchDiskByHostId = () => {
  axios
    .get("/host/associatedDisks/" + hostId.value)
    .then((response) => {
      disks.value = response.data;
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

watchEffect(fetchDiskByHostId);
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="此物理机的所有硬盘">
        <VDivider />
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th scope="col">名称</th>
              <th scope="col">文件系统</th>
              <th scope="col">使用情况</th>
              <th scope="col">已使用/总容量</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="disk in disks" :key="disk.dirName" style="height: 3.75rem">
              <td>
                <div class="d-flex align-center">
                  <div>
                    <p class="text-medium-emphasis">
                      {{ disk.name }}
                    </p>
                    <p class="text-medium-emphasis">
                      {{ disk.typeName }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="text-medium-emphasis">
                {{ disk.sysTypeName != "" ? disk.sysTypeName : "未格式化" }}
              </td>

              <td>
                <span>{{ Math.round(disk.usage) }}%</span>
                <VProgressLinear
                  :height="8"
                  :model-value="disk.usage"
                  rounded
                  :color="resolveDiskProgressVariant(disk.usage)"
                />
              </td>

              <td class="text-medium-emphasis">
                {{ disk.used }}  / {{ disk.total}}
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCard>
    </VCol>
  </VRow>
</template>
