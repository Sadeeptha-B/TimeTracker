const firebaseReference = firebase.database().ref()

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		firebaseRef.child(`Users/${getUsername(user.email)}`)
				   .once('value').then(function(snapshot) {
						const username = snapshot.child('Username').val()
						addProjectsToHomePage(username)
				  })
	} else {
	  // No user is signed in.
	}
  });

async function createProject(){
    var projectName = String(document.getElementById("ProjectName").value),
        description = String(document.getElementById("Description").value),

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

	var user = await firebase.auth().currentUser
    
	firebaseReference.child(`Users/${getUsername(user.email)}/Projects/${projectName}`).update({
		ProjectName: projectName
	})
	
    firebaseReference.child(`Projects/${projectName}`).set({
		ProjectName: projectName,
        Description: description,
        StartDate: startDate,
        EndDate: endDate,
        TeacherInCharge: getUsername(user.email)
    })
    
    window.alert("Project Created!")
    // Bring the user to the home page after successful sign up
    window.location.href = "../html/home-teacherview.html";
}

function addProjectsToHomePage(username) {
    firebaseRef.child(`Users/${username}`)
			   .once('value').then(function(snapshot) {
					const projects = snapshot.child('Projects').val()
					Object.entries(projects).forEach(project => {addProject(project)})
				})
}

function addProject(project) {
	firebaseRef.child(`Projects/${project[0]}`).once("value").then(function(snapshot) {
		const startDate = snapshot.child('StartDate').val(),
			  endDate = snapshot.child('EndDate').val(),
			  teacher = snapshot.child('TeacherInCharge').val(),

			  dashboard = document.getElementById("dash_project"),
			  newDiv = document.createElement("div"),
			  newH2 = document.createElement("h2"),
			  newP = document.createElement("p")

		dashboard.appendChild(newDiv)
		newDiv.appendChild(newH2)
		newDiv.appendChild(newP)

		newDiv.className = "dash_project"
		newH2.className = "dash_project_head"
		newH2.textContent = project[0]

		newP.className = "project_summary"
		newP.textContent = `Lecturer: ${teacher} | Start: ${startDate} | End: ${endDate}`
		
	})
}