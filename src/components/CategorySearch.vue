<script setup>
defineProps({
  modelValue: String
});
defineEmits(['update:modelValue']);
</script>

<template>
  <div class="relative w-full max-w-xl">
    <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
      <svg class="w-5 h-5 text-chocolate/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      placeholder="Search categories"
      class="w-full pl-12 pr-4 py-4 bg-white border border-chocolate/10 rounded-2xl shadow-sm focus:ring-2 focus:ring-chocolate/20 focus:outline-none transition-all placeholder:text-chocolate/30"
    />
  </div>
</template>
