<script setup>
import freebsd from "@/assets/images/pics/freebsd.png";
import linux from "@/assets/images/pics/linux.png";
import windows7 from "@/assets/images/pics/windows7.png";
import axios from "@axios";
import { requiredValidator, associationValidator } from "@validators";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:isDrawerOpen", "vmData"]);

const isFormValid = ref(false);
const refForm = ref();
const name = ref("");
const description = ref("");
const avatarUrl = ref("");
const thread = ref();
const memory = ref();
const kernel = ref();
const host = ref();
const osName = ref();
const manageIp = ref();
let allHost = ref([]);
const notifySwitch = ref(false)
const notifyType = ref()
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
  {
    title: "11264MB",
    value: 11264,
  },
  {
    title: "12288MB",
    value: 12288,
  },
  {
    title: "13312MB",
    value: 13312,
  },
  {
    title: "14336MB",
    value: 14336,
  },
  {
    title: "15360MB",
    value: 15360,
  },
  {
    title: "16384MB",
    value: 16384,
  },
  {
    title: "17408MB",
    value: 17408,
  },
  {
    title: "18432MB",
    value: 18432,
  },
  {
    title: "19456MB",
    value: 19456,
  },
  {
    title: "20480MB",
    value: 20480,
  },
  {
    title: "21504MB",
    value: 21504,
  },
  {
    title: "22528MB",
    value: 22528,
  },
  {
    title: "23552MB",
    value: 23552,
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
    title: "?????????",
    value: 1,
  },
  {
    title: "??????",
    value: 2,
  },
  {
    title: "?????????&??????",
    value: 3,
  },
];

// ???? drawer close
const closeNavigationDrawer = () => {
  emit("update:isDrawerOpen", false);
  nextTick(() => {
    refForm.value?.reset();
    refForm.value?.resetValidation();
  });
};

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit("vmData", {
        name: name.value,
        description: description.value,
        avatar: avatarUrl.value,
        threads: thread.value,
        memory: memory.value,
        osKernel: kernel.value,
        osName: osName.value,
        manageIp: manageIp.value,
        hostMachineId: host.value,
        notify: notifyType.value,
        sshHost: sshHost.value,
        sshPort: sshPort.value,
        sshUser: sshUser.value,
        sshPwd: sshPwd.value
      });
      emit("update:isDrawerOpen", false);
      nextTick(() => {
        refForm.value?.reset();
        refForm.value?.resetValidation();
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
</script>

<template>
  <VNavigationDrawer temporary :width="400" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">
    <!-- ???? Title -->
    <div class="d-flex align-center pa-6 pb-1">
      <h6 class="text-h6">???????????????</h6>

      <VSpacer />

      <!-- ???? Close btn -->
      <VBtn variant="tonal" color="default" icon size="32" class="rounded" @click="closeNavigationDrawer">
        <VIcon size="18" icon="tabler-x" />
      </VBtn>
    </div>

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- ???? Form -->
          <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
            <VRow>
              <!-- ???? Full name -->
              <VCol cols="12">
                <VTextField v-model="name" :rules="[requiredValidator]" label="??????????????????"
                  prepend-inner-icon="tabler-edit-circle" />
              </VCol>

              <!-- ???? Email -->
              <VCol cols="12">
                <VTextField v-model="description" :rules="[requiredValidator]" label="??????????????????"
                  prepend-inner-icon="tabler-edit-circle" />
              </VCol>

              <!-- ???? company -->
              <VCol cols="12">
                <VTextField v-model="avatarUrl" label="??????Url" prepend-inner-icon="tabler-edit-circle" />
              </VCol>

              <!-- ???? company -->
              <VCol cols="12">
                <VTextField v-model="manageIp" label="????????????IP??????(?????????)" prepend-inner-icon="tabler-edit-circle" />
              </VCol>

              <!-- ???? Country -->
              <VCol cols="12">
                <VTextField v-model="thread" type="number" label="???????????????" prepend-inner-icon="tabler-selector" />
              </VCol>

              <!-- ???? Contact -->
              <VCol cols="12">
                <VSelect v-model="memory" label="????????????" :items="allMemory" prepend-inner-icon="tabler-select" />
              </VCol>

              <!-- ???? Role -->
              <VCol cols="12">
                <VSelect v-model="kernel" label="????????????????????????" :rules="[requiredValidator]" :items="allKernel" clearable
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

              <!-- ???? company -->
              <VCol cols="12">
                <VTextField v-model="osName" label="????????????" prepend-inner-icon="tabler-edit-circle" />
              </VCol>

              <!-- ???? Plan -->
              <VCol cols="12">
                <VSelect v-model="host" label="?????????????????????" :rules="[requiredValidator]" :items="allHost" item-title="name"
                  item-value="id" clearable clear-icon="tabler-x" prepend-inner-icon="tabler-select">
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
                  <VIcon>tabler-terminal</VIcon> ?????????
                </span>
                <VDivider />
              </VCol>

              <!-- ???? company -->
              <VCol cols="7">
                <VTextField v-model="sshHost" label="Host??????" prepend-inner-icon="tabler-edit-circle" />
              </VCol>
              <!-- ???? company -->
              <VCol cols="5">
                <VTextField v-model="sshPort" label="?????????" prepend-inner-icon="tabler-edit-circle" />
              </VCol>
              <!-- ???? company -->
              <VCol cols="5">
                <VTextField v-model="sshUser" label="????????????" prepend-inner-icon="tabler-edit-circle" />
              </VCol>
              <!-- ???? company -->
              <VCol cols="7">
                <VTextField v-model="sshPwd" label="??????" :type="isPasswordVisible ? 'text' : 'password'"
                  prepend-inner-icon="tabler-edit-circle"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible" />
              </VCol>

              <VCol cols="12">
                <span class="text-sm text-disabled">
                  <VIcon>tabler-bell</VIcon> ??????
                </span>
                <VDivider />
              </VCol>
              <VCol cols="5">
                <VSwitch v-model="notifySwitch" label="????????????" color="primary" />
              </VCol>
              <VCol cols="6">
                <VSelect :disabled="!notifySwitch" v-model="notifyType" label="????????????" prepend-inner-icon="tabler-select"
                  :rules="[associationValidator(notifySwitch, notifyType)]" :items="allNotify" />
              </VCol>

              <!-- ???? Submit and Cancel -->
              <VCol cols="12">
                <VBtn type="submit" class="me-3"> ?????? </VBtn>
                <VBtn type="reset" variant="tonal" color="secondary" @click="closeNavigationDrawer">
                  ??????
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
