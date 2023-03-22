<script setup>
import axios from '@axios'
import { ref } from "vue"

const count = ref([])

const statistics = ref([
  {
    title: '容器',
    num: 0,
    icon: 'tabler-chart-pie-2',
    color: 'primary',
  },
  {
    title: '运行',
    num: 0,
    icon: 'tabler-server',
    color: 'success',
  },
  {
    title: '停止',
    num: 0,
    icon: 'tabler-server',
    color: 'error',
  },
  {
    title: '未知',
    num: 0,
    icon: 'tabler-server',
    color: 'secondary',
  },
])

onBeforeMount(() => {
  update()
})

const update = () => {
  axios.get('/container/containerList/summaryStatistics').then(r => {
    statistics.value[0].num = r.data.total
    statistics.value[1].num = r.data.running
    statistics.value[2].num = r.data.exited
    statistics.value[3].num = r.data.unknown
  })
}

defineExpose({
  update,
})
</script>

<template>
  <VCard title="总览">
    <VCardText>
      <VRow>
        <VCol v-for="item in statistics" :key="item.title" cols="6" md="3">
          <div class="d-flex">
            <VAvatar :color="item.color" variant="tonal" size="42" class="me-3">
              <VIcon size="24" :icon="item.icon" />
            </VAvatar>

            <div class="d-flex flex-column">
              <span class="text-h6 font-weight-medium">{{ item.num }}</span>
              <span class="text-caption">
                {{ item.title }}
              </span>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
