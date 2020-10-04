var template = document.getElementById("timelog_template");
var content = document.getElementById("logs_card_body");



document.getElementById("save_time_log").addEventListener('click', function(){
    getDataforPopulation();
});



function getDataforPopulation(){
    var startDate = document.getElementById("start_day");
    var startMonth = document.getElementById("start_month");
    var startYear = document.getElementById("start_year");
    var startHr = document.getElementById("start_hr");
    var startMin = document.getElementById("start_min");
    var startPeriod = document.getElementById("start_period")
    var start;
    if (startHr == 12) { // 12am
        start = new Date(startYear, startMonth-1, startDate, startPeriod, startMin)
    }
    else{
        start = new Date(startYear, startMonth-1, startDate, startHr+startPeriod, startMin)
    }

    var endDate = document.getElementById("end_day"); 
    var endMonth = document.getElementById("end_month");
    var endYear = document.getElementById('end_year');
    var endHr = document.getElementById('end_hr');
    var endMin = document.getElementById('end_min');
    var endPeriod = document.getElementById('end_period');
    var end;
    if (endHr == 12) { // 12am
        end = new Date(endYear, endMonth-1, endDate, endPeriod, endMin)
    }
    else{
        end = new Date(endYear, endMonth-1, endDate, endHr+endPeriod, endMin)
    }

    var workTime = end.getTime() - start.getTime();
    var dateValid = end.getTime() > start.getTime();
    // getTime() gives you the time elapsed after a fixed point in time in milliseconds, use this to get contribution time
    if (!dateValid){
        displayError("Task cannot end before it starts, or end on the same day as the start date",commonTaskError);
        return;
    }

    if (dateValid){
        var workHrs = ((time/1000)/60).toPrecision(3);
        print(workHrs);
        // toPrecision(x) rounds value to x-1 decimal places
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
