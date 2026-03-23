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
let cursorString = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAfCAYAAADjuz3zAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuMTITAUd0AAAAuGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAACAAAAMQECABEAAABaAAAAaYcEAAEAAABsAAAAAAAAAGAAAAABAAAAYAAAAAEAAABQYWludC5ORVQgNS4xLjEyAAADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlgAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAADZp5qVybcLXwAAA/ZJREFUSEulls9rW0cQxz9vny3JRWmUxrJBQo2ChFEujk0TAsV/QEoOgRb52kNPAfdgQ3KLCcSnQBowjtOaQoohh0DpxT+aGEPxIYf25KTJRWCpocW4ECHJsZFsvd3pQdpXWbUTpfnAgHZ35ju7783OEzQJhUIKIBqNfgFsAQJIJBJ5BESbbsr6d4oCGBgYGATqFy5ckOXlZT03N6cBOXbs2M/tAZ2iAE6cODENyIsXL/alyZ07dzQgIyMjn7T6vg0FOIABKJVK8UQiQTKZ9IPPnj0rAI7jfNCccuzam1DNZ2mdtdaaer3uOxhjHBrCpjkl/uIbaD+WFWmbhpbkhy620y58JCLSkaClY2GllH0+TpsdSsfCwWDQ1rJna7xptgAOJOlEWAGsrKzcBzbi8fh3fX19H2Wz2Y+z2WysWVE2ie9vsdl+jMViUqlUPFvHq6urAsjVq1dlfHxcAAmFQn8CfwOvIpHI90NDQyevXbv2oRVLpVL+7u2Ph+3CS0tLcv36dRERIyL67t27HiDT09MyNTVld/oX8AewFovFPgWgp6endeuL8Xj8gPDCwoI8ePDADuXJkycyOzurbaJbt27pQCAgt2/flnPnzgnwKpPJJFW1WjWRSKQ7mUx+A3ymtUZEXJvJ8zxev37tZ65WqyQSCfvC1PHjx9Xy8rKZmJgwMzMz+8DJcrn8OYODg8pxnJ8AuXjxomQyGVMqlfwdlstlKRaL/nh7e1vK5bI/LhaLUq1WRUTk5cuXtmK+5cyZM18CMj8/7z179swAfqAxxhfohHw+b4V/APilt7dXarWazufz0i5szXLYWGvdLnxfAYl0Ok13d7fT2nwsjuMc6B1vG1sUjevK/v4+yWSSfD5POByGo5tRRygA13UxxhAIBDh9+jSu6xfF/0YBjsi/LdYY23bfDwXsuK5LV1cXvOfxW1AqHA7/ura2xsbGhgcgIrSe4F1oiSupVCo1C3hXrlzpfv78uaeUwnGcdxK3voVCARrfyd8BSKfTWWAXkMXFRc/zGq2ikwtifXZ3d/Xo6KgAW5cuXeonnU4rgPPnzw9Go9HfALl586bZ29tr1zgSY4yZnJwUQIaGhr7yjxKJRFyAsbGx7uHh4XlAHj9+rEVEPM87cANbzd64p0+feoCk0+l7AIlEQimAcrmsQ6FQ18zMTP3y5ctjwNb6+roCjOu6/u1qN9UIl1wu5wKcOnXqIcDm5qbTqDGgVqvp/v5+58aNG9vA3vr6OrlcTvf09IjW+tAyFBECgYAUCgUFqEqlAo0/J4e/+WAw+KjZTDq2YDCYB2JNif9sw2k69obD4a93dnZSQL39C9yCAG4oFCrWarV7QM5q/AM0AOGW9o7GvgAAAABJRU5ErkJggg==),pointer';

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
    $query = 'SELECT * FROM ST_LOTS WHERE RECIEVEDQTY >0 AND DELETED<>1 AND  CURRENTQTY>0 AND PRODUCTID=107821 Order by LOTID';
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
