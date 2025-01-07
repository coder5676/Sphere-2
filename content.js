import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove, query, where } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

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
let useridf = "";
let useremail = "";
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("waiting").style.display = "flex";
  onAuthStateChanged(auth, (user) => {
    if (user) {
      useridf = user.uid;
      console.log("user is signed in", user)
      userlogined(user.providerData[0].uid, user.uid);
    } else {
      console.log("user is signed out")
      usersignedout();
    }
  });
});
window.slice=async function(str){
  if(str.length<80){
    return str;
  }
  return String(str).slice(0,80)+" ....";
}
async function getArticles(Domain) {
  var maxlikes = -1;
  var topArticle = null;
  try {
    const querySnapshot = await getDocs(collection(db, "articles"));
    if (querySnapshot.empty) {
      console.log("No articles found.");
      return;
    }

    let articleCount = 0;
    let infoCardCount = 0;
    let totalCount = 0;
    let contentHTML = "";

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const timepassed = gettimepassed(data.timestamp);
      if ((Domain == "all" || data.domain == Domain) && data.type === "article") {
        if (data.likes.length > maxlikes) {
          maxlikes = data.likes.length;
          topArticle = doc;
        }

        contentHTML += `
            <div id="card" class="card" onclick="openview('${doc.id}')">
              <div id="text">
                <div id="kj">
                  <p>${data.domain}</p>
                  <p1><i class="fa-regular fa-face-smile"></i> | ${countlikes(data.likes.length)}</p1>
                  <p2><i class="fa-regular fa-clock"></i> ${timepassed}</p2>
                </div>
                <h1>${String(data.heading).slice(0,80)+" ..."}</h1>
              </div>
              <div style="background-image: url(${data.imageurl});" id="crdimg">
                <div id="creinfo">
                  <div id="creimg" style="background-image: url(${data.profilepic});"></div>
                  <h1 id="crename">${data.user}</h1>
                </div>
              </div>
            </div>`;
      } else if (data.type !== "article") {
        contentHTML += `
            <div id="card2" class="card2" onclick="openinfocards('${doc.id}')">
            <div id="text2">
                <div id="fgh">
                  <p>${data.user}</p>
                  <h2><i class="fa-regular fa-paste"></i></h2>
                </div>
                <h1 id="mainh1">${String(data.textarr[0]).slice(0,80)+" ..."}</h1>
              </div>
              <div id="infoimg2" style="background-image:url(${data.imagearr[0]});"></div>
            </div>`;
      }

    });

    document.querySelector("#elements2").innerHTML = contentHTML;

    if (topArticle) {
      const strf = `
        <div id="imgfm" style="background-image:url(${topArticle.data().imageurl});">
          <p id="fd"><i class="fa-regular fa-face-laugh-beam"></i> . Getting famous</p>
        </div>
        <div id="textfm">
          <p>${topArticle.data().user}</p>
          <h1>${String(topArticle.data().heading).slice(0,80)+" ..."}</h1>
          <button onclick="openview('${topArticle.id}')" id="nj">Read article</button>
        </div>`;
      document.querySelector("#famous").innerHTML = strf;
    }

    document.getElementById("waiting").style.display = "none";

  } catch (error) {
    console.error("Error fetching documents:", error);
    document.getElementById("waiting").style.display = "none";
  }
}

window.openview = async function (id) {
  window.open(`article.html?id=${id}`, '_blank');
}

// Assuming you have a Firestore timestamp
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
  const differenceInMonth=Math.floor(differenceInDays/30);
  const differenceInYear=Math.floor(differenceInMonth/12);


  let timePassed;
  if (differenceInSeconds < 60) {
    timePassed = `${differenceInSeconds} seconds ago`;
  } else if (differenceInMinutes < 60) {
    timePassed = `${differenceInMinutes} minutes ago`;
  } else if (differenceInHours < 24) {
    timePassed = `${differenceInHours} hours ago`;
  } else if(differenceInDays<30) {
    timePassed = `${differenceInDays} days ago`;
  }
  else if(differenceInMonth<12) {
    timePassed = `${differenceInMonth} months ago`;
  }
  else{
    timePassed = `${differenceInYear} years ago`;
   
  }


  return timePassed;

};

window.openinfocards = async function (id) {
  window.open(`infocards.html?id=${id}`, '_blank');
};
window.goback = async function () {
  document.getElementById("maindisplay").style.display = "flex";
  document.getElementById("maincontainer").style.display = "none";
};
const button1 = document.getElementById('pr');
const button2 = document.getElementById('ino');
const button3 = document.getElementById('gn');
const button4 = document.getElementById('more');
const button5 = document.getElementById('all');
const button6 = document.getElementById('sc');
const button7 = document.getElementById('sp');

button1.addEventListener('click', () => {
  getArticles("programming");
});
button2.addEventListener('click', () => {
  getArticles("innovation");
});
button3.addEventListener('click', () => {
  getArticles("general");
});
button4.addEventListener('click', () => {
  getArticles("stories");
});
button5.addEventListener('click', () => {
  getArticles("all");
});
button6.addEventListener('click', () => {
  getArticles("science");
});
button7.addEventListener('click', () => {
  getArticles("space");
});

document.getElementById("userf").addEventListener('click', () => {
  const form = document.getElementById("form");
  if (form.style.display === "none" || form.style.display === "") {
    form.style.display = "flex";
    form.style.transitionDuration = "0.7s";
  } else {
    form.style.display = "none";
    form.style.transitionDuration = "0.7s";
  }

});
document.getElementById("login").addEventListener('click', () => {
  document.getElementById("loginform").style.display = "flex";
  document.getElementById("signupform").style.display = "none";
});
document.getElementById("signup").addEventListener('click', () => {
  document.getElementById("signupform").style.display = "flex";
  document.getElementById("loginform").style.display = "none";
});
document.getElementById("cross").addEventListener('click', () => {
  document.getElementById("form").style.display = "none";

});



