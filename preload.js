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
/*PUT EVERYTHING INSIDE THIS FUNCTION, AS IT RUNS WHEN EVERYTHING
ON THE PAGE HAS FULLY LOADED, OTHERWISE ELEMENTS MIGHT BE NULL!
*/

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
  //
});
//============================================================================//

//==============================DATE PICKER==================================//
function setToLastSunday(d){
  return d.setDate(d.getDate() - d.getDay());
}

const searchButtonVar = document.getElementById('searchButton');
const datePickerVar = document.getElementById('date-input');
function getThisWeeksJobs(){
  //First convert values from datepicker into useable date vars
  var datePickerValue = datePickerVar.value.toString();
  try{
    var datePickerDate = new Date(datePickerValue);
  
  console.log("Date Chosen: " + datePickerDate);
  setToLastSunday(datePickerDate);
  console.log("Previous sunday was: " + datePickerDate);
  //DATEPICKERDATE is NOW SUNDAY OF THAT WEEK!!!

  //NOW=>Generate Dates of this current week as dates
  var sundayOfWeek = datePickerDate; 

  var mondayOfWeek = new Date(datePickerDate);
  var tuesdayOfWeek = new Date(datePickerDate);
  var wednesdayOfWeek = new Date(datePickerDate);
  var thursdayOfWeek = new Date(datePickerDate);
  var fridayOfWeek = new Date(datePickerDate);

  mondayOfWeek.setDate(mondayOfWeek.getDate() + 1); 
  tuesdayOfWeek.setDate(tuesdayOfWeek.getDate() + 2);
  wednesdayOfWeek.setDate(wednesdayOfWeek.getDate() + 3);
  thursdayOfWeek.setDate(thursdayOfWeek.getDate() + 4);
  fridayOfWeek.setDate(fridayOfWeek.getDate() + 5);
  //=====>Print Help
  console.log("Sunday: " + sundayOfWeek);
  console.log("Monday: " + mondayOfWeek);
  console.log("Tuesday: " + tuesdayOfWeek);
  console.log("Wednesday: " + wednesdayOfWeek);
  console.log("Thursday: " + thursdayOfWeek);
  console.log("Friday: " + fridayOfWeek);
  //STERILIZE=> TO SQL SAFE
  var mondayAsSQL = (new Date(mondayOfWeek).toISOString().slice(0, -5).replace('T', ' '));
  var tuesdayAsSQL = (new Date(tuesdayOfWeek).toISOString().slice(0, -5).replace('T', ' '));
  var wednesdayAsSQL = (new Date(wednesdayOfWeek).toISOString().slice(0, -5).replace('T', ' '));
  var thursdayAsSQL = (new Date(thursdayOfWeek).toISOString().slice(0, -5).replace('T', ' '));
  var fridayAsSQL = (new Date(fridayOfWeek).toISOString().slice(0, -5).replace('T', ' '));
  //Trim and remove H/M/S to disable any timezone potential issues
  mondayAsSQL = mondayAsSQL.substring(0, mondayAsSQL.length - 8);
  tuesdayAsSQL = tuesdayAsSQL.substring(0, tuesdayAsSQL.length - 8);
  wednesdayAsSQL = wednesdayAsSQL.substring(0, wednesdayAsSQL.length - 8);
  thursdayAsSQL = thursdayAsSQL.substring(0, thursdayAsSQL.length - 8);
  fridayAsSQL = fridayAsSQL.substring(0, fridayAsSQL.length - 8);
  console.log("As SQL:\n" + mondayAsSQL + " " + tuesdayAsSQL + " " + wednesdayAsSQL
     + " " + thursdayAsSQL + " " + fridayAsSQL);
  
  //FINALLY=> pass all these dates into date search SQL in main.js
  ipcRenderer.send("SendDatesToDatabase", mondayAsSQL, tuesdayAsSQL,
    wednesdayAsSQL, thursdayAsSQL, fridayAsSQL
   );
  }
  catch(error){
    console.log("Likely no input in date picker... So error: ");
    console.log(error);
    datePickerVar.value = "Pick a date!";
    
  }
}
searchButtonVar.addEventListener("click", () => {
  getThisWeeksJobs();
});
//==>And when the objects are sent back...:
//========================SQL INFORMATION RENDERING=========================//

const mondayJobBox = document.getElementById('MondaysJobs');
const tuesdayJobBox = document.getElementById('TuesdaysJobs');
const wednesdayJobBox = document.getElementById('WednesdaysJobs');
const thursdayJobBox = document.getElementById('ThursdaysJobs');
const fridayJobBox = document.getElementById('FridaysJobs');
ipcRenderer.on("mondayObjectsReturned", (event, mondaysJobObjects) =>{
  mondayJobBox.innerHTML = "";
    for (var i = 0; i < mondaysJobObjects.length; i++){
      var currentRowObject = mondaysJobObjects[i];
        mondayJobBox.innerHTML = (
        mondayJobBox.innerHTML +
        "<div class='JobObject'>" + currentRowObject.JOBNO + "</br>" +
        currentRowObject.DELIVERYNAME + "</br><p></p><p></p><p></p><p></p></br>" +
        "Extra: </br>" + currentRowObject.TOTALFRAMES + 
        "");
  }
  addListeners2AllJobs();
});
ipcRenderer.on("tuesdayObjectsReturned", (event, tuesdaysJobObjects) =>{
  //
});
ipcRenderer.on("wednesdaysObjectsReturned", (event, wednesdaysJobObjects) =>{
  //
});
ipcRenderer.on("thursdayObjectsReturned", (event, thursdaysJobObjects) =>{
  //
});
ipcRenderer.on("fridayObjectsReturned", (event, fridaysJobObjects) =>{
  //
});


ipcRenderer.on("SQLTESTRETURNED", (event, result, $query) => {
    
});
//=============================================================================//


//================================JOBOBJECT HANDLING==========================//
function addListeners2AllJobs(){
const detailedInformationAboutJob = document.getElementById('leftDetailsBox');
document.querySelectorAll(".JobObject").forEach(function(elem) {

    //When you click a job object...
		elem.addEventListener("click", function() {
        if(this.classList.contains("selectedJob")){
          this.classList.remove("selectedJob");
          console.log("Job Object Deselected: " + this.innerHTML + "\n");
        }
        else{
          this.classList.add("selectedJob");
          console.log("Job Object Selected: " + this.innerHTML + "\n");
        }
		});

    //When you hover over a job object...
    elem.addEventListener("mouseenter", function() {
      var JobStringSplit = this.innerHTML.split("<br>");
      var jobNumber = JobStringSplit[0];
      var deliveryName = JobStringSplit[1];
      var jobFrames = JobStringSplit[4];
      detailedInformationAboutJob.innerHTML = (
        "<span style='font-weight:2000;color:#FF006A;text-shadow: 1px 1px 1px black;'>"
         + jobNumber + "</span></br>" +
        "<span style='color:#C40BF7;'>" + deliveryName + "</span></br>" +
        "<span style='color:#EF458C;'>Frame Total: " + jobFrames + "</span>" +
        "");
    
    });
	});
}
//=============================================================================//

//STARTUP RUN of Job Search (Based on current week):
getThisWeeksJobs();
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

  



