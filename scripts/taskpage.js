var template = document.getElementById("timelog_template");
var content = document.getElementById("logs_card_body");



document.getElementById("save_time_log").addEventListener('click', function(){
    getDataforPopulation();
});



function getDataforPopulation(){
    var startDate = document.getElementById("start_day").value;
    var startMonth = document.getElementById("start_month").value;
    var startYear = document.getElementById("start_year").value;
    var startHr = document.getElementById("start_hr").value;
    var startMin = document.getElementById("start_min").value;
    var startPeriod = document.getElementById("start_period").value;
    var start;
    if (startHr == 12) { // 12am
        start = new Date(startYear, startMonth-1, startDate, startPeriod, startMin)
    }
    else{
        start = new Date(startYear, startMonth-1, startDate, startHr+startPeriod, startMin)
    }

    var endDate = document.getElementById("end_day").value; 
    var endMonth = document.getElementById("end_month").value;
    var endYear = document.getElementById('end_year').value;
    var endHr = document.getElementById('end_hr').value;
    var endMin = document.getElementById('end_min').value;
    var endPeriod = document.getElementById('end_period').value;
    var end;
    if (endHr == 12) { // 12am
        end = new Date(endYear, endMonth-1, endDate, endPeriod, endMin)
    }
    else{
        end = new Date(endYear, endMonth-1, endDate, endHr+endPeriod, endMin)
    }
    // We need the values from these elements

    var workTime = end.getTime() - start.getTime();
    var dateValid = end.getTime() > start.getTime();
    // getTime() gives you the time elapsed after a fixed point in time in milliseconds, use this to get contribution time
    if (!dateValid){
        displayError("Task cannot end before it starts, or end on the same day as the start date",commonTaskError);
        return;
    }

    if (dateValid){
        var workHrs = ((time/1000)/60).toFixed(2);
        // toPrecision(x) rounds value to x-1 decimal places
        // can use parseInt() to get integer value;
    }

    /* REDUNDANT SOON: using JS Date objects to compare date/time and calculate time
    // date & time validation
	if (startYear > endYear){
        dateValid = false;
	}
	else if (startYear == endYear){
		if (startMonth > endMonth){
            dateValid = false;
            
		}
		else if (startMonth == endMonth){
			if (startDate > endDate){ 
				dateValid = false;
            }
            // tasks can be done within the same day
		}
    }
    // if we start at pm (12) and end at am (0), we must start and end on different days
    if (startPeriod > endPeriod){
        if (startYear == endYear && startMonth == endMonth && startDate == endDate){
            dateValid = false;
        }
    }
    if (startPeriod == endPeriod){
        if (startHr > endHr){
            dateValid = false;
        }
        else if (startMin > endMin){
            dateValid = false;
        }
    }
    */


}
