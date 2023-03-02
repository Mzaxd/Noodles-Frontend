export default [
  { heading: '设置' },
  {
    title: '面板管理',
    to: { name: 'setting-panel-tab', params: { tab: 'system' }},
    icon: { icon: 'tabler-settings' },
    badgeClass: 'bg-light-primary text-primary',
  },
  {
    title: '账号设置',
    to: { name: 'user-profile-tab', params: { tab: 'profile' }},
    icon: { icon: 'tabler-settings' },
    badgeClass: 'bg-light-primary text-primary',
  },
]
    