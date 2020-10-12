class Person{
    constructor(name){
        this.name = name;
        this.history = []
        this.devices = []
    }

    addDevice(MAC,manufacturer){
        if(!isDeviceSaved(MAC))
            this.devices.unshift({MAC:MAC,manufacturer:manufacturer})
        else
            console.log("MAC adress is already saved")       
    }
    removeDevice(MAC){
        try{
            this.devices.splice(this.devices.indexOf(MAC),1)
        }catch(err){
            console.log(err)
        }
    } 
    addToHistory(connection){
        this.history.unshift(connection)
    }
    getHistory(){
        return this.history
    }
}

function isDeviceSaved(MAC){
    try{
        this.devices.length
    }catch(err){
        return false
    }
    for(let x = 0 ; x < this.devices.length ; x++){
        if(this.devices[x].MAC === MAC)
            return true;
    }
    return false
}

module.exports = Person;