class Connection{
    constructor(MAC,startTime,manufacturer){
        this.MAC = MAC
        this.startTime = startTime;
        this.manufacturer = manufacturer;
        this.endTime = null
    }


    end(endTime){
        this.endTime = endTime;
    }
}

module.exports = Connection;