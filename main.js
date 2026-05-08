const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');
const fs = require("fs");
const shell = require('electron').shell;
//DATABASE OPTIONS======================================================//
const mysql = require("mysql");
const firebird = require("node-firebird");
const os = require('os');
var loggingFailed = false; //flag for if logging has reached an error
try{var logDirectory=os.homedir()+"\\Documents\\DJVLogs";}catch(err){loggingFailed=true;} //set log directory

function electronLog(message2Write){
  const RIGHTNOW = new Date();
  //Write to log file function
  if(!fs.existsSync(logDirectory)){
    loggingFailed = true;
  }
  else{
    var loggingFile = (logDirectory + "\\DJVlog.txt");
    if(!fs.existsSync(loggingFile)){
      try{
        console.log("No logging file found, creating...")
        console.log("Creating logging file: " + loggingFile);
        fs.writeFileSync(loggingFile, "---DJV Log File---");
      }
      catch(err){
        loggingFailed = true;
        console.log(err);
      }
    }
  }

  if(!loggingFailed || fs.existsSync(loggingFile)){
    try{
      fs.appendFile(loggingFile, ("\n[" + 
        RIGHTNOW.getHours() + ":" +
        RIGHTNOW.getMinutes() + ":" +
        RIGHTNOW.getSeconds() + "" +
        "] " + message2Write), err =>{
        if(err){
          console.log(err);
        }
        else{
          console.log(message2Write);
        }
      });
    }
    catch(err){
      console.log(err);
    }
  }
}

//csv template
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var criticalError = false;
    //================================//
var connection = mysql.createConnection({
   //Empty
});
var firebirdOptions ={};
var firebirdTracker ={};
electronLog("Reading Database Connection Details...");
try{
  let dbconnexion = require('./dbconnexion.json');
  firebirdOptions.host = dbconnexion.firebirdOption.host;
  firebirdOptions.user = dbconnexion.firebirdOption.user;
  firebirdOptions.password = dbconnexion.firebirdOption.password;
  firebirdOptions.database = dbconnexion.firebirdOption.database;
  firebirdOptions.port = dbconnexion.firebirdOption.port;
  firebirdTracker.host = dbconnexion.firebirdTracker.host;
  firebirdTracker.user = dbconnexion.firebirdTracker.user;
  firebirdTracker.password = dbconnexion.firebirdTracker.password;
  firebirdTracker.database = dbconnexion.firebirdTracker.database;
  firebirdTracker.port = dbconnexion.firebirdTracker.port;
  electronLog("dbconnexion loaded!");
}
catch(Error){
  electronLog("Failed: " + Error);
  criticalError = true;
}
//Internet Check
require('dns').resolve('www.google.com', function(err) {
  if (err) {
     criticalError = true;
  } else {
     electronLog("Internet Connection Ok!!");
  }
});
//=======================================================================//

//const drivelist = require('drivelist');
//const { getDriveList} = require('node-drivelist');
const Nanobar = require('nanobar');
const { electron } = require('node:process');

