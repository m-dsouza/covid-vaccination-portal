process.env.ORA_SDTZ = 'UTC';

const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');


module.exports = {
  register: async function register(obj) {
    let connection;


    try {
  
      let sql, binds, options, result;
  
      connection = await oracledb.getConnection(dbConfig);
  
     
      var query = "SELECT count(1) as count FROM login where username =:1";

      binds = [obj.r_username];

      options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        // extendedMetaData: true,               // get extra metadata
        // prefetchRows:     100,                // internal buffer allocation size for tuning
        // fetchArraySize:   100                 // internal buffer allocation size for tuning
      };
  
      result = await connection.execute(query, binds, options);
  
      console.log("Metadata: ");
      console.dir(result.metaData, { depth: null });
      console.log("Query results: ");
      console.dir(result.rows, { depth: null });

console.log(result.rows[0].COUNT);

      if(result.rows[0].COUNT == 0){
  
      // 
      // Insert
      //
    sql = `INSERT INTO login(USERNAME, PASSWORD, ACC_TYPE) VALUES (:1, :2,:3)`;
  
      binds = [obj.r_username,obj.r_pwd,obj.selectGrp];

      
  
     // For a complete list of options see the documentation.
    options = {
      autoCommit: false,
      // batchErrors: true,  // continue processing even if there are data errors
      bindDefs: [
        {type: oracledb.STRING, maxSize: 255 },
        { type: oracledb.STRING, maxSize: 255 },
        { type: oracledb.STRING, maxSize: 255 }
      ]
    };

    result = await connection.execute(sql, binds, options);

    console.log("Number of rows inserted:", result.rowsAffected);

    if(obj.selectGrp =='provider'){

      var query = "SELECT PROVIDER_SEQ.NEXTVAL FROM dual";

      binds = {};

      options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        // extendedMetaData: true,               // get extra metadata
        // prefetchRows:     100,                // internal buffer allocation size for tuning
        // fetchArraySize:   100                 // internal buffer allocation size for tuning
      };
  
      result = await connection.execute(query, binds, options);
  
      console.log("Metadata: ");
      console.dir(result.metaData, { depth: null });
      console.log("Query results: ");
      console.dir(result.rows, { depth: null });

        sqlProvider = `INSERT INTO provider(ID, NAME, PROVIDER_TYPE, PHONE_NUMBER, APT, STREET, CITY, STATE, ZIP_CODE, LATITUDE, LONGITUDE, USERNAME) 
                        VALUES (:1, :2,:3,:4,:5,:6,:7,:8,:9,:10,:11,:12)`;

        
        binds = [result.rows[0].NEXTVAL,obj.pName,obj.provider_type,obj.p_phnNumber,obj.apt,obj.street,obj.city,obj.state,obj.zipCode,obj.lattitude,obj.longitude,obj.r_username];
  
        
    
       // For a complete list of options see the documentation.
      options = {
        autoCommit: true,
        // batchErrors: true,  // continue processing even if there are data errors
        bindDefs: [
          {type: oracledb.NUMBER },
          {type: oracledb.STRING, maxSize: 255 },
          { type: oracledb.STRING, maxSize: 255 },
          {type: oracledb.NUMBER },
          { type: oracledb.STRING, maxSize: 255 },
          { type: oracledb.STRING, maxSize: 255 },
          { type: oracledb.STRING, maxSize: 255 },
          { type: oracledb.STRING, maxSize: 255 },
          { type: oracledb.STRING, maxSize: 255 },
          {type: oracledb.NUMBER },
          {type: oracledb.NUMBER },
          { type: oracledb.STRING, maxSize: 255 },
        ]
      };
  
      result = await connection.execute(sqlProvider, binds, options);
  
      console.log("Number of rows inserted:", result.rowsAffected);
    }else if(obj.selectGrp =='patient'){
      var query = "SELECT PATIENT_SEQ.NEXTVAL FROM dual";

      binds = {};

      options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        // extendedMetaData: true,               // get extra metadata
        // prefetchRows:     100,                // internal buffer allocation size for tuning
        // fetchArraySize:   100                 // internal buffer allocation size for tuning
      };
  
      resultSeq = await connection.execute(query, binds, options);

     
     var prefernceList=[];
      var query = "SELECT PF_ID from peferred_time natural join hour_block where DAYSOFWEEK =:1 and MORNING=:2 and AFTERNOON =:3 and  EVENING =:4 and NIGHT =:5";
      for (const property in obj.preferenceList) {
        var prefernceId=[];

        binds = [property,obj.preferenceList[property]['Morning'],obj.preferenceList[property]['Afternoon'],obj.preferenceList[property]['Evening'],obj.preferenceList[property]['Night']];

        options = {
          outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
          // extendedMetaData: true,               // get extra metadata
          // prefetchRows:     100,                // internal buffer allocation size for tuning
          // fetchArraySize:   100                 // internal buffer allocation size for tuning
        };
    
        resultPref = await connection.execute(query, binds, options);
        
        prefernceId.push(resultPref.rows[0].PF_ID);
        prefernceId.push(resultSeq.rows[0].NEXTVAL);
        prefernceList.push(prefernceId);
       }
     
        sqlPatient = `INSERT INTO patient(ID,NAME, SSN, DOB, PHONE, EMAIL, APT, STREET, CITY, STATE, ZIP_CODE, LATITUDE, LONGITUDE, PREF_DISTANCE, USERNAME, LASTNAME) VALUES (:1, :2,:3,:4,:5,:6,:7,:8,:9,:10,:11,:12,:13,:14,:15,:16)`;
        binds = [resultSeq.rows[0].NEXTVAL,obj.firstName,obj.ssn,new Date(obj.dob),obj.phnNumber,obj.email,obj.apt,obj.street,obj.city,obj.state,obj.zipCode,obj.lattitude,obj.longitude,Number(obj.pf_distance),obj.r_username,obj.lastName];
  
        
    
       // For a complete list of options see the documentation.
      options = {
        autoCommit: true,
        // batchErrors: true,  // continue processing even if there are data errors
        bindDefs: [
          {type: oracledb.NUMBER },
          {type: oracledb.STRING, maxSize: 255 },
          { type: oracledb.STRING, maxSize: 255 },
          { type: oracledb.DATE},
          {type: oracledb.NUMBER },
          { type: oracledb.STRING, maxSize: 255 },
          { type: oracledb.STRING, maxSize: 255 },
          { type: oracledb.STRING, maxSize: 255 },
          { type: oracledb.STRING, maxSize: 255 },
          { type: oracledb.STRING, maxSize: 255 },
          { type: oracledb.STRING, maxSize: 255 },
          {type: oracledb.NUMBER },
          {type: oracledb.NUMBER },
          {type: oracledb.NUMBER },
          { type: oracledb.STRING, maxSize: 255 },
          { type: oracledb.STRING, maxSize: 255 },
        ]
      };
  
      resultPatient = await connection.execute(sqlPatient, binds, options);


      sqlPatientPerference = `INSERT INTO patient_peferred_time(PF_ID, ID) VALUES (:1, :2)`;
 
      options = {
        autoCommit: true,
        // batchErrors: true,  // continue processing even if there are data errors
        bindDefs: [
          {type: oracledb.NUMBER },
          {type: oracledb.NUMBER }
        ]
      };
      resultPatient = await connection.executeMany(sqlPatientPerference, prefernceList, options);
      console.log("Number of rows inserted:", resultPatient.rowsAffected);
    }
    return true;
  }else{
    return false;
  }
  
  
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