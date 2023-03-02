<script setup>
import axios from "@axios";

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  logId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:isDrawerOpen"]);

const isFormValid = ref(false);
const refForm = ref();
const param = ref("");

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit("update:isDrawerOpen", false);
  nextTick(() => {
    refForm.value?.reset();
    refForm.value?.resetValidation();
    fetchLogParam();
  });
};

watchEffect(() => {
  if (props.logId != undefined) {
    axios.get("/auditLog/getParam/" + props.logId).then((r) => {
      param.value = r.data;
    });
  }
});


const fetchLogParam = () => {
  if (props.logId != undefined) {
    axios.get("/auditLog/getParam/" + props.logId).then((r) => {
      param.value = r.data;
    });
  }
};

const handleDrawerModelValueUpdate = (val) => {
  emit("update:isDrawerOpen", val);
};
</script>

<template>
  <VDialog temporary :width="600" location="end" class="scrollable-content" :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate">
    <VCard title="事件详细信息">
      <VCardText>
        <VRow>
          <VCol cols="12">
            <VTextarea readonly v-model="param" placeholder="参数" auto-grow>
            </VTextarea>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>
</template>
