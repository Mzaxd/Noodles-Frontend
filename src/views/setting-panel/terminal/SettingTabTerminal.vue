<script setup>
import laptopGirl from "@images/illustrations/sidebar-pic-1.png";

import axios from "@axios";
import { requiredValidator } from "@/@core/utils/validators";

const isEmailPasswordVisible = ref(false);

const isFormValid = ref(false);
const refForm = ref();

const rendererType = ref("");
const fontSize = ref();
const cursorBlink = ref();
const foreground = ref("");
const background = ref("");

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

const fetchTerminalSettings = () => {
  axios.get("/setting/terminal").then((r) => {
    rendererType.value = r.data.rendererType
    fontSize.value = r.data.fontSize
    foreground.value = r.data.foreground
    background.value = r.data.background
    cursorBlink.value = r.data.cursorBlink == 1 ? true : false
  });
};

watchEffect(fetchTerminalSettings);


const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      axios.post("/setting/terminal", {
        rendererType: rendererType.value,
        fontSize: fontSize.value,
        cursorBlink: cursorBlink.value == true ? 1 : 0,
        foreground: foreground.value,
        background: background.value,
      }).then((r) => {
        Message(r);
      });
      nextTick(() => {
        refForm.value?.reset();
        refForm.value?.resetValidation();
      });
      fetchTerminalSettings()
    }
  });
};
</script>

<template>
  <VRow>
    <VCol cols="12">
      <!-- SECTION: Create an API key -->
      <VCard title="控制台偏好设置">
        <VRow no-gutters>
          <!-- 👉 Choose API Key -->
          <VCol cols="12" md="5" order-md="0" order="1">
            <VCardText>
              <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
                <VRow>
                  <VCol cols="12">
                    <div class="d-flex align-center mb-4">
                      <h6 class="text-sm font-weight-semibold me-2">
                        渲染类型：
                      </h6>
                      <VSelect :rules="[requiredValidator]" v-model="rendererType" :items="['webgl', 'canvas']"
                        label="(性能/兼容性)" />
                    </div>
                  </VCol>

                  <VCol cols="12">
                    <div class="d-flex align-center mb-4">
                      <h6 class="text-sm font-weight-semibold me-2">
                        字体大小：
                      </h6>
                      <VTextField type="text" :rules="[requiredValidator]" v-model="fontSize" label="字体大小" />
                    </div>
                  </VCol>

                  <VCol cols="12">
                    <div class="d-flex align-center mb-4">
                      <h6 class="text-sm font-weight-semibold me-2">
                        光标闪烁：
                      </h6>
                      <VSwitch v-model="cursorBlink" inset :label="`${cursorBlink == true ? '开' : '关'}`" />
                    </div>
                  </VCol>

                  <VCol cols="12">
                    <div class="d-flex align-center mb-4">
                      <h6 class="text-sm font-weight-semibold me-2">
                        字体颜色：
                      </h6>
                      <VTextField type="email" :rules="[requiredValidator]" v-model="foreground" label="支持单词或颜色标号" />
                    </div>
                  </VCol>

                  <VCol cols="12">
                    <div class="d-flex align-center mb-4">
                      <h6 class="text-sm font-weight-semibold me-2">
                        背景颜色：
                      </h6>
                      <VTextField type="email" :rules="[requiredValidator]" v-model="background" label="支持单词或颜色标号" />
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
            <VImg :src="laptopGirl" :width="200" :style="
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
