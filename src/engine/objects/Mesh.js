import { mat4 } from "gl-matrix/src/gl-matrix"

export class Mesh {
    geometry
    texture
    world

    transform
    updateBehaviour
    renderBehaviour

    vertexBufferObject
    indicesBufferObject
    texCoordsBufferObject
    normalsBufferObject

    engine

    constructor(engine, geometry, texture, config) {
        const {gl} = engine
        this.engine = engine
        this.geometry = geometry
        this.geometry.updateMesh = this.setGeometryBuffers.bind(this)
        this.texture = texture
        this.texture.updateMesh = this.attachTexture.bind(this)
        this.world = mat4.create()

        this.vertexBufferObject = gl.createBuffer()
        this.indicesBufferObject = gl.createBuffer()
        this.texCoordsBufferObject = gl.createBuffer()
        this.normalsBufferObject = gl.createBuffer()

        if (config) {
            if (config.transform) {
                this.transform = config.transform
                config.transform(this)
            }
            if (config.updateBehaviour) this.updateBehaviour = config.updateBehaviour
            if (config.renderBehaviour) this.renderBehaviour = config.renderBehaviour
        }

        this.update = this.update.bind(this)
        this.render = this.render.bind(this)
    }

    setGeometryBuffers() {
        const {gl, activeProgram: program} = this.engine
        this.loadBuffer(gl.ARRAY_BUFFER, this.vertexBufferObject, this.geometry.vertices)
        this.loadBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBufferObject, this.geometry.indices)
        this.loadBuffer(gl.ARRAY_BUFFER, this.texCoordsBufferObject, this.geometry.texCoords)
        this.loadBuffer(gl.ARRAY_BUFFER, this.normalsBufferObject, this.geometry.normals)
        this.bindAttributes(program)
    }

    loadBuffer(type, bufferObject, bufferData) {
        const gl = this.engine.gl
        gl.bindBuffer(type, bufferObject)
        gl.bufferData(type, bufferData, gl.STATIC_DRAW)
    }

    bindAttributes(program) {
        const gl = this.engine.gl
        // bind position vertex attribute
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferObject)
        const positionAttributeLocation = gl.getAttribLocation(program, 'vertPosition')
        gl.vertexAttribPointer(
            positionAttributeLocation,
            3, gl.FLOAT,
            false,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0
        )
        gl.enableVertexAttribArray(positionAttributeLocation)

        // bind texture attribute
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsBufferObject)
        const texCoordAttributeLocation = gl.getAttribLocation(program, 'vertTexCoord')
        gl.vertexAttribPointer(
            texCoordAttributeLocation,
            2, gl.FLOAT,
            false,
            2 * Float32Array.BYTES_PER_ELEMENT,
            0
        )
        gl.enableVertexAttribArray(texCoordAttributeLocation)

        // bind normals attribute
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBufferObject)
        const normalAttributeLocation = gl.getAttribLocation(program, 'vertNormal')
        gl.vertexAttribPointer(
            normalAttributeLocation,
            3, gl.FLOAT,
            true,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0
        )
        gl.enableVertexAttribArray(normalAttributeLocation)
    }

    attachTexture() {
        const gl = this.engine.gl

        const glTexture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, glTexture)
        if (this.texture.flipY) gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
            gl.UNSIGNED_BYTE, this.texture.src
        )
        return function (textureLink) {
            gl.bindTexture(gl.TEXTURE_2D, glTexture)
            gl.activeTexture(textureLink)
        }
    }

    update() {
        const {gl, activeProgram: program} = this.engine
        if (this.updateBehaviour) this.updateBehaviour(this, gl, program)
    }

    render() {
        const {gl, activeProgram: program} = this.engine
        const matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld')
        if (this.renderBehaviour) this.renderBehaviour(this, gl, program)
        gl.uniformMatrix4fv(matWorldUniformLocation, false, this.world)
        gl.drawElements(gl.TRIANGLES, this.geometry.indices.length, gl.UNSIGNED_SHORT, 0)
    }
}