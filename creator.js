import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove,query,where } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
const firebaseConfig = {
    apiKey: "AIzaSyBu5-fE69WdhHWBR7-2U3NGMm2YgGb6fgo",
    authDomain: "sphere-858fc.firebaseapp.com",
    projectId: "sphere-858fc",
    storageBucket: "sphere-858fc.appspot.com",
    messagingSenderId: "683722942494",
    appId: "1:683722942494:web:61517cb2450ef4284b260f"
};
document.addEventListener("DOMContentLoaded",()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
  // Function to fetch article by Id
    fetchcrdetails(id);
});
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
let userid = "";
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("waiting").style.display="flex";

  onAuthStateChanged(auth, (user) => {
    if (user) {
      userid = user.uid;
      console.log("user is signed in",user)
      userlogined(user.providerData[0].uid, user.uid);
    } else {
      console.log("user is signed out")
    }
  });
});
function userlogined(name, id) {
  userid=String(name).slice(0, 6)+"@"+String(id).slice(-4);
}

document.getElementById("goback").addEventListener("click",()=>{
    window.close();
})
const fetchcrdetails = async (id) => {
    try {
        const docRef = doc(db, "creators", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            var bgcolor = "";
            var buttext = "";
            var txtcolor="";
            if (userid!="" && docSnap.data().followers.includes(userid)) {
              bgcolor = "black";
              buttext = "Unfollow";
              txtcolor="white";
            } else {
              bgcolor = " rgb(0, 128, 255)";
              buttext = "Follow";
              txtcolor="white";
            }
            console.log("Article data:", docSnap.data());
            document.getElementById("crimage").style.backgroundImage = `url(${docSnap.data().profilepic})`;
            document.getElementById("crname").innerHTML = docSnap.data().creatorname;
            document.getElementById("follcount").innerHTML = docSnap.data().followers.length+" followers";
            document.getElementById("followbut").style.color=txtcolor;
            document.getElementById("followbut").style.backgroundColor=bgcolor;
            document.getElementById("followbut").innerHTML=buttext;

            document.getElementById("followbut").addEventListener("click",()=>{
                addfollowings(docSnap.id);
            })

          }
          else{
            document.getElementById("articles").innerHTML=`No articles yet +<button id="fgh">create</button>`;
          }
          } catch (error) {
            console.error("Error fetching document:", error);
        }
        fetcharticlesbyid(id);
           
};



const fetcharticlesbyid = async (id) => {
  try {
    const articlesRef = collection(db, "articles");
    const q = query(articlesRef, where("crid", "==", id));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      document.querySelector("#articles").innerHTML = `No articles yet | <a href="upload.html"><button id="fgh">Create</button></a>`;
      document.getElementById("artcount").innerHTML = "0 articles";
      return;
    }

    let str4 = "";
    let str5 = "";
    let i = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const timepassed = gettimepassed(data.timestamp);
      i += 1;

      if (data.type === "article") {
        str4 += `
          <div id="card" class="card" onclick="openview('${doc.id}')">
            <div id="text">
              <div id="kj">
                <p>${data.domain}</p>
                <p1><i class="fa-regular fa-face-smile"></i> | ${data.likes.length}</p1>
                <p2><i class="fa-regular fa-clock"></i> ${timepassed}</p2>
              </div>
              <h1>${data.heading}</h1>
            </div>
            <div style="background-image: url(${data.imageurl});" id="crdimg">
              <div id="creinfo">
                <div id="creimg" style="background-image: url(${data.profilepic});"></div>
                <h1 id="crename">${data.user}</h1>
              </div>
            </div>
          </div>`;
      } else {
        str5 += `
          <div id="card2" class="card2" onclick="openinfocards('${doc.id}')">
            <div id="fgs">
              <p>${data.user}</p>
              <h2><i class="fa-regular fa-paste"></i></h2>
            </div>
            <div id="text2">
              <h1 id="mainh1">${data.textarr[0]}</h1>
            </div>
            <div id="infoimg2" style="background-image:url(${data.imagearr[0]});"></div>
          </div>`;
      }
    });

    document.querySelector("#articles").innerHTML = str4 || `No articles yet | <a href="upload.html"><button id="fgh">Create</button></a>`;
    document.querySelector("#infocards").innerHTML = str5 || ' `No info cards yet | <a href="upload.html"><button id="fgh">Create</button></a>';
    document.getElementById("artcount").innerHTML = i + " articles";

  } catch (error) {
    console.error("Error fetching document:", error);
  }
  document.getElementById("waiting").style.display="none";
};


window.openinfocards = async function (id) {
    window.open(`infocards.html?id=${id}`,'_blank');
  }

  window.openview = async function (id) {
    window.open(`article.html?id=${id}`,'_blank');
  }
function gettimepassed(timestamp) {
    const firestoreTimestamp = timestamp; // Firestore.Timestamp object
    const savedDate = firestoreTimestamp.toDate(); // Convert to JavaScript Date object
    const currentDate = new Date();
    console.log(savedDate);
    const differenceInMilliseconds = currentDate - savedDate;
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);
  
    let timePassed;
    if (differenceInSeconds < 60) {
      timePassed = `${differenceInSeconds} seconds ago`;
    } else if (differenceInMinutes < 60) {
      timePassed = `${differenceInMinutes} minutes ago`;
    } else if (differenceInHours < 24) {
      timePassed = `${differenceInHours} hours ago`;
    } else {
      timePassed = `${differenceInDays} days ago`;
    }
  
    return timePassed;
  
  }
  window.addfollowings = async function (creatorid) {
    const button=document.getElementById("followbut");
    if (userid != "") {
      const docRef2 = doc(db, "creators", creatorid);
      // Fetch the document data
      const docSnap = await getDoc(docRef2);
      if (docSnap.exists) {
        const followers = docSnap.data().followers;
        if (!followers.includes(userid)) {
          await updateDoc(docRef2,
            { followers: arrayUnion(userid) });
          console.log(`${userid} added to followings.`);
          button.style.backgroundColor="black";
        button.innerHTML="Unfollow";
        button.style.color="white";        
        }
        else {  await updateDoc(docRef2,
          { followers: arrayRemove(userid) });
        console.log(`${userid} removed from followings.`);
        button.style.backgroundColor="dodgerblue";
      button.innerHTML="Follow";
      button.style.color="white";
  
      
      }
      }
      else { console.log("No such document!"); }
     
    }
    else {
      alert("You must login to continue")
    }
  }
  document.getElementById('share').addEventListener('click', () => {
    // Create a temporary input element
    const tempInput = document.createElement('input');
    
    // Set its value to the current page URL
    tempInput.value = window.location.href;
    
    // Append it to the body
    document.body.appendChild(tempInput);
    
    // Select the input element's content
    tempInput.select();
    
    // Execute the "copy" command to copy the content to the clipboard
    document.execCommand('copy');
    
    // Remove the temporary input element from the DOM
    document.body.removeChild(tempInput);
    
    // Provide feedback to the user
    alert('URL copied to clipboard!');
  });

  