<script setup>
import axios from "@axios";
import freebsd from "@/assets/images/pics/freebsd.png";
import linux from "@/assets/images/pics/linux.png";
import windows7 from "@/assets/images/pics/windows7.png";
import { requiredValidator } from "@validators";

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  updateHostId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:isDrawerOpen", "hostData"]);

const id = ref();
const protocol = ref("");
const ip = ref("");
const port = ref("");
const snackBarlocation = ref("top");
const msg = ref("默认提示语");
const isSnackbarVisible = ref(false);
const snackBarColor = ref();
const isFormValid = ref(false);
const refForm = ref();
const name = ref("");
const description = ref("");
const avatarUrl = ref("");
const kernel = ref();
const manageIp = ref();
const notifySwitch = ref(true);
const notifyType = ref();
const sshHost = ref("")
const sshPort = ref("")
const sshUser = ref("")
const sshPwd = ref("")
const isPasswordVisible = ref(false)


const tryConnectDetector = () => {
  snackBarAlert("尝试连接探测器", "secondary", "center");
  axios
    .get(
      "/detector/isValidUrl/" +
      protocol.value +
      "/" +
      ip.value +
      "/" +
      port.value
    )
    .then((r) => {
      Message(r);
    });
};

const Message = (r) => {
  if (r.code == 200) {
    snackBarColor.value = "success";
    msg.value = 'o(^▽^)o ' + r.msg
  } else {
    snackBarColor.value = "error";
    msg.value = '╥﹏╥... ' + r.msg;
  }
  isSnackbarVisible.value = true;
};

const snackBarAlert = (r, color, location) => {
  snackBarColor.value = color;
  snackBarlocation.value = location;
  msg.value = r;
  isSnackbarVisible.value = true;
};

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit("update:isDrawerOpen", false);
  nextTick(() => {
    refForm.value?.reset();
    refForm.value?.resetValidation();
    fetchHostData();
  });
};

watchEffect(() => {
  if (props.updateHostId != undefined) {
    axios.get("/host/host/" + props.updateHostId).then((r) => {
      (id.value = r.data.id),
        (name.value = r.data.name),
        (description.value = r.data.description),
        (avatarUrl.value = r.data.avatar),
        (kernel.value = r.data.osKernel),
        (manageIp.value = r.data.manageIp),
        (protocol.value = r.data.protocol),
        (ip.value = r.data.ip),
        (port.value = r.data.port),
        (notifyType.value = r.data.notify),
        (sshHost.value = r.data.sshHost),
        (sshPort.value = r.data.sshPort),
        (sshUser.value = r.data.sshUser),
        (sshPwd.value = r.data.sshPwd);
      if (notifyType.value == 0) {
        notifySwitch.value = false;
      } else {
        notifySwitch.value = true;
      }
    });
  }
});

const fetchHostData = () => {
  if (props.updateHostId != undefined) {
    axios.get("/host/host/" + props.updateHostId).then((r) => {
      (id.value = r.data.id),
        (name.value = r.data.name),
        (description.value = r.data.description),
        (avatarUrl.value = r.data.avatar),
        (kernel.value = r.data.osKernel),
        (manageIp.value = r.data.manageIp),
        (protocol.value = r.data.protocol),
        (ip.value = r.data.ip),
        (port.value = r.data.port),
        (notifyType.value = r.data.notify),
        (sshHost.value = r.data.sshHost),
        (sshPort.value = r.data.sshPort),
        (sshUser.value = r.data.sshUser),
        (sshPwd.value = r.data.sshPwd);
      if (notifyType.value == 0) {
        notifySwitch.value = false;
      } else {
        notifySwitch.value = true;
      }
    });
  }
};

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit("hostData", {
        id: id.value,
        name: name.value,
        description: description.value,
        avatar: avatarUrl.value,
        protocol: protocol.value,
        manageIp: manageIp.value,
        oskernel: kernel.value,
        ip: ip.value,
        port: port.value,
        notify: notifySwitch.value ? notifyType.value : 0,
        sshHost: sshHost.value,
        sshPort: sshPort.value,
        sshUser: sshUser.value,
        sshPwd: sshPwd.value,
      });
      emit("update:isDrawerOpen", false);
      nextTick(() => {
        refForm.value?.reset();
        refForm.value?.resetValidation();
        fetchHostData();
      });
    }
  });
};

const allKernel = [
  {
    title: "Linux",
    value: 1,
  },
  {
    title: "WindowsNT",
    value: 2,
  },
  {
    title: "FreeBsd",
    value: 3,
  },
];

const allNotify = [
  {
    title: "不提醒",
    value: 0,
  },
  {
    title: "浏览器",
    value: 1,
  },
  {
    title: "邮件",
    value: 2,
  },
  {
    title: "浏览器&邮件",
    value: 3,
  },
];

