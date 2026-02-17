<template>
  <div class="history-panel">
    <div class="history-header">
      <div class="history-title-wrapper">
        <h3>History</h3>
        <span class="badge">{{ history.length }}</span>
      </div>
      <button class="icon-btn sm danger" @click="$emit('clear')" title="Clear Board" :disabled="history.length === 0">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </button>
    </div>
    <div class="history-list">
      <div class="history-item" :class="{ active: currentIndex === -1 }" @click="$emit('jump', -1)">
        <div class="history-icon start">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        </div>
        <div class="history-content">
          <span class="history-type">Empty Canvas</span>
        </div>
      </div>
      <div v-for="(item, index) in history" :key="item.id" class="history-item"
        :class="{ active: index === currentIndex, inactive: index > currentIndex }" @click="$emit('jump', index)"
        @mouseenter="$emit('highlight', index)" @mouseleave="$emit('unhighlight', index)">
        <div class="history-icon draw">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m18 15-6-6-6 6" />
          </svg>
        </div>
        <div class="history-content">
          <div class="history-title">
            <span class="history-meta" :style="{ backgroundColor: item.brush.color }"
              :title="'Color: ' + item.brush.color"></span>
            <span class="history-type capitalize">{{ item.type }}</span>
          </div>
          <span class="history-time">
            {{ formatTime(item.timestamp) }}
            <span> · {{ item.brush.size }}</span>
          </span>
        </div>
        <button class="history-delete-btn" @click.stop="$emit('remove', index)" title="Remove item">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HistoryRecord } from '../types/whiteboard'

defineProps<{
  history: HistoryRecord[]
  currentIndex: number
}>()

defineEmits<{
  (e: 'clear'): void
  (e: 'jump', index: number): void
  (e: 'remove', index: number): void
  (e: 'highlight', index: number): void
  (e: 'unhighlight', index: number): void
}>()

const formatTime = (timestamp: number) => new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
}).format(new Date(timestamp))
</script>

<style scoped>
.history-panel {
  width: 280px;
  background: white;
  border-radius: 16px;
  box-shadow:
    0 10px 40px -10px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 600px;
  /* Match whiteboard height */
  overflow: hidden;
}

.history-header {
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.history-title-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge {
  background: #f3f4f6;
  color: #4b5563;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.history-item:hover {
  background-color: #f9fafb;
}

.history-item.active {
  background-color: #f3f4f6;
}

.history-item.active .history-type {
  font-weight: 600;
  color: #111827;
}

.history-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.history-item.active .history-icon {
  background: #e5e7eb;
  color: #111827;
}

.history-icon.draw {
  color: #3b82f6;
  background: #eff6ff;
}

.history-icon.start {
  color: #9ca3af;
}

.history-content {
  display: flex;
  flex-direction: column;
}

.history-title {
  display: flex;
  align-items: center;
  gap: 6px;
}

.history-meta {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.history-type {
  font-size: 0.875rem;
  color: #4b5563;
}

.history-type.capitalize {
  text-transform: capitalize;
}

.history-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.history-item.inactive {
  opacity: 0.5;
  filter: grayscale(0.8);
}

.history-item.inactive:hover {
  opacity: 0.8;
  filter: grayscale(0.4);
}

.history-delete-btn {
  margin-left: auto;
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  opacity: 0;
  transition: all 0.2s;
}

.history-item:hover .history-delete-btn {
  opacity: 1;
}

.history-delete-btn:hover {
  background-color: #fee2e2;
  color: #ef4444;
}

.icon-btn.sm {
  width: 28px;
  height: 28px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.icon-btn.danger {
  background: transparent;
  color: #ef4444;
}

.icon-btn.danger:hover:not(:disabled) {
  background-color: #fee2e2;
}

.icon-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 1100px) {
  .history-panel {
    width: 100%;
    height: 300px;
  }
}
</style>
