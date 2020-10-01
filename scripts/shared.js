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


function setDisplayNone(elem){
    elem.style.display = "none";
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