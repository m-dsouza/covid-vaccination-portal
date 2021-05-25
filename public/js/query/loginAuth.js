process.env.ORA_SDTZ = 'UTC';

const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');
loginResult ={};


 
module.exports = {
  
  loginAuth: async function loginAuth(username,password) {
    let connection;


    try {
  
      let sql, binds, options, result;
  
      connection = await oracledb.getConnection(dbConfig);
  
     
  
      //
      // Query the data
      //
  
      sql = `SELECT * FROM login where username=:1 and password = :2`;
  
      binds = [username,password];
  
      // For a complete list of options see the documentation.
      options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        // extendedMetaData: true,               // get extra metadata
        // prefetchRows:     100,                // internal buffer allocation size for tuning
        // fetchArraySize:   100                 // internal buffer allocation size for tuning
      };
  
      result = await connection.execute(sql, binds, options);
  
     

      sqlPatientRecord = `SELECT * FROM patient where username=:1`;
      sqlProviderRecord = `SELECT * FROM provider where username=:1`;
  
      binds = [username];



      if(result.rows.length>0){
        loginResult["LoginDetails"] = result.rows[0];
        if(result.rows[0].ACC_TYPE == 'patient') {
        patientRecord = await connection.execute(sqlPatientRecord, binds, options);

       

        patient=patientRecord.rows;
         
        
       
        loginResult["patient"] = patientRecord.rows[0];
        
        loginResult["provider"] = null;
        loginResult["error"] = null;
        }else if(result.rows[0].ACC_TYPE == 'provider'){
          providerRecord = await connection.execute(sqlProviderRecord, binds, options);

       

        loginResult["provider"] = providerRecord.rows[0];
        loginResult["patient"] = null;
        loginResult["error"] = null;

        appointmentSql = "SELECT  a.APP_ID,APP_TIME,APP_STATUS from patient_assignment p right join appointment a on p.app_id = a.app_id right outer join provider p  on p.ID = a.id  where  p.id = :1";
        binds = [providerRecord.rows[0].ID];

        appointmentRecords = await connection.execute(appointmentSql, binds, options);

        loginResult["appointmentRecords"] = appointmentRecords.rows;
        }else{
         
        
       
        loginResult["patient"] = null;
        
        loginResult["provider"] = null;
        loginResult["error"] = null;
        }
      }else{
        loginResult["error"] ="Please enter valid username and password";
      }
  
    
      return loginResult;
  
    } catch (err) {
      console.error(err);
      return loginResult["error"] = err[0];
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
  appointmentDetails:  async function appointmentDetails(id) {

    let connection;


    try {
  
      let appointmentSql, binds, options, appointmentRecords;
  
      connection = await oracledb.getConnection(dbConfig);
      options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        // extendedMetaData: true,               // get extra metadata
        // prefetchRows:     100,                // internal buffer allocation size for tuning
        // fetchArraySize:   100                 // internal buffer allocation size for tuning
      };


    appointmentSql = "SELECT  a.APP_ID,APP_TIME,APP_STATUS from patient_assignment p right join appointment a on p.app_id = a.app_id right outer join provider p  on p.ID = a.id  where  p.id = :1";
        binds = [id];

        appointmentRecords = await connection.execute(appointmentSql, binds, options);

        loginResult["appointmentRecords"] = appointmentRecords.rows;
        return appointmentRecords;

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
  preferenceList:  async function preferenceList(id) {

    let connection;


    try {
  
      let preferenceSql, binds, options, preferenceRecords;
  
      connection = await oracledb.getConnection(dbConfig);
      options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        // extendedMetaData: true,               // get extra metadata
        // prefetchRows:     100,                // internal buffer allocation size for tuning
        // fetchArraySize:   100                 // internal buffer allocation size for tuning
      };


    preferenceSql = " SELECT DAYSOFWEEK, MORNING, AFTERNOON, EVENING, NIGHT  from  patient_peferred_time natural join peferred_time natural join hour_block where id = :1";
        binds = [id];

        preferenceRecords = await connection.execute(preferenceSql, binds, options);

        
        return preferenceRecords;

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

  patientAppDetails:  async function patientAppDetails(id) {

    let connection;


    try {
  
      let preferenceSql, binds, options, preferenceRecords;
  
      connection = await oracledb.getConnection(dbConfig);
      options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        // extendedMetaData: true,               // get extra metadata
        // prefetchRows:     100,                // internal buffer allocation size for tuning
        // fetchArraySize:   100                 // internal buffer allocation size for tuning
      };


    preferenceSql = "SELECT APP_STATUS,ACCEPTANCE_DEADLINE,app_time,p_id,PS_ID,provider.NAME,provider.APT,provider.STREET, provider.CITY, provider.STATE, provider.ZIP_CODE, PHONE_NUMBER,cast(sdo_geom.sdo_distance(   \
         sdo_geometry(2001, 4326, sdo_point_type(provider.latitude, provider.longitude, null), null, null),      sdo_geometry(2001, 4326, sdo_point_type(patient.latitude,	patient.longitude, null), null, null),      0.01,\
      'unit=KM'\
    ) as decimal(10,2)) as distance \
    from patient_assignment natural join appointment natural join provider  inner join patient on patient_assignment.p_id =patient.id where patient_assignment.p_id=:1 and patient_assignment.ps_id = (SELECT max(ps_id) from patient_assignment where  p_id=:1)";
    //preferenceSql = "SELECT APP_STATUS,ACCEPTANCE_DEADLINE,app_time,p_id,completion_details from patient_assignment natural join appointment where p_id=20 and ps_id = (SELECT max(ps_id) from patient_assignment where  p_id=20)";
    
        binds = [id];
        //binds={};

        preferenceRecords = await connection.execute(preferenceSql, binds, options);

        
        return preferenceRecords.rows[0];

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
  }
}

