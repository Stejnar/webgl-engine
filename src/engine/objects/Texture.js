
export class Texture {
    flipY = false
    src = null
    loader

    updateMesh = () => false

    constructor({loader, src, flipY} = {flipY: false}) {
        this.flipY = flipY
        if (src) {
            this.src = src
        }
        if (loader) {
            this.loader = loader
            this.loader.sourceSetter(this.setSource.bind(this))
        }
    }

    setSource(src) {
        // console.log(src)
        if (src) {
            this.src = src
            this.updateMesh()
        }
    }

}