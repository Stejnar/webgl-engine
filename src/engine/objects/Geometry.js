export class Geometry {
    vertices
    indices
    texCoords
    normals

    loader

    updateMesh = () => false

    constructor({loader, model}) {
        if (model) {
            this.vertices = new Float32Array(model.vertices)
            this.indices = new Uint16Array(model.indices)
            this.texCoords = new Float32Array(model.texCoords)
            this.normals = new Float32Array(model.normals)
        }
        if (loader) {
            this.loader = loader
            this.loader.sourceSetter(this.setModel.bind(this))
        }
    }

    setModel(model) {
        // console.log(model)
        if (model) {
            this.vertices = new Float32Array(model.meshes[0].vertices)
            this.indices = new Uint16Array([].concat.apply([], model.meshes[0].faces))
            this.texCoords = new Float32Array(model.meshes[0].texturecoords[0])
            this.normals = new Float32Array(model.meshes[0].normals)
            this.updateMesh()
        }
    }
}