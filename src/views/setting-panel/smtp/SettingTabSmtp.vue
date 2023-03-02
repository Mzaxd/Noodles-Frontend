<script setup>
import laptopGirl from "@images/illustrations/sidebar-pic-2.png";

import axios from "@axios";
import { requiredValidator, emailValidator } from "@/@core/utils/validators";

const isEmailPasswordVisible = ref(false);

const isFormValid = ref(false);
const refForm = ref();

const serverEmail = ref("");
const emailPass = ref("");
const notificationEmail = ref("");

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

const fetchSmtpSettings = () => {
  axios.get("/setting/smtp").then((r) => {
    serverEmail.value = r.data.serverEmail
    emailPass.value = r.data.emailPass
    notificationEmail.value = r.data.notificationEmail
  });
};

watchEffect(fetchSmtpSettings);


const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      axios.post("/setting/smtp", {
        serverEmail: serverEmail.value,
        emailPass: emailPass.value,
        notificationEmail: notificationEmail.value,
      }).then((r) => {
        Message(r);
      });
      nextTick(() => {
        refForm.value?.reset();
        refForm.value?.resetValidation();
      });
      fetchSmtpSettings()
    }
  });
};
</script>

<template>
  <VRow>
    <VCol cols="12">
      <!-- SECTION: Create an API key -->
      <VCard title="SMTP邮件服务器设置">
        <VRow no-gutters>
          <!-- 👉 Choose API Key -->
          <VCol cols="12" md="5" order-md="0" order="1">
            <VCardText>
              <VForm
                ref="refForm"
                v-model="isFormValid"
                @submit.prevent="onSubmit"
              >
                <VRow>
                  <VCol cols="12">
                    <div class="d-flex align-center mb-4">
                      <h6 class="text-sm font-weight-semibold me-2">
                        发送邮箱账号：
                      </h6>
                      <VTextField
                        type="email"
                        :rules="[requiredValidator,emailValidator]"
                        v-model="serverEmail"
                        label="您所使用的SMTP服务提供商的账号"
                      />
                    </div>
                  </VCol>

                  <VCol cols="12">
                    <div class="d-flex align-center mb-4">
                      <h6 class="text-sm font-weight-semibold me-2">
                        发送邮箱密码：
                      </h6>
                      <VTextField
                        :rules="[requiredValidator]"
                        v-model="emailPass"
                        label="您账号的密码或服务商的特殊服务码(QQ邮箱)"
                        :type="isEmailPasswordVisible ? 'text' : 'password'"
                        :append-inner-icon="
                          isEmailPasswordVisible
                            ? 'tabler-eye-off'
                            : 'tabler-eye'
                        "
                        @click:append-inner="
                          isEmailPasswordVisible = !isEmailPasswordVisible
                        "
                      />
                    </div>
                  </VCol>

                  <VCol cols="12">
                    <div class="d-flex align-center mb-4">
                      <h6 class="text-sm font-weight-semibold me-2">
                        接收邮箱地址：
                      </h6>
                      <VTextField
                        type="email"
                        :rules="[requiredValidator,emailValidator]"
                        v-model="notificationEmail"
                        label="一般为您的账号"
                      />
                    </div>
                  </VCol>

                  <!-- 👉 Create Key Button -->
                  <VCol cols="12">
                    <VBtn type="submit" block> 保 存 设 置 </VBtn>
                  </VCol>
                </VRow>
              </VForm>
            </VCardText>
          </VCol>

          <!-- 👉 Lady image -->
          <VCol
            cols="12"
            md="7"
            order="0"
            order-md="1"
            class="d-flex flex-column justify-center align-center"
          >
            <VImg
              :src="laptopGirl"
              :width="200"
              :style="
                $vuetify.display.smAndDown
                  ? ''
                  : 'position: absolute; bottom: 0;'
              "
            />
          </VCol>
        </VRow>
      </VCard>
      <!-- !SECTION -->
    </VCol>
    <VSnackbar
      v-model="isSnackbarVisible"
      :color="snackBarColor"
      location=""
      :timeout="1000"
    >
      {{ msg }}
    </VSnackbar>
  </VRow>
</template>
