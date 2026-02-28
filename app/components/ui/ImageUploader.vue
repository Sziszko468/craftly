<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '~/composables/useLocale'

const props = defineProps<{
  modelValue: string[]
  isUploading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [urls: string[]]
  'files-selected': [files: File[]]
  'remove': [index: number]
}>()

const { locale } = useLocale()
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_MB = 10

function handleFiles(files: FileList | null) {
  if (!files || files.length === 0) return

  const valid = Array.from(files).filter((f) => {
    if (!ACCEPTED_TYPES.includes(f.type)) return false
    if (f.size > MAX_SIZE_MB * 1024 * 1024) return false
    return true
  })

  if (valid.length > 0) {
    emit('files-selected', valid)
  }
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  handleFiles(e.dataTransfer?.files ?? null)
}

function onFileInput(e: Event) {
  handleFiles((e.target as HTMLInputElement).files)
}
</script>

<template>
  <div class="image-uploader">

    <!-- Dropzone -->
    <div
      class="dropzone"
      :class="{
        'dropzone--dragging': isDragging,
        'dropzone--uploading': isUploading,
      }"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="onDrop"
      @click="fileInput?.click()"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        class="dropzone__input"
        @change="onFileInput"
      />

      <template v-if="isUploading">
        <div class="dropzone__spinner" />
        <p class="dropzone__text">
          {{ locale === 'en' ? 'Uploading...' : 'Uploaden...' }}
        </p>
      </template>

      <template v-else>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="dropzone__icon">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <p class="dropzone__text">
          {{ locale === 'en' ? 'Drop images here or click to upload' : 'Sleep afbeeldingen hierheen of klik om te uploaden' }}
        </p>
        <span class="dropzone__hint">
          {{ locale === 'en' ? 'PNG, JPG, WEBP · max 10MB each' : 'PNG, JPG, WEBP · max 10MB per stuk' }}
        </span>
      </template>
    </div>

    <!-- Preview grid -->
    <div v-if="modelValue.length > 0" class="preview-grid">
      <div
        v-for="(url, i) in modelValue"
        :key="url"
        class="preview-item"
      >
        <img :src="url" :alt="`Image ${i + 1}`" class="preview-item__img" />
        <button
          class="preview-item__remove"
          @click.stop="emit('remove', i)"
        >
          ✕
        </button>
        <span v-if="i === 0" class="preview-item__main">
          {{ locale === 'en' ? 'Main' : 'Hoofd' }}
        </span>
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.image-uploader {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.dropzone {
  border: 2px dashed $color-border;
  border-radius: $radius-lg;
  padding: $space-10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-3;
  text-align: center;
  cursor: pointer;
  transition: all $duration-fast;
  position: relative;

  &:hover {
    border-color: $color-blue;
    background: rgba($color-blue, 0.03);
  }

  &--dragging {
    border-color: $color-blue;
    background: rgba($color-blue, 0.06);
    transform: scale(1.01);
  }

  &--uploading {
    pointer-events: none;
    opacity: 0.7;
  }

  &__input {
    display: none;
  }

  &__icon {
    color: $color-text-dim;
    transition: color $duration-fast;

    .dropzone:hover & { color: $color-blue; }
  }

  &__text {
    font-size: $text-sm;
    font-weight: 500;
    color: $color-text-muted;
  }

  &__hint {
    font-size: $text-xs;
    color: $color-text-dim;
  }

  &__spinner {
    width: 32px;
    height: 32px;
    border: 3px solid $color-border;
    border-top-color: $color-blue;
    border-radius: $radius-full;
    animation: spin 0.8s linear infinite;
  }
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $space-3;

  @media (max-width: 480px) { grid-template-columns: repeat(2, 1fr); }
}

.preview-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: $radius-md;
  overflow: hidden;
  border: 1px solid $color-border;

  &:first-child {
    border-color: $color-blue;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__remove {
    position: absolute;
    top: $space-1;
    right: $space-1;
    width: 24px;
    height: 24px;
    border-radius: $radius-full;
    background: rgba($color-bg, 0.8);
    backdrop-filter: blur(4px);
    color: $color-text;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all $duration-fast;

    &:hover {
      background: $color-error;
      color: #fff;
    }
  }

  &__main {
    position: absolute;
    bottom: $space-1;
    left: $space-1;
    font-size: 10px;
    font-weight: 600;
    background: $color-blue;
    color: #fff;
    padding: 2px $space-2;
    border-radius: $radius-full;
  }
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>