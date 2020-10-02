firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// Adds all the projects the logged in user is a part of to the his/her homepage
		firebaseRef.child(`Users/${getUsername(user.email)}`)
		.once('value').then(function(snapshot) {
			const username = snapshot.child('Username').val(),
					role = snapshot.child('Role').val()

			// Update the currnent page such as removing/adding restricted buttons
			updatePage(username, role)

			try { updateProjectPage() } catch(err) { ; }

			try { updateTaskPage() } catch(err) { ; }

			// Add all the projects of the user to the home page
			addProjectsToHomePage(username)
			populateAll(localStorage.getItem("projectName"));
		})
		// Event listener is then set up to see if any projects are trying to be accessed
		// If yes, alter projectpage.html to suit the called project's information
		.then(function() {
			const projects = document.getElementsByClassName("dash_project"),
				  tasks = document.getElementById("task_card_body")
			
			if (projects != null) {
				setTimeout(function () {
					Array.from(projects).forEach(project => addProjectsEventListener(project))
				}, 1000)
			}
				
			if (tasks != null) {
				setTimeout(function() {
					Array.from(tasks.getElementsByClassName("task")).forEach(task => addTasksEventListener(task))
				}, 1000)
			}
		})
		console.log(localStorage.getItem("projectName"))
		console.log(localStorage.getItem("description"))
		console.log(localStorage.getItem("members"))
		console.log(localStorage.getItem("taskName"))
		console.log(localStorage.getItem("taskDescription"))
	}
	else {
	  // No user is signed in.
	}
  });

function updatePage(username, role) {
	const welcomeText = document.getElementById("welcome_text"),
		  addTaskButton = document.getElementById("new_task_button"),
		  assignTaskButton = document.getElementById("assign_task_button"),
		  timeInputButton = document.getElementById("time_input_button"),
		  addMemberButton = document.getElementById("add_member"),
		  editDescriptionButton = document.getElementById("edit_desc")

	// Upadate username at the top of the screen depending on user
	if (welcomeText != null) {
		welcomeText.innerHTML = "Welcome, " + username
	}

	// Remove the add and assign task button for teachers but show for students
	if (addTaskButton != null && assignTaskButton != null) {
		if (role === 'Teacher') {
			addTaskButton.style.display = "none"
			assignTaskButton.style.display = "none"
		}
		else if (role === 'Student'){
			addTaskButton.style.display = "block"
			assignTaskButton.style.display = "block"
		}
	}

	// Remove time input button for teachers but show for students
	if (timeInputButton != null) {
		if (role === 'Teacher') {
			timeInputButton.style.display = "none"
		}
		else if (role === 'Student') {
			timeInputButton.style.display = "block"
		}
	}

	// Remove add member button for students but show for teachers
	if (addMemberButton != null && editDescriptionButton != null) {
		if (role === 'Teacher') {
			addMemberButton.style.display = "block"
			editDescriptionButton.style.display = "block"
		}
		else if (role === 'Student') {
			addMemberButton.style.display = "none"
			editDescriptionButton.style.display = "none"
		}
	}
}

function addProjectsEventListener(project){
	project.addEventListener("click", function(){
		firebaseRef.child(`Projects/${project.id}`)
		.once('value').then(function(snapshot) {
			const projectName = snapshot.child('ProjectName').val(),
				  description = snapshot.child('Description').val(),
				  members = snapshot.child('Members').val()  // Object containing all the students
				  
			localStorage.setItem("projectName", projectName)
			localStorage.setItem("description", description)
			localStorage.setItem("members", JSON.stringify(members))
			window.location.href = "../html/projectpage.html"
		})
	});
}

function addTasksEventListener(task){
	task.addEventListener("click", function(){
		firebaseRef.child(`Tasks/${task.id}`)
		.once('value').then(function(snapshot) {
			const taskName = snapshot.child('TaskName').val(),
				  taskDescription = snapshot.child('Description').val(),
				  projectName = document.getElementById("project_name").textContent,
				  projectDescription = document.getElementById("description").textContent,
				  members = document.getElementById("member_card_content").getElementsByClassName("member")

			var membersObject = {}
			// I need to figure out how to put members in the localStorage
			// Maybe try to loop through all the members (getElementsByClassName) and get the textContent
			// Then somehow make a JSON/object with this format
			// {"hban0006":{"Username":"hban0006"},"josephloo":{"Username":"josephloo"}}
			localStorage.setItem("projectName", projectName)
			localStorage.setItem("description", projectDescription)
			localStorage.setItem("taskName", taskName)
			localStorage.setItem("taskDescription", taskDescription)
			Array.from(members).forEach(member => {
				const name = member.textContent
				membersObject[name] = {"Username": name}
			})
			localStorage.setItem("member", JSON.stringify(membersObject))

			window.location.href = "../html/taskpage.html"
		})
	});
}

function updateProjectPage() {
	const projectField = document.getElementById("project_name"),
		  descriptionField = document.getElementById("description")

	// Update the fields with project information
	projectField.textContent = localStorage.getItem("projectName")
	descriptionField.textContent = localStorage.getItem("description")

	Object.entries(JSON.parse(localStorage.getItem("members"))).forEach(member => {addMembers(member)})
}

function addMembers(member) {
	var member_field = document.getElementById('member_card_content'),
		newDiv = document.createElement("div")

	member_field.appendChild(newDiv)
	newDiv.id = member[1].Username
	newDiv.className = "member"
	newDiv.textContent = member[1].Username
}

async function createProject(){
    var projectName = document.getElementById("ProjectName").value,
        description = document.getElementById("Description").value,

        //project start
        startDay =  document.getElementById("start_day").value,
        startMonth = document.getElementById("start_month").value,
        startYear = document.getElementById("start_year").value,
        
        // Putting into DD/MM/YYYY format
        startDate = startDay + "/" + startMonth + "/" + startYear,

        //project end
        endDay = document.getElementById("end_day").value,
        endMonth = document.getElementById("end_month").value,
        endYear = document.getElementById("end_year").value,

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
	firebaseRef.child(`Projects/${project[1].ProjectName}`).once("value").then(function(snapshot) {
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