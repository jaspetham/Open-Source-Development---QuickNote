/* initialise variables */

var inputTitle = document.querySelector('.new-note input');
var inputBody = document.querySelector('.new-note textarea');

var noteContainer = document.querySelector('.note-container');


var clearBtn = document.querySelector('.clear');
var addBtn = document.querySelector('.add');
var emptyBtn = document.querySelector('.empty');
var playBtn = document.querySelector('.play');
/*  add event listeners to buttons */

addBtn.addEventListener('click', addNote);
clearBtn.addEventListener('click', clearAll);
emptyBtn.addEventListener('click',emptyNote);
playBtn.addEventListener('click',playNote);
/* generic error handler */
function onError(error) {
  console.log(error);
}

/* display previously-saved stored notes on startup */

initialize();

function initialize() {
  var gettingAllStorageItems = browser.storage.local.get(null);
  gettingAllStorageItems.then((results) => {
    var noteKeys = Object.keys(results);
    for (let noteKey of noteKeys) {
      var curValue = results[noteKey];
      displayNote(noteKey,curValue);
    }
  }, onError);
}

/* Empty a note */
function emptyNote(){
	var noteTitle = inputTitle.value;
  	var noteBody = inputBody.value;
	inputTitle.value = '';
	inputBody.value='';
	console.log('Current note content has been cleared successfully');
}

function playNote(){
	title = document.getElementById('title').value;
	content = document.getElementById('content').value;
	if (content === ''){
		responsiveVoice.speak("Title is: " + title +", Content is: empty ");
	}else{
    responsiveVoice.speak("Title is: " + title +", Content are: "+content);
	}
}

/* Add a note to the display, and storage */

function addNote() {
  var noteTitle = inputTitle.value;
  var noteBody = inputBody.value;
  var gettingItem = browser.storage.local.get(noteTitle);
  gettingItem.then((result) => {
    var objTest = Object.keys(result);
    if(objTest.length < 1 && noteTitle !== '' && noteBody !== '') 	{
      inputTitle.value = '';
      inputBody.value = '';
      storeNote(noteTitle,noteBody);
    	}
    else if(objTest.length < 1 && noteTitle !== '' && noteBody == '') 	{
      inputTitle.value = '';
      inputBody.value = '';
      storeNote(noteTitle,noteBody);
	  console.log('Note has been added sucessfully');
    	}

  }, onError);
}

/* function to store a new note in storage */

function storeNote(title, body) {
  var storingNote = browser.storage.local.set({ [title] : body });
  storingNote.then(() => {
    displayNote(title,body);
	console.log('Note stored successfully');
  }, onError);
 
}

/* function to display a note in the note box */

function displayNote(title, body) {

  /* create note display box */
  var note = document.createElement('div');
  var noteDisplay = document.createElement('div');
  var noteH = document.createElement('h2');
  var notePara = document.createElement('p');
  var deleteBtn = document.createElement('button');
  var editBtn = document.createElement('button');
  var playBtn = document.createElement('button');
  var dlBtn = document.createElement('button');
  var clearFix = document.createElement('div');

  note.setAttribute('class','note');

  noteH.textContent = title;
  notePara.textContent = body;
  deleteBtn.setAttribute('class','delete');
  editBtn.setAttribute('class','reset');
  deleteBtn.textContent = 'Delete note';
  editBtn.textContent = 'Edit note';
  playBtn.textContent = 'Play';
  clearFix.setAttribute('class','clearfix');

  noteDisplay.appendChild(noteH);
  noteDisplay.appendChild(notePara);
  noteDisplay.appendChild(deleteBtn);
  noteDisplay.appendChild(editBtn);
  noteDisplay.appendChild(playBtn);
  noteDisplay.appendChild(clearFix);

  note.appendChild(noteDisplay);

  /* set up listener for the delete functionality */

  deleteBtn.addEventListener('click',(e) => {
    const evtTgt = e.target;
    evtTgt.parentNode.parentNode.parentNode.removeChild(evtTgt.parentNode.parentNode);
    browser.storage.local.remove(title);
	console.log('Current note has been deleted.');
  })
  
  /* play title and content */
   playBtn.addEventListener('click',(e) => {
   responsiveVoice.speak("title is," + title +", content are,"+body);
  })
  


  /* create note edit box */
  var noteEdit = document.createElement('div');
  var noteTitleEdit = document.createElement('input');
  var noteBodyEdit = document.createElement('textarea');
  var clearFix2 = document.createElement('div');

  var updateBtn = document.createElement('button');
  var cancelBtn = document.createElement('button');

  updateBtn.setAttribute('class','update');
  updateBtn.textContent = 'Update note';
  cancelBtn.setAttribute('class','cancel');
  cancelBtn.textContent = 'Cancel update';

  noteEdit.appendChild(noteTitleEdit);
  noteTitleEdit.value = title;
  noteEdit.appendChild(noteBodyEdit);
  noteBodyEdit.textContent = body;
  noteEdit.appendChild(updateBtn);
  noteEdit.appendChild(cancelBtn);

  noteEdit.appendChild(clearFix2);
  clearFix2.setAttribute('class','clearfix');

  note.appendChild(noteEdit);

  noteContainer.appendChild(note);
  noteEdit.style.display = 'none';

  /* set up listeners for the update functionality */

  editBtn.addEventListener('click',() => {
    noteDisplay.style.display = 'none';
    noteEdit.style.display = 'block';
	console.log('Editing the current selected note');
  })

  cancelBtn.addEventListener('click',() => {
    noteDisplay.style.display = 'block';
    noteEdit.style.display = 'none';
    noteTitleEdit.value = title;
    noteBodyEdit.value = body;
	console.log('Canceled editing current note.');
  })

  updateBtn.addEventListener('click',() => {
    if(noteTitleEdit.value !== title || noteBodyEdit.value !== body) {
      updateNote(title,noteTitleEdit.value,noteBodyEdit.value);
      note.parentNode.removeChild(note);
    } 
  });
}


/* function to update notes */

function updateNote(delNote,newTitle,newBody) {
  var storingNote = browser.storage.local.set({ [newTitle] : newBody });
  storingNote.then(() => {
    if(delNote !== newTitle) {
      var removingNote = browser.storage.local.remove(delNote);
      removingNote.then(() => {
        displayNote(newTitle, newBody);
		console.log('Note fail to update');
      }, onError);
    } else {
      displayNote(newTitle, newBody);
	  console.log('Note has been updated');
    }
  }, onError);
}

/* Clear all notes from the display/storage */

function clearAll() {
  while (noteContainer.firstChild) {
      noteContainer.removeChild(noteContainer.firstChild);
  }
  browser.storage.local.clear();
  console.log('Deleted all existing note');
}
