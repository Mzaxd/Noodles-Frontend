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
    title: "δΈζι",
    value: 0,
  },
  {
    title: "ζ΅θ§ε¨",
    value: 1,
  },
  {
    title: "ι?δ»Ά",
    value: 2,
  },
  {
    title: "ζ΅θ§ε¨&ι?δ»Ά",
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

// π drawer close
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
    <VCard title="ηΌθΎθζζΊ">
      <VCardText>
        <!-- π Form -->
        <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
          <VRow>
            <!-- π Full name -->
            <VCol cols="12">
              <VTextField
                v-model="name"
                :rules="[requiredValidator]"
                label="εη§°οΌεΏε‘«οΌ"
                prepend-inner-icon="tabler-edit-circle"
              />
            </VCol>

            <!-- π Email -->
            <VCol cols="12">
              <VTextField
                v-model="description"
                :rules="[requiredValidator]"
                label="ζθΏ°οΌεΏε‘«οΌ"
                prepend-inner-icon="tabler-edit-circle"
              />
            </VCol>

            <!-- π company -->
            <VCol cols="12">
              <VTextField
                v-model="avatarUrl"
                label="εΎζ Url"
                prepend-inner-icon="tabler-edit-circle"
              />
            </VCol>

            <!-- π company -->
            <VCol cols="12">
              <VTextField
                v-model="manageIp"
                label="η?‘ηηι’IPε°ε(ε¦ζζ)"
                prepend-inner-icon="tabler-edit-circle"
              />
            </VCol>

            <!-- π Country -->
            <VCol cols="12" sm="6">
              <VTextField
                v-model="thread"
                type="number"
                label="ειηΊΏη¨ζ°"
                prepend-inner-icon="tabler-selector"
              />
            </VCol>

            <!-- π Contact -->
            <VCol cols="12" sm="6">
              <VSelect
                v-model="memory"
                label="ειεε­"
                :items="allMemory"
                prepend-inner-icon="tabler-select"
              />
            </VCol>

            <!-- π company -->
            <VCol cols="12">
              <VTextField
                v-model="osName"
                label="ζδ½η³»η»"
                prepend-inner-icon="tabler-edit-circle"
              />
            </VCol>

            <!-- π Role -->
            <VCol cols="12" sm="6">
              <VSelect
                v-model="kernel"
                label="η³»η»εζ ΈοΌεΏε‘«οΌ"
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

            <!-- π Plan -->
            <VCol cols="12" sm="6">
              <VSelect
                v-model="host"
                label="ε?ΏδΈ»ζΊοΌεΏε‘«οΌ"
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
                <VIcon>tabler-terminal</VIcon> ζ§εΆε°
              </span>
              <VDivider />
            </VCol>

            <!-- π company -->
            <VCol cols="8">
              <VTextField v-model="sshHost" label="Hostε°ε" prepend-inner-icon="tabler-edit-circle" />
            </VCol>
            <!-- π company -->
            <VCol cols="4">
              <VTextField v-model="sshPort" label="η«―ε£ε·" prepend-inner-icon="tabler-edit-circle" />
            </VCol>
            <!-- π company -->
            <VCol cols="5">
              <VTextField v-model="sshUser" label="θΏζ₯η¨ζ·" prepend-inner-icon="tabler-edit-circle" />
            </VCol>
            <!-- π company -->
            <VCol cols="7">
              <VTextField v-model="sshPwd" label="ε―η "
                :type="isPasswordVisible ? 'text' : 'password'"
                prepend-inner-icon="tabler-edit-circle"
                :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible" />
            </VCol>


            <VCol cols="12">
              <span class="text-sm text-disabled">
                <VIcon>tabler-bell</VIcon> ζι
              </span>
              <VDivider />
            </VCol>
            <VCol cols="3">
              <VSwitch
                v-model="notifySwitch"
                label="η¦»ηΊΏζι"
                color="primary"
                :true-value="true"
                :false-value="false"
              />
            </VCol>
            <VCol cols="6">
              <VSelect
                :disabled="!notifySwitch"
                v-model="notifyType"
                label="ζιζΉεΌ"
                prepend-inner-icon="tabler-select"
                :rules="[requiredValidator]"
                :items="allNotify"
              />
            </VCol>

            <!-- π Submit and Cancel -->
            <VCardText class="d-flex justify-end flex-wrap gap-3">
              <VBtn type="submit" class="me-3"> δΏε­ </VBtn>
              <VBtn
                type="reset"
                variant="tonal"
                color="secondary"
                @click="closeNavigationDrawer"
              >
                εζΆ
              </VBtn>
            </VCardText>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
