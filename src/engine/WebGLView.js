import React, { Component } from 'react'
import WebGLEngine from "./WebGLEngine"

export class WebGLView extends Component {
    canvas = null

    componentDidMount() {
        const {engine, onLoad} = this.props
        let interval

        interval = setInterval(() => {
            if (this.canvas && onLoad) {
                WebGLEngine.getWebGLRenderingContext(this.canvas, engine)
                Promise.resolve(onLoad(engine)).then(() => {
                    engine.resolveLoaders(() => {
                        engine.run()
                    })
                }).catch(err => console.error(err))
                clearInterval(interval)
            } else {
                if (!onLoad) {
                    console.warn('WARNING: No onLoad function passed to WebGLView!')
                }
            }
        }, 10)
    }

    render() {
        const {width, height} = this.props
        return <canvas width={width}
                       height={height}
                       ref={ref => this.canvas = ref}>
            Your browser does not support HTML5
        </canvas>
    }
}