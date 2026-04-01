const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');
const fs = require("fs");
//DATABASE OPTIONS======================================================//
const mysql = require("mysql");
const firebird = require("node-firebird");
//csv template
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

    //================================//
var connection = mysql.createConnection({
   //Empty
});
var firebirdOptions ={};
  firebirdOptions.host = '192.168.30.161';
  firebirdOptions.user = 'SYSDBA';
  firebirdOptions.password = 'PZVKbN+d';
  firebirdOptions.database = '/opt/hqbird/Databases/LiveWD.gdb';
  firebirdOptions.port = 3050;
var firebirdTracker ={};
  firebirdTracker.host = '192.168.30.161';
  firebirdTracker.user = 'SYSDBA';
  firebirdTracker.password = 'PZVKbN+d';
  firebirdTracker.database = '/opt/hqbird/Databases/TRACKER.gdb';
  firebirdTracker.port = 3050;
//=======================================================================//

//const drivelist = require('drivelist');
const { getDriveList} = require('node-drivelist');
const Nanobar = require('nanobar');

const createWindow = () => {
  const win = new BrowserWindow({
    //titleBarStyle: 'hidden',
    width: 1024,
    height: 768, 
    resizable: true,
    center: true,
    icon: path.join(__dirname, 'assets/icons/win/Favicon.ico'),
    webPreferences:{
      nodeIntegration: true,
      //enableRemoteModule: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    }
    
  })
//UI MANIPULATION
ipcMain.on("minimizeWindow", (event) => {
  win.minimize();
});
ipcMain.on("maximizeWindow", (event) => {
 if(!win.isMaximized()){
    win.maximize();
  }
});
ipcMain.on("helpButtonClicked", (event) => {
  //Custom Functions for testing
  console.log(win.getBounds());
  console.log(win.getBounds());
});
//LAUNCH
win.setFullScreen(false);
win.setMinimumSize(600, 638);
win.setMaximumSize(2222, 1440);
win.loadFile('index.html'); 
checkUserHomeDirectory();
}
app.whenReady().then(() => {
  createWindow() 
});
//QUIT
ipcMain.on("quitWindow", () => {
try{
 app.quit();
}
catch(err){
}
});

//--MAC OS DARWIN BEHAVIOUR--//
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});

function checkUserHomeDirectory(){
  const homePath = process.env.HOME.toString();
  console.log(homePath);
  const programFiles = (homePath + "\\Documents\\DespatchBatches");
  if (!fs.existsSync(programFiles)){
    console.log(programFiles + " Not found, creating...");
    try{
      fs.mkdirSync(programFiles);
    }
    catch{
      console.log("failed");
    }
    console.log("Created " + programFiles);
  }
  else{
    console.log(programFiles + " Found");
  }
}
ipcMain.on("createCsvBatch", (event, jobRecords, jobsStringList) => {
  
  const nameOfFile = 'DespatchJobs.csv';
  const homePath = 
  (process.env.HOME.toString() + "\\Documents\\DespatchBatches\\" 
  + nameOfFile);
  const defaultPath = ('\\\\euro-dc01\\WDesign2022\\BarOpt\\' + nameOfFile);
  const testingPath = (homePath);
  //Set Location
  //===>
    const pathToWriteTo = testingPath;
  console.log("Writing " + homePath) + "...";
  const csvWriter = createCsvWriter({
  path: pathToWriteTo,
  header: [
    {id: 'JobNumber', title: 'Job Number'},
    {id: 'QuoteNumber', title: 'Quote Number'},
    {id: 'CustOrderNo', title: 'Cust Order No.'},
    {id: 'Reference', title: 'Reference'}
  ]
  });
  const records = jobRecords;
  try{
  csvWriter.writeRecords(records)       // returns a promise    
  .then(() => {
    console.log('...Done');
    event.reply("generatedCSV", pathToWriteTo);
    //Now write to Table
    var timeRightNow = (new Date().toISOString().slice(0, -5).replace('T', ' '));
    for (var i = 0; i < jobsStringList.length; i++){
      const job2send = jobsStringList[i];
      console.log("Current Date: " + timeRightNow);
      firebird.attach(firebirdOptions, function(err, db){
      if(err){
        throw err;
      }
      const SQLQuery = ("INSERT INTO YUUBINJOB" +
                "(JOB_NUMBER,WHEN_ADDED)" +
      "VALUES ('" + job2send + 
      "','" + timeRightNow + "');");
      console.log(job2send + " Added to LIVE.YUUBINJOBS");
        db.query(SQLQuery, function(err, result){
        if(err){
          console.log("ERROR");
          console.log(err);
        }
        db.detach();
        });
      });
    }
  });
  }
  catch (error){
    console.log(error);
  }
});

