const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');
const fs = require("fs");
//DATABASE OPTIONS======================================================//
const mysql = require("mysql");
const firebird = require("node-firebird");
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
    titleBarStyle: 'hidden',
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
});
//LAUNCH
win.setFullScreen(false);
win.setMinimumSize(600, 560);
win.setMaximumSize(2222, 1440);
win.loadFile('index.html'); 
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

//DATABASE/MYSQL FUNCTIONS
ipcMain.on("SQLTEST", (event) => {
  const timeRightNow = new Date();
  const timeAsUTCMilliseconds = timeRightNow.getTime();
  const oneWeekAgo = (timeAsUTCMilliseconds - 604800000);
  const oneWeekAgoAsDate = new Date(oneWeekAgo).toISOString();
  console.log("Date right now: " + timeRightNow)
  console.log("One Week Ago:" + oneWeekAgoAsDate);
  const timeWeekAgoForSQL = (
  new Date(oneWeekAgo).toISOString().slice(0, -5).replace('T', ' ')  );
  console.log("For SQL Statement filter: " + timeWeekAgoForSQL);
  
  firebird.attach(firebirdOptions, function(err, db){
    if(err){
      throw err;
    }
    $query = ("SELECT FIRST 20 j.FILENAME, " + 
          "iif(j.JOBNO = '', 'N/A', j.JOBNO) AS \"JOBNO\", " +
          "iif(j.CONTACT = '', 'N/A', j.CONTACT) AS \"CONTACT\" " +
          "FROM JOBQUOTEHEADER j " + 
          "WHERE j.TIME_STAMP > '" + timeWeekAgoForSQL + "'");
    db.query($query, function(err, result){
    if(err){
      console.log("ERROR");
      console.log(err);
    }
    //console.log("Result of SQL Query: ");
    //console.log(result);

    db.detach();
    event.reply("SQLTESTRETURNED", result, $query);
    //iterate through rows
    
    });
  });

});
