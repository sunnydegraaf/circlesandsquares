export class Timer {

    time:number

    constructor() {
        this.time = 200

        setInterval(() => {
            this.time--
        }, 1000);
    }


    
}
