
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
    if(nameOfPage == 'index.html'){
        helper.innerText = "Despatch Job Viewer";
    }
    else if(nameOfPage == 'rollingStock.html'){
        helper.innerText = "Rolling Stock Charts";  
    }
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

//Index/main page helper functions
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

//RollingStock Functions
if(nameOfPage == 'rollingStock.html'){
    const despatchJobButton = document.getElementById('despatchButton');
    despatchJobButton.addEventListener("mouseenter", () =>{
        helper.innerText = "Despatch Job Viewer";
    });

/*const chartZone = document.getElementById('theCharts');
  new (chartZone, {
    type: 'line',
    maintainAspectRatio: false,
    aspectRatio: 2,
    data: {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      datasets: [{
        label: 'Despatch',
        data: [3000, 2750, 2600, 2100, 1605, 1200],
        borderWidth: 5,
        borderColor: 'rgba(186, 109, 238, 0.6)',
        backgroundColor: 'rgba(186, 109, 238, 0.6)',
        color: 'red',
        animations: {
        tension: {
          duration: 2000,
          easing: 'linear',
          from: 0.2,
          to: 0.3,
          loop: true
        }
      },
        pointStyle: 'star',
        pointRadius: '10',
        pointHoverRadius: '10',
      },
      {
        label: 'Stores',
        data: [200, 800, 1234, 2350, 3400],
        borderWidth: 5,
        borderColor:'#8DF2C8',
        backgroundColor: '#8DF2C8',
        color: 'red',
        animations: {
        tension: {
          duration: 2000,
          easing: 'linear',
          from: 0.2,
          to: 0.3,
          loop: true
        }
      },
        pointStyle: 'triangle',
        pointRadius: '5',
        pointHoverRadius: '5',
      },
      {
        label: 'Production',
        data: [10, 25, 750, 700, 320],
        borderWidth: 5,
        borderColor:'#F28DB7',
        backgroundColor: '#F28DB7',
        color: 'red',
       animations: {
        tension: {
          duration: 2000,
          easing: 'linear',
          from: 0.2,
          to: 0.3,
          loop: true
        }
      },
        pointStyle: 'circle',
        pointRadius: '5',
        pointHoverRadius: '5',
      }
    ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });*/
}
//--------------------------HELPER DESCRIPTIONS------------------------------//

