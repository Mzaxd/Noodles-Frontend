<script setup>
import axios from "@axios";
import { useRouter } from "vue-router";

const router = useRouter();
const avatar = ref("");
const userName = ref("");
const nickName = ref("");
const userId = ref();

const logout = () => {
  axios.post("/auth/logout", null).then(() => {
    // Remove "userAbilities" from localStorage
    localStorage.removeItem("accessToken");
    router.push("/login");
  });
};

onBeforeMount(() => {
  axios.get("/user/userInfo").then((r) => {
    avatar.value = r.data.avatar;
    userName.value = r.data.userName;
    nickName.value = r.data.nickName;
    userId.value = r.data.id;
  });
});
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <VImg :src="avatar" />

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="14px">
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar color="primary" variant="tonal">
                    <VImg :src="avatar" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ userName }}
            </VListItemTitle>
            <VListItemSubtitle>{{ nickName }}</VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem
            :to="{ name: 'user-profile-tab', params: { tab: 'profile' } }"
          >
            <template #prepend>
              <VIcon class="me-2" icon="tabler-user" size="22" />
            </template>

            <VListItemTitle>个人信息</VListItemTitle>
          </VListItem>

          <!-- 👉 Settings -->
          <VListItem 
            :to="{ name: 'setting-panel-tab', params: { tab: 'system' } }">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-settings" size="22" />
            </template>

            <VListItemTitle>系统设置</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem @click="logout">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-logout" size="22" />
            </template>

            <VListItemTitle>退出账号</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
