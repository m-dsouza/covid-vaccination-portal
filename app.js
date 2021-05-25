const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
let nodeGeocoder = require('node-geocoder');
const schedule = require('node-schedule');
var string = require('string-sanitizer');



const loginAuth = require('./public/js/query/loginAuth');
const register = require('./public/js/query/register');
const addAppointment = require('./public/js/query/addAppointment');
const patientAssignment = require('./public/js/query/patientAssignment');
const updatePatientPreference = require('./public/js/query/updatePreferenceList');

const preference = require('./public/js/preference');
const patientAssignmentAlgo = require('./public/js/patientAssignmentAlgo');

const app = express();
app.set("view engine", "ejs"); 
app.set("views", __dirname + "/views")
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));

let options = {
  provider: 'openstreetmap'
};
 
let geoCoder = nodeGeocoder(options);

/*View Routes  Starts */
app.get('/', (req, res) => { res.render("index",{errorMsg: ""} )});


/*View Routes Ends*/

/*DB Calls  Starts */
app.post('/appConfimrDecline', async function(req, res) {
  obj=req.body;
  console.log(obj);
  patientAppRecords = JSON.parse(obj.patientAppRecords);
  patientAssignment.updateAppointment(patientAppRecords,obj.submit);
  res.render("index",{
    errorMsg: "Thank you for your choice. Please login to make any changes"
  });
});


app.post('/query', async function(req, res) {
  
 
  loginDetails = await loginAuth.loginAuth( string.sanitize(req.body.lusername),req.body.lpwd);
 var app_id =[];
 var APP_TIME =[];
 var APP_STATUS =[];
  if(loginDetails.error === null){
   
    if(loginDetails.patient  !== null ) {
      preferenceRecords = await loginAuth.preferenceList(loginDetails.patient.ID);
     
      preference_choice = preference.preferenceList(preferenceRecords.rows);
      patientAppRecords = await loginAuth.patientAppDetails(loginDetails.patient.ID);
      console.log(patientAppRecords);
      res.render("patientHome",{patient:loginDetails.patient,preferenceList :preference_choice,patientAppRecords:patientAppRecords});
    }else  if(loginDetails.provider  !== null ) {
        for (var i in loginDetails.appointmentRecords)
{
  app_id.push(loginDetails.appointmentRecords[i].APP_ID);
  APP_TIME.push(loginDetails.appointmentRecords[i].APP_TIME);
  APP_STATUS.push(loginDetails.appointmentRecords[i].APP_STATUS);
}
      
      res.render("providerHome",{provider:loginDetails.provider,app_id:app_id,APP_TIME:APP_TIME,APP_STATUS:APP_STATUS});
    }else{
      res.render("admin");
    }
  }else{
    res.render("index",{
      errorMsg: loginDetails.error
    });
  }
});

app.post('/addPreference', async function(req, res) {
  
  var obj = req.body;
  var patient =JSON.parse(obj.patient);
  obj["multiselect"] = obj.multiselect.split(',');
  console.log("sending",obj)
  obj["preferenceList"] =  preference.preference(obj);

  await   updatePatientPreference.updatePatientPreference(obj,patient.ID);
  preferenceRecords = await loginAuth.preferenceList(patient.ID);
  preference_choice = preference.preferenceList(preferenceRecords.rows);
  patientAppRecords = await loginAuth.patientAppDetails(patient.ID);
  console.log(patientAppRecords);
  res.render("patientHome",{patient:patient,preferenceList :preference_choice,patientAppRecords:patientAppRecords});
});

 app.post('/register', async function(req, res) {
   
  var obj = req.body;
  if(obj.selectGrp =="patient"){
  obj["preferenceList"] =  preference.preference(obj);
  }
var locationRes=    await geoCoder.geocode(req.body.street+" " +req.body.city+" " +req.body.state+" " +req.body.zipCode)
.then((locationRes)=> {
 return Promise.resolve(locationRes);
})
.catch((err)=> {
  console.log("error",err);
});

  obj["lattitude"] = locationRes[0].latitude;
  obj['longitude'] = locationRes[0].longitude;
  dbResult= await register.register(obj);
if(dbResult){
  res.render("index",{
    errorMsg: "Thank you for registering with us please login to view details"
  });
}else{
  res.render("index",{
    errorMsg: "Please select a different username"
  });
}
});

app.post('/appointmentDetails', async function(req, res) {
  var obj = req.body;
  var provider =JSON.parse(obj.provider);
 

  var app_id =[];
  var APP_TIME =[];
  var APP_STATUS =[];
  await addAppointment(obj.appointmentTime,provider.ID);
  loginDetails = await loginAuth.appointmentDetails(provider.ID);
 

  for (var i in loginDetails.rows)
  {
    app_id.push(loginDetails.rows[i].APP_ID);
    APP_TIME.push(loginDetails.rows[i].APP_TIME);
    APP_STATUS.push(loginDetails.rows[i].APP_STATUS);
  }
      
      res.render("providerHome",{provider:provider,app_id:app_id,APP_TIME:APP_TIME,APP_STATUS:APP_STATUS});

  
});


/*DB Calls  Ends */


const job = schedule.scheduleJob('10 * * * * *', async function(){
  var d = new Date();
  var n = d.getTime();

      nonVaccinatedList = await patientAssignment.nonVaccinated();
      availableAppointmentList = await patientAssignment.availableAppointment();
      await patientAssignment.priorityGroupAssignment();
      await patientAssignment.updateDecline();
     patientAssignmentAlgo.availableAppForPatientList(nonVaccinatedList.rows,availableAppointmentList);
});

const server = http.createServer(app);
server.listen(3000);


   
  