ipcMain.on("SendDatesToDatabase", (event, monday, tuesday, wednesday,
  thursday, friday) => {
    //Monday Search//
    firebird.attach(firebirdOptions, function(err, db){
    if(err){
      throw err;
    }
    const SQLQuery = ("SELECT DISTINCT j.JOBNO, j.DELIVERYNAME, j.TOTALFRAMES, " +
              "IIF(jp.STAGE_NAME='Despatch Optimised',1,0) AS DESPATCHOPTIMIZED, " +
              "IIF(jb.STAGE_NAME='Bar Optimized',1,0) AS BAROPTIMIZED, " +
              "IIF(ja.STAGE_NAME='Awaiting Signature',1,0) AS AWAITINGSIG, " +
              "IIF(js.STAGE_NAME='Signature Received',1,0) AS SIGNATURERECEIVED, " +
              "IIF (f.GLASSCOSTPRICE>0,1,0) AS GLASS " +
              "FROM JOBQUOTEHEADER j " +
              "LEFT JOIN FRAMES f  ON (j.HEADER_ID=f.HEADER_ID) AND WINDOWBAD <>1 AND WINDOWSTYLEPRESENT <>0 " +
              "LEFT JOIN JOBSTAGES js ON (j.HEADER_ID=js.HEADER_ID  AND js.STAGE_NAME = 'Signature Received') " +
              "LEFT JOIN JOBSTAGES jp ON (j.HEADER_ID=jp.HEADER_ID  AND jp.STAGE_NAME = 'Despatch Optimised') " + 
              "LEFT JOIN JOBSTAGES jb ON (j.HEADER_ID=jb.HEADER_ID  AND jb.STAGE_NAME = 'Bar Optimized') " +
              "LEFT JOIN JOBSTAGES ja ON (j.HEADER_ID=ja.HEADER_ID  AND ja.STAGE_NAME = 'Awaiting Signature') " +
              "WHERE j.REQUIREDDATE = '" + monday + "' " + 
              "AND j.QUOTE_JOB_TYPE = 'JOB'");
    //console.log("Sending query...:\n" + SQLQuery);
    db.query(SQLQuery, function(err, result){
    if(err){
      console.log("ERROR");
      console.log(err);
    }
    db.detach();
    event.reply("mondayObjectsReturned", result);
      });
    });
    //===========================END MONDAY//
  
    firebird.attach(firebirdOptions, function(err, db){
    if(err){
      throw err;
    }
    const SQLQuery = ("SELECT DISTINCT j.JOBNO, j.DELIVERYNAME, j.TOTALFRAMES, " +
              "IIF(jp.STAGE_NAME='Despatch Optimised',1,0) AS DESPATCHOPTIMIZED, " +
              "IIF(jb.STAGE_NAME='Bar Optimized',1,0) AS BAROPTIMIZED, " +
              "IIF(ja.STAGE_NAME='Awaiting Signature',1,0) AS AWAITINGSIG, " +
              "IIF(js.STAGE_NAME='Signature Received',1,0) AS SIGNATURERECEIVED, " +
              "IIF (f.GLASSCOSTPRICE>0,1,0) AS GLASS " +
              "FROM JOBQUOTEHEADER j " +
              "LEFT JOIN FRAMES f  ON (j.HEADER_ID=f.HEADER_ID) AND WINDOWBAD <>1 AND WINDOWSTYLEPRESENT <>0 " +
              "LEFT JOIN JOBSTAGES js ON (j.HEADER_ID=js.HEADER_ID  AND js.STAGE_NAME = 'Signature Received') " +
              "LEFT JOIN JOBSTAGES jp ON (j.HEADER_ID=jp.HEADER_ID  AND jp.STAGE_NAME = 'Despatch Optimised') " + 
              "LEFT JOIN JOBSTAGES jb ON (j.HEADER_ID=jb.HEADER_ID  AND jb.STAGE_NAME = 'Bar Optimized') " +
              "LEFT JOIN JOBSTAGES ja ON (j.HEADER_ID=ja.HEADER_ID  AND ja.STAGE_NAME = 'Awaiting Signature') " +
              "WHERE j.REQUIREDDATE = '" + tuesday + "' " + 
              "AND j.QUOTE_JOB_TYPE = 'JOB'");
    //console.log("Sending query...:\n" + SQLQuery);
    db.query(SQLQuery, function(err, result){
    if(err){
      console.log("ERROR");
      console.log(err);
    }
    db.detach();
    event.reply("tuesdayObjectsReturned", result);
    });
  });
  //===========================END TUESDAY//

  firebird.attach(firebirdOptions, function(err, db){
    if(err){
      throw err;
    }
    const SQLQuery = ("SELECT DISTINCT j.JOBNO, j.DELIVERYNAME, j.TOTALFRAMES, " +
              "IIF(jp.STAGE_NAME='Despatch Optimised',1,0) AS DESPATCHOPTIMIZED, " +
              "IIF(jb.STAGE_NAME='Bar Optimized',1,0) AS BAROPTIMIZED, " +
              "IIF(ja.STAGE_NAME='Awaiting Signature',1,0) AS AWAITINGSIG, " +
              "IIF(js.STAGE_NAME='Signature Received',1,0) AS SIGNATURERECEIVED, " +
              "IIF (f.GLASSCOSTPRICE>0,1,0) AS GLASS " +
              "FROM JOBQUOTEHEADER j " +
              "LEFT JOIN FRAMES f  ON (j.HEADER_ID=f.HEADER_ID) AND WINDOWBAD <>1 AND WINDOWSTYLEPRESENT <>0 " +
              "LEFT JOIN JOBSTAGES js ON (j.HEADER_ID=js.HEADER_ID  AND js.STAGE_NAME = 'Signature Received') " +
              "LEFT JOIN JOBSTAGES jp ON (j.HEADER_ID=jp.HEADER_ID  AND jp.STAGE_NAME = 'Despatch Optimised') " + 
              "LEFT JOIN JOBSTAGES jb ON (j.HEADER_ID=jb.HEADER_ID  AND jb.STAGE_NAME = 'Bar Optimized') " +
              "LEFT JOIN JOBSTAGES ja ON (j.HEADER_ID=ja.HEADER_ID  AND ja.STAGE_NAME = 'Awaiting Signature') " +
              "WHERE j.REQUIREDDATE = '" + wednesday + "' " + 
              "AND j.QUOTE_JOB_TYPE = 'JOB'");
    //console.log("Sending query...:\n" + SQLQuery);
    db.query(SQLQuery, function(err, result){
    if(err){
      console.log("ERROR");
      console.log(err);
    }
    db.detach();
    event.reply("wednesdaysObjectsReturned", result);
    });
  });
  //===========================END WEDNESDAY//

  firebird.attach(firebirdOptions, function(err, db){
    if(err){
      throw err;
    }
    const SQLQuery = ("SELECT DISTINCT j.JOBNO, j.DELIVERYNAME, j.TOTALFRAMES, " +
              "IIF(jp.STAGE_NAME='Despatch Optimised',1,0) AS DESPATCHOPTIMIZED, " +
              "IIF(jb.STAGE_NAME='Bar Optimized',1,0) AS BAROPTIMIZED, " +
              "IIF(ja.STAGE_NAME='Awaiting Signature',1,0) AS AWAITINGSIG, " +
              "IIF(js.STAGE_NAME='Signature Received',1,0) AS SIGNATURERECEIVED, " +
              "IIF (f.GLASSCOSTPRICE>0,1,0) AS GLASS " +
              "FROM JOBQUOTEHEADER j " +
              "LEFT JOIN FRAMES f  ON (j.HEADER_ID=f.HEADER_ID) AND WINDOWBAD <>1 AND WINDOWSTYLEPRESENT <>0 " +
              "LEFT JOIN JOBSTAGES js ON (j.HEADER_ID=js.HEADER_ID  AND js.STAGE_NAME = 'Signature Received') " +
              "LEFT JOIN JOBSTAGES jp ON (j.HEADER_ID=jp.HEADER_ID  AND jp.STAGE_NAME = 'Despatch Optimised') " + 
              "LEFT JOIN JOBSTAGES jb ON (j.HEADER_ID=jb.HEADER_ID  AND jb.STAGE_NAME = 'Bar Optimized') " +
              "LEFT JOIN JOBSTAGES ja ON (j.HEADER_ID=ja.HEADER_ID  AND ja.STAGE_NAME = 'Awaiting Signature') " +
              "WHERE j.REQUIREDDATE = '" + thursday + "' " + 
              "AND j.QUOTE_JOB_TYPE = 'JOB'");
    //console.log("Sending query...:\n" + SQLQuery);
    db.query(SQLQuery, function(err, result){
    if(err){
      console.log("ERROR");
      console.log(err);
    }
    db.detach();
    event.reply("thursdayObjectsReturned", result);
    });
  });
  //===========================END THURSDAY//

  firebird.attach(firebirdOptions, function(err, db){
    if(err){
      throw err;
    }
    const SQLQuery = ("SELECT DISTINCT j.JOBNO, j.DELIVERYNAME, j.TOTALFRAMES, " +
              "IIF(jp.STAGE_NAME='Despatch Optimised',1,0) AS DESPATCHOPTIMIZED, " +
              "IIF(jb.STAGE_NAME='Bar Optimized',1,0) AS BAROPTIMIZED, " +
              "IIF(ja.STAGE_NAME='Awaiting Signature',1,0) AS AWAITINGSIG, " +
              "IIF(js.STAGE_NAME='Signature Received',1,0) AS SIGNATURERECEIVED, " +
              "IIF (f.GLASSCOSTPRICE>0,1,0) AS GLASS " +
              "FROM JOBQUOTEHEADER j " +
              "LEFT JOIN FRAMES f  ON (j.HEADER_ID=f.HEADER_ID) AND WINDOWBAD <>1 AND WINDOWSTYLEPRESENT <>0 " +
              "LEFT JOIN JOBSTAGES js ON (j.HEADER_ID=js.HEADER_ID  AND js.STAGE_NAME = 'Signature Received') " +
              "LEFT JOIN JOBSTAGES jp ON (j.HEADER_ID=jp.HEADER_ID  AND jp.STAGE_NAME = 'Despatch Optimised') " + 
              "LEFT JOIN JOBSTAGES jb ON (j.HEADER_ID=jb.HEADER_ID  AND jb.STAGE_NAME = 'Bar Optimized') " +
              "LEFT JOIN JOBSTAGES ja ON (j.HEADER_ID=ja.HEADER_ID  AND ja.STAGE_NAME = 'Awaiting Signature') " +
              "WHERE j.REQUIREDDATE = '" + friday + "' " + 
              "AND j.QUOTE_JOB_TYPE = 'JOB'");
    //console.log("Sending query...:\n" + SQLQuery);
    db.query(SQLQuery, function(err, result){
    if(err){
      console.log("ERROR");
      console.log(err);
    }
    db.detach();
    event.reply("fridayObjectsReturned", result);
    });
  });
  var returnCode = 1;
  event.reply("allDoneLoadingSQL", returnCode);
  //===========================END FRIDAY//
});

ipcMain.on("allDaysFinishedLoadingFlag", (event, numberOfDaysLoaded) => {
  console.log(numberOfDaysLoaded + " days loaded: main pinged =>");
  console.log("Returning pong =>");
  event.reply("iUnderstandAllDays");
});