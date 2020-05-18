export default class Queue {
    public _processing: boolean = false;
    public _queue: any[] = [];

    get length() {
        return this._queue.length;
    }

    async add(promiseFunc) {
        this._queue.push(promiseFunc);
        if(!this._processing) {
            await this._process();
        }
    }

    async _process() {
        this._processing = true;
        const promiseFunc = this._queue.shift();

        if(promiseFunc) {
            try {
                await promiseFunc();
            } catch (err) {

            } finally {
                await this._process();
            }
        } else { 
            this._processing = false;
        }
    }
}