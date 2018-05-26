const defaultConfig = {
    ambientLightIntensity: [0.2, 0.2, 0.2],
    sunlightDirection: [3.0, 4.0, -2.0],
    sunlightIntensity: [0.9, 0.9, 0.9]
}

export class AmbientLight {
    boundSetUniforms = () => false

    constructor(engine, config = defaultConfig) {
        const {gl, activeProgram: program} = engine
        this.ambientLightIntensityUniformLocation = gl.getUniformLocation(program, 'ambientLightIntensity')
        this.sunlightIntensityUniformLocation = gl.getUniformLocation(program, 'sun.color')
        this.sunlightDirectionUniformLocation = gl.getUniformLocation(program, 'sun.direction')

        this.boundSetUniforms = this._setUniforms.bind(this, gl)
        this.boundSetUniforms(config)
    }

    _setUniforms(gl, config) {
        gl.uniform3f(this.ambientLightIntensityUniformLocation, ...config.ambientLightIntensity)
        gl.uniform3f(this.sunlightDirectionUniformLocation, ...config.sunlightDirection)
        gl.uniform3f(this.sunlightIntensityUniformLocation, ...config.sunlightIntensity)
    }
}