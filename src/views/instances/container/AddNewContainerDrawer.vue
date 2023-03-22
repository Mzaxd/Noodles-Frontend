<script setup>
import axios from '@axios'
import {
  requiredValidator, associationValidator
} from '@validators'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'containerData',
])

const allNotify = [
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

const isFormValid = ref(false)
const refForm = ref()
const name = ref('')
const description = ref('')
const avatarUrl = ref('')
const imageName = ref('')
const webUi = ref('')
const serverAddress = ref("")
const host = ref()
const notifySwitch = ref(false)
const notifyType = ref()
const sshType = ref("")
const sshHost = ref("")
const sshPort = ref()
const sshUser = ref("")
const sshPwd = ref("")
const containerId = ref("")

let allHost = ref([])

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
  })
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit('containerData', {
        name: name.value,
        description: description.value,
        avatar: avatarUrl.value,
        imageName: imageName.value,
        webUi: webUi.value,
        serverAddress: serverAddress.value,
        hostMachineId: host.value,
        notify: notifyType.value,
        sshType: sshType.value,
        sshHost: sshHost.value,
        sshPort: sshPort.value,
        sshUser: sshUser.value,
        sshPwd: sshPwd.value,
        containerId: containerId.value
      })
      emit('update:isDrawerOpen', false)
      nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
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
</script>

<template>
  <VNavigationDrawer temporary :width="400" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">
    <!-- 👉 Title -->
    <div class="d-flex align-center pa-6 pb-1">
      <h6 class="text-h6">
        添加容器
      </h6>

      <VSpacer />

      <!-- 👉 Close btn -->
      <VBtn variant="tonal" color="default" icon size="32" class="rounded" @click="closeNavigationDrawer">
        <VIcon size="18" icon="tabler-x" />
      </VBTn>
    </div>

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- 👉 Form -->
          <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
            <VRow>
              <!-- 👉 name -->
              <VCol cols="12">
                <VTextField v-model="name" :rules="[requiredValidator]" label="名称（必填）"
                  prepend-inner-icon="tabler-edit-circle" />
              </VCol>

              <!-- 👉 description -->
              <VCol cols="12">
                <VTextField v-model="description" :rules="[requiredValidator]" label="描述（必填）"
                  prepend-inner-icon="tabler-edit-circle" />
              </VCol>

              <!-- 👉 avatarUrl -->
              <VCol cols="12">
                <VTextField v-model="avatarUrl" label="图标Url" prepend-inner-icon="tabler-edit-circle" />
              </VCol>

              <!-- 👉 imageName -->
              <VCol cols="12">
                <VTextField v-model="imageName" label="镜像" prepend-inner-icon="tabler-edit-circle" />
              </VCol>

              <!-- 👉 webUi -->
              <VCol cols="12">
                <VTextField v-model="webUi" label="WebUi地址" prepend-inner-icon="tabler-edit-circle" />
              </VCol>

              <!-- 👉 serverAddress -->
              <VCol cols="12">
                <VTextField v-model="serverAddress" label="服务地址(IP + 端口号)" prepend-inner-icon="tabler-edit-circle" />
              </VCol>

              <!-- 👉 Plan -->
              <VCol cols="12">
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
              <VCol cols="7">
                <VTextField v-model="sshHost" label="Host地址" prepend-inner-icon="tabler-edit-circle" />
              </VCol>
              <!-- 👉 company -->
              <VCol cols="5">
                <VTextField v-model="sshPort" label="端口号" prepend-inner-icon="tabler-edit-circle" />
              </VCol>
              <!-- 👉 company -->
              <VCol cols="6">
                <VSelect v-model="sshType" label="Shell类型" prepend-inner-icon="tabler-select" :items="['bash', 'sh']" />
              </VCol>
              <!-- 👉 company -->
              <VCol cols="6">
                <VTextField v-model="sshUser" label="连接用户" prepend-inner-icon="tabler-edit-circle" />
              </VCol>
              <!-- 👉 company -->
              <VCol cols="12">
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
              <VCol cols="5">
                <VSwitch v-model="notifySwitch" label="离线提醒" color="primary" />
              </VCol>
              <VCol cols="6">
                <VSelect :disabled="!notifySwitch" v-model="notifyType" label="提醒方式" prepend-inner-icon="tabler-select"
                  :rules="[associationValidator(notifySwitch, notifyType)]" :items="allNotify" />
              </VCol>


              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn type="submit" class="me-3">
                  保存
                </VBtn>
                <VBtn type="reset" variant="tonal" color="secondary" @click="closeNavigationDrawer">
                  取消
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
