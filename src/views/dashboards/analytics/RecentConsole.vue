<script setup>
import { ref } from "vue"
import axios from "@axios"
import auFlag from '@images/icons/countries/au.png'
import brFlag from '@images/icons/countries/br.png'
import cnFlag from '@images/icons/countries/cn.png'
import frFlag from '@images/icons/countries/fr.png'
import inFlag from '@images/icons/countries/in.png'
import usFlag from '@images/icons/countries/us.png'

const instances = ref([])

const fetchRecentConsole = () => {
  axios.get('/dashboard/getRecentConsoleList').then(r => {
    instances.value = r.data
  })
}

watchEffect(fetchRecentConsole);

const refresh = () => {
  fetchRecentConsole()
}

const newTerminalPage = (sshId) => {
  const protocol = window.location.protocol
  const host = window.location.host
  const url = protocol + "//" + host+"/terminal/" + sshId
  window.open(url);
};
</script>

<template>
  <VCard title="控制台" subtitle="最近连接过的控制台">
    <template #append>
      <div class="mt-n4 me-n2">
        <VBtn icon color="default" size="x-small" variant="plain">
          <VIcon size="22" icon="tabler-refresh" @click="refresh()" />
        </VBtn>
      </div>
    </template>

    <VCardText>
      <VList class="card-list">
        <VListItem v-for="instance in instances" :key="instance.name">
          <template #prepend>
            <VAvatar rounded="lg" variant="tonal" class="me-3" size="38">
              <VImg v-if="instance.avatar" :src="instance.avatar" />
              <span v-else>{{ instance.name }}</span>
            </VAvatar>
          </template>

          <VListItemTitle class="font-weight-medium">
            {{ instance.name }}
          </VListItemTitle>
          <VListItemSubtitle class="opacity-100 text-disabled">
            {{ instance.description }}
          </VListItemSubtitle>

          <template #append>
            <div>
              <VBtn @click="newTerminalPage(instance.sshId)" icon="tabler-terminal-2" size="x-xl" color="default" variant="text" />
            </div>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 19px;
}
</style>
