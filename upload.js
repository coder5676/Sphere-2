import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js'
const firebaseConfig = {
  apiKey: "AIzaSyBu5-fE69WdhHWBR7-2U3NGMm2YgGb6fgo",
  authDomain: "sphere-858fc.firebaseapp.com",
  projectId: "sphere-858fc",
  storageBucket: "sphere-858fc.appspot.com",
  messagingSenderId: "683722942494",
  appId: "1:683722942494:web:61517cb2450ef4284b260f"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
let pic = "";
let crid = "";
async function checkUsernameExists(email) {
  const usersRef = collection(db, "creators"); // Reference to the collection
  const q = query(usersRef, where("creatoremail", "==", email)); // Query for the specific username
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    console.log("Username exists!");
    const userInfo = querySnapshot.docs[0].data();
    pic = userInfo.profilepic;
    crid = querySnapshot.docs[0].id;
    joined(userInfo.creatorname, userInfo.creatoremail, userInfo.profilepic);
  } else {
    console.log("Username does not exist.");
    notjoined();

  }
  document.getElementById("waiting").style.display="none";

}
document.getElementById("ca").addEventListener("click", () => {
  document.getElementById("ca").style.backgroundColor = "black";
  document.getElementById("ca").style.color = "white";
  document.getElementById("cf").style.backgroundColor = "white";
  document.getElementById("cf").style.color = "black";
  document.getElementById("notepad").style.display = "flex";
  document.getElementById("flashcardpad").style.display = "none";
  document.getElementById("save").style.display = "block";
  document.getElementById("savefl").style.display = "none";
  document.getElementById("thumbnail").style.display = "flex";
  

})
document.getElementById("cf").addEventListener("click", () => {
  document.getElementById("cf").style.backgroundColor = "black";
  document.getElementById("cf").style.color = "white";
  document.getElementById("ca").style.backgroundColor = "white";
  document.getElementById("ca").style.color = "black";
  document.getElementById("flashcardpad").style.display = "flex";
  document.getElementById("notepad").style.display = "none";
  document.getElementById("savefl").style.display = "block";
  document.getElementById("save").style.display = "none";
  document.getElementById("thumbnail").style.display = "none";
 

})

document.getElementById("save").addEventListener("click", () => {
  const user = document.getElementById("chname").value;
  var selectelement = document.getElementById("domainselector");
  var selvalue = selectelement.options[selectelement.selectedIndex].value;
  const domain = selvalue;
  const heading = document.getElementById("heading").value;
  const imageurl = document.getElementById("imageurl").value;
  const content = document.getElementById("maincontent").value;
  const rdtime = document.getElementById("readtime").value;
  addArticle(user, heading, imageurl, content, domain, pic, rdtime);
})
async function addArticle(user, heading, imageurl, content, domain, pic, rdtime) {
  try {
    const docRef = await addDoc(collection(db, "articles"), {
      user: user,
      domain: domain,
      heading: heading,
      imageurl: imageurl,
      content: content,
      profilepic: pic,
      likes: [],
      crid: crid,
      readtime: rdtime,
      type: "article",
      timestamp: new Date()
    });
    console.log("Document written with ID: ", docRef.id);
    document.getElementById("uploadcnt").style.display = "flex";

  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
// Initialize Firebase

//checking login status//
let useremail = ""
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("waiting").style.display="flex";
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log("user is signed in");
      useremail = String(user.providerData[0].uid).slice(0, 6) + "@" + String(uid).slice(-4);
      checkUsernameExists(useremail);
      userlogined();
    } else {
      console.log("user is signed out")
      usersignedout();
    }
  });
});


