<script lang="ts" setup>
import { useRoute } from 'vue-router';
import LolRift from '~/components/game/lol/LolRift.vue';

// 현재 라우터 정보 가져오기
const route = useRoute();

// 라우터에서 id 파라미터 가져오기
const rawId = route.params.id;

// id를 숫자로 변환 (필요시 처리)
const id = Array.isArray(rawId) ? Number(rawId[0]) : Number(rawId);
</script>

<template>
  <LolRift :id="id" />
</template>

