<script setup>
import axios from "@axios";

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  servirId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:isDrawerOpen"]);

const isFormValid = ref(false);
const refForm = ref();
const remark = ref("");

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit("update:isDrawerOpen", false);
  nextTick(() => {
    refForm.value?.reset();
    refForm.value?.resetValidation();
    fetchServirData();
  });
};

watchEffect(() => {
  if (props.servirId != undefined) {
    axios.get("/servir/getRemark/" + props.servirId).then((r) => {
      remark.value = r.data;
    });
  }
});

const fetchServirData = () => {
  if (props.servirId != undefined) {
    axios.get("/servir/getRemark/" + props.servirId).then((r) => {
      remark.value = r.data;
    });
  }
};

const handleDrawerModelValueUpdate = (val) => {
  emit("update:isDrawerOpen", val);
};
</script>

<template>
  <VDialog
    temporary
    :width="600"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <VCard title="备注">
      <VCardText>
        <VRow>
          <VCol cols="12">
            <VTextarea
              readonly
              v-model="remark"
              placeholder="备注"
              auto-grow
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>
</template>
