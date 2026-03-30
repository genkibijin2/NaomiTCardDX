
//Helper Info Box
//Add mouseover events to everything that change the innerText to a description of

//const { ipcRenderer } = require("electron");

//the moused over element...
const helper = document.getElementById('helper');
//loading box
const loadingBox = document.getElementById('loadingBlock');

//default mode--//
document.getElementById('shaderCanvas').setAttribute("width","1280");
document.getElementById('shaderCanvas').setAttribute("height","900");
document.getElementById('shaderCanvas').style.imageRendering = "pixelated";
var currentFile = location.href.split("/").slice(-1); 
var nameOfPage = currentFile[0];
//quit button


//--End of performance controls-----------------------------------------//

//--------------------------HELPER DESCRIPTIONS------------------------------//
const programTitleBlock = document.getElementById('programTitle');
programTitleBlock.addEventListener("mouseenter", () => {
    helper.innerText = "Euroglaze T Card System";
});
const quithelper = document.getElementById('quit');
quithelper.addEventListener("mouseenter", () => {
    helper.innerText = "Quit the program";
});

const minimizeHelper = document.getElementById('minimize');
minimizeHelper.addEventListener("mouseenter", () => {
    helper.innerText = "Minimize the program";
});

const maximizeHelper = document.getElementById('maximize');
maximizeHelper.addEventListener("mouseenter", () => {
    helper.innerText = "Maximize the program";
});

if(nameOfPage == 'index.html'){
const mondayJobSlice = document.getElementById('MondaySlice');
mondayJobSlice.addEventListener("mouseenter", () => {
    helper.innerText = "Monday's Jobs";
});
const tuesdayJobSlice = document.getElementById('TuesdaySlice');
tuesdayJobSlice.addEventListener("mouseenter", () => {
    helper.innerText = "Tuesday's Jobs";
});
const wednesdayJobSlice = document.getElementById('WednesdaySlice');
wednesdayJobSlice.addEventListener("mouseenter", () => {
    helper.innerText = "Wednesday's Jobs";
});
const thursdayJobSlice = document.getElementById('ThursdaySlice');
thursdayJobSlice.addEventListener("mouseenter", () => {
    helper.innerText = "Thursday's Jobs";
});
const fridayJobSlice = document.getElementById('FridaySlice');
fridayJobSlice.addEventListener("mouseenter", () => {
    helper.innerText = "Friday's Jobs";
});
const jobInformationBox = document.getElementById('topBarInformation');
jobInformationBox.addEventListener("mouseenter", () => {
    helper.innerText = "Detailed information about job";
});
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener("mouseenter", () => {
    helper.innerText = "Search this date range";
});
searchButton.addEventListener("click", () => {
    helper.innerText = "Searching dates...";
});
const datePickerBox = document.getElementById('date-input');
datePickerBox.addEventListener("mouseenter", () => {
    helper.innerText = "Choose dates to look at";
});
}
//--------------------------HELPER DESCRIPTIONS------------------------------//

