import { CreateOptionsType } from 'embla-carousel/components/Options'

export type OptionsType = CreateOptionsType<{
  playOnInit: boolean
  rootNode: ((emblaRoot: HTMLElement) => HTMLElement | null) | null
}>

export const defaultOptions: OptionsType = {
  active: true,
  breakpoints: {},
  playOnInit: true,
  rootNode: null
}
