<script setup>
import axios from "@axios";
import {
  confirmedValidator,
  passwordValidator,
} from "@/@core/utils/validators";

const passwordRequirements = [
  'Minimum 8 characters long - the more, the better',
  'At least one lowercase character',
  'At least one number, symbol, or whitespace character',
]

const isNewPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const smsVerificationNumber = ref("+1(968) 819-2547");
const isTwoFactorDialogOpen = ref(false);

const isAccountDeactivated = ref(false);
const validateAccountDeactivation = [(v) => !!v || "请确认账户已停用"];

const isFormValid = ref(false);
const refForm = ref();
const password = ref("");
const confirmPassword = ref("");

const isDialogVisible = ref(false);
const isSnackbarVisible = ref(false);
const snackBarColor = ref();
const msg = ref("");
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

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      axios
        .post("/user/changePassword", {
          password: password.value,
        })
        .then((r) => {
          Message(r);
        });
      nextTick(() => {
        refForm.value?.reset();
        refForm.value?.resetValidation();
      });
    }
  });
};

const deleteAccount = () => {
  axios.get("/auth/deleteAccount").then((r) => {
    Message(r);
  });
};
</script>

<template>
  <VRow>
    <VCol cols="12">
      <!-- 👉 Change password -->
      <VCard title="修改密码">
        <VCardText>
          <VAlert variant="tonal" color="info" class="mb-4">
            <VAlertTitle class="mb-1">
              请尽量提高密码复杂度以增加安全性
            </VAlertTitle>
            <span>比如最少8位字符 大小写及特殊符号</span>
          </VAlert>

          <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
            <VRow>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="password"
                  label="新密码"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :rules="[requiredValidator, passwordValidator]"
                  :append-inner-icon="
                    isNewPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  @click:append-inner="
                    isNewPasswordVisible = !isNewPasswordVisible
                  "
                />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="confirmPassword"
                  label="确认密码"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :rules="[
                    requiredValidator,
                    confirmedValidator(password, confirmPassword),
                  ]"
                  :append-inner-icon="
                    isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  @click:append-inner="
                    isConfirmPasswordVisible = !isConfirmPasswordVisible
                  "
                />
              </VCol>

              <!-- 👉 Password Requirements -->
              <VCardText>
                <h6 class="text-base font-weight-medium mb-3">
                  Password Requirements:
                </h6>

                <VList class="card-list">
                  <VListItem
                    v-for="item in passwordRequirements"
                    :key="item"
                    :title="item"
                    class="text-medium-emphasis"
                  >
                    <template #prepend>
                      <VIcon size="8" icon="tabler-circle" class="me-3" />
                    </template>
                  </VListItem>
                </VList>
              </VCardText>

              <VCol cols="12">
                <VBtn type="submit"> 修改密码 </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12">
      <!-- 👉 Delete Account -->
      <VCard title="删除账号">
        <VCardText>
          <!-- 👉 Checkbox and Button  -->
          <VAlert color="warning" variant="tonal" class="mb-4">
            <VAlertTitle class="mb-1"> 你确定你要删除你的帐户吗? </VAlertTitle>
            <p class="mb-0">
              一旦你删除了你的帐号，就没有回头路了。请确认一下。
            </p>
          </VAlert>
          <div>
            <VCheckbox
              v-model="isAccountDeactivated"
              :rules="validateAccountDeactivation"
              label="我确定要删除账号及其所有信息"
            />
          </div>

          <VBtn
            :disabled="!isAccountDeactivated"
            color="error"
            class="mt-3"
            @click="isDialogVisible = true"
          >
            删除账号
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
    <!-- Snackbar -->
    <VSnackbar
      v-model="isSnackbarVisible"
      :color="snackBarColor"
      location=""
      :timeout="1000"
    >
      {{ msg }}
    </VSnackbar>
    <VDialog v-model="isDialogVisible" persistent class="v-dialog-sm">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

      <!-- Dialog Content -->
      <VCard title="╥﹏╥... 您确定要删除账号吗?">
        <VCardText> 删除此账号您将无法再次登录此平台 </VCardText>

        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <VBtn
            color="secondary"
            variant="tonal"
            @click="isDialogVisible = false"
          >
            取消
          </VBtn>
          <VBtn
            color="error"
            @click="(isDialogVisible = false), deleteAccount()"
          >
            删除
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </VRow>

  <!-- 👉 Enable One Time Password Dialog -->
  <EnableOneTimePasswordDialog
    v-model:isDialogVisible="isTwoFactorDialogOpen"
    :mobile-number="smsVerificationNumber"
  />
</template>
