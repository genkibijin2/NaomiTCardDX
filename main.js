const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');
const fs = require("fs");
const mysql = require("mysql");
var connection = mysql.createConnection({
    host     : '192.168.30.161',
    user     : 'SYSDBA',
    password : 'PZVKbN+d', 
    database : ':/opt/hqbird/Databases/LiveWD.gdb'
});

//const drivelist = require('drivelist');
const { getDriveList} = require('node-drivelist');

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
//Minimize window passthru
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
win.setFullScreen(false);
win.setMinimumSize(600, 560);
win.setMaximumSize(2222, 1440);
win.loadFile('index.html');




  
}




app.whenReady().then(() => {
  createWindow() 
});

//Method example to help
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


