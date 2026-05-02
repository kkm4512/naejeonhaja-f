<template>
  <div class="page-inner">
    <HealthStatus />
    <TeamBuilder />
  </div>
</template>

<script setup lang="ts">
import HealthStatus from '~/components/HealthStatus.vue'
import TeamBuilder from '~/components/TeamBuilder.vue'
</script>

<style scoped>
.page-inner {
  display: grid;
  gap: 1.4rem;
}
</style>
