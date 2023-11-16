import { OptionsType, defaultOptions } from './Options'
import { CreatePluginType } from 'embla-carousel/components/Plugins'
import { OptionsHandlerType } from 'embla-carousel/components/OptionsHandler'
import { EmblaCarouselType } from 'embla-carousel'
import { EngineType } from 'embla-carousel/components/Engine'
import { ScrollBodyType } from 'embla-carousel/components/ScrollBody'

declare module 'embla-carousel/components/Plugins' {
  interface EmblaPluginsType {
    autoScroll?: AutoScrollType
  }
}

declare module 'embla-carousel/components/EventHandler' {
  interface EmblaEventListType {
    autoScrollPlay: 'autoScroll:play'
    autoScrollStop: 'autoScroll:stop'
  }
}

// TODO: Fix pointerdown and up
// TODO: Add Ease in and out?

export type AutoScrollType = CreatePluginType<
  {
    play: (delay?: number) => void
    stop: () => void
    isPlaying: () => boolean
  },
  OptionsType
>

export type AutoScrollOptionsType = AutoScrollType['options']

function AutoScroll(userOptions: AutoScrollOptionsType = {}): AutoScrollType {
  let options: OptionsType
  let emblaApi: EmblaCarouselType
  let active = false
  let playing = false
  let wasPlaying = false
  let timer = 0
  let startDelay: number
  let defaultScrollBehaviour: ScrollBodyType

  function init(
    emblaApiInstance: EmblaCarouselType,
    optionsHandler: OptionsHandlerType
  ): void {
    emblaApi = emblaApiInstance
    if (emblaApi.scrollSnapList().length <= 1) return

    const { mergeOptions, optionsAtMedia } = optionsHandler
    const optionsBase = mergeOptions(defaultOptions, AutoScroll.globalOptions)
    const allOptions = mergeOptions(optionsBase, userOptions)
    options = optionsAtMedia(allOptions)

    startDelay = options.delay
    active = true
    defaultScrollBehaviour = emblaApi.internalEngine().scrollBody

    const { eventStore, ownerDocument } = emblaApi.internalEngine()
    const emblaRoot = emblaApi.rootNode()
    const root = (options.rootNode && options.rootNode(emblaRoot)) || emblaRoot

    emblaApi.on('pointerDown', stopScroll)
    // if (!options.stopOnInteraction) emblaApi.on('settle', startScroll)

    if (options.stopOnMouseEnter) {
      eventStore.add(root, 'mouseenter', stopScroll)

      if (!options.stopOnInteraction) {
        eventStore.add(root, 'mouseleave', startScroll)
      }
    }

    if (options.stopOnFocusIn) {
      eventStore.add(root, 'focusin', stopScroll)

      if (!options.stopOnInteraction) {
        eventStore.add(root, 'focusout', startScroll)
      }
    }

    eventStore.add(ownerDocument, 'visibilitychange', visibilityChange)

    if (options.playOnInit) {
      emblaApi.on('init', startScroll).on('reInit', startScroll)
    }
  }

  function destroy(): void {
    active = false
    playing = false
    emblaApi.off('init', startScroll).off('reInit', startScroll)
    emblaApi.off('pointerDown', stopScroll)
    // if (!options.stopOnInteraction) emblaApi.off('pointerUp', startTimer)
    stopScroll()
  }

  function startScroll(): void {
    if (!active || playing) return
    emblaApi.emit('autoScroll:play')

    const engine = emblaApi.internalEngine()
    const { ownerWindow } = engine

    timer = ownerWindow.setTimeout(() => {
      engine.scrollBody = createAutoScrollBehaviour(engine)
      engine.animation.start()
    }, startDelay)

    playing = true
  }

  function stopScroll(): void {
    if (!active || !playing) return
    emblaApi.emit('autoScroll:stop')

    const engine = emblaApi.internalEngine()
    const { ownerWindow } = engine

    engine.scrollBody = defaultScrollBehaviour
    ownerWindow.clearTimeout(timer)
    timer = 0

    playing = false
  }

  function visibilityChange(): void {
    const { ownerDocument } = emblaApi.internalEngine()

    if (ownerDocument.visibilityState === 'hidden') {
      wasPlaying = playing
      return stopScroll()
    }

    if (wasPlaying) startScroll()
  }

  function createAutoScrollBehaviour(engine: EngineType): ScrollBodyType {
    const { location, target, scrollTarget, index, indexPrevious } = engine
    const directionSign = options.direction === 'forward' ? -1 : 1
    const noop = (): ScrollBodyType => self

    let bodyVelocity = 0
    let scrollDirection = 0
    let rawLocation = location.get()
    let rawLocationPrevious = 0

    function seek(): ScrollBodyType {
      let directionDiff = 0

      bodyVelocity = directionSign
      rawLocation += bodyVelocity
      location.add(bodyVelocity)
      target.set(location)

      directionDiff = rawLocation - rawLocationPrevious

      scrollDirection = Math.sign(directionDiff)
      rawLocationPrevious = rawLocation

      const currentIndex = scrollTarget.byDistance(0, false).index

      if (index.get() !== currentIndex) {
        indexPrevious.set(index.get())
        index.set(currentIndex)
        emblaApi.emit('select')
      }

      return self
    }

    const self: ScrollBodyType = {
      direction: () => scrollDirection,
      duration: () => -1,
      velocity: () => bodyVelocity,
      seek,
      settled: () => false,
      useBaseFriction: noop,
      useBaseDuration: noop,
      useFriction: noop,
      useDuration: noop
    }
    return self
  }

  function play(delayOverride?: number): void {
    if (typeof delayOverride !== 'undefined') startDelay = delayOverride
    startScroll()
  }

  function stop(): void {
    if (playing) stopScroll()
  }

  // function reset(): void {
  //   if (playing) play()
  // }

  function isPlaying(): boolean {
    return playing
  }

  const self: AutoScrollType = {
    name: 'autoScroll',
    options: userOptions,
    init,
    destroy,
    play,
    stop,
    isPlaying
  }
  return self
}

AutoScroll.globalOptions = <AutoScrollOptionsType | undefined>undefined

export default AutoScroll