document.getElementById("logout").addEventListener("click", () => {
  document.getElementById("rightbar").classList.remove("openrightbar");
})
getArticles("all");
const anchor = document.querySelectorAll(".anchor");
function userlogined(name, id) {
  document.getElementById("userf").style.display = "none";
  document.getElementById("userbar").style.display = "block";
  document.getElementById("userbar").innerHTML = String(name).slice(0, 1).toUpperCase();


  anchor.forEach(tag => {
    tag.href = "upload.html";
    tag.target = "_blank";
  })

  document.getElementById("username").innerHTML = name;
  document.getElementById("userid").innerHTML = String(name).slice(0, 6) + "@" + String(id).slice(-4);

  useremail = String(name).slice(0, 6) + "@" + String(id).slice(-4);
  document.getElementById("openrr").style.display = "flex";
  document.getElementById("fetchmy").style.display = "flex";
  document.getElementById("gi").style.display = "flex";
  document.getElementById("followings").style.display = "flex";
}
function usersignedout() {
  document.getElementById("userf").style.display = "block";
  document.getElementById("userbar").style.display = "none";
  anchor.forEach(tag => { tag.href = "" });
  document.getElementById("form").style.display = "flex";
  document.getElementById("userf").style.color = "grey";
  document.getElementById("elements").innerHTML = "";
  document.getElementById("openrr").style.display = "none";
  document.getElementById("fetchmy").style.display = "none";
  document.getElementById("gi").style.display = "none";
  document.getElementById("followings").style.display = "none";
}

const buttons = document.querySelectorAll('.uplbut');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    alert("You will be redirected to another page only if you are logined🐧");
  });
})


document.getElementById("openrr").addEventListener("click", () => {
  document.getElementById("rightbar").classList.toggle("openrightbar");
});
document.getElementById("fetchmy").addEventListener("click", () => {
  document.getElementById("myfollowers").classList.add("openmyfollowers");
  document.getElementById("waiting").style.display = "flex";

  getcreators();
});
document.getElementById("closefollowers").addEventListener("click", () => {
  document.getElementById("myfollowers").classList.remove("openmyfollowers");
});
async function getcreators() {
  try {
    // Reference to the collection
    const querySnapshot2 = await getDocs(collection(db, "creators"));
    var str3 = "";

    querySnapshot2.forEach((doc) => {
      var bgcolor = "";
      var buttext = "";
      var txtcolor = "";
      if (doc.data().followers.includes(useremail)) {
        bgcolor = "white";
        buttext = "Unfollow";
        txtcolor = "black"
      } else {
        bgcolor = "cornflowerblue";
        buttext = "Follow";
        txtcolor = "white";
      }

      str3 += `
        <div id="creator" >
          <div id="crimg" style="background-image:url(${doc.data().profilepic})" onclick="creatorinfo('${doc.data().creatoremail}')"></div>
          <h1 id="crname">${doc.data().creatorname}</h1>
          <p id="foll">${doc.data().followers.length} followers</p>
          <button id="followbut-${doc.id}" style="background-color:${bgcolor};color:${txtcolor}" onclick="addfollowings('${doc.id}',this)">${buttext}</button>
        </div>
      `;
    });

    document.querySelector("#creatorsbar").innerHTML = str3;
    str3 = "";

  } catch (error) {
    console.log(error);
  }
  document.getElementById("waiting").style.display = "none";

};


window.addfollowings = async function (creatorid, button) {
  if (useremail != "") {
    const docRef2 = doc(db, "creators", creatorid);
    // Fetch the document data
    const docSnap = await getDoc(docRef2);
    if (docSnap.exists) {
      const followers = docSnap.data().followers;
      if (!followers.includes(useremail)) {
        await updateDoc(docRef2,
          { followers: arrayUnion(useremail) });
        console.log(`${useremail} added to followings.`);
        button.style.backgroundColor = "white";
        button.innerHTML = "Unfollow";
        button.style.color = "black";
      }
      else {
        await updateDoc(docRef2,
          { followers: arrayRemove(useremail) });
        console.log(`${useremail} removed from followings.`);
        button.style.backgroundColor = "cornflowerblue";
        button.innerHTML = "Follow";
        button.style.color = "white";


      }
    }
    else { console.log("No such document!"); }

  }
  else {
    alert("You must login to continue")
  }
}



/*
function joined(nm, em, pp) {

}
function notjoined() {

}

function like(userem) {

}*/
window.creatorinfo = async function (usemail) {
  try {
    const creatorsRef = collection(db, "creators");
    const q = query(creatorsRef, where("creatoremail", "==", usemail));
    // Execute the query 
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        // Assuming you expect only one document 
        const crid = doc.id;
        window.open(`creator.html?id=${crid}`, '_blank');
      })
    }
    else {
      console.log("Not found");
    }
  }
  catch (error) {
    console.log(error);
  }
};
document.getElementById("followings").addEventListener("click", () => {
  creatorinfo(useremail);
});
document.getElementById("togglebut2").addEventListener("click", () => {
  document.getElementById("styletop").classList.toggle("openstyletop");
});
document.getElementById("closergb").addEventListener("click", () => {
  document.getElementById("rightbar").classList.remove("openrightbar");
});
function countlikes(likes) {
  let a = "";
  if (likes > 999) {
    a = String(likes).slice("-3") + "k";
  }
  else {
    a = String(likes);
  }
  return a;

};
