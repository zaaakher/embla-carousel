"use strict";(self.webpackChunkembla_carousel_docs=self.webpackChunkembla_carousel_docs||[]).push([[6825],{6825:function(n,e,a){a.r(e),e.default="\nexport const updateSelectedSnapDisplay = (emblaApi, snapDisplay) => {\n    const updateSnapDisplay = (emblaApi) => {\n        const selectedSnap = emblaApi.selectedScrollSnap();\n        const snapCount = emblaApi.scrollSnapList().length;\n        snapDisplay.innerHTML = `${selectedSnap + 1} / ${snapCount}`;\n    };\n    \n    emblaApi.on('select', updateSnapDisplay).on('reInit', updateSnapDisplay);\n    updateSnapDisplay(emblaApi);\n    \n    return () => {\n        emblaApi.off('select', updateSnapDisplay).off('reInit', updateSnapDisplay);\n    };\n};\n"}}]);
//# sourceMappingURL=6825-9e66f4887263c24fbbb9.js.map