const resolveOsAvatar = (kernel) => {
  if (kernel === 1) return linux;
  if (kernel === 2) return windows7;
  if (kernel === 3) return freebsd;
};

const handleDrawerModelValueUpdate = (val) => {
  emit("update:isDrawerOpen", val);
};
</script>

<template>
  <VDialog persistent temporary :width="600" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">
    <VCard title="编辑物理机">
      <VCardText>
        <!-- 👉 Form -->
        <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
          <VRow>
            <!-- 👉 Full name -->
            <VCol cols="12">
              <VTextField v-model="name" :rules="[requiredValidator]" label="名称（必填）"
                prepend-inner-icon="tabler-edit-circle" />
            </VCol>

            <!-- 👉 Email -->
            <VCol cols="12">
              <VTextField v-model="description" :rules="[requiredValidator]" label="描述（必填）"
                prepend-inner-icon="tabler-edit-circle" />
            </VCol>

            <!-- 👉 Role -->
            <VCol cols="12">
              <VSelect v-model="kernel" label="系统内核（必填）" :rules="[requiredValidator]" :items="allKernel" clearable
                clear-icon="tabler-x" prepend-inner-icon="tabler-select">
                <template #selection="{ item }">
                  <VChip>
                    <VAvatar start rounded="lg">
                      <VImg :src="resolveOsAvatar(item.value)" />
                    </VAvatar>
                    <span>{{ item.title }}</span>
                  </VChip>
                </template>
              </VSelect>
            </VCol>

            <!-- 👉 company -->
            <VCol cols="12">
              <VTextField v-model="avatarUrl" label="图标Url" prepend-inner-icon="tabler-edit-circle" />
            </VCol>

            <!-- 👉 company -->
            <VCol cols="12">
              <VTextField v-model="manageIp" label="管理界面IP地址(如果有)" prepend-inner-icon="tabler-edit-circle" />
            </VCol>

            <VCol cols="12">
              <span class="text-sm text-disabled">
                <VIcon>tabler-radar</VIcon>
                探测器配置（必填）
              </span>
              <VDivider />
            </VCol>
            <VCol cols="3">
              <VSelect v-model="protocol" label="类型" prepend-inner-icon="tabler-select" :rules="[requiredValidator]"
                :items="['http', 'https']" />
            </VCol>

            <!-- 👉 company -->
            <VCol cols="4">
              <VTextField v-model="ip" label="IP地址" prepend-inner-icon="tabler-edit-circle" />
            </VCol>
            <!-- 👉 company -->
            <VCol cols="3">
              <VTextField v-model="port" label="端口号" prepend-inner-icon="tabler-edit-circle" />
            </VCol>
            <VCol cols="2">
              <VBtn icon="tabler-link" color="info" @click="tryConnectDetector" />
            </VCol>


            <VCol cols="12">
              <span class="text-sm text-disabled">
                <VIcon>tabler-terminal</VIcon> 控制台
              </span>
              <VDivider />
            </VCol>

            <!-- 👉 company -->
            <VCol cols="8">
              <VTextField v-model="sshHost" label="Host地址" prepend-inner-icon="tabler-edit-circle" />
            </VCol>
            <!-- 👉 company -->
            <VCol cols="4">
              <VTextField v-model="sshPort" label="端口号" prepend-inner-icon="tabler-edit-circle" />
            </VCol>
            <!-- 👉 company -->
            <VCol cols="5">
              <VTextField v-model="sshUser" label="连接用户" prepend-inner-icon="tabler-edit-circle" />
            </VCol>
            <!-- 👉 company -->
            <VCol cols="7">
              <VTextField v-model="sshPwd" label="密码" :type="isPasswordVisible ? 'text' : 'password'"
                prepend-inner-icon="tabler-edit-circle"
                :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible" />
            </VCol>

            <VCol cols="12">
              <span class="text-sm text-disabled">
                <VIcon>tabler-bell</VIcon> 提醒
              </span>
              <VDivider />
            </VCol>
            <VCol cols="3">
              <VSwitch v-model="notifySwitch" label="离线提醒" color="primary" :true-value="true" :false-value="false" />
            </VCol>
            <VCol cols="6">
              <VSelect :disabled="!notifySwitch" v-model="notifyType" label="提醒方式" prepend-inner-icon="tabler-select"
                :rules="[requiredValidator]" :items="allNotify" />
            </VCol>

            <!-- 👉 Submit and Cancel -->
            <VCardText class="d-flex justify-end flex-wrap gap-3">
              <VBtn type="submit" class="me-3"> 保存 </VBtn>
              <VBtn type="reset" variant="tonal" color="secondary" @click="closeNavigationDrawer">
                取消
              </VBtn>
            </VCardText>
            <VSnackbar v-model="isSnackbarVisible" :color="snackBarColor" :location="snackBarlocation" :timeout="1000">
              {{ msg }}
            </VSnackbar>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
