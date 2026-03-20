const { contextBridge } = require('electron');
const { ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
  // we can also expose variables, not just functions
});

//contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);


document.addEventListener('DOMContentLoaded', function () {
  //--Load Contents of Sawfiles//
  console.log('Page fully loaded!');
  //----------------------------Definitions of elements-----------------//
  let information = document.getElementById('info');
  const minimizeButton = document.getElementById('minimize');
  const quitButton = document.getElementById('quit');
  const maximizeButton = document.getElementById('maximize');
  const helper = document.getElementById('helper');
  //----------------------------------------------------------------------//

minimizeButton.addEventListener("click", () => {
  ipcRenderer.send("minimizeWindow");
});
quitButton.addEventListener("click", () => {
  ipcRenderer.send("quitWindow");
});
maximizeButton.addEventListener("click", () =>{
  ipcRenderer.send("maximizeWindow");
});
helper.addEventListener("click", () =>{
  ipcRenderer.send("helpButtonClicked");
});

});//END OF DOMCONTENTLOAD




//Example Snippets to reuse on future functions
//ipcRenderer.send("readSawFilesFolder", "c:\\sawfiles_two\\");
  
//xxx.addEventListener("mouseenter", () => {
   // helper.innerText = "";
 // });
//ipcRenderer.on("USBdevicesSentBack", (event, USBDrive) => { 
//USB Parse
/* DrivesInfo = USBDrive;
let DriveIDIndexes = Object.keys(DrivesInfo); 
DriveIDIndexes.forEach(DriveNumber => {
  let currentSelectedDrive = DriveNumber;
  
  let drivePATH = (DrivesInfo[currentSelectedDrive].mountpoint + "\\");
  let nameOfDrive = (DrivesInfo[currentSelectedDrive].name);
  let freespaceInGB = parseFloat(DrivesInfo[currentSelectedDrive].available);
  freespaceInGB = Number(((freespaceInGB/1000000000).toFixed(2)));
  
});
*/

//add listeners to all inaccessible drives

//FileAppendButton.addEventListener("click", () => {
  //What happens whe minimize is clicked, sent to main.
//  let text2beSaved = "Test example to append to file";
//  ipcRenderer.send("saveText", text2beSaved);
//});

  



