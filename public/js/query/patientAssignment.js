process.env.ORA_SDTZ = 'UTC';

const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');
var moment = require('moment'); // require

loginResult ={};
const morning_timing_start ="08:00:00";
const morning_timing_end = "11:59:00";
const  afternoon_timing_start = "12:00:00";
const  afternoon_timing_end ="15:59:00";
const  evening_timing_start = "16:00:00";
const  evening_timing_end = "19:59:00";
const  night_timing_start = "20:00:00";
const  night_timing_end = "23:59:00";
 

nonVaccinatedSql = ` SELECT ID,DAYSOFWEEK, MORNING, AFTERNOON, EVENING, NIGHT  from  patient natural join patient_peferred_time natural join peferred_time natural join hour_block where id in  (SELECT id from patient p left join patient_assignment ps on p.id= ps.p_id where COMPLETION_DETAILS is null -- PS_ID is null and 
                      minus
                      (SELECT p_id  from patient_assignment where APP_STATUS ='confirm' and COMPLETION_DETAILS='true'
                      UNION
                      SELECT p_id  from patient_assignment natural join appointment where APP_STATUS ='sent' and appointment.app_time > = sysdate) )
                      order by pg_id,patient.pref_distance asc`;

availableAppointmentSql =`SELECT APP_ID,APP_TIME,TO_CHAR(APP_TIME, 'Day') as day, TO_CHAR (APP_TIME, 'HH24:MI:ss')as time,id
FROM appointment natural join provider 
 where APP_TIME > = sysdate 
and APP_ID not in (SELECT app_id  from patient_assignment where APP_STATUS ='confirm' and COMPLETION_DETAILS='true'
                    UNION
                    SELECT app_id  from patient_assignment natural join appointment where APP_STATUS ='sent' and appointment.app_time > = sysdate)`;


updateAppointmentSql =`UPDATE patient_assignment SET APP_STATUS =:1 where PS_ID=:2`;

priorityGroupSql ='SELECT ID, DOB,(Extract(year from sysdate) - Extract(year from dob)) as age from patient where pg_id is null';

updatePriorityGroupSql =`UPDATE patient SET pg_id =:2 where ID=:1`;

