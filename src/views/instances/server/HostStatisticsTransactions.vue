<script setup>
import { ref } from "vue";
import axios from "@axios";

const route = useRoute();
const hostId = ref(route.params.id);
const toggleSwitch = ref(false);

let dynamicData = ref();

let websocket = null;

const onOpen = () => {
  console.log("WebSocket连接成功,状态码:", websocket.readyState);
};

const onMessage = (event) => {
  // console.log('WebSocket收到消息:', event.data)
  dynamicData = JSON.parse(event.data);
  console.log(dynamicData);
  update();
};

const onError = () => {
  console.log("WebSocket连接错误,状态码:", websocket.readyState);
};

const onClose = () => {
  console.log("WebSocket连接关闭,状态码:", websocket.readyState);
};

const initWebSocket = () => {
  // 连接成功
  websocket.onopen = onOpen;

  // 收到消息的回调
  websocket.onmessage = onMessage;

  // 连接错误
  websocket.onerror = onError;

  // 连接关闭的回调
  websocket.onclose = onClose;
};

onMounted(() => {
  // WebSocket
  if ("WebSocket" in window) {
    websocket = new WebSocket(
      import.meta.env.VITE_WS_URL + "/getHostDynamicData/" + hostId.value
    );
    startSendDynamicData();
    initWebSocket();
  } else {
    alert("当前浏览器 不支持websocket");
  }
});

onUnmounted(() => {
  console.log("关闭websocket连接");
  websocket.close();
  stopSendDynamicData();
});

const startSendDynamicData = () => {
  axios.get("/host/startSendDynamicData/" + hostId.value).then((r) => {
    if (r.code == 200) {
      toggleSwitch.value = true;
    }
  });
};

const stopSendDynamicData = () => {
  axios.get("/host/stopSendDynamicData/" + hostId.value).then((r) => {
    if (r.code == 200) {
      toggleSwitch.value = false;
    }
  });
};

const changeSwitch = () => {
  if (toggleSwitch.value) {
    startSendDynamicData();
  } else {
    stopSendDynamicData();
  }
};

const statistics = ref([
  {
    title: "CPU Load",
    num: "None",
    icon: "tabler-chart-pie-2",
    color: "error",
  },
  {
    title: "Mem Free",
    num: "None",
    icon: "tabler-server",
    color: "success",
  },
  {
    title: "Downstream Rate",
    num: "None",
    icon: "tabler-arrow-down",
    color: "primary",
  },
  {
    title: "Upstream Rate",
    num: "None",
    icon: "tabler-arrow-up",
    color: "success",
  },
]);

const update = () => {
  statistics.value[0].num = dynamicData[hostId.value].cpuLoad + " %";
  statistics.value[1].num = dynamicData[hostId.value].memFree + " GB";
  //rx下行速率 tx上行速率
  statistics.value[2].num = dynamicData[hostId.value].rxPercent + " MB/s";
  statistics.value[3].num = dynamicData[hostId.value].txPercent + " MB/s";
};
</script>

<template>
  <VCard title="总览">
    <template #append>
      <div class="mt-n4 me-n2">
        <VBtn icon color="default" size="x-small" variant="plain">
          <VSwitch
            v-model="toggleSwitch"
            label="实时监控"
            @change="changeSwitch()"
          />
        </VBtn>
      </div>
    </template>

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
