<template>
  <section class="status-card">
    <h2>서버 상태</h2>
    <p v-if="loading">서버 상태를 확인 중입니다...</p>
    <p v-else-if="isHealthy" class="healthy">정상 연결되었습니다.</p>
    <p v-else class="unhealthy">서버에 연결할 수 없습니다.</p>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApiClient } from '~/composables/useApiClient'

const loading = ref(true)
const isHealthy = ref(false)
const apiClient = useApiClient()

// 컴포넌트가 마운트될 때 서버 상태를 확인한다.
onMounted(async () => {
  try {
    isHealthy.value = await apiClient.getHealthStatus()
  } catch (error) {
    isHealthy.value = false
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.status-card {
  background: #ffffffcc;
  padding: 1.3rem;
  border-radius: 1rem;
  margin-bottom: 1.2rem;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.05);
}
.healthy {
  color: #0b6f3c;
}
.unhealthy {
  color: #c53030;
}
</style>
