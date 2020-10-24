/*
Functions : ------
updateTaskPage : Display according to user
updateVisuals : Update charts and tables  (Load data upon page load and update)                   
                    Charts: addChart :   Specify chart type, chart creation function for the type
                            updateCharts : Calls updateChart for each chart

                   Tables : populateTable : Call updateTable and handle change display

Entering new timelogs: Called by event listener for click "save_time_log" ------
    getDataforPopulation
    format
    update     : updateCharts
                 updateTable : Put timelog on frontend

Planning Times: Called by event listener for click "save_contribution" ---------
    updatePlannedTime
    changeContribution

Chart detailed specifics  ------------------------------------------------------
    dynamicallyCreateChart - Base chart creation function
    basicChartConfig       - Standard Chart config


    Specific charts   - Calls dynamicallyCreateChart and sets chart config
      memberDurationChart   - members and duration 
      updateChart           

Event listeners -----------------------------------
   save_time_log
   save_contribution
   edit_task_desc
   save_desc
   mark_complt_btn
   set_active_btn
*/



/* Timelogs table */
var timeLogs = document.getElementById("timelogs");   //Container div
var timeLogTableRow = document.getElementById("template_table_row");   //Table row
var timeLogTableBody = document.getElementById("timelog_table_body");   // Table body

/* Modals*/
var timeInput = document.getElementById("time_input");
var contribution = document.getElementById("contribution_overlay");

/* Chart */
var chartCard = document.getElementById("task_chart_card")  
var statusColumn = document.getElementById("logtime_status")

/* Error Messages */
var commonTaskError = document.getElementById("timelog_error")
var contributeError = document.getElementById("contribute_error")

window.taskPageNameSpace = {
    charts: [],
    members: {
        array : [],
        totalTime : 0
    }
}

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// Adds all the projects the logged in user is a part of to the his/her homepage
		firebaseRef.child(`Users/${getUsername(user.email)}`)
		.once('value').then(function(snapshot) {
			const username = snapshot.child('Username').val(),
					role = snapshot.child('Role').val()

            updateTaskPage(username, role)
            updateVisuals()
		})
	}
	else {
      // No user is signed in.
	}
});

// FUNCTIONS TO UPDATE THE TASK PAGE
function updateTaskPage(username, role) {
	const taskField = document.getElementById("taskName"),
		  descriptionField = document.getElementById("description"),
		  editTaskDescriptionButton = document.getElementById("edit_task_desc"),
		  submitTimeButton = document.getElementById("save_time_log"),
		  planContBtn = document.getElementById("plan_cont_btn"),
		  newLogBtn   = document.getElementById("new_log_btn"),
		  markCompltBtn = document.getElementById("mark_complt_btn")

	// Update the fields with project information
	taskField.textContent = localStorage.getItem("taskName")
	descriptionField.textContent = localStorage.getItem("taskDescription")
	Object.entries(JSON.parse(localStorage.getItem("assignedTo"))).forEach(member => {addMembers(member)})

	// Remove task description button for teachers but show for students
	// Remove time input button for teachers but show for students
	if (editTaskDescriptionButton && submitTimeButton) {
		if (role === 'Teacher') {
			markCompltBtn.style.display="inline-block";
			planContBtn.style.display = "none"
			newLogBtn.style.display = "none"
			editTaskDescriptionButton.style.display = "none"
			submitTimeButton.style.display = "none"
			
		}
		else if (role === 'Student') {
			firebaseRef.child(`Projects/${localStorage.getItem("projectName")}/Tasks/${localStorage.getItem("taskName")}/AssignedTo/${username}`)
			.once('value').then(function(snapshot) {
				if (snapshot.val()) {
					markCompltBtn.style.display="inline-block";
					newLogBtn.style.display = "inline-block"
					planContBtn.style.display="inline-block"
					editTaskDescriptionButton.style.display = "inline-block"
					submitTimeButton.style.display = "inline-block"
				}
				else {
					markCompltBtn.style.display="none";
					newLogBtn.style.display = "none"
					planContBtn.style.display="none"
					editTaskDescriptionButton.style.display = "none"
					submitTimeButton.style.display = "none"
				}
			})
		}
	}
}

