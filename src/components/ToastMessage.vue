<template>
  <transition name="toast-fade">
    <div v-if="show" :class="['toast-message', type]">
      <i
        :class="
          type === 'success'
            ? 'fa-solid fa-circle-check'
            : 'fa-solid fa-circle-exclamation'
        "
      ></i>

      <span>{{ message }}</span>

      <button class="toast-close" @click="$emit('close')">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  show: Boolean,
  message: String,
  type: {
    type: String,
    default: 'success'
  }
})

defineEmits(['close'])
</script>

<style scoped>
@import '../assets/css/toast.css';
</style>