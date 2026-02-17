<template>
  <div v-if="image" class="preview-overlay" @click.self="$emit('close')">
    <div class="preview-card">
      <div class="preview-header">
        <h3>Saved Snapshot</h3>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>
      <div class="preview-body">
        <img :src="image" alt="Whiteboard Snapshot" />
      </div>
      <div class="preview-footer">
        <a :href="image" download="whiteboard.png" class="download-btn">Download PNG</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  image?: string
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<style scoped>
.preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
}

.preview-card {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.preview-header {
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
}

.preview-body {
  padding: 16px;
  background: #f9fafb;
}

.preview-body img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
}

.preview-footer {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
}

.download-btn {
  background-color: #111827;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.download-btn:hover {
  opacity: 0.9;
}
</style>
