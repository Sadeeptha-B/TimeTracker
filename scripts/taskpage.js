/* Timelogs table */
var timeLogs = document.getElementById("timelogs");   //Container div
var timeLogTableRow = document.getElementById("template_table_row");   //Table row
var timeLogTableBody = document.getElementById("timelog_table_body");   // Table body

/* Modals*/
var timeInput = document.getElementById("time_input");

/* Chart */
var chartCard = document.getElementById("chart_card")  
var statusColumn = document.getElementById("logtime_status")

/* Error Messages */
var commonTaskError = document.getElementById("timelog_error")

window.taskPageNameSpace = {
    charts: [],
    members: {
        /* Dummy Data can be deleted once assignees are available in local storage  */
        array : ["hban0006", "josephloo", "student12"],
        hban0006: {
            timelogs: [],
            totalDuration: 5
        },
        josephloo: {
            timelogs: [],
            totalDuration: 5
        },
        student12:{
            timelogs: [], 
            totalDuration: 2
        }
    }
}


Object.entries(JSON.parse(localStorage.getItem("assignedTo"))).forEach(member => {
    var memberAccess =  window.taskPageNameSpace.members;
    memberAccess.member = {};
    memberAccess.array.push(member);
    memberAccess.member.timelogs = [];
    memberAccess.member.totalDuration = 0;
})

addChart("time_duration_bar", "Time Duration spent by each member", "bar", memberDurationChart,);
addChart("time_duration_pie","Time Percentages","pie", memberDurationChart)

function addChart( id,title, type,func){
    var chart = func(id, title, type);
    window.taskPageNameSpace.charts.push(chart)
}

function updateCharts(){
    var charts = window.taskPageNameSpace.charts;
    charts.forEach(chart => {
        updateChart(chart);
    })
}


document.getElementById("save_time_log").addEventListener('click', function(){
    clearErrors(commonTaskError);
    var dateObjs = getDataforPopulation();
    if (dateObjs != undefined){
        var formatData = format(dateObjs.start, dateObjs.end)
        update(formatData);
    }
});


function getDataforPopulation(){
    var startDate = document.getElementById("start_day").value,
        startMonth = document.getElementById("start_month").value,
        startYear = document.getElementById("start_year").value,
        startHr = document.getElementById("start_hr").value,
        startMin = document.getElementById("start_min").value,
        startPeriod = document.getElementById("start_period").value;


    var endDate = document.getElementById("end_day").value,
        endMonth = document.getElementById("end_month").value,
        endYear = document.getElementById('end_year').value,
        endHr = document.getElementById('end_hr').value,
        endMin = document.getElementById('end_min').value,
        endPeriod = document.getElementById('end_period').value;

    function timeCheck(hour, period){
        if (hour == 12){
            if (period == 0){
                return 0;   // 12am = 0000hrs
            }
            else if (period == 12){
                return 12;  // 12pm = 1200hrs;
            }
        }
        else {
            return hour + period;
        }
    }

    var startHrParsed = timeCheck(parseInt(startHr), parseInt(startPeriod));
    var endHrParsed = timeCheck(parseInt(endHr), parseInt(endPeriod));

    var startDateFormat = new Date(startYear, startMonth-1, startDate, startHrParsed, startMin),
        endDateFormat = new Date(endYear, endMonth-1, endDate, endHrParsed, endMin ),
        hourNotEntered = isNaN(startDateFormat.getTime()) || isNaN(endDateFormat.getTime()),
        dateValid = endDateFormat.getTime() > startDateFormat.getTime()
    

    if (hourNotEntered){
        displayError("Hour minute input must be provided", commonTaskError);
        return;
    }

    if (!dateValid){
        displayError("Start time should be before end time",commonTaskError);
        return;
    } 

    var dateObj = {
        start: startDateFormat,
        end:endDateFormat
    }
    return dateObj
}

