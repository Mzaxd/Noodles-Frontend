<script setup>
import axios from '@axios'
import {
  requiredValidator,
} from '@validators'


const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  updateContainerId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'containerData',
])


const isFormValid = ref(false)
const id = ref()
const refForm = ref()
const name = ref('')
const description = ref('')
const avatarUrl = ref('')
const imageName = ref('')
const webUi = ref('')
let allHost = ref([])
const host = ref()
const notifySwitch = ref(true);
const notifyType = ref();
const sshType = ref("")
const sshHost = ref("")
const sshPort = ref()
const sshUser = ref("")
const sshPwd = ref("")
const containerId = ref("")

const isPasswordVisible = ref(false)


watchEffect(() => {
  if (props.updateContainerId != undefined) {
    axios.get('/container/' + props.updateContainerId).then(r => {
      id.value = r.data.id
      name.value = r.data.name,
        description.value = r.data.description,
        avatarUrl.value = r.data.avatar,
        imageName.value = r.data.imageName
      webUi.value = r.data.webUi
      host.value = r.data.hostMachineId,
        (notifyType.value = r.data.notify),
        (sshType.value = r.data.sshType),
        (sshHost.value = r.data.sshHost),
        (sshPort.value = r.data.sshPort),
        (sshUser.value = r.data.sshUser),
        (sshPwd.value = r.data.sshPwd),
        (containerId.value = r.data.containerId)
      if (notifyType.value == 0) {
        notifySwitch.value = false;
      } else {
        notifySwitch.value = true;
      }
    })
  }
})

const fetchContainerData = () => {
  if (props.updateContainerId != undefined) {
    axios.get('/container/' + props.updateContainerId).then(r => {
      id.value = r.data.id
      name.value = r.data.name,
        description.value = r.data.description,
        avatarUrl.value = r.data.avatar,
        imageName.value = r.data.imageName
      webUi.value = r.data.webUi
      host.value = r.data.hostMachineId,
        (notifyType.value = r.data.notify),
        (sshType.value = r.data.sshType),
        (sshHost.value = r.data.sshHost),
        (sshPort.value = r.data.sshPort),
        (sshUser.value = r.data.sshUser),
        (sshPwd.value = r.data.sshPwd),
        (containerId.value = r.data.containerId)
      if (notifyType.value == 0) {
        notifySwitch.value = false;
      } else {
        notifySwitch.value = true;
      }
    })
  }
}


// 👉 drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
    fetchContainerData()
  })
}

const onSubmit = () => {
  console.log(host.value)
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit('containerData', {
        id: id.value,
        name: name.value,
        description: description.value,
        avatar: avatarUrl.value,
        imageName: imageName.value,
        webUi: webUi.value,
        hostMachineId: host.value,
        notify: notifySwitch.value ? notifyType.value : 0,
        sshType: sshType.value,
        sshHost: sshHost.value,
        sshPort: sshPort.value,
        sshUser: sshUser.value,
        sshPwd: sshPwd.value,
        containerId: containerId.value,
      })
      emit('update:isDrawerOpen', false)
      nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
        fetchContainerData()
      })
    }
  })
}

onBeforeMount(() => {
  axios.get('/container/allHost').then(r => {
    allHost = r.data
  })
})

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

const resolveHostAvatar = rawAvatar => {
  if (avatarUrl != null)
    return avatarUrl
}

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
</script>

<template>
  <VDialog persistent temporary :width="600" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">
    <VCard title="编辑容器">
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

            <!-- 👉 company -->
            <VCol cols="12">
              <VTextField v-model="avatarUrl" label="图标Url" prepend-inner-icon="tabler-edit-circle" />
            </VCol>

            <!-- 👉 Country -->
            <VCol cols="12">
              <VTextField v-model="imageName" label="镜像" prepend-inner-icon="tabler-edit-circle" />
            </VCol>

            <VCol cols="12">
              <VTextField v-model="webUi" label="WebUi地址" prepend-inner-icon="tabler-edit-circle" />
            </VCol>

            <!-- 👉 Plan -->
            <VCol cols="12" sm="6">
              <VSelect v-model="host" label="宿主机（必填）" :rules="[requiredValidator]" :items="allHost" item-title="name"
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
                <VIcon>tabler-terminal</VIcon> 控制台
              </span>
              <VDivider />
            </VCol>

            <!-- 👉 company -->
            <VCol cols="3">
              <VSelect v-model="sshType" label="类型" prepend-inner-icon="tabler-select" :items="['bash', 'sh']" />
            </VCol>
            <!-- 👉 company -->
            <VCol cols="5">
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
            <!-- 👉 company -->
            <VCol cols="12">
              <VTextField v-model="containerId" label="容器ID（连接控制台时必填）" prepend-inner-icon="tabler-edit-circle" />
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
              <VBtn type="submit" class="me-3">
                保存
              </VBtn>
              <VBtn type="reset" variant="tonal" color="secondary" @click="closeNavigationDrawer">
                取消
              </VBtn>
            </VCardText>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
