<script setup>

let dynamicData = null;

const total = ref();
const usageRate = ref();
const max = ref();
const jdkVersion = ref();
const free = ref();
const user = ref();
const freeRate = ref()

let websocket = null

const onOpen = () => {
  console.log('WebSocket连接成功,状态码:', websocket.readyState)
}

const onMessage = event => {
  // console.log('WebSocket收到消息:', event.data)
  dynamicData = JSON.parse(event.data)
  total.value = dynamicData.total
  usageRate.value = Number(dynamicData.usageRate.replace('%', '')).toFixed(1) + '%'
  max.value = dynamicData.max
  jdkVersion.value = dynamicData.jdkVersion
  free.value = dynamicData.free
  user.value = dynamicData.user
  
  freeRate.value = (100 - usageRate.value.replace('%', '')).toFixed(1) + '%'
}

const onError = () => {
  console.log('WebSocket连接错误,状态码:', websocket.readyState)
}

const onClose = () => {
  console.log('WebSocket连接关闭,状态码:', websocket.readyState)
}

const initWebSocket = () => {
  // 连接成功
  websocket.onopen = onOpen

  // 收到消息的回调
  websocket.onmessage = onMessage

  // 连接错误
  websocket.onerror = onError

  // 连接关闭的回调
  websocket.onclose = onClose
}

onMounted(() => {
  // WebSocket
  if ('WebSocket' in window) {
    // 连接地址:ws://127.0.0.1:8880/ws/xxx
    websocket = new WebSocket("ws://localhost:6081/ws/getNoodlesJvmInfo")

    initWebSocket()

    // 关闭
    // websocket.close();
  } else {
    alert('当前浏览器 不支持websocket')
  }
})

onUnmounted(() => {
  console.log("关闭websocket连接")
  websocket.close()
})

</script>
<template>
  <VCard>
    <VCardText>
      <div class="d-flex align-center justify-space-between">
        <span class="text-sm text-disabled">Jvm监控</span>
        <span class="text-success">{{ jdkVersion }}</span>
      </div>
      <h5 class="text-h5">
        {{ total }}
      </h5>
    </VCardText>

    <VCardText>
      <VRow no-gutters>
        <VCol cols="5">
          <div class="d-flex align-center mb-3">
            <VAvatar color="warning" variant="tonal" :size="30" rounded class="me-2">
              <VIcon size="18" icon="tabler-stack-2" />
            </VAvatar>

            <span>Used</span>
          </div>
          <h6 class="text-h6">
            {{ usageRate }}
          </h6>
          <span class="text-sm text-disabled">{{ user }}</span>
        </VCol>

        <VCol cols="2">
          <div class="d-flex flex-column align-center justify-center h-100">
            <VDivider vertical class="mx-auto" />

            <div class="pa-1">
              <VChip size="20">
                <span class="text-xs pa-1">VS</span>
              </VChip>
            </div>

            <VDivider vertical class="mx-auto" />
          </div>
        </VCol>

        <VCol cols="5" class="text-end">
          <div class="d-flex align-center justify-end mb-3">
            <span class="me-2">Free</span>

            <VAvatar color="success" variant="tonal" :size="30" rounded>
              <VIcon size="18" icon="tabler-backpack" />
            </VAvatar>
          </div>
          <h6 class="text-h6">
            {{ freeRate }} 
          </h6>
          <span class="text-sm text-disabled">{{ free }}</span>
        </VCol>
      </VRow>

      <div class="mt-6">
        <VProgressLinear :model-value="usageRate" color="primary" height="8" rounded />
      </div>
    </VCardText>
  </VCard>
</template>
