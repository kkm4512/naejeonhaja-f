<template>
  <section class="player-card">
    <h2>플레이어 기본 정보</h2>
    <pre>{{ formattedData }}</pre>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RiotPlayerBasicInfo } from '~/types/api'

const props = defineProps<{ data: RiotPlayerBasicInfo }>()

const formattedData = computed(() => JSON.stringify(props.data, null, 2))
</script>

<style scoped>
.player-card {
  background: #ffffffcc;
  padding: 1.3rem;
  border-radius: 1rem;
  margin-top: 1.2rem;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}
pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
