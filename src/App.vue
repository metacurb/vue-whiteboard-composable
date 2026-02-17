<template>
  <div class="app-container">
    <header class="header">
      <div class="header-content">
        <h1>
          Vue Whiteboard Composable<span class="version">v{{ pkg.version }}</span>
        </h1>
        <p>A lightweight, headless Vue 3 composable for SVG-based whiteboard drawing.</p>
        <div class="links">
          <a :href="`https://www.npmjs.com/package/${pkg.name}`" target="_blank" class="badge-link npm">
            NPM
          </a>
          <a :href="pkg.repository.url.replace('git+', '').replace('.git', '')" target="_blank"
            class="badge-link github">
            GitHub
          </a>
        </div>
      </div>
    </header>

    <main class="workspace">
      <div class="whiteboard-wrapper">
        <TheWhiteboard ref="whiteboardComponent" :color="color" :size="size" />

        <TheControls v-model:color="color" v-model:size="size" :colors="colors" :sizes="sizes" :can-undo="canUndo"
          :can-redo="canRedo" @undo="undo" @redo="redo" @save="saveImage" />
      </div>

      <TheHistory :history="history" :current-index="currentIndex" @clear="clear" @jump="jumpTo"
        @remove="removeFromHistory" @highlight="highlightRecord" @unhighlight="unhighlightRecord" />

      <ThePreview :image="image" @close="image = undefined" />
    </main>

    <footer class="footer">
      <div class="features-grid">
        <div class="feature-card">
          <h3>🧩 Headless & Composable</h3>
          <p>
            Built as a Vue 3 composable (<code>useWhiteboard</code>), giving you full control over
            the UI while handling the logic.
          </p>
        </div>
        <div class="feature-card">
          <h3>⚡ SVG & D3.js</h3>
          <p>
            Leverages D3.js for efficient SVG manipulation, ensuring smooth drawing and scaling.
          </p>
        </div>
        <div class="feature-card">
          <h3>↺ Undo / Redo</h3>
          <p>Built-in history stack management with robust undo/redo capabilities.</p>
        </div>
        <div class="feature-card">
          <h3>💾 Export to Image</h3>
          <p>Easily export your whiteboard creations to PNG format.</p>
        </div>
      </div>
      <p class="footer-note">
        MIT Licensed • Created by <a href="https://github.com/metacurb" target="_blank">Metacurb</a>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useWhiteboard } from './composables/useWhiteboard'
import pkg from '../package.json'
import defaultState from './default-state.json'

// Components
import TheWhiteboard from './components/TheWhiteboard.vue'
import TheControls from './components/TheControls.vue'
import TheHistory from './components/TheHistory.vue'
import ThePreview from './components/ThePreview.vue'

const colors = [
  { name: 'Black', value: '#212121' },
  { name: 'Red', value: '#ff555f' },
  { name: 'Yellow', value: '#ffc93b' },
  { name: 'Blue', value: '#3494ff' },
  { name: 'Green', value: '#4caf50' },
  { name: 'Purple', value: '#9c27b0' },
]

const sizes = [
  { name: 'Thin', value: '2px', previewSize: 4 },
  { name: 'Medium', value: '4px', previewSize: 8 },
  { name: 'Thick', value: '8px', previewSize: 12 },
  { name: 'Extra Thick', value: '16px', previewSize: 18 },
]

const color = ref('#ff555f')
const size = ref('16px')
const image = ref<string | undefined>(undefined)

const whiteboardComponent = ref<InstanceType<typeof TheWhiteboard> | null>(null)
const svgRef = computed(() => whiteboardComponent.value?.svgRef || null)

const STORAGE_KEY = 'vue-whiteboard-state'
const getInitialState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return defaultState

    const parsed = JSON.parse(saved)
    return parsed?.length ? parsed : defaultState
  } catch (e) {
    console.error('Failed to load state', e)
    return defaultState
  }
}

const {
  undo,
  redo,
  clear,
  save,
  removeFromHistory,
  canUndo,
  canRedo,
  history,
  currentIndex,
  jumpTo,
  serialize,
} = useWhiteboard(svgRef, {
  color,
  size,
  lineStyles: { 'mix-blend-mode': 'normal' },
  initialState: getInitialState(),
})

watch(
  history,
  () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialize()))
  },
  { deep: true },
)

const highlightRecord = (index: number) => {
  const record = history.value[index]
  if (record?.type === 'line' && record.data) {
    const el = record.data as SVGElement
    el.classList.add('highlighted')
  }
}

const unhighlightRecord = (index: number) => {
  const record = history.value[index]
  if (record?.type === 'line' && record.data) {
    const el = record.data as SVGElement
    el.classList.remove('highlighted')
  }
}

async function saveImage() {
  image.value = await save()
}
</script>

<style>
body {
  margin: 0;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Helvetica,
    Arial,
    sans-serif;
  background: radial-gradient(circle at 50% 0%, #eef2f6 0%, #dfe4ea 100%);
  color: #1f2937;
  -webkit-font-smoothing: antialiased;
}

.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  margin: 0 auto;
  padding: 60px 0;
  max-width: 1000px;
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.025em;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.version {
  font-size: 0.875rem;
  background: #e5e7eb;
  color: #4b5563;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
}

.header p {
  color: #6b7280;
  font-size: 1.1rem;
  margin: 0 0 20px 0;
}

.links {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.badge-link {
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.badge-link.npm {
  background-color: #fff0f0;
  color: #cc3534;
  border: 1px solid #ffcdcd;
}

.badge-link.npm:hover {
  background-color: #ffe6e6;
}

.badge-link.github {
  background-color: #f3f4f6;
  color: #1f2937;
  border: 1px solid #e5e7eb;
}

.badge-link.github:hover {
  background-color: #e5e7eb;
}

.workspace {
  display: flex;
  width: 100%;
  gap: 24px;
}

.whiteboard-wrapper {
  flex: 1;
  position: relative;
  background: white;
  border-radius: 16px;
  box-shadow:
    0 10px 40px -10px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.footer {
  margin-top: 24px;
  text-align: center;
  width: 100%;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.feature-card {
  background: white;
  border-radius: 16px;
  box-shadow:
    0 10px 40px -10px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  padding: 24px;
  text-align: left;
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-2px);
}

.feature-card h3 {
  font-size: 1.1rem;
  margin: 0 0 8px 0;
  color: #111827;
}

.feature-card p {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.feature-card code {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  color: #ec4899;
}

.footer-note {
  color: #9ca3af;
  font-size: 0.9rem;
}

.footer-note a {
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
}

.footer-note a:hover {
  color: #111827;
}

@media (max-width: 1100px) {
  .workspace {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .app-container {
    padding-right: 10px;
    padding-left: 10px;
    width: auto;
  }

  .features-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 850px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .header h1 {
    font-size: 1.75rem;
    flex-wrap: wrap;
  }
}
</style>