async function updateVisuals() {
    const waitFor = (ms) => new Promise(r => setTimeout(r, ms))

    Object.entries(JSON.parse(localStorage.getItem("assignedTo"))).forEach(member => {
        var memberAccess = window.taskPageNameSpace.members,
            username = member[1].Username
        memberAccess[username] = {};
        memberAccess.array.push(username);
        // Later I just need to take the data from firebase and add it the total duration and timelogs
        firebaseRef.child(`Projects/${localStorage.getItem("projectName")}/Tasks/${localStorage.getItem("taskName")}/Times/${username}`).once("value").then(function(snapshot) {
            var totalDuration = snapshot.child('TotalTimeSpent').val(),
                plannedTime = snapshot.child('PlannedTime').val(),
                timelogs = snapshot.val()
            
            memberAccess[username].totalDuration = totalDuration;
            memberAccess[username].plannedTime = plannedTime;
            memberAccess.totalTime += totalDuration
    
            if (timelogs) {
                var timelogs = Object.entries(timelogs),
                    length = timelogs.length
                
                memberAccess[username].timelogs = timelogs.slice(1, length - 1)
            }
            else {
                memberAccess[username].timelogs = []
            }
            
        }).then(function() {
            updateCharts()
            populateTable(username)
        })
    })

    await(waitFor(250))

    Object.entries(JSON.parse(localStorage.getItem("assignedTo"))).forEach(member => {
        var memberAccess = window.taskPageNameSpace.members,
            username = memberAccess[member[1].Username],
            total = memberAccess.totalTime,
            memberTime = username.totalDuration
            
        username.actualAllocation = Math.floor(((memberTime/total) * 100)+0.5);
    })

    addChart("time_duration_bar", "Time Duration spent by each member", "bar", memberDurationChart)
    addChart("time_duration_pie","Time Percentages","pie", memberDurationChart)
}

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

function populateTable(member) {
    var timelogs = window.taskPageNameSpace.members[member].timelogs
    
    if (timelogs) {
        timelogs.forEach(log => {updateTable(member, log[1])})
        setDisplayNone(statusColumn);
        setDisplayFlex(timeLogs);
    }
}

document.getElementById("save_time_log").addEventListener('click', function(){
    clearErrors(commonTaskError);
    var dateObjs = getDataforPopulation();
    if (dateObjs != undefined){
        var formatData = format(dateObjs.start, dateObjs.end)
        update(formatData);
    }
});

