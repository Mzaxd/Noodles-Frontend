<script setup>
import UserProfile from '@/views/user-profile/profile/index.vue'
import UserTabSecurity from '@/views/user-profile/security/UserTabSecurity.vue'
import UserProfileHeader from '@/views/user-profile/UserProfileHeader.vue'

const activeTab = ref(null)

// tabs
const tabs = [
  {
    title: '个人信息',
    icon: 'tabler-user-check',
    tab: 'profile',
  },
  {
    title: '账号安全',
    icon: 'tabler-shield-lock',
    tab: 'security',
  },
]
</script>
<template>
  <div>
    <UserProfileHeader class="mb-5" />

    <VTabs
      v-model="activeTab"
      class="v-tabs-pill"
    >
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
        :to="{ name: 'user-profile-tab', params: { tab: item.tab } }"
      >
        <VIcon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
      </VTab>
    </VTabs>

    <VWindow
      v-model="activeTab"
      class="mt-5 disable-tab-transition"
      :touch="false"
    >
      <!-- Profile -->
      <VWindowItem value="profile">
        <UserProfile />
      </VWindowItem>

      <!-- Security -->
      <VWindowItem value="security">
        <UserTabSecurity />
      </VWindowItem>
    </VWindow>
  </div>
</template>

<route lang="yaml">
meta:
  navActiveLink: user-profile-tab
</route>
