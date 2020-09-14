const firebaseRef = firebase.database().ref()

function signup() {
	var	userEmail = String(document.getElementById("Email").value),
        userPass = String(document.getElementById("Password").value),
		userConfirmPass = String(document.getElementById("ConfirmPassword").value),
		userRole = String(document.getElementById("user_type").value)

	// sign up the user
	if (userPass === userConfirmPass && userPass.length >= 6) {
		var result = firebase.auth().createUserWithEmailAndPassword(userEmail, userPass),
			errorFound = false

		result.catch(function(error) {
			var errorCode = error.code
			var errorMessage = error.message

			console.log(errorCode)
			window.alert(errorMessage)
			errorFound = true
		})

		if (!errorFound) {
			result.then(() => {
				writeUserData(userEmail, userRole)

				window.alert("Sign Up successful!")
				// Bring the user to the home page after successful sign up
				window.location.href = "../html/home.html";
			})
		}
	}
	else if (userPass.length < 6) {
		window.alert("Password needs to be at least 6 characters long")
	}
	else if (userPass !== userConfirmPass) {
		window.alert("Password does not match Confirm Password")
	}
}

function writeUserData(email, userRole) {
	var username;
	for (i = 0; i < email.length; i++) {
		if (email[i] === "@") {
			username = email.slice(0, i)
			break
		}
	}
	firebaseRef.child(`User/${userRole}/${username}`).set({
		Username: username,
		Email: email,
	})
}
//login page
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
		window.alert("User signed in.");

  } else {
    // No user is signed in.

  }
});

function login() {
	var userEmail = String(document.getElementById("userEmail").value);
	var userPass = String(document.getElementById("userPass").value);

	firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
	window.alert("Error :" + errorMessage);
});

}

function logout(){
	firebase.auth().signOut().then(function() {
		window.alert('Signed Out')
		window.location.href = "../html/login.html";
	}, function(error) {
		window.alert('Sign Out Error', error)
	});
}