const createWindow = () => {
  const win = new BrowserWindow({
    titleBarStyle: 'hidden',
    //frame: false,
    width: 1024,
    height: 768, 
    resizable: true,
    center: true,
    icon: path.join(__dirname, 'assets/appIcon/DJV.ico'),
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
  electronLog(win.getBounds());
  electronLog(win.getBounds());
});
var progressAmount = 0.0;
ipcMain.on("dayAdded2Counter", (event, numberOfDaysLoaded) =>{
  //console.log(numberOfDaysLoaded + " days added to progress bar");
  progressAmount = progressAmount + 0.20;
  win.setProgressBar(progressAmount);
  if(progressAmount >= 1.0){
    progressAmount = 0.0;
    win.setProgressBar(progressAmount);
  }
});
//LAUNCH
if(criticalError){
    electronLog("No database file! Place 'dbconnexion.json' in the root folder!");
    win.loadFile('criticalError.html'); 
    win.setMaximumSize(600, 638);
    win.setMinimumSize(600, 638);
    win.setSize(600, 638);
  }
else{
  win.loadFile('index.html'); 
  win.setMinimumSize(600, 638);
  win.setMaximumSize(2222, 1440);
  win.setFullScreen(false);
  win.setProgressBar(0.0);
}
checkUserHomeDirectory();
}
app.whenReady().then(() => {
  createWindow();
  
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
  if(os.homedir()){
    if (!fs.existsSync(logDirectory)){
      try{
        fs.mkdirSync(logDirectory);

      }
      catch(err){
        console.log(err);
        loggingFailed = true;
      }
    }
  if(!os.homedir()){
      console.log(os.homedir() + " not accessible...");
      loggingFailed = true;
  }
    if(!loggingFailed){
    electronLog("homedir found: " + os.homedir());
    }
  }
}
ipcMain.on("createCsvBatch", (event, jobRecords, jobsStringList) => {
  
  const nameOfFile = 'KPDespatchJobs.csv';
  const homePath = 
  ("C:\\DespatchJobs\\Batched" 
  + nameOfFile);
  const defaultPath = ('\\\\euro-dc01\\WDesign2022\\BarOpt\\' + nameOfFile);
  const testingPath = (homePath);
  //Set Location
  //===>
    const pathToWriteTo = defaultPath;
  electronLog("Writing " + defaultPath) + "...";
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
    electronLog('...Done');
    //Now write to Table
    var timeRightNow = (new Date().toISOString().slice(0, -5).replace('T', ' '));
    for (var i = 0; i < jobsStringList.length; i++){
      const job2send = jobsStringList[i];
      electronLog(job2send + " Added to CSV");     
    }
    event.reply("generatedCSV", pathToWriteTo);
  });
  }
  catch (error){
    electronLog(error);
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
              "IIF (f.GLASSCOSTPRICE>0,1,0) AS GLASS, " +
              "j.REQUIREDDATE " +
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
      throw err;
      electronLog("ERROR");
      electronLog(err);
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
              "IIF (f.GLASSCOSTPRICE>0,1,0) AS GLASS, " +
              "j.REQUIREDDATE " +
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
      electronLog("ERROR");
      electronLog(err);
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
              "IIF (f.GLASSCOSTPRICE>0,1,0) AS GLASS, " +
              "j.REQUIREDDATE " +
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
      electronLog("ERROR");
      electronLogg(err);
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
              "IIF (f.GLASSCOSTPRICE>0,1,0) AS GLASS, " +
              "j.REQUIREDDATE " +
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
      electronLog("ERROR");
      electronLog(err);
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
              "IIF (f.GLASSCOSTPRICE>0,1,0) AS GLASS, " +
              "j.REQUIREDDATE " +
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
      electronLog("ERROR");
      electronLog(err);
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
  electronLog(numberOfDaysLoaded + " days loaded: main pinged =>");
  electronLog("Returning pong =>");
  event.reply("iUnderstandAllDays");
});

ipcMain.on("amIAlreadyBatched", (event, jobNumber2Check) => {
    firebird.attach(firebirdOptions, function(err, db){
    if(err){
      throw err;
    }
    const SQLQuery = ("SELECT yj.JOB_NUMBER FROM YUUBINJOB yj "
            + "WHERE yj.JOB_NUMBER = '" + jobNumber2Check + "'"
    );
    //console.log("Sending query...:\n" + SQLQuery);
    db.query(SQLQuery, function(err, result){
    if(err){
      electronLog("ERROR");
      electronLog(err);
    }
    event.reply("thisJobMustBeDestroyed", result);
    db.detach();
    });
  });
});

ipcMain.on("getChartData", (event, variable) => {
 
});

ipcMain.on("writeIt2TheElectronLog", (event, message2Write) => {
  electronLog(message2Write);
});

ipcMain.on("openHelpDoc", (event) => {
  shell.openExternal('http://kendallwiki.system:777/dokuwiki/doku.php?id=public:dpj');
});