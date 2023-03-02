export default [
  {
    title: '实例管理',
    icon: { icon: 'tabler-server' },
    children: [
      { title: '物理机', to: 'instances-server-list' },
      { title: '虚拟机', to: 'instances-vm-list' },
      { title: '容器', to: 'instances-container-list' },
    ],
  },
]
  