<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const { toasts, dismiss } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast" tag="div" class="toast-list">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.type}`"
          role="alert"
        >
          <span class="toast__icon">
            <template v-if="toast.type === 'success'">✓</template>
            <template v-else-if="toast.type === 'error'">✕</template>
            <template v-else>ℹ</template>
          </span>
          <span class="toast__message">{{ toast.message }}</span>
          <button class="toast__close" @click="dismiss(toast.id)">✕</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  bottom: $space-6;
  right: $space-6;
  z-index: 9999;
  pointer-events: none;
}

.toast-list {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.toast {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3 $space-5;
  border-radius: $radius-md;
  background: $color-surface-2;
  border: 1px solid $color-border-2;
  font-size: $text-sm;
  pointer-events: all;
  box-shadow: $shadow-lg;
  min-width: 260px;
  max-width: 360px;

  &--success {
    border-color: rgba($color-success, 0.4);
    .toast__icon { color: $color-success; }
  }

  &--error {
    border-color: rgba($color-error, 0.4);
    .toast__icon { color: $color-error; }
  }

  &--info {
    border-color: rgba($color-blue, 0.4);
    .toast__icon { color: $color-blue; }
  }

  &__icon {
    font-size: $text-sm;
    flex-shrink: 0;
  }

  &__message {
    flex: 1;
    color: $color-text;
  }

  &__close {
    color: $color-text-dim;
    font-size: $text-xs;
    flex-shrink: 0;
    transition: color $duration-fast;

    &:hover { color: $color-text; }
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all $duration-base $ease-out;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.95);
}
</style>