// FUNCTIONALITY FUNCTIONS
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
        timeNow = new Date(),
        hourNotEntered = isNaN(startDateFormat.getTime()) || isNaN(endDateFormat.getTime()),
        startEndTimeValid = endDateFormat.getTime() > startDateFormat.getTime() 
    
    if (timeNow < startDateFormat){
        displayError("Timelogs in the future are not accepted ", commonTaskError);
        return;
    }

    if (hourNotEntered){
        displayError("Hour minute input must be provided", commonTaskError);
        return;
    }

    if (!startEndTimeValid){
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
        endTimeObject = formatObject.endTimeObject
        
    var user = await firebase.auth().currentUser;
    const username = getUsername(user.email)

    window.taskPageNameSpace.members[username].timelogs.push(formatObject);
    window.taskPageNameSpace.members[username].totalDuration += formatObject.durationData.timeInHrs;
    updateCharts(); 
    updateTable(username, formatObject);     // Consider incorporating to populateTable function

    
    setDisplayNone(statusColumn);
    setDisplayFlex(timeLogs);
    closeModal(timeInput);

    var projectName = localStorage.getItem("projectName"),
            taskName = localStorage.getItem("taskName")

    firebaseRef.child(`Projects/${projectName}`).once('value').then(function(snapshot) {
        var username = getUsername(user.email),
            amount = snapshot.child(`Tasks/${taskName}/Times/${username}`).val(),
            plannedTimePresent = snapshot.child(`Tasks/${taskName}/Times/${username}/PlannedTime`).val(),
            noOfTasks = 1,

            totalTimeSpentProject = snapshot.child(`TotalTimeSpent/${username}/Duration`).val(),
            totalTimeSpentTask = snapshot.child(`Tasks/${taskName}/Times/${username}/TotalTimeSpent`).val(),
            timeSpent = formatObject.durationData.timeInHrs

        if (amount) {
            amount = Object.entries(amount)
            if (plannedTimePresent) {
                noOfTasks = amount.length - 1
            }
            else {
                noOfTasks = amount.length
            }
        }

        if (totalTimeSpentProject == null) {
            totalTimeSpentProject = 0
        }
        if (totalTimeSpentTask == null) {
            totalTimeSpentTask = 0
        }

        firebaseRef.child(`Projects/${projectName}/Tasks/${taskName}/Times/${username}/Time${noOfTasks}`).set({
            startTimeObject : startTimeObject,
            endTimeObject : endTimeObject,
            durationData: {
                timeInHrs: formatObject.durationData.timeInHrs,
                timeFormatHrs: formatObject.durationData.timeFormatHrs,
                timeFormatMins: formatObject.durationData.timeFormatMins
            }
        })
        .then(function(){
            // Updating the total time spent of the user in the project
            firebaseRef.child(`Projects/${projectName}/TotalTimeSpent/${username}`).set({
                Duration: timeSpent + totalTimeSpentProject
            })
        })
        .then(function() {
            // Updating the total time spent of the user in the specific task
            firebaseRef.child(`Projects/${projectName}/Tasks/${taskName}/Times/${username}`).update({
                TotalTimeSpent: timeSpent + totalTimeSpentTask
            })
        })
        .then(function() {
            displayConfirmAlert("Time logged    👍")
            // window.alert("Time logged!");
        })
    })
}

document.getElementById("save_contribution").addEventListener('click', function(){
    clearErrors(commonTaskError);
    var hrsObj = updatePlannedTime();
    if (hrsObj != undefined){
        changeContribution(hrsObj);
    }
});

function updatePlannedTime(){
    var workHours = document.getElementById("work_hours").value;
    var hrsObj = parseInt(workHours);

    var dateFormat = new Date(2020, 0, 1, hrsObj, 0)
    workHourNotGiven = isNaN(dateFormat.getTime());

    if (workHourNotGiven){
        displayError("Hour input must be provided", contributeError);
        return;
    }

    return hrsObj;
}

async function changeContribution(hrsObject){
    var user = await firebase.auth().currentUser;
    const username = getUsername(user.email)

    window.taskPageNameSpace.members[username].plannedTime = hrsObject;
    updateCharts(); 
    
    setDisplayNone(statusColumn);
    setDisplayFlex(timeLogs);
    closeModal(contribution);

    var projectName = localStorage.getItem("projectName"),
            taskName = localStorage.getItem("taskName")

    firebaseRef.child(`Projects/${projectName}`).once('value').then(function(snapshot) {
        var username = getUsername(user.email)

        firebaseRef.child(`Projects/${projectName}/Tasks/${taskName}/Times/${username}`).update({
            PlannedTime: hrsObject
        })
        .then(function() {
            displayConfirmAlert("Workload expectation logged!");
            // window.alert("Workload expectation logged!");
        })
    })
}

