"use strict";(self.webpackChunkembla_carousel_docs=self.webpackChunkembla_carousel_docs||[]).push([[5555],{5555:function(e,a,n){n.r(a),a.default="import { EmblaCarouselType } from 'embla-carousel'\n\nexport const updateSelectedSnapDisplay = (\n  emblaApi: EmblaCarouselType,\n  snapDisplay: HTMLElement\n): void => {\n  const updateSnapDisplay = (emblaApi: EmblaCarouselType) => {\n    const selectedSnap = emblaApi.selectedScrollSnap()\n    const snapCount = emblaApi.scrollSnapList().length\n    snapDisplay.innerHTML = `${selectedSnap + 1} / ${snapCount}`\n  }\n\n  emblaApi.on('select', updateSnapDisplay).on('reInit', updateSnapDisplay)\n\n  updateSnapDisplay(emblaApi)\n}\n"}}]);
//# sourceMappingURL=5555-7271b7d079a01b9fe9ba.js.map