<script setup>
import axios from "@axios";
import { emailValidator, requiredValidator } from "@validators";

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:isDrawerOpen", "userData"]);

const isFormValid = ref(false);
const id = JSON.parse(localStorage.getItem("userId"));
const refForm = ref();
const email = ref("");
const name = ref("");
const nickName = ref("");
const avatarUrl = ref("");

watchEffect(() => {
  axios.get("/user/" + id).then((r) => {
    (name.value = r.data.userName), (avatarUrl.value = r.data.avatar);
    (email.value = r.data.email), (nickName.value = r.data.nickName);
  });
});

const fetchUserData = () => {
  axios.get("/user/" + id).then((r) => {
    (name.value = r.data.userName), (avatarUrl.value = r.data.avatar);
    (email.value = r.data.email), (nickName.value = r.data.nickName);
  });
};

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit("update:isDrawerOpen", false);
  nextTick(() => {
    refForm.value?.reset();
    refForm.value?.resetValidation();
    fetchUserData();
  });
};

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit("userData", {
        userName: name.value,
        nickName: nickName.value,
        email: email.value,
        avatar: avatarUrl.value,
      });
      emit("update:isDrawerOpen", false);
      nextTick(() => {
        refForm.value?.reset();
        refForm.value?.resetValidation();
        fetchUserData();
      });
    }
  });
};

const handleDrawerModelValueUpdate = (val) => {
  emit("update:isDrawerOpen", val);
};
</script>

<template>
  <VDialog
    persistent
    temporary
    :width="500"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <VCard title="编辑账号信息">
      <VCardText>
        <!-- 👉 Form -->
        <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
          <VRow>
            <!-- 👉 company -->
            <VCol cols="12">
              <VTextField
                v-model="email"
                :rules="[requiredValidator, emailValidator]"
                label="邮箱"
                prepend-inner-icon="tabler-edit-circle"
              />
            </VCol>
            <!-- 👉 Full name -->
            <VCol cols="12">
              <VTextField
                v-model="name"
                :rules="[requiredValidator]"
                label="账户名称"
                prepend-inner-icon="tabler-edit-circle"
              />
            </VCol>

            <!-- 👉 Email -->
            <VCol cols="12">
              <VTextField
                v-model="nickName"
                :rules="[requiredValidator]"
                label="昵称"
                prepend-inner-icon="tabler-edit-circle"
              />
            </VCol>

            <!-- 👉 company -->
            <VCol cols="12">
              <VTextField
                v-model="avatarUrl"
                :rules="[requiredValidator]"
                label="头像Url"
                prepend-inner-icon="tabler-edit-circle"
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
