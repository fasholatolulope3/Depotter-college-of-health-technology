import { defineStore } from 'pinia';
import { ref, onMounted, onUnmounted } from 'vue';

export const useDeadlineStore = defineStore('deadline', () => {
  // Hardcoded deadline: March 28, 2026 23:59:59 UTC+1
  const targetDate = new Date('2026-03-28T23:59:59+01:00');
  
  const isExpired = ref(false);
  const timeLeftString = ref('');
  let timer = null;

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance <= 0) {
      isExpired.value = true;
      timeLeftString.value = 'VOTING CONCLUDED';
      if (timer) clearInterval(timer);
      return;
    }

    isExpired.value = false;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    timeLeftString.value = `${days}d ${hours}h ${minutes}m ${seconds}s remaining`;
  };

  // Safe manual setup method for components
  const initTimer = () => {
    updateCountdown();
    if (!isExpired.value && !timer) {
      timer = setInterval(updateCountdown, 1000);
    }
  };

  const cleanupTimer = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  return {
    isExpired,
    timeLeftString,
    initTimer,
    cleanupTimer
  };
});
