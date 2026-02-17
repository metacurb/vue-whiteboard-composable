<template>
  <div class="toolbar">
    <div class="color-picker" role="group" aria-label="Color Palette">
      <button
        v-for="c in colors"
        :key="c.value"
        class="color-btn"
        :class="{ active: color === c.value }"
        :style="{ backgroundColor: c.value }"
        @click="$emit('update:color', c.value)"
        :aria-label="c.name"
        :title="c.name"
      ></button>
    </div>

    <div class="separator"></div>

    <div class="size-picker" role="group" aria-label="Brush Size">
      <button
        v-for="s in sizes"
        :key="s.value"
        class="size-btn"
        :class="{ active: size === s.value }"
        @click="$emit('update:size', s.value)"
        :title="s.name"
      >
        <div
          class="size-preview"
          :style="{ width: s.previewSize + 'px', height: s.previewSize + 'px' }"
        ></div>
      </button>
    </div>

    <div class="separator"></div>

    <div class="actions">
      <button class="icon-btn" @click="$emit('undo')" :disabled="!canUndo" title="Undo">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 7v6h6" />
          <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
        </svg>
      </button>
      <button class="icon-btn" @click="$emit('redo')" :disabled="!canRedo" title="Redo">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 7v6h-6" />
          <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
        </svg>
      </button>
      <button class="icon-btn primary" @click="$emit('save')" title="Save Image">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Color {
  name: string
  value: string
}

interface Size {
  name: string
  value: string
  previewSize: number
}

defineProps<{
  color: string
  size: string
  colors: Color[]
  sizes: Size[]
  canUndo: boolean
  canRedo: boolean
}>()

defineEmits<{
  (e: 'update:color', value: string): void
  (e: 'update:size', value: string): void
  (e: 'undo'): void
  (e: 'redo'): void
  (e: 'save'): void
}>()
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  background: #ffffff;
  border-top: 1px solid #f3f4f6;
  flex-wrap: wrap;
}

.color-picker,
.size-picker,
.actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.separator {
  width: 1px;
  height: 24px;
  background-color: #e5e7eb;
  margin: 0 8px;
}

.color-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.color-btn:hover {
  transform: scale(1.1);
}

.color-btn.active {
  border-color: #111827;
  transform: scale(1.1);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 1);
}

.size-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #4b5563;
}

.size-btn:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.size-btn.active {
  background-color: #f3f4f6;
  border-color: #e5e7eb;
  color: #111827;
}

.size-preview {
  background-color: currentColor;
  border-radius: 50%;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-btn:hover:not(:disabled) {
  background-color: #f3f4f6;
  color: #111827;
}

.icon-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.icon-btn.primary {
  background-color: #111827;
  color: white;
}

.icon-btn.primary:hover:not(:disabled) {
  opacity: 0.9;
  background-color: #111827;
  color: white;
  transform: translateY(-1px);
}

@media (max-width: 700px) {
  .toolbar {
    gap: 8px;
    padding: 8px;
    flex-direction: column;
  }

  .separator {
    display: none;
  }
}
</style>
