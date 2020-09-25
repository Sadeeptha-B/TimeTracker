const firebaseReference = firebase.database().ref()

function createProject(){
    var projectName = String(document.getElementById("ProjectName").value),
        description = String(document.getElementById("Description").value),
        //students =  String(document.getElementById("Students").value),

        //project start
        startDay =  String(document.getElementById("start_day").value),
        startMonth = String(document.getElementById("start_month").value),
        startYear = String(document.getElementById("start_year").value),
        
        // Putting into DD/MM/YYYY format
        startDate = startDay + "/" + startMonth + "/" + startYear,

        //project end
        endDay = String(document.getElementById("end_day").value),
        endMonth = String(document.getElementById("end_month").value),
        endYear = String(document.getElementById("end_year").value),

        // Putting into DD/MM/YYYY format
        endDate = endDay + "/" + endMonth + "/" + endYear

    if (description.length == 0){
        description = "N/A";
    }

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            window.alert(user)
        }
    })
    firebaseReference.child(`Projects/${projectName}`).set({
		ProjectName: projectName,
        Description: description,
        StartDate: startDate,
        EndDate: endDate,
    })
    
    window.alert("Project Created!")
    window.alert(user)
    // Bring the user to the home page after successful sign up
    window.location.href = "../html/home.html";
}

function addProject() {

}