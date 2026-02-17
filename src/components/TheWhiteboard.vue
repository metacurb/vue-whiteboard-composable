<template>
  <div class="canvas-area">
    <svg @mouseenter="isHovering = true" @mouseleave="isHovering = false" @mousemove="handleMouseMove" ref="svgRef"
      class="whiteboard" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet"></svg>
    <svg class="cursor-overlay" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
      <circle v-if="isHovering" :cx="mouseX" :cy="mouseY" :r="parseInt(size) / 2" :fill="color" stroke="rgba(0,0,0,0.1)"
        stroke-width="0.5" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  color: string
  size: string
}>()

const svgRef = ref<SVGSVGElement | null>(null)
const mouseX = ref(0)
const mouseY = ref(0)
const isHovering = ref(false)

const handleMouseMove = (e: MouseEvent) => {
  if (!svgRef.value) return
  const svg = svgRef.value
  const point = svg.createSVGPoint()
  point.x = e.clientX
  point.y = e.clientY
  const ctm = svg.getScreenCTM()
  if (ctm) {
    const svgPoint = point.matrixTransform(ctm.inverse())
    mouseX.value = svgPoint.x
    mouseY.value = svgPoint.y
  }
}

defineExpose({
  svgRef,
})
</script>

<style scoped>
.canvas-area {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.whiteboard {
  width: 100%;
  max-width: 800px;
  height: 100%;
  touch-action: none;
  cursor: none;
  background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
  background-size: 20px 20px;
  display: block;
}

.cursor-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

:deep(path.highlighted) {
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.5));
}

@media (max-width: 700px) {
  .whiteboard {
    aspect-ratio: 1 / 1;
  }
}
</style>
