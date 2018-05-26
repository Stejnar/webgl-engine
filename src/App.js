import React, { Component } from 'react'
import './App.css'
import { mat4 } from "gl-matrix/src/gl-matrix"
import { WebGLView } from "./engine/WebGLView";
import WebGLEngine from "./engine/WebGLEngine";

class App extends Component {
    engine

    componentWillMount() {
        this.engine = new WebGLEngine()
    }

    render() {
        return (
            <div className="App">
                <WebGLView width={800}
                           height={600}
                           engine={this.engine}
                           onLoad={this.load}/>
            </div>
        )
    }

    async load(engine) {
        await engine.createProgram('basic', 'shaders/shader.vs.glsl', 'shaders/shader.fs.glsl')
        engine.useProgram('basic')

        const scene = engine.Scene('scene')

        const susanMesh = {
            geometry: engine.Geometry({
                loader: engine.ModelLoader('models/Susan.json')
            }),
            texture: engine.Texture({
                loader: engine.TextureLoader('textures/SusanTexture.png'),
                flipY: true
            })
        }

        scene.Mesh('Susan1', {
            ...susanMesh, config: {
                transform: (mesh) => {
                    mat4.rotate(mesh.world, mesh.world, -Math.PI / 2, [1, 0, 0])
                    mat4.translate(mesh.world, mesh.world, [-2, 0, 0])
                },
                updateBehaviour: (mesh) => {
                    mat4.rotate(mesh.world, mesh.world, Math.PI / 150, [0, 0, 1])
                    mat4.translate(mesh.world, mesh.world, [0.02, 0, 0])
                }
            }
        })
        scene.Mesh('Susan2', {
            ...susanMesh, config: {
                transform: (mesh) => {
                    mat4.rotate(mesh.world, mesh.world, -Math.PI / 2, [1, 0, 0])
                    mat4.translate(mesh.world, mesh.world, [2, 0, 0])
                },
                updateBehaviour: (mesh) => {
                    mat4.rotate(mesh.world, mesh.world, Math.PI / 150, [0, 0, 1])
                    mat4.translate(mesh.world, mesh.world, [0.02, 0, 0])
                }
            }
        })

        engine.AmbientLight()

        const camera = engine.PerspectiveCamera({
            fovy: Math.PI / 4,
            aspect: engine.gl.canvas.width / engine.gl.canvas.height,
            near: 0.1,
            far: 1000
        })

        // camera.setPosition([-5, 0, -7])
    }
}

export default App