/*adding the users*/
async function addcreator(creatoremail, creatorname, profilepic) {
  try {
    const docRef = await addDoc(collection(db, "creators"), {
      creatoremail: creatoremail,
      creatorname: creatorname,
      profilepic: profilepic,
      followers: []
    });
    cradded();
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}



let history = [];

function saveState() {
  history.push(document.getElementById('maincontent').value);
}
function opentextbox() {
  const textbox = document.getElementById("write");
  textbox.style.display = "flex";
}

function closetextbox() {
  const textbox = document.getElementById("write");
  textbox.style.display = "none";
}

function gettext(action, isInline = false) {
  const textbox = document.getElementById("textbox");
  const text = textbox.value.trim();
  const inlineClass = isInline ? ' class="inline-heading"' : '';
  return `<${action}${inlineClass}>${text}</${action}>\n`;
}

document.getElementById("closetextbox").addEventListener("click", () => closetextbox());

function show() {
  const a = document.getElementById("maincontent").value;
  document.getElementById("preview").innerHTML = a;
}

function addSaveEventListener(action, isInline = false) {
  const saveBtn = document.getElementById("savecurrent");
  saveBtn.onclick = null;

  saveBtn.onclick = function () {
    saveState();
    document.getElementById('maincontent').value += gettext(action, isInline);
    show();
    closetextbox();
  };
}

document.getElementById('addtext').addEventListener('click', function () {
  opentextbox();
  addSaveEventListener('p');
});

document.getElementById('addboldtext').addEventListener('click', function () {
  opentextbox();
  addSaveEventListener('h2');
});

document.getElementById('addimage').addEventListener('click', function () {
  opentextbox();
  const saveBtn = document.getElementById("savecurrent");
  saveBtn.onclick = null;
  saveBtn.onclick = function () {
    saveState();
    const url = document.getElementById('textbox').value.trim();
    if (url) {
      document.getElementById('maincontent').value += `<img src="${url}" alt="Image">\n`;
      show();
      closetextbox();
    }
  };
});

document.getElementById('addcode').addEventListener('click', function () {
  opentextbox();
  const saveBtn = document.getElementById("savecurrent");
  saveBtn.onclick = null;
  saveBtn.onclick = function () {
    saveState();
    const code = document.getElementById('textbox').value.trim();
    if (code) {
      document.getElementById('maincontent').value += `<pre><code>${code}</code></pre>\n`;
      show();
      closetextbox();
    }
  };
});

document.getElementById('addheading').addEventListener('click', function () {
  opentextbox();
  addSaveEventListener('h1', true); // Set isInline to true for headings
});

document.getElementById('addlink').addEventListener('click', function () {
  opentextbox();
  const saveBtn = document.getElementById("savecurrent");
  saveBtn.onclick = null; saveBtn.onclick = function () {
    const linkText = document.getElementById('textbox').value.trim();
    const url = prompt('Enter the link URL:');
    if (linkText && url) {
      saveState();
      document.getElementById('maincontent').value += `<a href="${url}" target="_blank">${linkText}</a>\n`;
      show();
      closetextbox();
    }
  };
});
document.getElementById('linkmap').addEventListener('click', function () {
  const textbox = document.getElementById('textbox');
  const existingText = textbox.value.trim();
  const word = document.getElementById("word").value.trim();
  const link = document.getElementById("wordlink").value.trim();
  if (word != "" || link != "") {
    var a = ` <a href='${link}' target='_blank'>${word}</a>`
  }
  textbox.value = existingText + a;
});

document.getElementById('undo').addEventListener('click', function () {
  if (history.length > 0) {
    document.getElementById('maincontent').value = history.pop();
  }
  show();
});


document.getElementById("ok").addEventListener("click", () => {
  window.close();
})

document.getElementById("cancel").addEventListener("click", () => {
  window.close();

});

document.getElementById("submitform").addEventListener("click", () => {
  const creatorname = document.getElementById("creatorname").value.trim();
  const profilepic = document.getElementById("profilepic").value.trim();
  if (document.getElementById("creatorname").value != "") {
    addcreator(useremail, creatorname, profilepic);
  }
  creatorname.value = "";
  profilepic.value = "";
}
);
function cradded() {
  document.getElementById("joinform").style.display = "none";
  window.location.reload();
}

/*check if user already joined*/

function joined(useracc, userem, userlogo) {
  document.getElementById("joinform").style.display = "none";
  document.getElementById("chname").value = useracc;
  document.getElementById("imageuser3").style.backgroundImage = `url(${userlogo})`
  document.getElementById("usem").innerHTML = userem;

}
function notjoined() {
  document.getElementById("joinform").style.display = "flex";

}
function userlogined() {
  /*now check in the array if users email is found then close the form*/
  /*else show the form and call the adddoc function to add data to users database*/

}
function usersignedout() {
  /*document.getElementById("uploadform").innerHTML="<p style="font-size:30px;margin:30px">You have to login first before continuing to upload page..</p>"*/
}
/*the page will contain form and a button upload.*/

/*joinform will call the adddoc function to the users database with useremail,chanelname,logourl*/
/*also check if chnnel is already available*/
/*ask him to recreate his name*/
/*after channel is created joinform will be none and uploadform will open in which on top teir should be channel name*/
/*when save and upload button will be clicked the function willl fetch chanel name also form the top and will post to database*/
/*document.getElementById("savef1").addEventListener("click", () => {
  const user = document.getElementById("chname").value;
  const imageurl = document.getElementById("imageurl").value;
  const content = document.getElementById("maincontent").value;
  addinfocard(user,imageurl,content,infocard);
})*/

var imageurlarr = [];
var textarr = [];
let currentIndex = -1;

document.getElementById("saveinfocard4").addEventListener("click", () => {
  const imageurl = document.getElementById("cfimg").value.trim();
  const text = document.getElementById("cftext").value.trim();
  if (imageurl != "" && text != "") {
    imageurlarr.push(imageurl);
    textarr.push(text);
    currentIndex = imageurlarr.length - 1;
    showinfodemo(currentIndex);
  }
  document.getElementById("pgcount").innerHTML=(imageurlarr.length)+ " Pages";
});
document.getElementById("prev").addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    showinfodemo(currentIndex);
  }
});
document.getElementById("next").addEventListener("click", () => {
  if (currentIndex < textarr.length - 1) {
    currentIndex++; 
    showinfodemo(currentIndex);

  }
});
function showinfodemo(index) {
  const imagearea = document.getElementById("flimg");
  const textarea = document.getElementById("fltext");
  imagearea.style.backgroundImage = `url(${imageurlarr[index]})`;
  textarea.innerHTML = textarr[index];
}
document.getElementById("undofl").addEventListener("click",()=>{
  imageurlarr.pop();
  textarr.pop();
  currentIndex--;
  showinfodemo(currentIndex);
})
document.getElementById("pgcount").innerHTML=(imageurlarr.length)+ " Pages";


document.getElementById("savefl").addEventListener("click", () => {

  const user = document.getElementById("chname").value;
  const likes=[];
  addinfocard(user,imageurlarr,textarr,likes);
  
})
async function addinfocard(user,arr1,arr2,likes,type) {
  try {
    const docRef = await addDoc(collection(db, "articles"), {
      user: user,
      profilepic: pic,
      likes: [],
      crid: crid,
      type: "infocard",
      imagearr:arr1,
      textarr:arr2,
      timestamp: new Date(),
      userid:useremail
    });
    console.log("Document written with ID: ", docRef.id);
    document.getElementById("uploadcnt").style.display = "flex";

  } catch (e) {
    console.error("Error adding document: ", e);
  }
}