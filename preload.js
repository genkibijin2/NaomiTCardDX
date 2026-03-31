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
var currentFile = location.href.split("/").slice(-1); 
var nameOfPage = currentFile[0];
console.log(currentFile[0]);
/*PUT EVERYTHING INSIDE THIS FUNCTION, AS IT RUNS WHEN EVERYTHING
ON THE PAGE HAS FULLY LOADED, OTHERWISE ELEMENTS MIGHT BE NULL!
*/
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
function setToLastSunday(d){
  return d.setDate(d.getDate() - d.getDay());
}
//Loading Box//
function nowLoading(){
  const loadingIcon = document.getElementById('loadingIcon');
  loadingIcon.style.opacity = "100";
}
function doneLoading(){
  const loadingIcon = document.getElementById('loadingIcon');
  loadingIcon.style.opacity = "0";
}
//==================================================EVENTS FOR MAIN SCREEN, INDEX.HTML=====================================================================//
//==============================DATE PICKER==================================//
if(nameOfPage == 'index.html'){
  const batchButton = document.getElementById('batchButton');
  batchButton.addEventListener("click", () => {
    var listOfJobNumbers = [];
    document.querySelectorAll(".selectedJob").forEach(function(elem) {
      var currentSelectedJob = elem.innerHTML;
      splitUpJobInfo = currentSelectedJob.split("<br>");
      const thisJobNumberObject = {
        JobNumber: splitUpJobInfo[0]
      };

      listOfJobNumbers.push(thisJobNumberObject);
      console.log(thisJobNumberObject)
		  //elem.addEventListener("click", function() {});
    });
    console.log(listOfJobNumbers);
    ipcRenderer.send("createCsvBatch", listOfJobNumbers);
  });

  ipcRenderer.on("generatedCSV", (event, pathWrittenTo) => {
    const rightContainsBox = document.getElementById('rightContainsBox');
    rightContainsBox.innerHTML = ("" +
      "<div id='flashingbox'></div>"
    );
    function getRidOfTheFlashing(){
     rightContainsBox.innerHTML = (""
      + "<img src='img/smiler.png'> " + 
      "File Written: </br>" +
      pathWrittenTo
     ); 
     helper.innerText = ("File Written: " + pathWrittenTo);
    }
    setTimeout(getRidOfTheFlashing, 1000);
  });
  var numberOfDaysLoaded = 0;
  function resetDayCounter(){
    numberOfDaysLoaded = 0;
  }
  //Functions as the global counter for aysnc IPC functions.
  //Will bounce between main to signal finished loading...
  function addADay2TheCounter (){
    numberOfDaysLoaded++;
    console.log(numberOfDaysLoaded + " days loaded");
    if(numberOfDaysLoaded >= 5){
      ipcRenderer.send("allDaysFinishedLoadingFlag", numberOfDaysLoaded);
    }
  }

  ipcRenderer.on("iUnderstandAllDays", (event) => {
    console.log("Pong received back in preload...");
    addListeners2AllJobs();
    doneLoading();
  });

  nowLoading();
  const searchButtonVar = document.getElementById('searchButton');
  const datePickerVar = document.getElementById('date-input');
  function getThisWeeksJobs(){
    nowLoading();
    //First convert values from datepicker into useable date vars
    var datePickerValue = datePickerVar.value.toString();
    try{
      var datePickerDate = new Date(datePickerValue);
    
    
    setToLastSunday(datePickerDate);
    
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
    //console.log("Sunday: " + sundayOfWeek);
    //console.log("Monday: " + mondayOfWeek);
    //console.log("Tuesday: " + tuesdayOfWeek);
    //console.log("Wednesday: " + wednesdayOfWeek);
    //console.log("Thursday: " + thursdayOfWeek);
    //console.log("Friday: " + fridayOfWeek);
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
    resetDayCounter();
    getThisWeeksJobs();
    clearTheJobBox();
  });
}
//==>And when the objects are sent back...:
//========================SQL INFORMATION RENDERING=========================//
if(nameOfPage == 'index.html'){
const mondayJobBox = document.getElementById('MondaysJobs');
const tuesdayJobBox = document.getElementById('TuesdaysJobs');
const wednesdayJobBox = document.getElementById('WednesdaysJobs');
const thursdayJobBox = document.getElementById('ThursdaysJobs');
const fridayJobBox = document.getElementById('FridaysJobs');
ipcRenderer.on("mondayObjectsReturned", (event, mondaysJobObjects) =>{
  console.log("MONDAY OBJECTS RETURNED!");
  mondayJobBox.innerHTML = "";
    for (var i = 0; i < mondaysJobObjects.length; i++){
      //var variable = ipcRenderer.Invoke("HasThisJobBeenBatchedAlready?");
  
      var currentRowObject = mondaysJobObjects[i];
      var glassImg = "img/nothing.png";
      var barOptImg = "img/nothing.png";
      var signatureOKImg = "img/nothing.png";
      var waitSigImg = "img/nothing.png";
      var despatchOptimisedImg = "img/nothing.png";
      //Add Icons to HTML for status
      if(currentRowObject.GLASS == '1'){
        glassImg = "img/SKIconMini.png";
      }
      if ((currentRowObject.BAROPTIMIZED == '1') || (currentRowObject.DESPATCHOPTIMIZED == '1')){
        barOptImg = "img/optIconMini.png";
      }
      if((currentRowObject.AWAITINGSIG == '1') && (currentRowObject.SIGNATURERECEIVED == '0')){
        waitSigImg = 'img/awaitIconMini.png';
      }
      if(currentRowObject.SIGNATURERECEIVED == '1'){
        waitSigImg = "img/nothing.png";
        signatureOKImg = "img/recIconMini.png";
      }
        
      //Now build box      
      mondayJobBox.innerHTML = (
      mondayJobBox.innerHTML +
      "<div class='JobObject'>" + currentRowObject.JOBNO + "</br>" +
      currentRowObject.DELIVERYNAME + 
      "<img src='" + glassImg + "'>" +
      "<img src='" + barOptImg + "'>" +
      "<img src='" + waitSigImg + "'>" +
      "<img src='" + signatureOKImg + "'>" +
      "</br></br>" +
      "<span style='font-size: 0px;'>Extra: </br>" + currentRowObject.TOTALFRAMES + 
      "</br>" + currentRowObject.DESPATCHOPTIMIZED +
      "</br>" + currentRowObject.BAROPTIMIZED +
      "</br>" + currentRowObject.AWAITINGSIG +
      "</br>" + currentRowObject.SIGNATURERECEIVED +
      "</br>" + currentRowObject.GLASS +
      "</br>" + "Reserved for value that represents if this has been batched" +
      "</span>");
  }
  addADay2TheCounter();
});
ipcRenderer.on("tuesdayObjectsReturned", (event, tuesdaysJobObjects) =>{
  console.log("TUESDAY OBJECTS RETURNED!");
   tuesdayJobBox.innerHTML = "";
    for (var i = 0; i < tuesdaysJobObjects.length; i++){
      //var variable = ipcRenderer.Invoke("HasThisJobBeenBatchedAlready?");
  
      var currentRowObject = tuesdaysJobObjects[i];
      var glassImg = "img/nothing.png";
      var barOptImg = "img/nothing.png";
      var signatureOKImg = "img/nothing.png";
      var waitSigImg = "img/nothing.png";
      var despatchOptimisedImg = "img/nothing.png";
      //Add Icons to HTML for status
      if(currentRowObject.GLASS == '1'){
        glassImg = "img/SKIconMini.png";
      }
      if ((currentRowObject.BAROPTIMIZED == '1') || (currentRowObject.DESPATCHOPTIMIZED == '1')){
        barOptImg = "img/optIconMini.png";
      }
      if((currentRowObject.AWAITINGSIG == '1') && (currentRowObject.SIGNATURERECEIVED == '0')){
        waitSigImg = 'img/awaitIconMini.png';
      }
      if(currentRowObject.SIGNATURERECEIVED == '1'){
        waitSigImg = "img/nothing.png";
        signatureOKImg = "img/recIconMini.png";
      }
        
      //Now build box      
      tuesdayJobBox.innerHTML = (
      tuesdayJobBox.innerHTML +
      "<div class='JobObject'>" + currentRowObject.JOBNO + "</br>" +
      currentRowObject.DELIVERYNAME + 
      "<img src='" + glassImg + "'>" +
      "<img src='" + barOptImg + "'>" +
      "<img src='" + waitSigImg + "'>" +
      "<img src='" + signatureOKImg + "'>" +
      "</br></br>" +
      "<span style='font-size: 0px;'>Extra: </br>" + currentRowObject.TOTALFRAMES + 
      "</br>" + currentRowObject.DESPATCHOPTIMIZED +
      "</br>" + currentRowObject.BAROPTIMIZED +
      "</br>" + currentRowObject.AWAITINGSIG +
      "</br>" + currentRowObject.SIGNATURERECEIVED +
      "</br>" + currentRowObject.GLASS +
      "</br>" + "Reserved for value that represents if this has been batched" +
      "</span>");
  }
  addADay2TheCounter();
});
ipcRenderer.on("wednesdaysObjectsReturned", (event, wednesdaysJobObjects) =>{
  console.log("WEDNESDAY OBJECTS RETURNED!");
   wednesdayJobBox.innerHTML = "";
    for (var i = 0; i < wednesdaysJobObjects.length; i++){
      //var variable = ipcRenderer.Invoke("HasThisJobBeenBatchedAlready?");
  
      var currentRowObject = wednesdaysJobObjects[i];
      var glassImg = "img/nothing.png";
      var barOptImg = "img/nothing.png";
      var signatureOKImg = "img/nothing.png";
      var waitSigImg = "img/nothing.png";
      var despatchOptimisedImg = "img/nothing.png";
      //Add Icons to HTML for status
      if(currentRowObject.GLASS == '1'){
        glassImg = "img/SKIconMini.png";
      }
      if ((currentRowObject.BAROPTIMIZED == '1') || (currentRowObject.DESPATCHOPTIMIZED == '1')){
        barOptImg = "img/optIconMini.png";
      }
      if((currentRowObject.AWAITINGSIG == '1') && (currentRowObject.SIGNATURERECEIVED == '0')){
        waitSigImg = 'img/awaitIconMini.png';
      }
      if(currentRowObject.SIGNATURERECEIVED == '1'){
        waitSigImg = "img/nothing.png";
        signatureOKImg = "img/recIconMini.png";
      }
        
      //Now build box      
      wednesdayJobBox.innerHTML = (
      wednesdayJobBox.innerHTML +
      "<div class='JobObject'>" + currentRowObject.JOBNO + "</br>" +
      currentRowObject.DELIVERYNAME + 
      "<img src='" + glassImg + "'>" +
      "<img src='" + barOptImg + "'>" +
      "<img src='" + waitSigImg + "'>" +
      "<img src='" + signatureOKImg + "'>" +
      "</br></br>" +
      "<span style='font-size: 0px;'>Extra: </br>" + currentRowObject.TOTALFRAMES + 
      "</br>" + currentRowObject.DESPATCHOPTIMIZED +
      "</br>" + currentRowObject.BAROPTIMIZED +
      "</br>" + currentRowObject.AWAITINGSIG +
      "</br>" + currentRowObject.SIGNATURERECEIVED +
      "</br>" + currentRowObject.GLASS +
      "</br>" + "Reserved for value that represents if this has been batched" +
      "</span>");
  }
  addADay2TheCounter();
});
ipcRenderer.on("thursdayObjectsReturned", (event, thursdaysJobObjects) =>{
  console.log("THURSDAY OBJECTS RETURNED!");
   thursdayJobBox.innerHTML = "";
    for (var i = 0; i < thursdaysJobObjects.length; i++){
      //var variable = ipcRenderer.Invoke("HasThisJobBeenBatchedAlready?");
  
      var currentRowObject = thursdaysJobObjects[i];
      var glassImg = "img/nothing.png";
      var barOptImg = "img/nothing.png";
      var signatureOKImg = "img/nothing.png";
      var waitSigImg = "img/nothing.png";
      var despatchOptimisedImg = "img/nothing.png";
      //Add Icons to HTML for status
      if(currentRowObject.GLASS == '1'){
        glassImg = "img/SKIconMini.png";
      }
      if ((currentRowObject.BAROPTIMIZED == '1') || (currentRowObject.DESPATCHOPTIMIZED == '1')){
        barOptImg = "img/optIconMini.png";
      }
      if((currentRowObject.AWAITINGSIG == '1') && (currentRowObject.SIGNATURERECEIVED == '0')){
        waitSigImg = 'img/awaitIconMini.png';
      }
      if(currentRowObject.SIGNATURERECEIVED == '1'){
        waitSigImg = "img/nothing.png";
        signatureOKImg = "img/recIconMini.png";
      }
        
      //Now build box      
      thursdayJobBox.innerHTML = (
      thursdayJobBox.innerHTML +
      "<div class='JobObject'>" + currentRowObject.JOBNO + "</br>" +
      currentRowObject.DELIVERYNAME + 
      "<img src='" + glassImg + "'>" +
      "<img src='" + barOptImg + "'>" +
      "<img src='" + waitSigImg + "'>" +
      "<img src='" + signatureOKImg + "'>" +
      "</br></br>" +
      "<span style='font-size: 0px;'>Extra: </br>" + currentRowObject.TOTALFRAMES + 
      "</br>" + currentRowObject.DESPATCHOPTIMIZED +
      "</br>" + currentRowObject.BAROPTIMIZED +
      "</br>" + currentRowObject.AWAITINGSIG +
      "</br>" + currentRowObject.SIGNATURERECEIVED +
      "</br>" + currentRowObject.GLASS +
      "</br>" + "Reserved for value that represents if this has been batched" +
      "</span>");
  }
  addADay2TheCounter();
});
ipcRenderer.on("fridayObjectsReturned", (event, fridaysJobObjects) =>{
  console.log("FRIDAYS OBJECTS RETURNED!");
   fridayJobBox.innerHTML = "";
    for (var i = 0; i < fridaysJobObjects.length; i++){
      //var variable = ipcRenderer.Invoke("HasThisJobBeenBatchedAlready?");
  
      var currentRowObject = fridaysJobObjects[i];
      var glassImg = "img/nothing.png";
      var barOptImg = "img/nothing.png";
      var signatureOKImg = "img/nothing.png";
      var waitSigImg = "img/nothing.png";
      var despatchOptimisedImg = "img/nothing.png";
      //Add Icons to HTML for status
      if(currentRowObject.GLASS == '1'){
        glassImg = "img/SKIconMini.png";
      }
      if ((currentRowObject.BAROPTIMIZED == '1') || (currentRowObject.DESPATCHOPTIMIZED == '1')){
        barOptImg = "img/optIconMini.png";
      }
      if((currentRowObject.AWAITINGSIG == '1') && (currentRowObject.SIGNATURERECEIVED == '0')){
        waitSigImg = 'img/awaitIconMini.png';
      }
      if(currentRowObject.SIGNATURERECEIVED == '1'){
        waitSigImg = "img/nothing.png";
        signatureOKImg = "img/recIconMini.png";
      }
        
      //Now build box      
      fridayJobBox.innerHTML = (
      fridayJobBox.innerHTML +
      "<div class='JobObject'>" + currentRowObject.JOBNO + "</br>" +
      currentRowObject.DELIVERYNAME + 
      "<img src='" + glassImg + "'>" +
      "<img src='" + barOptImg + "'>" +
      "<img src='" + waitSigImg + "'>" +
      "<img src='" + signatureOKImg + "'>" +
      "</br></br>" +
      "<span style='font-size: 0px;'>Extra: </br>" + currentRowObject.TOTALFRAMES + 
      "</br>" + currentRowObject.DESPATCHOPTIMIZED +
      "</br>" + currentRowObject.BAROPTIMIZED +
      "</br>" + currentRowObject.AWAITINGSIG +
      "</br>" + currentRowObject.SIGNATURERECEIVED +
      "</br>" + currentRowObject.GLASS +
      "</br>" + "Reserved for value that represents if this has been batched" +
      "</span>");
  }
  addADay2TheCounter();
});


ipcRenderer.on("allDoneLoadingSQL", (event, returnCode) => {
    console.log("all done SQL");
});
//=============================================================================//

function clearTheJobBox(){
  const leftInfoForClear = document.getElementById('leftDetailsBox');
  const infoBoxOnTheRight = document.getElementById('rightContainsBox');
  leftInfoForClear.innerHTML = '<img src="img/waitingForJobInfo.png" alt="waiting for job info" width="102" height="77">';
  infoBoxOnTheRight.innerHTML = '<img src="img/envelope.png" alt="waiting for job info" width="102" height="77">';
}
//================================JOBOBJECT HANDLING==========================//
function addListeners2AllJobs(){
nowLoading();
const detailedInformationAboutJob = document.getElementById('leftDetailsBox');
const iconsOnRight = document.getElementById('rightContainsBox');
document.querySelectorAll(".JobObject").forEach(function(elem) {
    
    //When you click a job object...
		elem.addEventListener("click", function() {
        if(this.classList.contains("selectedJob")){
          this.classList.remove("selectedJob");
         
        }
        else{
          this.classList.add("selectedJob");
         
        }
        if (this.classList.contains("invalidJob")){
          this.classList.remove("selectedJob");
        }
		});


    //When you hover over a job object...
    elem.addEventListener("mouseenter", function() {
      var JobStringSplit = this.innerHTML.split("<br>");
      var jobNumber = JobStringSplit[0].trim();
      var deliveryName = JobStringSplit[1].trim();
      var jobFrames = JobStringSplit[4].trim();
      var despatchOptimized = JobStringSplit[5].trim();
      var barOptimized = JobStringSplit[6].trim();
      var awaitingSignature = JobStringSplit[7].trim();
      var signatureReceived = JobStringSplit[8].trim();
      var hasGlass = JobStringSplit[9].trim();
      var hasJobBeenBatchedByNaomi = JobStringSplit[10].trim();
      
      
      detailedInformationAboutJob.innerHTML = (
        "<span style='font-weight:2000;color:#FF006A;text-shadow: 1px 1px 1px black;'>"
         + jobNumber + "</span></br>" +
        "<span style='color:#C40BF7;'>" + deliveryName + "</span></br>" +
        "<span style='color:#EF458C;'>Frame Total: " + jobFrames + " </span>" +
        "</br><hr class='gradientLine2'>" +
        "");
      
      //ICONS
      iconsOnRight.innerHTML = '';
      if (hasGlass == '1'){
        
        iconsOnRight.innerHTML = (
          iconsOnRight.innerHTML + 
          "<span class='glassIcon'>Glass</span></br>"
        );
      }
      if ((barOptimized == '1') || (despatchOptimized == '1')){
        iconsOnRight.innerHTML = (
          iconsOnRight.innerHTML + 
          "<span class='optimizedIcon'>Optimised</span></br>"
        );
      }
      if ((awaitingSignature == '1') && (signatureReceived == '0')){
        iconsOnRight.innerHTML = (
          iconsOnRight.innerHTML + 
          "<span class='awaitingIcon'>Signature Waiting</span></br>"
          
        );
        this.classList.add('invalidJob');
      }
      if(signatureReceived == '1'){
        iconsOnRight.innerHTML = (
          iconsOnRight.innerHTML + 
          "<span class='sigReceivedIcon'>Signed</span></br>"
        );
      }
    });
	});
  
}
  getThisWeeksJobs();
}// If Index.html handler
//=============================================================================//
//======================================================================MAIN PAGE FUNCTIONS AKA INDEX.HTML==================================================//



});//END OF DOMCONTENTLOAD

  



