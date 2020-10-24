const firebaseRef = firebase.database().ref()

function login() {
	var userEmail = String(document.getElementById("userEmail").value),
		userPass = String(document.getElementById("userPass").value)

	firebase.auth().signInWithEmailAndPassword(userEmail, userPass)
	.then(function() {
		// User is signed in.
		getLoginPage()
	})
	.catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// ...
		console.log(errorCode)
		displayErrorAlert("Error :" + errorMessage);
	});
}

function logout(){
	firebase.auth().signOut()
	.then(function() {
		removeLocalStorageItem()
		window.location.href = "../index.html";
	})
	.catch(function(error) {
		displayErrorAlert("Sign Out Error" + error);
	});
}

async function signup() {
	const userEmail = String(document.getElementById("Email").value),
    	  userPass = String(document.getElementById("Password").value),
		  userConfirmPass = String(document.getElementById("ConfirmPassword").value)

	// Sign up the user
	if (userPass === userConfirmPass && userPass.length >= 6) {
		var user = await firebase.auth().currentUser

		try {
			if (user) {
				createAccount(userEmail, userPass, 'Teacher')
			}
			else {
				createAccount(userEmail, userPass, 'Student')
			}
		}
		catch(err) {
			displayErrorAlert(err)
			location.reload()
		}

	}
	else if (userPass.length < 6) {
		displayErrorAlert("Password needs to be at least 6 characters long")
		// window.alert("Password needs to be at least 6 characters long")
	}
	else if (userPass !== userConfirmPass) {
		displayErrorAlert("Password does not match Confirm Password")
		// window.alert("Password does not match Confirm Password")
	}
}

async function getLoginPage() {
	var user = await firebase.auth().currentUser
	firebaseRef.child(`Users/${getUsername(user.email)}`)
	.once('value').then(function(snapshot) {
		const role = snapshot.child("Role").val()

		if (role === 'Admin') {
			window.location.href = "html/home-adminview.html"
		}
		else {
			window.location.href = "html/home.html"
		}

   })

   removeLocalStorageItem()
}

async function getHomePage() {
	var user = await firebase.auth().currentUser
	firebaseRef.child(`Users/${getUsername(user.email)}`)
	.once('value').then(function(snapshot) {
		const role = snapshot.child("Role").val()

		if (role === 'Admin') {
			window.location.href = "../html/home-adminview.html"
		}
		else {
			window.location.href = "../html/home.html"
		}

   })

   removeLocalStorageItem()
}

function removeLocalStorageItem() {
	localStorage.removeItem("projectName")
	localStorage.removeItem("description")
	localStorage.removeItem("members")
	localStorage.removeItem("taskName")
	localStorage.removeItem("taskDescription")
	localStorage.removeItem("assignedTo")
}

function createAccount(userEmail, userPass, userRole) {
	try {
		// Enters the information into the database
		writeUserData(userEmail, userPass, userRole)

		// When account is created, users is automatically logged in,
		// so the user is straight away logged out in order to prevent unintentional login
		firebase.auth().createUserWithEmailAndPassword(userEmail, userPass)
		.then(function() {
			firebase.auth().signOut()
			.then(function() {
				displayConfirmAlert("Sign Up Successful")
				// window.alert("Sign Up Successful")

				// This means Admin is creating a teacher account
				if (userRole === 'Teacher') {
					firebase.auth().signInWithEmailAndPassword('timetracker999@gmail.com', 'admin123!')
					.then(function() {
						// Bring admin back to the home page after successful sign up of teacher
						window.location.href = "../html/home-adminview.html";
					})
				}
				else {
					// Bring the student back to the login page after successful sign up to log in
					window.location.href = "../index.html";
				}
			})
		})
		.catch(function(error) {
			var errorCode = error.code
			var errorMessage = error.message

			console.log(errorCode)
			displayErrorAlert(errorMessage);
			// window.alert(errorMessage)
		})
	}
	catch(err) {
		throw err
	}
}

