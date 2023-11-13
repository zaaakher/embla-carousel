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

// TODO: Add stopOnFocusIn

export type AutoScrollType = CreatePluginType<{}, OptionsType>

export type AutoScrollOptionsType = AutoScrollType['options']

function AutoScroll(userOptions: AutoScrollOptionsType = {}): AutoScrollType {
  let options: OptionsType
  let emblaApi: EmblaCarouselType
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

    console.log('hi!')

    const emblaRoot = emblaApi.rootNode()

    // const root = (options.rootNode && options.rootNode(emblaRoot)) || emblaRoot

    startScroll()

    emblaApi.on('pointerDown', clearScroll)
    emblaApi.on('scroll', (_, name) => console.log(name))
    emblaApi.on('settle', (_, name) => console.log(name))
  }

  function destroy(): void {}

  function startScroll(): void {
    const engine = emblaApi.internalEngine()
    defaultScrollBehaviour = engine.scrollBody
    engine.scrollBody = autoScrollBehaviour(engine)
    engine.animation.start()
  }

  function clearScroll(): void {
    const engine = emblaApi.internalEngine()
    engine.animation.stop()
    engine.scrollBody = defaultScrollBehaviour
    engine.animation.start()
  }

  function autoScrollBehaviour(engine: EngineType): ScrollBodyType {
    const { location, target, scrollTarget, index, indexPrevious } = engine
    const noop = (): ScrollBodyType => self

    let bodyVelocity = 0
    let scrollDirection = 0
    let rawLocation = location.get()
    let rawLocationPrevious = 0

    function seek(): ScrollBodyType {
      let directionDiff = 0

      bodyVelocity = -2
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

  const self: AutoScrollType = {
    name: 'autoScroll',
    options: userOptions,
    init,
    destroy
  }
  return self
}

AutoScroll.globalOptions = <AutoScrollOptionsType | undefined>undefined

export default AutoScroll
