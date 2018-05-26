import { Loader } from "./Loader";

export class TextureLoader extends Loader {
    url = null
    setter = () => false

    constructor(url) {
        super()
        this.url = url
    }

    load() {
        return this._load((resolve, reject) => {
            if (!this.url) {
                this.status = Loader.REJECTED
                reject(new Error('ERROR: no url passed to TextureLoader'))
            }
            let image = new Image()
            image.src = this.url
            image.onload = () => {
                this.status = Loader.RESOLVED
                resolve(image)
            }
            image.onerror = err => {
                this.status = Loader.REJECTED
                reject(err)
            }
        })
    }

    sourceSetter(setter) {
        this.setter = setter
    }
}