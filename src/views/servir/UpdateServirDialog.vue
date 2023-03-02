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
  updateServirId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'servirData',
])

const id = ref()
const snackBarlocation = ref('top')
const msg = ref('默认提示语')
const isSnackbarVisible = ref(false)
const snackBarColor = ref()
const isFormValid = ref(false)
const refForm = ref()
const name = ref('')
const description = ref('')
const avatarUrl = ref('')
const remark = ref("");
const originalTag = ref();
const originalHost = ref();
const originalContainer = ref();
const selectedTag = ref();
const selectedHost = ref();
const selectedContainer = ref();
let allHost = ref([]);
let allContainer = ref([]);
let allTag = ref([]);

onBeforeMount(() => {
  axios.get("/container/allHost").then((r) => {
    allHost = r.data;
  });
  axios.get("/container/allContainer").then((r) => {
    allContainer = r.data;
  });
  axios.get("/tag/allTag").then((r) => {
    allTag = r.data;
  });
});

const Message = r => {
  if (r.code == 200) {
    snackBarColor.value = 'success'
  } else {
    snackBarColor.value = 'error'
  }
  msg.value = r.msg
  isSnackbarVisible.value= true
}

const snackBarAlert = (r, color, location) => {
  snackBarColor.value = color
  snackBarlocation.value = location
  msg.value = r
  isSnackbarVisible.value= true
}

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
    fetchServirData()
  })
}

watchEffect(() => {
  if (props.updateServirId != undefined) {
    axios.get('/servir/' + props.updateServirId).then(r => {
      id.value = r.data.id
      name.value = r.data.name,
      description.value = r.data.description,
      avatarUrl.value = r.data.avatar,
      remark.value = r.data.remark,
      selectedHost.value = r.data.hosts,
      selectedContainer.value = r.data.containers,
      selectedTag.value = r.data.tags,
      
      //保存原始值
      originalHost.value = r.data.hosts,
      originalContainer.value = r.data.containers,
      originalTag.value = r.data.tags
    })
  }
})

const fetchServirData = () => {
  if (props.updateServirId != undefined) {
    axios.get('/servir/' + props.updateServirId).then(r => {
      id.value = r.data.id
      name.value = r.data.name,
      description.value = r.data.description,
      avatarUrl.value = r.data.avatar,
      remark.value = r.data.remark,
      selectedHost.value = r.data.hosts,
      selectedContainer.value = r.data.containers,
      selectedTag.value = r.data.tags,
      
      //保存原始值
      originalHost.value = r.data.hosts,
      originalContainer.value = r.data.containers,
      originalTag.value = r.data.tags
    })
  }
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit('servirData', {
        id: id.value,
        name: name.value,
        description: description.value,
        avatar: avatarUrl.value,
        remark: remark.value,
        hostIds: selectedHost.value === originalHost.value ? null : selectedHost.value,
        containerIds: selectedContainer.value === originalContainer.value ? null : selectedContainer.value,
        tagIds: selectedTag.value === originalTag.value ? null : selectedTag.value,
      })
      emit('update:isDrawerOpen', false)
      nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
        fetchServirData()
      })
    }
  })
}



const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}
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
    <VCard title="编辑服务">
      <VCardText>
        <!-- 👉 Form -->
        <VForm
          ref="refForm"
          v-model="isFormValid"
          @submit.prevent="onSubmit"
        >
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

            <!-- 👉 Description -->
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

            <!-- 👉 Plan -->
            <VCol cols="12">
              <VSelect
                v-model="selectedHost"
                label="关联物理机\虚拟机"
                :items="allHost"
                item-title="name"
                item-value="id"
                multiple=""
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
              <VSelect
                v-model="selectedContainer"
                label="关联容器"
                :items="allContainer"
                item-title="name"
                item-value="id"
                multiple=""
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

            <!-- 👉 Plan -->
            <VCol cols="12">
              <VSelect
                v-model="selectedTag"
                label="标签（必填）"
                :rules="[requiredValidator]"
                :items="allTag"
                item-title="name"
                item-value="id"
                multiple=""
                clearable
                clear-icon="tabler-x"
                prepend-inner-icon="tabler-select"
              >
                <template #selection="{ item }">
                  <VChip>
                    <span>{{ item.title }}</span>
                  </VChip>
                </template>
              </VSelect>
            </VCol>

            <VCol cols="12">
              <VTextarea v-model="remark" placeholder="备注"></VTextarea>
            </VCol>
            
            <!-- 👉 Submit and Cancel -->
            <VCardText class="d-flex justify-end flex-wrap gap-3">
              <VBtn
                type="submit"
                class="me-3"
              >
                保存
              </VBtn>
              <VBtn
                type="reset"
                variant="tonal"
                color="secondary"
                @click="closeNavigationDrawer"
              >
                取消
              </VBtn>
            </VCardText>
            <VSnackbar
              v-model="isSnackbarVisible"
              :color="snackBarColor"
              :location="snackBarlocation"
              :timeout="1000"
            >
              {{ msg }}
            </VSnackbar>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