updateDeclineSql =`UPDATE patient_assignment SET APP_STATUS = 'declined' where PS_ID in (:1)`

 
module.exports = {
  
  nonVaccinated: async function nonVaccinated() {
    let connection;


    try {
  
      let binds, options, nonVaccinatedPatient;
  
      connection = await oracledb.getConnection(dbConfig);
      binds = {};
  
      // For a complete list of options see the documentation.
      options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        // extendedMetaData: true,               // get extra metadata
        // prefetchRows:     100,                // internal buffer allocation size for tuning
        // fetchArraySize:   100                 // internal buffer allocation size for tuning
      };
  
      nonVaccinatedPatient = await connection.execute(nonVaccinatedSql, binds, options);
  
    
      return nonVaccinatedPatient;
  
    } catch (err) {
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
  },
  availableAppointment:  async function availableAppointment() {

    let connection;


    try {
  
      let  binds, options, availableAppointmentRecords,availableAppointmentList =[];
  
      connection = await oracledb.getConnection(dbConfig);
      options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        // extendedMetaData: true,               // get extra metadata
        // prefetchRows:     100,                // internal buffer allocation size for tuning
        // fetchArraySize:   100                 // internal buffer allocation size for tuning
      };


    
        binds = {};

        availableAppointmentRecords = await connection.execute(availableAppointmentSql, binds, options);
        
        availableAppointmentRecords.rows.forEach(element => {
            if(dateCompare(morning_timing_start,morning_timing_end,element.TIME)){
                element["MORNING"] ="Y";
            }else if(dateCompare(afternoon_timing_start,afternoon_timing_end,element.TIME)){
                element["AFTERNOON"] ="Y";
            }else if(dateCompare(evening_timing_start,evening_timing_end,element.TIME)){
                element["EVENING"] ="Y";
            }else if(dateCompare(night_timing_start,night_timing_end,element.TIME)){
                element["NIGHT"] ="Y";
            }
            availableAppointmentList.push(element);
        });

        return availableAppointmentList;

      } catch (err) {
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
  },
  updateAppointment:  async function updateAppointment(patientAppRecords,submit) {

    let connection;


    try {
  
      let  binds, options, availableAppointmentRecords,availableAppointmentList =[];
  
      connection = await oracledb.getConnection(dbConfig);
      binds = [submit,patientAppRecords.PS_ID];
     

      
  
      // For a complete list of options see the documentation.
     options = {
       autoCommit: true,
       // batchErrors: true,  // continue processing even if there are data errors
       bindDefs: [
         {type: oracledb.String, maxSize: 255  },
         {type: oracledb.NUMBER },
       ]
     };
        availableAppointmentRecords = await connection.execute(updateAppointmentSql, binds, options);
        console.log(availableAppointmentRecords);
        console.log("Number of rows inserted:", availableAppointmentRecords.rowsAffected);
        

        return availableAppointmentList;

      } catch (err) {
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
  },
  priorityGroupAssignment:  async function priorityGroupAssignment() {

    let connection;


    try {
  
      let  binds, options, priorityGroup, priorityList =[];
  
      connection = await oracledb.getConnection(dbConfig);
      binds = {};
  
      // For a complete list of options see the documentation.
      options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        // extendedMetaData: true,               // get extra metadata
        // prefetchRows:     100,                // internal buffer allocation size for tuning
        // fetchArraySize:   100                 // internal buffer allocation size for tuning
      };
        priorityGroup = await connection.execute(priorityGroupSql, binds, options);
        console.log(priorityGroup.rows.length);
        
        let obj = [];
        if(priorityGroup.rows.length>0){
        (priorityGroup.rows).forEach(element => {
         
          switch (true) {
              case  element.AGE<=5 && element.AGE>0:
                obj.push(10);
              break;
              case element.AGE<=10 && element.AGE>6:
                obj.push(9);
              break;
              case element.AGE<=20 && element.AGE>10:
                obj.push(8);
              break;
              case element.AGE<=30 && element.AGE>20:
                obj.push(7);
              break;
              case element.AGE<=40 && element.AGE>30:
                obj.push(6);
      
              break;
              case element.AGE<=50 && element.AGE>40:
                obj.push(5);
                 
              break;
              case element.AGE<=60 && element.AGE>50:
                obj.push(4);
                 
              break;
              case element.AGE<=70 && element.AGE>60:
                obj.push(3);
                 
              break;
              case element.AGE<=80 && element.AGE>70:
                obj.push(2);
                 
              break;
              case element.AGE>80:
                obj.push(1);
              break;
              
          }
          obj.push(element.ID);
          priorityList.push(obj);
          obj=[];
          
      });
        console.log(priorityList);



     

      
  
      // For a complete list of options see the documentation.
     options = {
       autoCommit: true,
       // batchErrors: true,  // continue processing even if there are data errors
       bindDefs: [
         {type: oracledb.NUMBER },
         {type: oracledb.NUMBER },
       ]
     };
        availableAppointmentRecords = await connection.executeMany(updatePriorityGroupSql, priorityList, options);
        console.log(availableAppointmentRecords);
        console.log("Number of rows inserted:", availableAppointmentRecords.rowsAffected);

        
    }
        return priorityGroup;

      } catch (err) {
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
  },updateDecline:  async function updateDecline() {

    let connection;


    try {
  
      let  binds, options, availableAppointmentRecords;
  
      connection = await oracledb.getConnection(dbConfig);
     binds ={};
     
     var query = "SELECT PS_ID from patient_assignment where acceptance_deadline < sysdate and app_status ='sent'";

     binds = {};

     options = {
       outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
       // extendedMetaData: true,               // get extra metadata
       // prefetchRows:     100,                // internal buffer allocation size for tuning
       // fetchArraySize:   100                 // internal buffer allocation size for tuning
     };
 
     resultPsId = await connection.execute(query, binds, options);
    
    obj =[]
    binds =[]
    resultPsId.rows.forEach(element =>{
      obj.push(element.PS_ID);
      binds.push(obj);
      obj =[]
    })
    
    console.log(binds);
      // For a complete list of options see the documentation.
     options = {
       autoCommit: true,
       // batchErrors: true,  // continue processing even if there are data errors
       bindDefs: [
        {type: oracledb.NUMBER }
      ]
     };

     if(resultPsId.rows.length >0){
        availableAppointmentRecords = await connection.executeMany(updateDeclineSql, binds, options);
        console.log(availableAppointmentRecords);
        console.log("Number of rows inserted:", availableAppointmentRecords.rowsAffected);
     }
        

        return availableAppointmentList;

      } catch (err) {
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
  },
  
}




  function dateCompare(slotStart,slotEnd,timeSlot) {
    
    var t1 = moment(slotStart,"HH:mm:ss"); 
    var t2 = moment(slotEnd,"HH:mm:ss");
    var t3 = moment(timeSlot,"HH:mm:ss");
    if(t3.isBetween(t1,t2)){
        return true;
    }else{
        false;
    }
    
  }