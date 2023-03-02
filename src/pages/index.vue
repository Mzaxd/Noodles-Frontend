<script setup>
import axios from "@axios";
import {
  confirmedValidator,
  emailValidator,
  passwordValidator,
  requiredValidator,
} from "@validators";

const isNewPasswordVisible = ref(false)
const isDialogVisible = ref(false);
const isFormValid = ref(false);
const refForm = ref();
const email = ref("");
const password = ref("");
const isSnackbarVisible = ref(false);
const snackBarColor = ref();
const msg = ref("");

onBeforeMount(()=>{
  axios.get('/system/isFirstUse').then(r => {
    if (r.data == true) {
      isDialogVisible.value = true
    }
  })
})


const Message = (r) => {
  if (r.code == 200) {
    snackBarColor.value = "success";
    msg.value = 'o(^▽^)o ' + r.msg
  } else {
    snackBarColor.value =  "error";
    msg.value = '╥﹏╥... ' + r.msg;
  }
  isSnackbarVisible.value = true;
};

// 👉 drawer close
const closeNavigationDrawer = () => {
  isDialogVisible.value = false;
  nextTick(() => {
    refForm.value?.reset();
    refForm.value?.resetValidation();
  });
};

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      axios
        .post("/auth/updateAccount", {
          email: email.value,
          password: password.value,
        })
        .then((r) => {
          Message(r);
          isDialogVisible.value = false;
        });
    }
  });
};
</script>

<template>
  <div>
    <VCard class="mb-6" title="欢迎使用Noodles服务管理平台 🚀">
      <VCardText>All the best for your new project.</VCardText>
      <VCardText>
        Please make sure to read our
        <a
          href="https://pixinvent.com/demo/vuexy-vuejs-admin-dashboard-template/documentation/"
          target="_blank"
          rel="noopener noreferrer"
          class="text-decoration-none"
        >
          Template Documentation
        </a>
        to understand where to go from here and how to use our template.
      </VCardText>
    </VCard>

    <VDialog v-model="isDialogVisible" persistent class="v-dialog-sm">
      <VCard title="修改账号">
        <VCardText>
          <!-- 👉 Form -->
          <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
            <VRow>
              <VCol cols="12"
                ><VAlert
                  v-model="isAlertVisible"
                  color="warning"
                  variant="tonal"
                >
                |ω・）
                  为了安全，建议您修改账号密码
                </VAlert></VCol
              >

              <!-- 👉 Description -->
              <VCol cols="12">
                <VTextField
                  v-model="email"
                  type="email"
                  :rules="[requiredValidator, emailValidator]"
                  label="您的邮箱"
                  prepend-inner-icon="tabler-edit-circle"
                />
              </VCol>

              <!-- 👉 Description -->
              <VCol cols="12">
                <VTextField
                  v-model="password"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isNewPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible"
                  :rules="[requiredValidator]"
                  label="新密码"
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
    <!-- Snackbar -->
    <VSnackbar
      v-model="isSnackbarVisible"
      :color="snackBarColor"
      location=""
      :timeout="1000"
    >
      {{ msg }}
    </VSnackbar>
  </div>
</template>