function writeUserData(email, password, role) {
	var username = getUsername(email)

	if (isSchoolAccount(email) && (getRole(email) === role)) {
		firebaseRef.child(`Users/${username}`).set({
			Username: username,
			Email: email,
			Role: role,
			Password: password
		})

		if (role === 'Student') {
			firebaseRef.child(`Students/${username}`).set({
				Username: username,
				Password: password
			})
		}


	}
	else if (!isSchoolAccount(email)) {
		throw 'Please use your school email account. Please try again.'
	}
	else if (getRole(email) !== role && role === 'Student') {
		throw 'As a student, you are not allowed to create a teacher account.'
	}
	else if (getRole(email) !== role && role === 'Teacher') {
		throw 'As an admin, you can only create teacher accounts.'
	}
}

function deleteTeacher(){
	teacher = String(document.getElementById("delete_username_input").value);
	localStorage.setItem("teacher",teacher);

	firebaseRef.child(`Users/${localStorage.getItem("teacher")}`).once('value')
		.then(function(snapshot) {
			localStorage.setItem("role",String(snapshot.child('Role').val()));
			localStorage.setItem("userEmail",String(snapshot.child('Email').val()));
			localStorage.setItem("password",String(snapshot.child('Password').val()));
		}).then(function() {
			firebase.auth().signOut().then(function() {
				userEmail = localStorage.getItem("userEmail");
				password = localStorage.getItem("password");
				firebase.auth().signInWithEmailAndPassword(userEmail, password).then(async function() {
					var user = await firebase.auth().currentUser;
					user.delete()
					displayConfirmAlert("Teacher Account Deleted")
				}).then(function() {
					// User deleted.
						firebase.auth().signInWithEmailAndPassword('timetracker999@gmail.com', 'admin123!').then(function() {
						getHomePage();
						localStorage.removeItem("userEmail");
						localStorage.removeItem("password");
						localStorage.removeItem("teacher");
						}).catch(function(error) {
							// An error happened.
							displayErrorAlert("Error in deleting teacher account.")
						});
					})

			})
		})
}

function editTeacher(){
	email = String(document.getElementById("Email").value);
	newUsername = String(document.getElementById("Username").value);
	newPass = String(document.getElementById("Password").value);
	newConfirmPass = String(document.getElementById("ConfirmPassword").value);


	firebaseRef.child(`Users/${getUsername(email)}`).once('value')
	.then(function(snapshot) {
			localStorage.setItem("PASSWORD",String(snapshot.child('Password').val()));
			localStorage.setItem("EMAIL",String(snapshot.child('Email').val()));
		}).then(function(){
			if (localStorage.getItem("EMAIL") == email){
				if(newPass == newConfirmPass){
					localStorage.setItem("newEmail",String(newUsername + "@monash.edu"));
					localStorage.setItem("newPass",newPass);
					firebaseRef.child(`Users/${getUsername(email)}`).update({
						Email: newUsername + "@monash.edu",
						Username: newUsername,
						Password: newPass
					}).then(function() {
							firebase.auth().signOut()
							.then(async function() {
								firebase.auth().signInWithEmailAndPassword(localStorage.getItem("EMAIL"),localStorage.getItem("PASSWORD"));
								var user = await firebase.auth().currentUser;
								user.updateEmail(localStorage.getItem("newEmail"));
								user.updatePassword(localStorage.getItem("newPass"))
								.then(function(){
									firebase.auth().signOut();
									firebase.auth().signInWithEmailAndPassword('timetracker999@gmail.com','admin123!')
									.then(function(){
										displayConfirmAlert("Updated teacher account.")
										window.location.href = "../html/home-adminview.html";
									}).catch(function(error){
										displayErrorAlert("Error in updating information of teacher.")

									})
								})
							})
						})
					}
				}
			})
		}
