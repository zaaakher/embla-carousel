"use strict";(self.webpackChunkembla_carousel_docs=self.webpackChunkembla_carousel_docs||[]).push([[4307],{4307:function(e,o,n){n.r(o),o.default="import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport EmblaCarousel from './Default/EmblaCarousel';\nimport Header from './Header';\nimport Footer from './Footer';\nimport '../css/base.css';\nimport '../css/sandbox.css';\nimport '../css/embla.css';\n\nconst OPTIONS = {};\nconst SLIDE_COUNT = 5;\nconst SLIDES = Array.from(Array(SLIDE_COUNT).keys());\n\nconst App = () => (<main className=\"sandbox\">\n    <Header />\n    <section className=\"sandbox__carousel\">\n      <EmblaCarousel slides={SLIDES} options={OPTIONS}/>\n    </section>\n    <Footer />\n  </main>);\n\nReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode>\n    <App />\n  </React.StrictMode>);\n"}}]);
//# sourceMappingURL=4307-c4935f66eb7f67c35bf9.js.map