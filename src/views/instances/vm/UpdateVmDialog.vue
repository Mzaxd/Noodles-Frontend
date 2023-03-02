<script setup>
import freebsd from "@/assets/images/pics/freebsd.png";
import linux from "@/assets/images/pics/linux.png";
import windows7 from "@/assets/images/pics/windows7.png";
import axios from "@axios";
import { requiredValidator, associationValidator } from "@validators";

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  updateVmId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:isDrawerOpen", "vmData"]);

const isFormValid = ref(false);
const id = ref();
const refForm = ref();
const name = ref("");
const description = ref("");
const avatarUrl = ref("");
const thread = ref();
const memory = ref();
const kernel = ref();
const osName = ref();
const manageIp = ref();
let allHost = ref([]);
const host = ref();
const notifySwitch = ref(true);
const notifyType = ref();
const sshHost = ref("")
const sshPort = ref()
const sshUser = ref("")
const sshPwd = ref("")
const isPasswordVisible = ref(false)

const allMemory = [
  {
    title: "128MB",
    value: 128,
  },
  {
    title: "256MB",
    value: 256,
  },
  {
    title: "512MB",
    value: 512,
  },
  {
    title: "1024MB",
    value: 1024,
  },
  {
    title: "1536MB",
    value: 1536,
  },
  {
    title: "2048MB",
    value: 2048,
  },
  {
    title: "2560MB",
    value: 2560,
  },
  {
    title: "3072MB",
    value: 3072,
  },
  {
    title: "3584MB",
    value: 3584,
  },
  {
    title: "4096MB",
    value: 4096,
  },
  {
    title: "4608MB",
    value: 4608,
  },
  {
    title: "5120MB",
    value: 5120,
  },
  {
    title: "6144MB",
    value: 6144,
  },
  {
    title: "7168MB",
    value: 7168,
  },
  {
    title: "8192MB",
    value: 8192,
  },
  {
    title: "9216MB",
    value: 9216,
  },
  {
    title: "10240MB",
    value: 10240,
  },
];

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