function format(startDateFormat, endDateFormat){
    startTimeObject = { Date : startDateFormat.getDate().toString().padStart(2,"0"), 
                        Month : (startDateFormat.getMonth() + 1).toString().padStart(2,"0"), 
                        Year : startDateFormat.getFullYear(), 
                        Hour : startDateFormat.getHours(),
                        Minute : startDateFormat.getMinutes() },

    endTimeObject = {   Date : endDateFormat.getDate().toString().padStart(2,"0"), 
                        Month : (endDateFormat.getMonth() + 1).toString().padStart(2,"0"), 
                        Year : endDateFormat.getFullYear(), 
                        Hour : endDateFormat.getHours(),
                        Minute : endDateFormat.getMinutes() }

    var timeInSecs =(endDateFormat.getTime() - startDateFormat.getTime())/1000,
        timeInMins = timeInSecs / 60,
        timeInHrs = timeInMins / 60,
        timeFormatHrs = Math.floor(timeInHrs),
        timeFormatMins = (timeInMins % 60).toString().padStart(2, "0")

    var duration = timeFormatHrs + ":" + timeFormatMins

    var formatObject = {
        startDateFormat : startDateFormat,
        endDateFormat: endDateFormat,
        startTimeObject: startTimeObject, 
        endTimeObject: endTimeObject,
        durationData: {
            timeInHrs: timeInHrs,
            timeFormatHrs: timeFormatHrs,
            timeFormatMins: timeFormatMins
        }
    }
    return formatObject;
}


async function update(formatObject){
    var startTimeObject = formatObject.startTimeObject, 
        endTimeObject = formatObject.endTimeObject,
        duration = formatObject.durationData.timeFormatHrs + ":" + formatObject.durationData.timeFormatMins
        
    var user = await firebase.auth().currentUser;
    firebaseRef.child(`Users/${getUsername(user.email)}`)
		.once('value').then(function(snapshot) {
            const username = snapshot.child('Username').val();
            window.taskPageNameSpace.members[username].timelogs.push(formatObject);
            window.taskPageNameSpace.members[username].totalDuration += formatObject.durationData.timeInHrs;
            updateCharts(); 
            populateTable(username, startTimeObject, endTimeObject, duration);
    });

    
    setDisplayNone(statusColumn);
    setDisplayFlex(timeLogs);
    closeModal(timeInput);

    firebaseRef.child(`Projects/${localStorage.getItem("projectName")}/Tasks/${localStorage.getItem("taskName")}/Times`).once('value').then(function(snapshot) {
        var amount = snapshot.child(getUsername(user.email)).val(),
            noOfTasks = 1
        

        if (amount !== null) {
            amount = Object.entries(amount)
            noOfTasks = amount.length + 1
        }
        
        firebaseRef.child(`Projects/${localStorage.getItem("projectName")}/Tasks/${localStorage.getItem("taskName")}/Times/${getUsername(user.email)}/Time${noOfTasks}`).set({
            StartTime : startTimeObject,
            EndTime : endTimeObject,
            Duration: `${formatObject.durationData.timeFormatHrs} hour(s) ${formatObject.durationData.timeFormatMins} min(s)`
        })
        .then(function(){
            window.alert("Time logged!");
        })
    })
}


function populateTable(user, startTimeObject, endTimeObject, duration){
    var startDateString = startTimeObject.Date + "/" + startTimeObject.Month + "/" + startTimeObject.Year;
    var endDateString = endTimeObject.Date + "/" + endTimeObject.Month + "/" + endTimeObject.Year;

    function timeToStr(num){
        var numStr = num.toString();
        if (num < 10){
            numStr = "0" + num;
        }
        return numStr;
    }
    
    var startTimeMinuteString = timeToStr(startTimeObject.Minute);
    var endTimeMinuteString = timeToStr(endTimeObject.Minute);
    var startTimeHourString = timeToStr(startTimeObject.Hour);
    var endTimeHourString = timeToStr(endTimeObject.Hour);

    var startFormatted = new Date (startTimeObject.Year, 
        parseInt(startTimeObject.Month)-1, 
        parseInt(startTimeObject.Date), 
        startTimeObject.Hour, 
        startTimeObject.Minute);

    var endFormatted = new Date (endTimeObject.Year, 
        parseInt(endTimeObject.Month)-1, 
        parseInt(endTimeObject.Date), 
        endTimeObject.Hour, 
        endTimeObject.Minute);

    var durationSecs = (endFormatted.getTime() - startFormatted.getTime())/1000;
    var durationMins = durationSecs / 60;
    var durationHrs = Math.floor(durationMins / 60);
    var durationDisplayMins = durationMins % 60;

    document.getElementById("table_member").innerText = user;
    document.getElementById("table_start_date").innerText = startDateString;
    document.getElementById("table_end_date").innerText = endDateString;
    document.getElementById("table_start").innerText = startTimeHourString +":" + startTimeMinuteString;
    document.getElementById("table_end").innerText = endTimeHourString +":" + endTimeMinuteString;
    document.getElementById("table_duration").innerText = durationHrs.toString() + " hrs " + durationDisplayMins.toString() + " mins";

    var clone = cloneElement(timeLogTableRow, timeLogTableBody);
    clone.removeAttribute("style");
}


