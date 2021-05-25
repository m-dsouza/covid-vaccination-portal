process.env.ORA_SDTZ = 'UTC';

const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');

module.exports = {
    
    updatePatientPreference: async function updatePatientPreference(obj,id) {  


        let sql, binds, options, result;
  
      connection = await oracledb.getConnection(dbConfig);

      var deleteQuery = "DELETE from patient_peferred_time where ID=:1";
      binds = [id]

      options = {
        autoCommit: false,
        // batchErrors: true,  // continue processing even if there are data errors
        bindDefs: [
          {type: oracledb.NUMBER },
        ]
      };

    result = await connection.execute(deleteQuery, binds, options);

console.log("Number of rows inserted:", result.rowsAffected);

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
        prefernceId.push(id);
        prefernceList.push(prefernceId);
       }


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
}
