firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// Adds all the projects the logged in user is a part of to the his/her homepage
		const welcomeText = document.getElementById("welcome_text")
		console.log(document)
		firebaseRef.child(`Users/${getUsername(user.email)}`)
				   .once('value').then(function(snapshot) {
						const username = snapshot.child('Username').val()

						// Upadate username at the top of the screen depending on user
						welcomeText.innerHTML = "Welcome, " + username

						addProjectsToHomePage(username)
				  })
				  // Event listener is then set up to see if any projects are trying to be accessed
				  // If yes, alter projectpage.html to suit the called project's information
				   .then(function() {
						const projects = document.getElementsByClassName("dash_project")
						
						setTimeout(function () {
							Array.from(projects).forEach(project => getProjectDetails(project))
						}, 1000)
				  })
	} 
	else {
	  // No user is signed in.
	}
  });

function getProjectDetails(project){
	project.addEventListener("click", function(){
		firebaseRef.child(`Projects/${project.id}`)
		.once('value').then(async function(snapshot) {
			const projectName = snapshot.child('ProjectName').val(),
				  description = snapshot.child('Description').val(),
				  members = snapshot.child('Members').val()  // Object containing all the students
			
			// Still got problems here, basically the logic is ran first before page is even loaded
			const newPromise = new Promise(function(resolve, reject) {
				window.location.href = "../html/projectpage.html"
				resolve()
			})

			newPromise.then(function() {

				if (document.readyState === "complete") {
					const projectField = document.getElementById("projectName"),
					descriptionField = document.getElementById("description")

					projectField.textContent = projectName
					descriptionField.textContent = description
					Object.entries(members).forEach(member => {addMembers(member)})
				}
				
			})
		})
	});
}

function addMembers(member) {
	var membersName = document.getElementById("member_name"),
		add_member_template = document.getElementById('add_member_template'),
		member_field = document.getElementById('team_card_footer'),
		duplicate = add_member_template.cloneNode(true)

	membersName.textContent = member[0]
	duplicate.id = member[0]
	member_field.append(clone);
}

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

	// Store project information under Projects
	firebaseRef.child(`Projects/${projectName}`).set({
		ProjectName: projectName,
        Description: description,
        StartDate: startDate,
        EndDate: endDate,
        TeacherInCharge: getUsername(user.email)
	})
	
	// Update projects the current user is in charge of
	firebaseRef.child(`Users/${getUsername(user.email)}/Projects/${projectName}`).update({
		ProjectName: projectName
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
		const projectName = snapshot.child('ProjectName').val(),
			  startDate = snapshot.child('StartDate').val(),
			  endDate = snapshot.child('EndDate').val(),
			  teacher = snapshot.child('TeacherInCharge').val(),

			  dashboard = document.getElementById("dash_container"),
			  newDiv = document.createElement("div"),
			  newH2 = document.createElement("h2"),
			  newP = document.createElement("p")
			  imgEdit = document.createElement("input")
			  imgDelete = document.createElement("delete")
			  footerDiv = document.createElement("div")


		dashboard.appendChild(newDiv)
		dashboard.appendChild(footerDiv)
		newDiv.appendChild(newH2)
		newDiv.appendChild(newP)
		// footerDiv.appendChild(imgEdit)
		// footerDiv.appendChild(imgDelete)

		newDiv.className = "dash_project"
		newDiv.id = `${projectName}`
		newH2.className = "dash_project_head"
		newH2.textContent = project[0]

		newP.className = "project_summary"
		newP.textContent = `Lecturer: ${teacher} | Start: ${startDate} | End: ${endDate}`
		
		/* Not working
		footerDiv.className = "action_pane"
		imgEdit.type="image"
		imgEdit.src="../imgs/edit-16.png"
		imgEdit.id="edit_project"
		imgEdit.class="std_component"

		imgEdit.type="image"
		imgDelete.src="../imgs/delete-16.png"
		imgDelete.id="edit_project"
		imgDelete.class="std_component"
		*/
	})
}