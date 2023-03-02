<script setup>
import UpdateUserDialog from "./UpdateUserDialog.vue";
import { useRoute } from "vue-router";
import axios from "@axios";
import bg from "@/assets/images/pics/user-profile-header-bg-half.png";

const isUpdateUserInfoDialogVisible = ref(false);
const route = useRoute();
const profileHeaderData = ref();
const userId = JSON.parse(localStorage.getItem("userId"));

const snackBarlocation = ref("top");
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


const fetchHeaderData = () => {
  axios.get("/user/profileHeader/" + userId).then((response) => {
    profileHeaderData.value = response.data;
  });
};

const updateUserInfo = (userData) => {
  axios
    .post("/user/updateUserInfo", {
      user: userData,
    })
    .then((r) => {
      Message(r);

      // refetch Vms
      fetchHeaderData();
      location.reload()
    });
};

fetchHeaderData();
</script>
<template>
  <VCard v-if="profileHeaderData">
    <VImg :src="bg" />

    <VCardText
      class="d-flex align-bottom flex-sm-row flex-column justify-center gap-x-5"
    >
      <div class="d-flex h-0">
        <VAvatar
          rounded
          size="120"
          :image="profileHeaderData.avatar"
          class="user-profile-avatar mx-auto"
        />
      </div>

      <div class="user-profile-info w-100 mt-16 pt-6 pt-sm-0 mt-sm-0">
        <h6 class="text-h6 text-center text-sm-start font-weight-semibold mb-3">
          {{ profileHeaderData?.nickName }}
        </h6>

        <div
          class="
            d-flex
            align-center
            justify-center justify-sm-space-between
            flex-wrap
            gap-4
          "
        >
          <div
            class="
              d-flex
              flex-wrap
              justify-center justify-sm-start
              flex-grow-1
              gap-2
            "
          >
            <span class="d-flex align-center">
              <VIcon size="20" icon="tabler-map-pin" class="me-2" />
              <span class="text-body-1">
                {{ profileHeaderData?.location }}
              </span>
            </span>

            <span class="d-flex align-center">
              <VIcon size="20" icon="tabler-calendar" class="me-2" />
              <span class="text-body-1">
                {{ profileHeaderData?.createTime }}
              </span>
            </span>
          </div>
          <VBtn
            prepend-icon="tabler-edit-circle"
            @click="isUpdateUserInfoDialogVisible = true"
          >
            编辑个人信息
          </VBtn>
        </div>
      </div>
    </VCardText>
    <!-- 👉 Update User -->
    <UpdateUserDialog
      v-model:isDrawerOpen="isUpdateUserInfoDialogVisible"
      @user-data="updateUserInfo"
    />
    <VSnackbar
        v-model="isSnackbarVisible"
        :color="snackBarColor"
        :location="snackBarlocation"
        :timeout="3000"
      >
        {{ msg }}
      </VSnackbar>
  </VCard>
</template>

<style lang="scss">
.user-profile-avatar {
  border: 5px solid rgb(var(--v-theme-surface));
  background-color: rgb(var(--v-theme-surface)) !important;
  inset-block-start: -3rem;

  .v-img__img {
    border-radius: 0.125rem;
  }
}
</style>