function updateTable(user, formatObject){
    var startTimeObject = formatObject.startTimeObject,
        endTimeObject = formatObject.endTimeObject,
        timeFormatHrs = formatObject.durationData.timeFormatHrs,
        timeFormatMins = formatObject.durationData.timeFormatMins

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

    // var startFormatted = new Date (startTimeObject.Year, 
    //     parseInt(startTimeObject.Month)-1, 
    //     parseInt(startTimeObject.Date), 
    //     startTimeObject.Hour, 
    //     startTimeObject.Minute);

    // var endFormatted = new Date (endTimeObject.Year, 
    //     parseInt(endTimeObject.Month)-1, 
    //     parseInt(endTimeObject.Date), 
    //     endTimeObject.Hour, 
    //     endTimeObject.Minute);

    // var durationSecs = (endFormatted.getTime() - startFormatted.getTime())/1000;
    // var durationMins = durationSecs / 60;
    // var durationHrs = Math.floor(durationMins / 60);
    // var durationDisplayMins = durationMins % 60;

    document.getElementById("table_member").innerText = user;
    document.getElementById("table_start_date").innerText = startDateString;
    document.getElementById("table_end_date").innerText = endDateString;
    document.getElementById("table_start").innerText = startTimeHourString +":" + startTimeMinuteString;
    document.getElementById("table_end").innerText = endTimeHourString +":" + endTimeMinuteString;
    document.getElementById("table_duration").innerText = timeFormatHrs + " hrs " + timeFormatMins + " mins";

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

function basicChartConfig(type, xAxes, label, yAxes){
    var config = {  type: type,
                    data: {
                        labels:xAxes,
                        datasets:[{
                            label: type === "bar" ? "Actual Time in Hours" : "Numbers",
                            data: yAxes,
                            backgroundColor: palette('tol', xAxes.length).map(function(hex) {
                                return '#' + hex;
                            })
                        }]
                    }
                }
    
    if (type === "bar") {
        config.options = {
                            scales:{
                                yAxes: [{
                                    display: true,
                                    ticks:{
                                        beginAtZero:true, 
                                    }
                                }]
                            }
                        }
    }
    else if(type === "pie") {
        config.options = {
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
    return function(tooltipItem, data) {
        var dataset = data.datasets[tooltipItem.datasetIndex];  //get the concerned dataset
    
        var component = data.labels[tooltipItem.index];
    
        //calculate the total of this data set
        var total = dataset.data.reduce(function(previousValue, currentValue) {
            return previousValue + currentValue;
        });
    
        //get the current items value
        var currentValue = dataset.data[tooltipItem.index];
    
    
        //calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
        var percentage = Math.floor(((currentValue/total) * 100)+0.5);
    
        return component + " : " + percentage + "%";
    }
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

document.getElementById("download_data_btn").addEventListener('click', function() {
    firebaseRef.child(`Projects/${localStorage.getItem('projectName')}`).once('value').then(function(snapshot) {
        var data = snapshot.val(),
            taskData = snapshot.child(`Tasks/${localStorage.getItem('taskName')}`).val(),
            filename = `${data.ProjectName}_${taskData.TaskName}`,
            members = "",
            assignedTo = "",
            text = ""
        
            
        Object.entries(data.Members).forEach(member => {
            members += member[1].Username + ", "
        })
        
        Object.entries(taskData.AssignedTo).forEach(member => {
            assignedTo += member[1].Username + ", "
        })

        text += `Project: ${data.ProjectName}
Project Description: ${data.Description}
Members: ${members}
Teacher In Charge: ${data.TeacherInCharge}
Start Date: ${data.StartDate}
End Date: ${data.EndDate}

Task: ${taskData.TaskName}
Task Description: ${taskData.Description}
AssignedTo: ${assignedTo}
Start Date: ${taskData.StartDate}
End Date: ${taskData.EndDate}
\n`

        Object.entries(taskData.AssignedTo).forEach(member => {  // plannedTime is in hours, it will be later changed to percentage
            text += member[1].Username + `
Planned Allocation: ${window.taskPageNameSpace.members[member[1].Username].plannedTime}%
Actual Allocation: ${window.taskPageNameSpace.members[member[1].Username].actualAllocation}%
Total Time Spent on Task: ${window.taskPageNameSpace.members[member[1].Username].totalDuration} hours\n`
        })       

        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    })
})