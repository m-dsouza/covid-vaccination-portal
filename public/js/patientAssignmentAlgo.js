
var findMatching = require("bipartite-matching");

process.env.ORA_SDTZ = 'UTC';

const oracledb = require('oracledb');
const dbConfig = require('./query/dbconfig');

module.exports = {
    
    availableAppForPatientList: function availableAppForPatientList(nonVaccinatedList,availableAppointmentList) {  

        var viewData = { 
            patientAppointmentList : [] 
        };
        jsonData = {};
        
        nonVaccinatedList.forEach(nonVaccinatedRecord => {
            
            var checkflag = false;
            availableAppointmentList.forEach(availableAppointmentRecord => {

                if(nonVaccinatedRecord.DAYSOFWEEK.trim() == availableAppointmentRecord.DAY.trim()){
                    if(typeof nonVaccinatedRecord.MORNING !== "undefined" && typeof availableAppointmentRecord.MORNING !== "undefined"){
                       
                        if(nonVaccinatedRecord.MORNING.trim() == availableAppointmentRecord.MORNING.trim()){
                           
                            jsonData["id"] = nonVaccinatedRecord.ID;
                            jsonData[nonVaccinatedRecord.DAYSOFWEEK] = nonVaccinatedRecord.DAYSOFWEEK;
                            jsonData["APP_ID"] =availableAppointmentRecord.APP_ID;
                            jsonData["APP_TIME"] =availableAppointmentRecord.APP_TIME;
                            viewData.patientAppointmentList.push(jsonData);
                            jsonData = {};
                            
                        }
                    }
                    if(typeof nonVaccinatedRecord.AFTERNOON !== "undefined" && typeof availableAppointmentRecord.AFTERNOON !== "undefined"){
                       
                        if(nonVaccinatedRecord.AFTERNOON.trim() == availableAppointmentRecord.AFTERNOON.trim()){
                           
                            jsonData["id"] = nonVaccinatedRecord.ID;
                            jsonData[nonVaccinatedRecord.DAYSOFWEEK] = nonVaccinatedRecord.DAYSOFWEEK;
                            jsonData["APP_ID"] =availableAppointmentRecord.APP_ID;
                            jsonData["APP_TIME"] =availableAppointmentRecord.APP_TIME;
                            viewData.patientAppointmentList.push(jsonData);
                            jsonData = {};
                        }
                    }
                     if(typeof nonVaccinatedRecord.EVENING !== "undefined" && typeof availableAppointmentRecord.EVENING !== "undefined"){
                        
                        if(nonVaccinatedRecord.EVENING.trim() == availableAppointmentRecord.EVENING.trim()){
                            
                            jsonData["id"] = nonVaccinatedRecord.ID;
                            jsonData[nonVaccinatedRecord.DAYSOFWEEK] = nonVaccinatedRecord.DAYSOFWEEK;
                            jsonData["APP_ID"] =availableAppointmentRecord.APP_ID;
                            jsonData["APP_TIME"] =availableAppointmentRecord.APP_TIME;
                            viewData.patientAppointmentList.push(jsonData);
                            jsonData = {};
                        }
                    } if(typeof nonVaccinatedRecord.NIGHT !== "undefined" && typeof availableAppointmentRecord.NIGHT !== "undefined"){
                       
                        if(nonVaccinatedRecord.NIGHT.trim() == availableAppointmentRecord.NIGHT.trim()){
                           
                            jsonData["id"] = nonVaccinatedRecord.ID;
                            jsonData[nonVaccinatedRecord.DAYSOFWEEK] = nonVaccinatedRecord.DAYSOFWEEK;
                            jsonData["APP_ID"] =availableAppointmentRecord.APP_ID;
                            jsonData["APP_TIME"] =availableAppointmentRecord.APP_TIME;
                            viewData.patientAppointmentList.push(jsonData);
                            jsonData = {};
                        }
                    }
                }
                
            });
           
            
            
        });

  patientAppRecord =       patientAssignmentList(viewData.patientAppointmentList)
console.log("Duplicate Check" ,patientAssignmentList(viewData.patientAppointmentList));

if(patientAppRecord.length>0){
    console.log("result");
patientAssignmentDB(patientAppRecord);
}
return viewData;
    }
}
 
function patientAssignmentList(array) {
 
const patientRecord = new Set();
const appointmentRecord = new Set();
graphgroup = [];
graphgroupArray = [];

array.forEach(function (a) {
    patientRecord.add(a.id);
    appointmentRecord.add(a.APP_ID);
});


array.forEach(function (a) {
    graphgroup.push(Array.from(patientRecord).indexOf(a.id));
    graphgroup.push(Array.from(appointmentRecord).indexOf(a.APP_ID));
    graphgroupArray.push(graphgroup);
    graphgroup = [];
});

matchingRecrods =findMatching(patientRecord.size, appointmentRecord.size, graphgroupArray);
patientAppMatch =[];
matchingRecrods.forEach(function (a) {

        
        graphgroup.push(Array.from(patientRecord)[a[0]])
        graphgroup.push(Array.from(appointmentRecord)[a[1]]);

        array.some(function (arrVal) {
            if(arrVal.APP_ID == Array.from(appointmentRecord)[a[1]]){
                var d = new Date(arrVal.APP_TIME);
                d.setDate(d.getDate()-5);
                graphgroup.push(d);

                return graphgroup;
            }
        })
        patientAppMatch.push(graphgroup);
        graphgroup = [];
   
});

    return patientAppMatch;
}

async function patientAssignmentDB(patientAppRecord){
    let connection;


    try {

        
  
      let sql, binds, options, result;
  
      connection = await oracledb.getConnection(dbConfig);
  
      var query_seq = "SELECT PATIENTASSIGNMENT_SEQ.NEXTVAL FROM dual";

      binds = {};

      options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        // extendedMetaData: true,               // get extra metadata
        // prefetchRows:     100,                // internal buffer allocation size for tuning
        // fetchArraySize:   100                 // internal buffer allocation size for tuning
      };
  
      result = await connection.execute(query_seq, binds, options);

     
      

      for(var i =0 ; i < patientAppRecord.length; i++){
        patientAppRecord[i].unshift(result.rows[0].NEXTVAL+i,"sent");
     }
    
     console.log(patientAppRecord)
      // 
      // Insert
      //
    sql = `INSERT INTO patient_assignment(PS_ID, APP_STATUS, P_ID,APP_ID,ACCEPTANCE_DEADLINE) VALUES (:1, :2,:3,:4,:5)`;
  
     

      
  
     // For a complete list of options see the documentation.
  options = {
      autoCommit: true,
      // batchErrors: true,  // continue processing even if there are data errors
      bindDefs: [
        {type: oracledb.NUMBER},
        { type: oracledb.STRING, maxSize: 255 },
        {type: oracledb.NUMBER},
        {type: oracledb.NUMBER},
        { type: oracledb.DATE }
        
      ]
    };

    result = await connection.executeMany(sql, patientAppRecord, options);
    console.log(result);
    console.log("Number of rows inserted:", result.rowsAffected);
}  catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}
