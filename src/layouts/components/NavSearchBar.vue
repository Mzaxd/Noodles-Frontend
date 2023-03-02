<script setup>
import axios from '@axios'
import { useThemeConfig } from '@core/composable/useThemeConfig'

const { appContentLayoutNav } = useThemeConfig()

defineOptions({ inheritAttrs: false })

// 👉 Is App Search Bar Visible
const isAppSearchBarVisible = ref(false)

// 👉 Default suggestions
const suggestionGroups = [
  {
    title: '实例管理',
    content: [
      {
        icon: 'tabler-server',
        title: '物理机',
        url: { name: 'instances-server-list' },
      },
      {
        icon: 'tabler-chart-bubble',
        title: '虚拟机',
        url: { name: 'instances/vm/list' },
      },
      {
        icon: 'tabler-brand-docker',
        title: '容器',
        url: { name: 'instances/container/list' },
      },
    ],
  },
  {
    title: '统计',
    content: [
      {
        icon: 'tabler-dashboard',
        title: '仪表盘',
        url: { name: 'dashboard' },
      },
      {
        icon: 'tabler-book',
        title: '操作记录',
        url: { name: 'history' },
      },
    ],
  },
  {
    title: '设置',
    content: [
      {
        icon: 'tabler-settings',
        title: '面板管理',
        url: { 
          name: 'setting-panel-tab', 
          params: { tab: 'system' },
      },
      },
      {
        icon: 'tabler-user',
        title: '账号设置',
        url: {
          name: 'user-profile-tab',
          params: { tab: 'profile' },
        },
      },
    ],
  },
  {
    title: '其他',
    content: [
      {
        icon: 'tabler-bell',
        title: '通知提醒',
        url: { name: 'notification' },
      },
      {
        icon: 'tabler-help',
        title: '帮助文档',
        url: { name: 'help-center' },
      },
    ],
  },

]

// 👉 No Data suggestion
const noDataSuggestions = [
  {
    title: 'Analytics Dashboard',
    icon: 'tabler-shopping-cart',
    url: { name: 'dashboards-analytics' },
  },
  {
    title: 'Account Settings',
    icon: 'tabler-user',
    url: {
      name: 'pages-account-settings-tab',
      params: { tab: 'account' },
    },
  },
  {
    title: 'Pricing Page',
    icon: 'tabler-cash',
    url: { name: 'pages-pricing' },
  },
]

const searchQuery = ref('')
const searchResult = ref([])
const router = useRouter()

// 👉 fetch search result API
watchEffect(() => {
  axios.get('/app-bar/search', { params: { q: searchQuery.value } }).then(response => {
    searchResult.value = response.data
  })
})

const redirectToSuggestedOrSearchedPage = selected => {
  router.push(selected.url)
  isAppSearchBarVisible.value = false
  searchQuery.value = ''
}

const LazyAppBarSearch = defineAsyncComponent(() => import('@core/components/AppBarSearch.vue'))
</script>

<template>
  <div class="d-flex align-center cursor-pointer" v-bind="$attrs"
    @click="isAppSearchBarVisible = !isAppSearchBarVisible">
    <!-- 👉 Search Trigger button -->
    <VBtn icon variant="text" color="default" size="small">
      <VIcon icon="tabler-search" size="24" />
    </VBtn>

    <span v-if="appContentLayoutNav === 'vertical'" class="d-none d-md-flex align-center text-disabled">
      <span class="me-3">搜索</span>
      <span class="meta-key">⌃⌥K</span>
    </span>
  </div>

  <!-- 👉 App Bar Search -->
  <LazyAppBarSearch v-model:isDialogVisible="isAppSearchBarVisible" v-model:search-query="searchQuery"
    :search-results="searchResult" :suggestions="suggestionGroups" :no-data-suggestion="noDataSuggestions"
    @item-selected="redirectToSuggestedOrSearchedPage">
    <!--
      <template #suggestions>
      use this slot if you want to override default suggestions
      </template>
    -->

    <!--
      <template #noData>
      use this slot to change the view of no data section
      </template>
    -->

    <!--
      <template #searchResult="{ item }">
      use this slot to change the search item
      </template>
    -->
  </LazyAppBarSearch>
</template>

<style lang="scss" scoped>
@use "@styles/variables/_vuetify.scss";

.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: vuetify.$card-border-radius;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}
</style>
