// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

var firebaseConfig = {
    apiKey: "AIzaSyAFzBnMY1ouf3kKCBzMWsOIb8DUJl-ur6o",
    authDomain: "time-tracker-web-applica-52250.firebaseapp.com",
    databaseURL: "https://time-tracker-web-applica-52250.firebaseio.com",
    projectId: "time-tracker-web-applica-52250",
    storageBucket: "time-tracker-web-applica-52250.appspot.com",
    messagingSenderId: "469326104071",
    appId: "1:469326104071:web:d7e6193b4efe7152828ca2",
    measurementId: "G-B4244K0E5J"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);


/* Search functionality */

/* Provide Searchbar and Array of data to search from */
function searchSingle(searchBar, searchSpace){
    var searchValue = searchBar.value.toLowerCase();
    var foundArray = [];

    for (i=0; i < searchSpace.length; i++){
        var item = searchSpace[i].toLowerCase();
        var itemCheck = item.indexOf(searchValue);
        var found = indexToBoolean(itemCheck);

        if(found){
            foundArray.push(item);
        }
    }
    return foundArray;
}

/* Provide searchbar and pass in an array of objects of which keys need to be 
searched.
*/
function searchMultiple(searchBar, objArray){
    var searchValue = searchBar.value.toLowerCase();
    var foundArray=[];

    for (i= 0; i< objArray.length; i++){
        var obj = objArray[i];
        var criteria = Object.keys(obj);
        var found = false;

        for (j=0; j < criteria.length; j++){
            var item = obj[criteria[j]].toLowerCase();
            var itemCheck = item.indexOf(searchValue);
            found = found || indexToBoolean(itemCheck)
        }

        if (found){
            foundArray.push(objArray[i]);
        }
    }   

    return foundArray;
}


/* Alerts */
    function displayConfirmAlert(msg){
        var elem = document.querySelector("div[class^='alert confirmation_alert']")
        document.getElementById("confirm_msg").innerText = msg;

        elem.setAttribute("class", "alert confirmation_alert show")
        setTimeout(function(){
            elem.setAttribute("class", "alert confirmation_alert hide")
        }, 5000);
    }

    function displayErrorAlert(msg){
        var elem = document.querySelector("div[class^='alert error_alert']")
        document.getElementById("error_msg").innerText = msg;

        elem.setAttribute("class", "alert error_alert show")

        //Will be removed once close is clickable
        setTimeout(function(){
            elem.setAttribute("class", "alert confirmation_alert hide")
        }, 5000);
    }

    function closeAlert(){
        var elems = document.querySelectorAll("div[class^='alert']")

        for (i=0; i < elems.length; i++){
            elems[i].classList.toggle("hide")
        }
    }


function cloneElement(elem, parent){
    var clone = elem.cloneNode(true);
    parent.appendChild(clone);
    return clone;
}

var customColorFunction = function(schemeColors){
    var myColors = [ "rgba(178, 102, 255)",
                     "rgba(153, 255, 204)",
                     "rgba(204, 0, 102)"  ,
                     "rgba(204, 204, 0)"];

    Array.prototype.push.apply(schemeColors, myColors);
    return schemeColors;
}


/* Modal Controls */
function openModal(modalElem, isTextModal, ...editableElems){
    if (isTextModal == true){
        for (i= 0; i < editableElems.length; i++){
            editableElems[i].value = "";
        }
    } 
    modalElem.style.display = "flex";
}


function openConfigurableModal(modalElem, isTextModal, isCreateMode, ...editableElems){
    var createModeElems = document.querySelectorAll('[id^=create_mode]');
    var editModeElems = document.querySelectorAll('[id^=edit_mode]');


    for (i =0; i< createModeElems.length;i++){
        createModeElems[i].classList.toggle('visible', isCreateMode);
        createModeElems[i].classList.toggle('hidden', !isCreateMode);
    }

    for (i =0; i<  editModeElems.length;i++){
        editModeElems[i].classList.toggle('visible', !isCreateMode);
        editModeElems[i].classList.toggle('hidden', isCreateMode);
    }  
    openModal(modalElem, isTextModal, ...editableElems);
}


function closeModal(modalElem){
   setDisplayNone(modalElem);
}




/* Display Controls */
function setDisplayNone(elem){
    elem.style.display = "none";
}

function setDisplayFlex(elem){
    elem.style.display="flex";
}

function displayError(errorMsg, errorElement){
    errorElement.innerText = errorMsg;
    errorElement.style.display="block";
}


function clearErrors(...errorDivs){
    for (i=0; i< errorDivs.length; i++){
        setDisplayNone(errorDivs[i]);
    }
}


Date.prototype.onlyDate = function () {
    var d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
}


/* Helper function */
function indexToBoolean(index){
    var value; 
     if (index === -1) {
         value = false;
     } else {
         value = true;
     }
     return value;
 };














