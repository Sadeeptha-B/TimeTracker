
/* Recent timelogs */
var timeLogCardTemplate = document.getElementById("timelog_card_template");
var logCardContent = document.getElementById("logs_card_body");

/* Timelogs table */
var timeLogs = document.getElementById("timelogs");   //Container div
var timeLogTableRow = document.getElementById("template_table_row");   //Table row
var timeLogTableBody = document.getElementById("timelog_table_body");   // Table body

/* Modals*/
var timeInput = document.getElementById("time_input");

/* Chart */
var timeTrackChart = document.getElementById("time_track_chart")

var statusColumn = document.getElementById("logtime_status")
var commonTaskError = document.getElementById("timelog_error")


function logTimeDisplayNone(){
    setDisplayNone(logTimeField);
    var descTeam = document.getElementById("description_team_wrapper");
    descTeam.toggle("body-flex-wrapper-one-third", true);
}


document.getElementById("save_time_log").addEventListener('click', function(){
    clearErrors(commonTaskError);
    getDataforPopulation();
});


async function getDataforPopulation(){
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


    var user = await firebase.auth().currentUser;
    firebaseRef.child(`Users/${getUsername(user.email)}`)
		.once('value').then(function(snapshot) {
            const username = snapshot.child('Username').val();
            populateTable(username, startTimeObject, endTimeObject);
    });

    console.log(getTimeDuration(startDateFormat, endDateFormat));
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
            Duration: `${timeFormatHrs} hour(s) ${timeFormatMins} min(s)`
        })
        .then(function(){
            window.alert("Time logged!");
        })
    })
}

function getTimeDuration(startDateFormat, endDateFormat){
    return {
        timeInSecs:(endDateFormat.getTime() - startDateFormat.getTime())/1000,
        timeInMins:+this.timeInSecs / 60,
        timeInHrs:+this.timeInMins / 60,
        timeFormatHrs: Math.floor(+this.timeInHrs),
        timeFormatMins : +this.timeInMins % 60
    }
}


function populateTable(user, startTimeObject, endTimeObject){
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


/* Chart */
var ctxMyCont = document.getElementById("myContChart").getContext('2d');
var timeArray = ["2018-12-07 15:45:17", "2018-12-09 15:30:17", "2018-12-15 15:15:16", "2018-12-12 15:00:17", "2018-12-13 14:45:16", "2018-12-14 14:30:17", "2018-12-10 14:15:17", "2018-12-09 14:00:17", "2018-12-08 13:45:17", "2018-12-07 13:30:16", "2018-12-06 13:15:17", "2018-12-10 16:00:17"];
var hoursContributed = [3, 1, 0.5, 2, 5, 3, 1, 1.5, 1, 2, 4, 3];

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

var myChart = new Chart(ctxMyCont, {
    type: 'line',
    data: {
        labels: timeArray,
        datasets: [{
            label: 'Duration',
            data: hoursContributed,
            backgroundColor: "rgb(113, 163, 240)",
        }],
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }],
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'day',
                    displayFormats: {
                        // second: 'h:MM:SS',
                        // minute: 'h:MM',
                        // hour: 'hA',
                        day: 'MMM D',
                        month: 'YYYY MMM',
                        year: 'YYYY'
                    },                            
                },
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'value'
                }                        
            }]                    
        }
    }
});


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






















// //JX
// function inputTimeForTask(){
// 	//task start time
// 	var startDay =  document.getElementById("start_day").value,
// 		startMonth = document.getElementById("start_month").value,
// 		startYear = document.getElementById("start_year").value,
// 		startHour = document.getElementById("start_hr").value,
// 		startMinute = document.getElementById("start_min").value,
// 		startPeriod = document.getElementById("start_period").value,
// 		militaryStartHour = startPeriod+startHour,

// 		// Putting into DD/MM/YYYY,HH:MM format
// 		startTimeFormat = startDay + "/" + startMonth + "/" + startYear + "," + militaryStartHour + ":" + startMinute,

// 	//task end time
// 		endDay = document.getElementById("end_day").value,
// 		endMonth = document.getElementById("end_month").value,
// 		endYear = document.getElementById("end_year").value,
// 		endHour = document.getElementById("end_hr").value,
// 		endMinute = document.getElementById("end_min").value,
// 		endPeriod = document.getElementById("end_period").value,
// 		militaryEndHour = endPeriod+endHour,

// 		// Putting into DD/MM/YYYY,HH:MM format
// 		endTimeFormat = endDay + "/" + endMonth + "/" + endYear + "," + militaryEndHour + ":" + endMinute,

// 	var commonProjError = document.getElementById("create_project_error");
// 	var dateValid = true;
//     var oneDayGap = false;
//     /* 
//     oneDayGap is only changed if there is a minimum of 1 day gap between inputs, if not, compare times.
// 	Initially we have valid = true; we change this value according to the criteria below:
// 	if startYear > endYear: not valid
// 	else:
// 		if startYear == endYear:
// 			if startMonth > endMonth: not valid
// 			else: 
// 				if startMonth == endMonth:
// 					if startDay > endDay: not valid
// 					else: valid
// 				else if startMonth < endMonth: valid
// 		if startYear < endYear: valid
// 	*/
// 	if (startYear > endYear){
//         dateValid = false;
// 	}
// 	else if (startYear == endYear){
// 		if (startMonth > endMonth){
//             dateValid = false;
// 		}
// 		else if (startMonth == endMonth){
// 			if (startDay > endDay){ 
//                 dateValid = false;
//             }
//             else if (startDay < endDay){
//                 oneDayGap = true;
//             }
//             else if (startDay == endDay){
//                 if (militaryStartHour > militaryEndHour || !oneDayGap){
//                     dateValid = false;
//                 }
//                 else if (militaryStartHour == militaryEndHour){
//                     if (startMinute > endMinute || !oneDayGap){
//                         dateValid =false;
//                     }
//                 }
//             }
//         }
// 	}

// 	/*
// 	if (valid = compare(startYear, endYear)){
// 		if (valid = compare(startMonth,endMonth))
// 			valid = compare(startDay, endDay);
// 	}
// 	*/

// 	if (!dateValid){
// 		window.alert("Task cannot end before it starts, or end at the same time as the start time");
// 		return;
// 	}

// 	var user = await firebase.auth().currentUser

// 	firebaseRef.child(`Projects/${localStorage.getItem(projectName)}/Tasks/${localStorage.getItem(taskName)}`).update({
// 		StartTime : startTimeFormat,
// 		EndTime : endTimeFormat
//     })
    
//     window.alert("Time logged!")
// }