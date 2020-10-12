
var currentlyConnected = [];
var lastUpdateLenCC = 0; // last  length of currentlyConnected, chcek if any changes have been made, to avoid too much rendering
var savedPeople = [];
$(document).ready(()=>{
checkCurrentlyConnected()
renderSavedPeople()
setInterval(checkCurrentlyConnected, 1000);
$( ".delete-device-btn" ).on( "click", console.log( "clicked" ));
})

async function modalUp(manufacturer,MAC) {
    $('#saveDeviceModal').modal()
    $('#saveDeviceButton').click(()=>{
        $('#saveDeviceModal').modal('hide');
        let selectedOwner = $('#owner-select').val()
        console.log("SO: "+selectedOwner)
        if(selectedOwner != "notSelected"){
            data = {MAC:MAC,manufacturer:manufacturer,name:selectedOwner}
            addDevice(data)
        }
    });
}

function addDevice(data){
    $.post("/saveDevice", data, function(result){
        renderSavedPeople()
    });
}

function checkCurrentlyConnected() {
    $.get('/currentlyConnected', function (data) {
        currentlyConnected = data;
        //if (currentlyConnected.length == lastUpdateLenCC)
        //    return;
        lastUpdateLenCC = currentlyConnected.length
        $("#actual-dev-cont").html("")
        currentlyConnected.forEach((connection, index) => {
            let timePassed = Date.now() - currentlyConnected[index].startTime
            timePassed = timeConversion(timePassed);
            let devOw = deviceOwner(currentlyConnected[index].MAC, savedPeople)
            let deviceHTML = `<div id="${currentlyConnected[index].MAC}" class="row devices-row d-flex flex-nowrap">
                                        <div class="col-2 owner">${devOw}</div>
                                        <div class="col-3 adress">${currentlyConnected[index].MAC}</div>
                                        <div class="col-3 connected-on">${timePassed} ago</div>
                                        <div class='col-3 vendor'>${currentlyConnected[index].manufacturer}</div>
                                        <div class="col-1 buttons">
                                            <i onclick="modalUp('${connection.manufacturer}','${currentlyConnected[index].MAC}')" class="far fa-save fa-inverse fa"></i>
                                        </div>
                                </div>`;
            $("#actual-dev-cont").append(deviceHTML)
        });
    });
}

async function getSavedPeople() {
    let oData = "del"
    oData = await $.get('/savedPeople', (data) => {
        data = oData;
    });
    return oData;
}


function deviceOwner(MAC, savedPeople) {
    if (savedPeople.length == 0)
        return "none"
    for (let x = 0; x < savedPeople.length; x++) {
        for (let y = 0; y < savedPeople[x].devices.length; y++) {
            if (savedPeople[x].devices[y] == MAC) {
                return x
            }
        }
    }
    return "none"
}

async function renderSavedPeople() {
    var savedPPL = await getSavedPeople();
    $('#people-row').html("");
    let modalOwnersHTML = `<option value="notSelected"><span class="not-selected">select</select></option>`;
    savedPPL.forEach((element) => {
        let devicesHTML = "";
        let lastSeen = Date.now() - element.history[0].endTime;
        lastSeen = timeConversion(lastSeen);
        element.devices.forEach((el,index) => {
            devicesHTML += `<li class="device" id="${el.MAC}">
                                <ul class="device-attributes">
                                    <li><i class="fas fa-tablet-alt"></i>${el.manufacturer} </li>
                                    <li><i class="fas fa-fingerprint"></i>${el.MAC}</li></ul>
                            </li>`
        });
        personHTML = `<div class="person col-12 col-sm-6 col-md-4 col-xl-3 border">
                            <h3 class="person-name d-flex flex-nowrap">${element.name}'s devices</h3>
                            <span class="person-last-seen mb-1">last seen ${lastSeen} ago</span>
                            <ul class="person-devices">
                                ${devicesHTML}
                            </ul>
                     </div>`
        $('#people-row').append(personHTML);
        modalOwnersHTML+= `<option class="select-option" value=${element.name}>${element.name}</option>`
    });
    $("#owner-select").html(modalOwnersHTML)
}
function timeConversion(millisec) {
    var seconds = (millisec / 1000).toFixed(1);
    var minutes = (millisec / (1000 * 60)).toFixed(1);
    var hours = (millisec / (1000 * 60 * 60)).toFixed(1);
    var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
    if (seconds < 60) {
        return Math.round(seconds) + "s";
    } else if (minutes < 60) {
        return Math.round(minutes) + "m";
    } else if (hours < 24) {
        return Math.round(hours) + "h";
    } else {
        return Math.round(days) + "d"
    }
} 

function deleteDevice(name,MAC){
    console.log("del");
    $("#"+MAC).remove()
}


 

// button - <li><button type="button" class="btn btn-danger btn-sm delete-device-btn mb-1">delete</button></li>
                                