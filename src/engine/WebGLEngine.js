import { Geometry, PerspectiveCamera, Texture } from './objects/index'
import { TextureLoader } from "./loaders/TextureLoader";
import { JsonLoader } from "./loaders/JsonLoader";
import { Loader } from "./loaders/Loader";
import { AmbientLight } from "./objects/AmbientLight";
import { Scene } from "./objects/Scene";

export default class WebGLEngine {
    scenes = new Map()
    gl = null
    programs = new Map()
    activeProgram = null
    loaders = new Map()
    camera = null

    constructor() {
        this.run = this.run.bind(this)
    }

    static getWebGLRenderingContext(canvas, engine) {
        let gl = canvas.getContext('webgl')
        if (!gl) {
            gl = canvas.getContext('experimental-webgl')
            console.warn('WARNING: Using experimental WebGL context!')
        }
        if (!gl) {
            alert('Your browser doesn\'t support WebGL!')
        }
        if (engine) {
            engine.gl = gl
        } else {
            console.warn('WARNING: No engine specified for WebGLView!')
        }
        return gl
    }

    createProgram(name, vertexShaderUrl, fragmentShaderUrl) {
        const gl = this.gl
        if (!gl) {
            return Promise.reject(new Error('ERROR: No WebGLRenderingContext specified!' +
                '\n Did you pass an instance of WebGLEngine as props to WebGLView?'))
        }
        const program = gl.createProgram()

        const attachShader = ShaderAttacher(gl, program)

        return new Promise(((resolve, reject) => {
            Promise.all([
                new Loader().loadTextResource(vertexShaderUrl),
                new Loader().loadTextResource(fragmentShaderUrl)
            ]).then(shader => {
                attachShader(gl.VERTEX_SHADER, shader[0])
                attachShader(gl.FRAGMENT_SHADER, shader[1])

                gl.linkProgram(program)
                if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                    reject(new Error('ERROR linking program! \n' +
                        gl.getProgramInfoLog(program)))
                }

                gl.validateProgram(program)
                if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
                    reject(new Error('ERROR validating program! \n' +
                        gl.getProgramInfoLog(program)))
                }
                this.programs.set(name, program)
                resolve(program)
            })
        }))
    }

    useProgram(name) {
        const program = this.getProgram(name)
        this.activeProgram = program
        this.gl.useProgram(program)
    }

    getProgram(name) {
        return this.programs.get(name)
    }

    getMesh(name) {
        let mesh
        for (const iterator of this.scenes) {
            mesh = iterator[1].getMesh(name)
            if (mesh) return mesh
        }
        return mesh
    }

    Scene(name) {
        if (!name) {
            console.error('ERROR: Scenes must be instantiated with a valid name string')
            return
        }
        const scene = new Scene(this, name)
        this.scenes.set(name, scene)
        return scene
    }

    PerspectiveCamera({fovy, aspect, near, far}) {
        this.camera = new PerspectiveCamera(this, {fovy, aspect, near, far})
        return this.camera
    }

    Texture(config) {
        return new Texture(config)
    }

    Geometry({loader, model}) {
        return new Geometry({loader, model})
    }

    ModelLoader(url) {
        this.loaders.set(url, new JsonLoader(url))
        return this.loaders.get(url)
    }

    TextureLoader(url) {
        this.loaders.set(url, new TextureLoader(url))
        return this.loaders.get(url)
    }

    /**
     * @param {{ambientLightIntensity, sunlightDirection, sunlightIntensity}} [config]
     * @return {AmbientLight}
     */
    AmbientLight(config) {
        return new AmbientLight(this, config)
    }

    resolveLoaders(callback) {
        let promiseHolders = []
        for (const [url, loader] of this.loaders) {
            promiseHolders.push({
                url: url,
                loader: loader,
                promise: loader.load()
            })
        }
        Promise.all(promiseHolders.map(holder => holder.promise))
            .then(results => {
                promiseHolders.map((promise, i) => promise.loader.setter(results[i]))
                callback()
            })
            .catch(err => console.error(err))
    }

    update() {
        for (const iterator of this.scenes) {
            iterator[1].update()
        }
    }

    render() {
        const gl = this.gl
        gl.enable(gl.DEPTH_TEST) // only render what is closest to camera
        gl.enable(gl.CULL_FACE) // do not process vertices out of view

        gl.clearColor(0.75, 0.85, 0.8, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        for (const iterator of this.scenes) {
            iterator[1].render()
        }
    }

    run() {
        const update = this.update.bind(this)
        const render = this.render.bind(this)
        const loop = function () {
            update()
            render()
            requestAnimationFrame(loop)
        }
        requestAnimationFrame(loop)
    }
}

function ShaderAttacher(gl, program) {
    return function attachShader(type, shaderText) {
        const shader = gl.createShader(type)
        gl.shaderSource(shader, shaderText)
        gl.compileShader(shader)
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('ERROR compiling shader! \n', gl.getShaderInfoLog(shader))
        } else {
            gl.attachShader(program, shader)
        }
    }
}