<script setup>
import SettingTabSystem from '@/views/setting-panel/system/SettingTabSystem.vue'
import SettingTabTerminal from '@/views/setting-panel/terminal/SettingTabTerminal.vue'
import SettingTabSmtp from '@/views/setting-panel/smtp/SettingTabSmtp.vue'

const route = useRoute()
const activeTab = ref(null)

// tabs
const tabs = [
  {
    title: '系统设置',
    icon: 'tabler-settings',
    tab: 'system',
  },
  {
    title: '控制台偏好',
    icon: 'tabler-terminal',
    tab: 'terminal',
  },
  {
    title: '邮件服务',
    icon: 'tabler-mail',
    tab: 'mail',
  },
]
</script>
<template>
  <div>

    <VTabs v-model="activeTab" class="v-tabs-pill">
      <VTab v-for="item in tabs" :key="item.icon" :value="item.tab"
        :to="{ name: 'setting-panel-tab', params: { tab: item.tab } }">
        <VIcon size="20" start :icon="item.icon" />
        {{ item.title }}
      </VTab>
    </VTabs>

    <VWindow v-model="activeTab" class="mt-5 disable-tab-transition" :touch="false">
      <!-- Teams -->
      <VWindowItem value="system">
        <SettingTabSystem />
      </VWindowItem>
      <VWindowItem value="terminal">
        <SettingTabTerminal />
      </VWindowItem>
      <VWindowItem value="mail">
        <SettingTabSmtp />
      </VWindowItem>
    </VWindow>
  </div>
</template>

<route lang="yaml">
meta:
  navActiveLink: setting-panel-tab
</route>
