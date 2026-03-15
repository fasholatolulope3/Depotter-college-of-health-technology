<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useDeadlineStore } from '../stores/deadline';

const deadlineStore = useDeadlineStore();

onMounted(() => {
  deadlineStore.initTimer();
});

onUnmounted(() => {
  deadlineStore.cleanupTimer();
});
</script>

<template>
  <div :class="[
    'px-4 py-2 rounded-full text-sm font-bold tracking-tight transition-colors',
    deadlineStore.isExpired ? 'bg-red-500 text-white shadow-inner' : 'bg-chocolate text-cream'
  ]">
    {{ deadlineStore.timeLeftString }}
  </div>
</template>
