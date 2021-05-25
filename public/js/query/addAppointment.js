process.env.ORA_SDTZ = 'UTC';

const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');



module.exports = async function addAppointment(appointmentTime,id) {
    let connection;


    try {
  
      let sql, binds, options, result;
      var flag= "N";
  
      connection = await oracledb.getConnection(dbConfig);
  
      sql = "SELECT APP_SEQ.NEXTVAL FROM dual";

      binds = {};

      options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        // extendedMetaData: true,               // get extra metadata
        // prefetchRows:     100,                // internal buffer allocation size for tuning
        // fetchArraySize:   100                 // internal buffer allocation size for tuning
      };
  
      resultSeq = await connection.execute(sql, binds, options);

  
      // 
      // Insert
      //
    sqlAppointment = `INSERT INTO appointment(APP_ID, APP_TIME, PROVIDER_NOTIFICATION_STATUS, ID) VALUES (:1, :2,:3,:4)`;
  
    
      binds = [resultSeq.rows[0].NEXTVAL,new Date(appointmentTime),flag,id];
     

      
  
     // For a complete list of options see the documentation.
    options = {
      autoCommit: true,
      // batchErrors: true,  // continue processing even if there are data errors
      bindDefs: [
        {type: oracledb.NUMBER },
        { type: oracledb.DATE},
        {type: oracledb.STRING, maxSize: 255 },
        {type: oracledb.NUMBER },
      ]
    };

    result = await connection.execute(sqlAppointment, binds, options);

    console.log("Number of rows inserted:", result.rowsAffected);


  
  
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
  
  
  