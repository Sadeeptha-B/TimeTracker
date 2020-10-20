firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// Adds all the projects the logged in user is a part of to the his/her homepage
		firebaseRef.child(`Users/${getUsername(user.email)}`)
		.once('value').then(function(snapshot) {
			const username = snapshot.child('Username').val()

			updateArchivesPage(username)
		})
	}
	else {
	  // No user is signed in.
	}
});

function updateArchivesPage(username) {
	const welcomeText = document.getElementById("welcome_text")

	// Update username at the top of the screen depending on user
	if (welcomeText) {
		welcomeText.innerHTML = "Welcome, " + username
	}

	// // Add all the completed projects of the user to the archives page
	populateProjectsToArchives(username)
}

function populateProjectsToArchives(username) {
    firebaseRef.child(`Users/${username}`)
	.once('value').then(function(snapshot) {
		const projects = snapshot.child('Projects').val(),
			  role = snapshot.child('Role').val()

		Object.entries(projects).forEach(project => {
			firebaseRef.child(`Projects/${project[1].ProjectName}`).once("value").then(function(snapshot) {
				var projectData = snapshot.val()

				if (projectData.Completed && role === 'Teacher') {
					addProject(project, projectData, role)
				}
			})
		})
	})
}