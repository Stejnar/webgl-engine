export class Loader {
    static UNSET = 'UNSET'
    static RESOLVED = 'RESOLVED'
    static REJECTED = 'REJECTED'
    static PENDING = 'PENDING'

    status = Loader.UNSET

    _load(callback) {
        this.status = Loader.PENDING
        return new Promise((resolve, reject) => {
            callback(resolve, reject)
        })
    }

    loadTextResource(name) {
        return new Promise((resolve, reject) => {
            const url = 'http://localhost:3000/' + name + '?please-dont-cache=' + Math.random()
            let request = new XMLHttpRequest()
            request.open('GET', url, true)
            request.onerror = () => reject(request.status)
            request.onload = () => {
                if (request.status < 200 || request.status > 299) {
                    reject(new Error('Error: HTTP Status ' + request.status + 'on source ' + url))
                } else {
                    resolve(request.responseText)
                }
            }
            request.send()
        })
    }
}