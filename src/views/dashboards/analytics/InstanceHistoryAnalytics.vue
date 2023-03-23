<script setup>
import { VIcon } from 'vuetify/components'
import sliderBar1 from '@images/illustrations/sidebar-pic-1.png'
import sliderBar2 from '@images/illustrations/sidebar-pic-2.png'
import sliderBar3 from '@images/illustrations/sidebar-pic-3.png'

import axios from "@axios";


const fetchInstancesHistory = () => {
  axios.get('/dashboard/getInstancesHistory').then(r => {
    InstanceHistoryData.value[0].data[0].number = r.data.hostCount
    InstanceHistoryData.value[0].data[1].number = r.data.hostOnlineCount
    InstanceHistoryData.value[0].data[2].number = r.data.hostOfflineCount
    InstanceHistoryData.value[0].data[3].number = r.data.hostUnknownCount
    InstanceHistoryData.value[1].data[0].number = r.data.vmCount
    InstanceHistoryData.value[1].data[1].number = r.data.vmOnlineCount
    InstanceHistoryData.value[1].data[2].number = r.data.vmOfflineCount
    InstanceHistoryData.value[1].data[3].number = r.data.vmUnknownCount
    InstanceHistoryData.value[2].data[0].number = r.data.containerCount
    InstanceHistoryData.value[2].data[1].number = r.data.containerOnlineCount
    InstanceHistoryData.value[2].data[2].number = r.data.containerOfflineCount
    InstanceHistoryData.value[2].data[3].number = r.data.containerUnknownCount
  })
}

watchEffect(fetchInstancesHistory);

const InstanceHistoryData = ref([
  {
    name: '物理机',
    slideImg: sliderBar1,
    data: [
      {
        number: '0',
        text: '总',
      },
      {
        number: '0',
        text: '在线',
      },
      {
        number: '0',
        text: '离线',
      },
      {
        number: '0',
        text: '未知',
      },
    ],
  },
  {
    name: '虚拟机',
    slideImg: sliderBar2,
    data: [
      {
        number: '0',
        text: '总',
      },
      {
        number: '0',
        text: '在线',
      },
      {
        number: '0',
        text: '离线',
      },
      {
        number: '0',
        text: '未知',
      },
    ],
  },
  {
    name: '容器',
    slideImg: sliderBar3,
    data: [
      {
        number: '0',
        text: '总',
      },
      {
        number: '0',
        text: '在线',
      },
      {
        number: '0',
        text: '离线',
      },
      {
        number: '0',
        text: '未知',
      },
    ],
  },
])
</script>

<template>
  <VCard color="primary">
    <VCarousel cycle :continuous="false" :show-arrows="false" hide-delimiter-background
      :delimiter-icon="() => h(VIcon, { icon: 'fa-circle', size: '10' })" height="auto"
      class="carousel-delimiter-top-end web-analytics-carousel">
      <VCarouselItem v-for="item in InstanceHistoryData" :key="item.name">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <h6 class="text-h6 text-white mb-1">
                昨日实例统计
              </h6>
              <p class="text-sm mb-0">
                记录昨日所有类型实例在线状态
              </p>
            </VCol>

            <VCol cols="12" sm="6" order="2" order-sm="1">
              <VRow>
                <VCol cols="12" class="pb-0">
                  <p class="font-weight-semibold">
                    {{ item.name }}
                  </p>
                </VCol>

                <VCol v-for="d in item.data" :key="d.number" cols="6" class="text-no-wrap">
                  <VChip label class="me-2">
                    {{ d.number }}
                  </VChip>
                  <span>{{ d.text }}</span>
                </VCol>
              </VRow>
            </VCol>

            <VCol cols="12" sm="6" order="1" order-sm="2" class="position-relative text-center">
              <img :src="item.slideImg" class="card-website-analytics-img">
            </VCol>
          </VRow>
        </VCardText>
      </VCarouselItem>
    </VCarousel>
  </VCard>
</template>

<style lang="scss">
.card-website-analytics-img {
  block-size: 160px;
}

@media screen and (min-width: 600px) {
  .card-website-analytics-img {
    position: absolute;
    margin: auto;
    inset-block-end: 40px;
    inset-block-start: -1rem;
    inset-inline-end: 1rem;
  }
}

.web-analytics-carousel {
  .v-carousel__controls {
    .v-btn:not(.v-btn--active) {
      opacity: 0.4;
    }
  }
}
</style>

