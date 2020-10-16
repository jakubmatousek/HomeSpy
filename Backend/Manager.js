const { timeStamp } = require('console');
const fs = require('fs');
const Person = require('./Person');

class Manager {
    constructor(){
        this.currentlyConnected = [];
        this.savedPeople = [];
    }

    addConnectionToCurrentlyConnected(connection) {
        let savedAdresses = [];
        this.currentlyConnected.forEach(element => {
            savedAdresses.push(element.MAC)
        });
        if (!savedAdresses.includes(connection.MAC)) {
            this.currentlyConnected.push(connection)
        } else {
            console.log("Device with the same MAC aress already saved!")
        }
    }

    removeConnectionFromCurrentlyConnected(MAC) { //OPRAVIT
        let connection = this.currentlyConnected[getConnectionIndex(MAC,this.currentlyConnected)]
        let savedAdresses = [];
        this.currentlyConnected.forEach(element => {
            savedAdresses.push(element.MAC)
        })
        if (savedAdresses.includes(connection.MAC)) {
            let indexOfToBeRemovedObj = savedAdresses.indexOf(connection.MAC)
            this.currentlyConnected.splice(indexOfToBeRemovedObj, 1);
            let thisDeviceOwner = deviceOwner(connection.MAC,this.savedPeople)
            if (thisDeviceOwner != null) {
                connection.endTime = Date.now()
                this.savedPeople[thisDeviceOwner].addToHistory(connection);
            }

        } else {
            console.log("couldn't find a connection that was set to remove")
        }

    }
    addToSavedPeople(person){
        this.savedPeople.push(person)
    }
    removeFromSavedPeople(person){
        this.savedPeople.splice(getPersonIndex(person,this.savedPeople),1);
    }
    loadFromDB(){
        var DBSavedPeople = JSON.parse(fs.readFileSync('savedPeople.json'))
        for(let x = 0 ; x < DBSavedPeople.length ; x++){
            var person = new Person(DBSavedPeople[x].name)
            DBSavedPeople[x].history.forEach(element => {
                person.history.push(element)
            });
            person.devices = DBSavedPeople[x].devices
            this.savedPeople.push(person)
        }
    }
    saveToDB(){
        let ssppl = JSON.stringify(this.savedPeople)
        fs.writeFileSync('savedPeople.json', ssppl);
    }
}


function deviceOwner(MAC,savedPeople) { 

    for(let x = 0 ; x<savedPeople.length; x++){
        for(let y = 0 ; y<savedPeople[x].devices.length ; y++){
            if(savedPeople[x].devices[y]==MAC){
                return x
            }
        }
    }
    return null   
}

function getPersonIndex(inPerson){
    savedPeople.forEach(person => {
        if(person.name == inPerson.name)
            return savedPeople.indexOf(person)
    });
}

function getConnectionIndex(MAC,currentlyConnected){
    for(let x = 0; x < currentlyConnected.length ; x++){
        if(currentlyConnected[x].MAC ==MAC)
            return x
    }

}

module.exports = Manager;