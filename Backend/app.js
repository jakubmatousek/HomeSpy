const express = require('express')
const { response } = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const port =  process.env.PORT||5501
const Manager = require('./Manager');
const Person = require('./Person');
const Connection = require('./Connection');
const { clear } = require('console') 

app.use(express.static(path.join(__dirname,'./Frontend/')));
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//SETUP  -  START

const manager = new Manager();
manager.loadFromDB()
//manager.addConnectionToCurrentlyConnected(new Connection("32:21:33:21:11",Date.now(),"Black mesa inc."));

//SETUP  -  END
app.get('/', (req, res) => {
  res.send("all good in here")
})

app.post('/',(req,res)=>{
});

app.use('/startConnection',(req,res)=>{
  console.log("START: "+req.body.MAC)
  res.send("g")
  let MAC = req.body.MAC;
  let manufacturer = req.body.manufacturer;
  connection = new Connection(MAC,Date.now(),manufacturer)
  manager.addConnectionToCurrentlyConnected(connection)
});

app.post('/endConnection',(req,res)=>{
  console.log("END: "+req.body.MAC)
  let MAC = req.body.MAC;
  manager.removeConnectionFromCurrentlyConnected(MAC);
  manager.saveToDB()
  res.send('conn ended')
});

app.post('/newPerson',(req,res)=>{
  let name = req.body.name
  let person = new Person(name);
  manager.addToSavedPeople(person)
  manager.saveToDB();
  res.send()
});

app.post('/saveDevice',(req,res)=>{

  console.log("get req /saveDevice")
  let MAC = req.body.MAC
  let name = req.body.name
  let manufacturer = req.body.manufacturer
  if(personExsists){
    manager.savedPeople[getPersonIndex(name)].addDevice(MAC,manufacturer)
    manager.saveToDB(); 
  }else{
    console.log("Owner of the device not found")
  }
});

app.get('/savedPeople',(req,res)=>{
  res.send(manager.savedPeople)
});

app.get('/currentlyConnected',(req,res)=>{
  res.send(manager.currentlyConnected)
});

function getPersonIndex(name){
  let oi;
  manager.savedPeople.forEach((person,index) => {
      if(person.name === name){
        oi =  index
      };
  });
  return oi;
}

function personExsists(name){
  manager.savedPeople.forEach(element => {
    if(element.name == name)
      return true
  });
  return false
}
try{
app.listen(port, () => {
  console.log(`Express listening at http://localhost:${port}`)
})
}catch(err){
  console.log(err);
}
