import { mat4 } from "gl-matrix/src/gl-matrix"

export class PerspectiveCamera {
    matWorldUniformLocation
    matViewUniformLocation
    matProjUniformLocation

    worldMatrix
    viewMatrix
    projMatrix

    config
    position
    center

    engine

    constructor(engine, config) {
        const {gl, activeProgram: program} = engine
        const defaultCameraConfig = {
            fovy: Math.PI / 4,
            aspect: gl.canvas.width / gl.canvas.height,
            near: 1,
            far: 1000
        }
        this.engine = engine
        this.config = {...defaultCameraConfig, ...config};
        this.position = [0, 0, -10]
        this.center = [0, 0, 0]

        this.matViewUniformLocation = gl.getUniformLocation(program, 'mView')
        this.matProjUniformLocation = gl.getUniformLocation(program, 'mProj')

        this.viewMatrix = new Float32Array(16)
        this.projMatrix = new Float32Array(16)

        mat4.lookAt(this.viewMatrix, this.position, this.center, [0, 1, 0])
        mat4.perspective(
            this.projMatrix,
            this.config.fovy,
            this.config.aspect,
            this.config.near,
            this.config.far
        )
        this.update()
    }

    setPosition(position) {
        this.position = position
        mat4.lookAt(this.viewMatrix, this.position, this.center, [0, 1, 0])
        this.update()
    }

    lookAt(center) {
        this.center = center
        mat4.lookAt(this.viewMatrix, this.position, this.center, [0, 1, 0])
        this.update()
    }

    update() {
        const gl = this.engine.gl
        gl.uniformMatrix4fv(this.matViewUniformLocation, false, this.viewMatrix)
        gl.uniformMatrix4fv(this.matProjUniformLocation, false, this.projMatrix)
    }
}