function dynamicallyCreateChart(id, title){
    var chartUnit = document.createElement("div");
    var header = document.createElement("h4");
    var chartContainer = document.createElement("div");
    var chartCanvas = document.createElement("canvas");
    var br =  document.createElement("br");
    
    chartCard.appendChild(chartUnit);
    chartUnit.appendChild(header);
    chartUnit.appendChild(chartContainer);
    chartContainer.appendChild(chartCanvas);
    chartContainer.appendChild(br);
    chartContainer.appendChild(br);

    header.innerText = title;
    chartContainer.class = "chart_container";
    chartCanvas.id = id;

    var ctx = chartCanvas;
    return ctx;
}

function basicChartConfig(type, xAxes, label, yAxes, tooltipFunction){
    var config = {
        type: type,
        data: {
            labels:xAxes,
            datasets:[{
                label: label,
                data: yAxes,
                backgroundColor: palette('tol', xAxes.length).map(function(hex) {
                    return '#' + hex;
                })
            }]
        },
        options:{
            scales:{
                yAxes: [{
                    display: true,
                    ticks:{
                        beginAtZero:true, 
                    }
                }]
            },
            tooltips:{
                callbacks:{
                    label: tooltipFunction()
                }
            }
        }
    }
    return config;
}

function tooltipFunction(){
   /* To modify tooltip */ 
}

function memberDurationChart(id, title, type){
    var ctx = dynamicallyCreateChart(id, title);
    var members = window.taskPageNameSpace.members.array;
    var durationArray = []
    members.forEach((member) => {
        durationArray.push(window.taskPageNameSpace.members[member].totalDuration)
    })


    var chart = new Chart(ctx, basicChartConfig(type, members, 'Members', durationArray));

    return chart;
}


function updateChart(chart){
    var members = window.taskPageNameSpace.members.array;
    var durationArray = []
    members.forEach((member) => {
        durationArray.push(window.taskPageNameSpace.members[member].totalDuration)
    })

    setTimeout(function(){
        chart.data.datasets[0].data.pop();
        chart.data.datasets[0].data = durationArray;
        // chart.data.datasets[0].backgroundColor = ['#f2d13a', '#c9deeb', '#cacaca'];
        chart.update();
    }, 0);
}


/* Chart */
// var ctxMyCont = document.getElementById("myContChart").getContext('2d');
// var timeArray = ["2018-12-07 15:45:17", "2018-12-09 15:30:17", "2018-12-15 15:15:16", "2018-12-12 15:00:17", "2018-12-13 14:45:16", "2018-12-14 14:30:17", "2018-12-10 14:15:17", "2018-12-09 14:00:17", "2018-12-08 13:45:17", "2018-12-07 13:30:16", "2018-12-06 13:15:17", "2018-12-10 16:00:17"];
// var hoursContributed = [3, 1, 0.5, 2, 5, 3, 1, 1.5, 1, 2, 4, 3];


