<template>
    <div 
        class="fixed z-50"
        :style="{ top: `${position.y}px`, left: `${position.x}px` }"
    >
        <!-- 모달창 -->
        <div 
            class="relative block max-w-sm p-6 bg-gradient-to-r from-blue-500 to-purple-600 border border-gray-200 rounded-lg shadow-lg 
                   hover:shadow-2xl hover:-translate-y-1 hover:scale-105 transform transition-all duration-300 ease-in-out"
        >

            <!-- 제목 -->
            <h5 class="mb-3 text-2xl font-extrabold text-white">
                🚀 {{ getPlayerName(player?.name) }}
            </h5>
            
            <!-- 본문 -->
            <p class="text-base text-white font-medium leading-relaxed">
                {{ player?.mmr }}
            </p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { LolPlayerDto } from '~/types/game/lol/common';

// Props 정의
const props = defineProps<{ 
    player: LolPlayerDto | null,
    position: { x: number, y: number },
}>();
</script>
