<script setup>
import congo from "@images/illustrations/laptop-girl.png";

import axios from "@axios";
import { requiredValidator, emailValidator } from "@/@core/utils/validators";

const isEmailPasswordVisible = ref(false);

const isFormValid = ref(false);
const refForm = ref();

const logExpire = ref();
const checkInstanceStatePeriod = ref();
const defaultLang = ref("");

const isDialogVisible = ref(false);
const isSnackbarVisible = ref(false);
const snackBarColor = ref();
const msg = ref("");
const Message = (r) => {
  if (r.code == 200) {
    snackBarColor.value = "success";
    msg.value = 'o(^▽^)o ' + r.msg
  } else {
    snackBarColor.value = "error";
    msg.value = '╥﹏╥... ' + r.msg;
  }
  isSnackbarVisible.value = true;
};

const fetchSystemSettings = () => {
  axios.get("/setting/system").then((r) => {
    logExpire.value = r.data.logExpire
    checkInstanceStatePeriod.value = r.data.checkInstanceStatePeriod
    defaultLang.value = r.data.defaultLang
  });
};

watchEffect(fetchSystemSettings);


const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      axios.post("/setting/system", {
        logExpire: logExpire.value,
        checkInstanceStatePeriod: checkInstanceStatePeriod.value,
        defaultLang: defaultLang.value,
      }).then((r) => {
        Message(r);
      });
      nextTick(() => {
        refForm.value?.reset();
        refForm.value?.resetValidation();
      });
      fetchSystemSettings()
    }
  });
};
</script>

<template>
  <VRow>
    <VCol cols="12">
      <!-- SECTION: Create an API key -->
      <VCard title="系统设置">
        <VRow no-gutters>
          <!-- 👉 Choose API Key -->
          <VCol cols="12" md="5" order-md="0" order="1">
            <VCardText>
              <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
                <VRow>
                  <VCol cols="12">
                    <div class="d-flex align-center mb-4">
                      <h6 class="text-sm font-weight-semibold me-2">
                        默认语言：
                      </h6>
                      <VSelect :rules="[requiredValidator]" v-model="defaultLang" :items="['ch']" label="语言" />
                    </div>
                  </VCol>
                  <VCol cols="12">
                    <div class="d-flex align-center mb-4">
                      <h6 class="text-sm font-weight-semibold me-2">
                        检测间隔：
                      </h6>
                      <VSelect :rules="[requiredValidator]" v-model="checkInstanceStatePeriod" :items="[3, 5, 10, 30]"
                        label="实力状态检测间隔时间(分钟)" />
                    </div>
                  </VCol>
                  <VCol cols="12">
                    <div class="d-flex align-center mb-4">
                      <h6 class="text-sm font-weight-semibold me-2">
                        保持时间：
                      </h6>
                      <VSelect :rules="[requiredValidator]" v-model="logExpire" :items="[1, 3, 7]"
                        label="登录状态保持时间(天)" />
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
          <VCol cols="12" md="7" order="0" order-md="1" class="d-flex flex-column justify-center align-center">
            <VImg :src="congo" :width="200" :style="
              $vuetify.display.smAndDown
                ? ''
                : 'position: absolute; bottom: 0;'
            " />
          </VCol>
        </VRow>
      </VCard>
      <!-- !SECTION -->
    </VCol>
    <VSnackbar v-model="isSnackbarVisible" :color="snackBarColor" location="" :timeout="1000">
      {{ msg }}
    </VSnackbar>
  </VRow>
</template>