// var myChart = new Chart(ctxMyCont, {
//     type: 'line',
//     data: {
//         labels: timeArray,
//         datasets: [{
//             label: 'Duration',
//             data: hoursContributed,
//             backgroundColor: "rgb(113, 163, 240)",
//         }],
//     },
//     options: {
//         scales: {
//             yAxes: [{
//                 ticks: {
//                     beginAtZero:true
//                 }
//             }],
//             xAxes: [{
//                 type: 'time',
//                 time: {
//                     unit: 'day',
//                     displayFormats: {
//                         // second: 'h:MM:SS',
//                         // minute: 'h:MM',
//                         // hour: 'hA',
//                         day: 'MMM D',
//                         month: 'YYYY MMM',
//                         year: 'YYYY'
//                     },                            
//                 },
//                 display: true,
//                 scaleLabel: {
//                     display: true,
//                     labelString: 'value'
//                 }                        
//             }]                    
//         }
//     }
// });

var contributors={
    label:"Team member",
    borderColor: "orange",
    data: [
        {x:"2018-12-07 15:45:17", y: "Robyn"},
        {x:"2018-12-09 15:30:17", y: "Campbell"},
        {x: "2018-12-15 15:15:16",y: "Najam"},
        {x:"2018-12-12 15:00:17", y: "Nathan"},
        {x: "2018-12-13 14:45:16", y:"Robyn"},
        {x:"2018-12-14 14:30:17", y:"Najam"},
        {x:"2018-12-10 14:15:17", y:"Nathan"},
        {x:"2018-12-09 14:00:17", y: "Campbell"},
        {x:"2018-12-08 13:45:17", y: "Campbell"},
        {x: "2018-12-07 13:30:16", y: "Campbell"},
        {x:"2018-12-06 13:15:17", y:"Robyn"},
        {x:"2018-12-10 16:00:17", y:"Nathan"}
    ]

}


var dateAndCont = {
    label:"Dates and Hour contribution",
    borderColor: "blue",
    data: [
        {x:"2018-12-07 15:45:17", y: 3},
        {x:"2018-12-09 15:30:17", y:1},
        {x: "2018-12-15 15:15:16", y:0.5},
        {x:"2018-12-12 15:00:17", y:2},
        {x: "2018-12-13 14:45:16", y:5},
        {x:"2018-12-14 14:30:17", y:3},
        {x:"2018-12-10 14:15:17", y:1},
        {x:"2018-12-09 14:00:17", y: 1.5},
        {x:"2018-12-08 13:45:17", y:1},
        {x: "2018-12-07 13:30:16", y:2},
        {x:"2018-12-06 13:15:17", y:4},
        {x:"2018-12-10 16:00:17", y:3}
    ]
}


// Edit task description
document.getElementById("edit_task_desc").addEventListener('click', function(){
    document.getElementById("desc_field").setAttribute("placeholder", document.getElementById("description").innerHTML);
});

// Save new task description
document.getElementById("save_desc").addEventListener("click", async function(){
    var newDesc = document.getElementById("desc_field").value.trim();

    firebaseRef.child(`Projects/${localStorage.getItem("projectName")}/Tasks/${localStorage.getItem("taskName")}`).update({
        // If the description field is empty, close
        Description: newDesc.length > 0 ? newDesc : localStorage.getItem("taskDescription")
    })
    .then(function() {
        // Rename the local storage values to the new values
        if (newDesc.length > 0) {
            localStorage.setItem("taskDescription", newDesc)
            document.getElementById("description").innerText = newDesc
        }
        // window.location.reload()
    })
    closeModal(document.getElementById("desc_edit_overlay"));
});

document.getElementById("mark_complt_btn").addEventListener('click', function(){
    document.getElementById("marked_cmplt").style.display = "flex";   // This must be grid
    document.getElementById("mark_complt_btn").style.display = "none";   
    document.getElementById("new_log_btn").style.display="none";
    document.getElementById("plan_cont_btn").style.display="none"
    document.getElementById("set_active_btn").style.display = "flex";
});

document.getElementById("set_active_btn").addEventListener('click', function(){
    document.getElementById("marked_cmplt").style.display = "none";
    document.getElementById("new_log_btn").style.display="flex";
    document.getElementById("plan_cont_btn").style.display="flex"
    document.getElementById("mark_complt_btn").style.display = "flex";   
    document.getElementById("set_active_btn").style.display = "none";
});