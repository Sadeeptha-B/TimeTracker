const firebaseRef = firebase.database().ref()

function create(){
    var projectName = String(document.getElementById("Project Name").value),
        description = String(document.getElementById("Description").value),
        //students =  String(document.getElementById("Students").value),

        //project start
        startDay =  String(document.getElementById("Start Day").value),
        startMonth = String(document.getElementById("start_month").value),
        startYear = String(document.getElementById("Start Year").value),
        //temporary
        startDate = String(document.getElementById("Start Day").value + " " + document.getElementById("start_month").value + " " + document.getElementById("Start Year").value),

        //project end
        endDay = String(document.getElementById("End Day").value),
        endMonth = String(document.getElementById("end_month").value),
        endYear = String(document.getElementById("End Year").value),
        //temporary
        endDate = String(document.getElementById("End Day").value + " " + document.getElementById("end_month").value + " " + document.getElementById("End Year").value),

    if (description.length == 0){
        description = "Please edit description.";
    }

    firebaseRef.child(`Projects/${projectName}`).set({
		ProjectName = projectName,
        Description = description,
        StartDate = startDate,
        EndDate = endDate,
	})

    window.alert("Project Created!")
    // Bring the user to the home page after successful sign up
    window.location.href = "../html/home.html";
}