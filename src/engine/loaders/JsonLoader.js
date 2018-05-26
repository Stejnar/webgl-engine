import { Loader } from "./Loader";

export class JsonLoader extends Loader {
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
                reject(new Error('ERROR: no url passed to JsonLoader'))
            }
            this.loadTextResource(this.url)
                .then(res => {
                    try {
                        const json = JSON.parse(res)
                        this.status = Loader.RESOLVED
                        resolve(json)
                    } catch (e) {
                        this.status = Loader.REJECTED
                        reject(e)
                    }
                })
                .catch(err => {
                    this.status = Loader.REJECTED
                    reject(err)
                })
        })
    }

    sourceSetter(setter) {
        this.setter = setter
    }
}