<script setup>
import About from './About.vue'
import ActivityTimeline from './ActivityTimeline.vue'
import axios from '@axios'

const route = useRoute()
const profileTabData = ref()

const fetchAboutData = () => {
    axios.get('/user/profile').then(response => {
      profileTabData.value = response.data
    })
}

watch(route, fetchAboutData, { immediate: true })
</script>

<template>
  <VRow v-if="profileTabData">
    <VCol
      md="4"
      cols="12"
    >
      <About :data="profileTabData" />
    </VCol>

    <VCol
      cols="12"
      md="8"
    >
      <VRow>
        <VCol cols="12">
          <ActivityTimeline />
        </VCol>
      </VRow>
    </VCol>
  </VRow>
</template>
