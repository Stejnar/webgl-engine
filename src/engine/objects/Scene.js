import { Mesh } from "./index";

export class Scene {
    meshes = new Map()
    Mesh = () => false

    constructor(engine, name) {
        this.name = name

        this.Mesh = this._Mesh.bind(this, engine)
        this.update = this.update.bind(this)
        this.render = this.render.bind(this)
    }

    _Mesh(engine, name, {geometry, texture, config}) {
        if (!name) {
            console.error('ERROR: Meshes must be instantiated with a valid name string')
            return
        }
        const mesh = new Mesh(engine, geometry, texture, config)
        this.addMesh(name, mesh)
        return mesh
    }

    addMesh(name, mesh) {
        this.meshes.set(name, mesh)
    }

    getMesh(name) {
        return this.meshes.get(name)
    }

    removeMesh(name) {
        this.meshes.delete(name)
    }

    update() {
        for (const iterator of this.meshes) {
            iterator[1].update()
        }
    }

    render() {
        for (const iterator of this.meshes) {
            iterator[1].render()
        }
    }
}