
//Helper Info Box
//Add mouseover events to everything that change the innerText to a description of
//the moused over element...
const helper = document.getElementById('helper');

//loading box
const loadingBox = document.getElementById('loadingBlock');

//default mode--//
document.getElementById('shaderCanvas').setAttribute("width","1280");
document.getElementById('shaderCanvas').setAttribute("height","900");
document.getElementById('shaderCanvas').style.imageRendering = "pixelated";

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
//--------------------------HELPER DESCRIPTIONS------------------------------//

