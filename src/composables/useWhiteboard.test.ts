import { cleanup, render } from '@testing-library/vue'
import { defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useWhiteboard } from './useWhiteboard'
import type { SerializableRecord, UseWhiteboardReturn, WhiteboardOptions } from '@/types/whiteboard'

type HarnessResult = ReturnType<typeof render> & {
  api: UseWhiteboardReturn
  svg: SVGSVGElement
}

const createHarness = async (options: WhiteboardOptions = {}): Promise<HarnessResult> => {
  let api!: UseWhiteboardReturn

  const Harness = defineComponent({
    setup() {
      const containerRef = ref<SVGSVGElement | null>(null)
      api = useWhiteboard(containerRef, options)

      return () =>
        h('svg', {
          ref: containerRef,
          'data-testid': 'whiteboard',
          width: 320,
          height: 200,
        })
    },
  })

  const view = render(Harness)
  const element = view.getByTestId('whiteboard')
  if (!(element instanceof SVGSVGElement)) {
    throw new Error('Expected whiteboard test node to be an SVGSVGElement')
  }
  const svg = element

  Object.defineProperty(svg, 'clientWidth', {
    configurable: true,
    value: 320,
  })

  Object.defineProperty(svg, 'clientHeight', {
    configurable: true,
    value: 200,
  })

  Object.defineProperty(svg, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 320,
      bottom: 200,
      width: 320,
      height: 200,
      toJSON: () => '',
    }),
  })

  await nextTick()

  return {
    ...view,
    api,
    svg,
  }
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('useWhiteboard', () => {
  it('hydrates initial state into the svg and history', async () => {
    const initialState: SerializableRecord[] = [
      {
        id: 'first',
        type: 'line',
        timestamp: 100,
        pathData: 'M0,0L10,10',
        brush: {
          color: '#123456',
          size: '8px',
        },
      },
    ]

    const { api, svg } = await createHarness({
      color: '#ffffff',
      size: '2px',
      initialState,
    })

    const path = svg.querySelector('path')

    expect(path).not.toBeNull()
    expect(path?.getAttribute('d')).toBe('M0,0L10,10')
    expect(path?.getAttribute('style')).toContain('stroke: #123456')
    expect(path?.getAttribute('style')).toContain('stroke-width: 8px')
    expect(api.history.value).toHaveLength(1)
    expect(api.currentIndex.value).toBe(0)
    expect(api.canUndo.value).toBe(true)
    expect(api.canRedo.value).toBe(false)
  })

  it('undoes and redoes hydrated history against the rendered svg', async () => {
    const initialState: SerializableRecord[] = [
      {
        id: 'first',
        type: 'line',
        timestamp: 100,
        pathData: 'M0,0L10,10',
        brush: {
          color: '#111111',
          size: '4px',
        },
      },
      {
        id: 'second',
        type: 'line',
        timestamp: 200,
        pathData: 'M20,20L30,30',
        brush: {
          color: '#222222',
          size: '6px',
        },
      },
    ]

    const { api, svg } = await createHarness({ initialState })

    expect(svg.querySelectorAll('path')).toHaveLength(2)

    api.undo()

    expect(svg.querySelectorAll('path')).toHaveLength(1)
    expect(api.currentIndex.value).toBe(0)
    expect(api.canRedo.value).toBe(true)

    api.redo()

    expect(svg.querySelectorAll('path')).toHaveLength(2)
    expect(api.currentIndex.value).toBe(1)
    expect(api.canRedo.value).toBe(false)
  })

  it('removes history records and clears the board', async () => {
    const initialState: SerializableRecord[] = [
      {
        id: 'first',
        type: 'line',
        timestamp: 100,
        pathData: 'M0,0L10,10',
        brush: {
          color: '#111111',
          size: '4px',
        },
      },
      {
        id: 'second',
        type: 'line',
        timestamp: 200,
        pathData: 'M20,20L30,30',
        brush: {
          color: '#222222',
          size: '6px',
        },
      },
    ]

    const { api, svg } = await createHarness({ initialState })

    api.removeFromHistory(0)

    expect(svg.querySelectorAll('path')).toHaveLength(1)
    expect(api.history.value).toHaveLength(1)
    expect(api.history.value[0]?.id).toBe('second')
    expect(api.currentIndex.value).toBe(0)

    api.clear()

    expect(svg.querySelectorAll('path')).toHaveLength(0)
    expect(api.history.value).toHaveLength(0)
    expect(api.currentIndex.value).toBe(-1)
    expect(api.canUndo.value).toBe(false)
    expect(api.canRedo.value).toBe(false)
  })

  it('syncs jump/undo/redo state with a mounted svg history', async () => {
    const initialState: SerializableRecord[] = [
      {
        id: 'first',
        type: 'line',
        timestamp: 100,
        pathData: 'M0,0L10,10',
        brush: {
          color: '#111111',
          size: '4px',
        },
      },
      {
        id: 'second',
        type: 'line',
        timestamp: 200,
        pathData: 'M20,20L30,30',
        brush: {
          color: '#222222',
          size: '6px',
        },
      },
      {
        id: 'third',
        type: 'line',
        timestamp: 300,
        pathData: 'M40,40L60,60',
        brush: {
          color: '#333333',
          size: '8px',
        },
      },
    ]

    const { api, svg } = await createHarness({
      backgroundColor: '#f5f5f5',
      initialState,
    })

    expect(svg.style.backgroundColor).toBe('rgb(245, 245, 245)')
    expect(api.history.value).toHaveLength(3)
    expect(svg.querySelectorAll('path')).toHaveLength(3)

    api.undo()
    expect(api.canRedo.value).toBe(true)
    expect(svg.querySelectorAll('path')).toHaveLength(2)

    api.jumpTo(0)
    expect(api.currentIndex.value).toBe(0)
    expect(svg.querySelectorAll('path')).toHaveLength(1)

    api.jumpTo(2)
    expect(api.currentIndex.value).toBe(2)
    expect(svg.querySelectorAll('path')).toHaveLength(3)

    api.undo()
    api.undo()
    expect(api.currentIndex.value).toBe(0)
    expect(svg.querySelectorAll('path')).toHaveLength(1)
    expect(api.canUndo.value).toBe(true)
    expect(api.canRedo.value).toBe(true)

    api.redo()
    expect(api.currentIndex.value).toBe(1)
    expect(svg.querySelectorAll('path')).toHaveLength(2)
    expect(api.canRedo.value).toBe(true)
  })

  it('serializes and exports the rendered board', async () => {
    const drawImage = vi.fn()
    const clearRect = vi.fn()

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      clearRect,
      drawImage,
      imageSmoothingEnabled: false,
      imageSmoothingQuality: 'low',
    } as unknown as CanvasRenderingContext2D)

    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/png;base64,mock')

    vi.stubGlobal(
      'Image',
      class {
        onload: null | (() => void) = null

        set src(_value: string) {
          this.onload?.()
        }
      },
    )

    const { api } = await createHarness({
      initialState: [
        {
          id: 'first',
          type: 'line',
          timestamp: 100,
          pathData: 'M0,0L20,20',
          brush: {
            color: '#0088ff',
            size: '9px',
          },
        },
      ],
      linecap: 'square',
      linejoin: 'bevel',
      exportScale: 2,
    })

    const serialized = api.serialize()
    const exported = await api.save()

    expect(serialized).toHaveLength(1)
    expect(serialized[0]?.brush).toEqual({
      color: '#0088ff',
      size: '9px',
    })
    expect(serialized[0]?.pathData).toBeTruthy()
    expect(exported).toBe('data:image/png;base64,mock')
    expect(clearRect).toHaveBeenCalledWith(0, 0, 640, 400)
    expect(drawImage).toHaveBeenCalled()
  })
})