watchEffect(() => {
  if (props.updateVmId != undefined) {
    axios.get("/host/vm/" + props.updateVmId).then((r) => {
      id.value = r.data.id;
      (name.value = r.data.name),
        (description.value = r.data.description),
        (avatarUrl.value = r.data.avatar),
        (thread.value = r.data.threads),
        (memory.value = r.data.memory),
        (kernel.value = r.data.osKernel),
        (osName.value = r.data.osName),
        (manageIp.value = r.data.manageIp),
        (host.value = r.data.hostMachineId),
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

const fetchVmData = () => {
  if (props.updateVmId != undefined) {
    axios.get("/host/vm/" + props.updateVmId).then((r) => {
      id.value = r.data.id;
      (name.value = r.data.name),
        (description.value = r.data.description),
        (avatarUrl.value = r.data.avatar),
        (thread.value = r.data.threads),
        (memory.value = r.data.memory),
        (kernel.value = r.data.osKernel),
        (osName.value = r.data.osName),
        (manageIp.value = r.data.manageIp),
        (host.value = r.data.hostMachineId),
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

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit("update:isDrawerOpen", false);
  nextTick(() => {
    refForm.value?.reset();
    refForm.value?.resetValidation();
    fetchVmData();
  });
};

const onSubmit = () => {
  console.log(host.value);
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit("vmData", {
        id: id.value,
        name: name.value,
        description: description.value,
        avatar: avatarUrl.value,
        threads: thread.value,
        memory: memory.value,
        osKernel: kernel.value,
        osName: osName.value,
        manageIp: manageIp.value,
        hostMachineId: host.value,
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
        fetchVmData();
      });
    }
  });
};

onBeforeMount(() => {
  axios.get("/host/drawer").then((r) => {
    allHost = r.data;
  });
});

const handleDrawerModelValueUpdate = (val) => {
  emit("update:isDrawerOpen", val);
};

const resolveOsAvatar = (kernel) => {
  if (kernel === 1) return linux;
  if (kernel === 2) return windows7;
  if (kernel === 3) return freebsd;
};

const resolveHostAvatar = (rawAvatar) => {
  if (avatarUrl != null) return avatarUrl;
};
</script>

<template>
  <VDialog
    persistent
    temporary
    :width="600"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <VCard title="编辑虚拟机">
      <VCardText>
        <!-- 👉 Form -->
        <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
          <VRow>
            <!-- 👉 Full name -->
            <VCol cols="12">
              <VTextField
                v-model="name"
                :rules="[requiredValidator]"
                label="名称（必填）"
                prepend-inner-icon="tabler-edit-circle"
              />
            </VCol>

            <!-- 👉 Email -->
            <VCol cols="12">
              <VTextField
                v-model="description"
                :rules="[requiredValidator]"
                label="描述（必填）"
                prepend-inner-icon="tabler-edit-circle"
              />
            </VCol>

            <!-- 👉 company -->
            <VCol cols="12">
              <VTextField
                v-model="avatarUrl"
                label="图标Url"
                prepend-inner-icon="tabler-edit-circle"
              />
            </VCol>

            <!-- 👉 company -->
            <VCol cols="12">
              <VTextField
                v-model="manageIp"
                label="管理界面IP地址(如果有)"
                prepend-inner-icon="tabler-edit-circle"
              />
            </VCol>

            <!-- 👉 Country -->
            <VCol cols="12" sm="6">
              <VTextField
                v-model="thread"
                type="number"
                label="分配线程数"
                prepend-inner-icon="tabler-selector"
              />
            </VCol>

            <!-- 👉 Contact -->
            <VCol cols="12" sm="6">
              <VSelect
                v-model="memory"
                label="分配内存"
                :items="allMemory"
                prepend-inner-icon="tabler-select"
              />
            </VCol>

            <!-- 👉 company -->
            <VCol cols="12">
              <VTextField
                v-model="osName"
                label="操作系统"
                prepend-inner-icon="tabler-edit-circle"
              />
            </VCol>

            <!-- 👉 Role -->
            <VCol cols="12" sm="6">
              <VSelect
                v-model="kernel"
                label="系统内核（必填）"
                :rules="[requiredValidator]"
                :items="allKernel"
                clearable
                clear-icon="tabler-x"
                prepend-inner-icon="tabler-select"
              >
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

            <!-- 👉 Plan -->
            <VCol cols="12" sm="6">
              <VSelect
                v-model="host"
                label="宿主机（必填）"
                :rules="[requiredValidator]"
                :items="allHost"
                item-title="name"
                item-value="id"
                clearable
                clear-icon="tabler-x"
                prepend-inner-icon="tabler-select"
              >
                <template #selection="{ item }">
                  <VChip>
                    <VAvatar rounded="lg" :image="item.raw.avatar" />
                    <span>{{ item.title }}</span>
                  </VChip>
                </template>
              </VSelect>
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
              <VTextField v-model="sshPwd" label="密码"
                :type="isPasswordVisible ? 'text' : 'password'"
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
              <VSwitch
                v-model="notifySwitch"
                label="离线提醒"
                color="primary"
                :true-value="true"
                :false-value="false"
              />
            </VCol>
            <VCol cols="6">
              <VSelect
                :disabled="!notifySwitch"
                v-model="notifyType"
                label="提醒方式"
                prepend-inner-icon="tabler-select"
                :rules="[requiredValidator]"
                :items="allNotify"
              />
            </VCol>

            <!-- 👉 Submit and Cancel -->
            <VCardText class="d-flex justify-end flex-wrap gap-3">
              <VBtn type="submit" class="me-3"> 保存 </VBtn>
              <VBtn
                type="reset"
                variant="tonal"
                color="secondary"
                @click="closeNavigationDrawer"
              >
                取消
              </VBtn>
            </VCardText>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
