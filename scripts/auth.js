// signup
function signup() {
    var signupForm = document.getElementById("signup_form"),

        username = document.getElementById("Username").value,
        userEmail = document.getElementById("Email").value,
        userPass = String(document.getElementById("Password").value),
        userConfirmPass = String(document.getElementById("ConfirmPassword").value);
    
	// sign up the user
	if (userPass === userConfirmPass && userPass.length >= 6) {
		firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).then(cred=> {
			window.alert("Sign Up successful!")
			// Bring the user to the log in page to log in after successful sign up
			window.location.href = "../html/login.html";
		})
	}
	else if (userPass !== userConfirmPass) {
		window.alert("Password does not match Confirm Password")
	}
	else if (userPass.length < 6) {
		window.alert("Password needs to be at least 6 characters long")
	}
}
