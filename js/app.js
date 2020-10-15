let nameInput = document.getElementById("username");
let nameSearch = document.getElementById("nameSearch");
let profileInfo = document.getElementById("profileInfo");
let projectDetail = document.getElementById("projectDetail");
let modal = document.getElementById("simpleModal");
let closeBtn = document.getElementById("closeBtn");
let filterPopularityBTN = document.getElementById("filterpopularity")
let filterNewest = document.getElementById("byNewest")
let filterOldest = document.getElementById("byOldest")
let filterComplete = document.getElementById("completedStatus")
let filterDropdown = document.getElementsByClassName("dropdown__title")[0];
window.addEventListener("click",outsideClick)

// Making username accept when enter

var name
nameInput.addEventListener('keypress',function(e){
  if(e.key=='Enter'){
    name = this.value;
    let url = `https://api.ravelry.com/projects/${name}/list.json`;
  getAPI(url).then(function (json) {
    showProjects(json);
    showFilter()
  });
  }
})
nameSearch.addEventListener("click", () => {
  name = nameInput.value;
  let url = `https://api.ravelry.com/projects/${name}/list.json`;
  getAPI(url).then(function (json) {
    showProjects(json);
    showFilter()
  });
});

function showProjects(json) {
  while (profileInfo.firstChild) {
    profileInfo.removeChild(profileInfo.firstChild)
  };
  if (json.projects.length == 0) {
    window.alert("Please choose a username with at least one project.")
  } else {
    let projects = json.projects.map((project) => {
      let projectName = '';
      let title = ''
      let photo = ''
      if (project.name == null || project.name == "") {
        projectName = "No name"
      } else {
        projectName = project.name.replace(/'/g,"\\'")
        title = project.name.replace(/'/g,"\'")
      }
      if(project.first_photo == null){
        photo = 'images/placeholder.jpg'
      }else{
        photo = project.first_photo.square_url
      }
        return `<li class = "projectInfo">
                        <p>${title}</p>
                        <img src = ${photo}>
                        <div class="projectInfoBtns">
                          <button onclick="showState('${project.pattern_id}', '${photo}', '${projectName}')">Yardage</button>
                          <button onclick="showTime('${project.completed}', '${project.started}', '${photo}', '${projectName}')">Time</button>
                        </div>
                    </li>`;
    });
    profileInfo.insertAdjacentHTML("beforeend", projects.join(""));
  }
}

function showState(id, img, name) {
  if (id == "null") {
    window.alert(
      "Please choose a project with a pattern selected in Project info."
    );
  } else {
    let url = `https://api.ravelry.com/patterns/${id}.json`;
    getAPI(url).then(function (json) {
      showProjectDetail(json, img, name);
    });
  }
}

function showTime(completed, started, img, name) {
  if (started != "null" && completed != "null") {
    let startDate = new Date(started)
    let endDate = new Date(completed)
    if (startDate - endDate == 0) {
      let totalTime = 3;
      let timeText = generateTimeText(name, totalTime)
      let details = `<div id = "imageDetails">
                        <img src = '${img}'>
                        <p>${timeText}</p>
                    </div>`

      projectDetail.innerHTML = details;
      // call function to open modal
      openModal();
    } else {
      let totalTime = (((endDate - startDate) / 3600000) * .125)
      let timeText = generateTimeText(name, totalTime)
      let details = `<div id = "imageDetails">
                        <img src = '${img}'>
                        <p>${timeText}</p>
                    </div>`

      projectDetail.innerHTML = details;
      // call function to open modal
      openModal();
    }
  } else {
    window.alert("Please choose a project with a started and completed date.")
  }
}

function showProjectDetail(json, img, name) {
  if (json.pattern.yardage_max != null) {
    let lengthText = generateText(name, json.pattern.yardage_max)
    let details = `<div id = "imageDetails">
                      <img src = '${img}'>
                      <p>${lengthText}</p>
                      </div>`;
    projectDetail.innerHTML = details;
    
    // call function to open modal
    openModal();

  } else if (json.pattern.yardage != null) {
    let lengthText = generateText(name, json.pattern.yardage)
    let details = `<div id = "imageDetails">
                      <img src = '${img}'>
                      <p>${lengthText}</p>
                      </div>`;
    projectDetail.innerHTML = details;

    // call function to open modal
    openModal();

  } else {
    window.alert(
      "Please choose a project with a pattern with a suggested yardage."
    );
  }  
}

// add function to show the modal
function openModal() {
  modal.style.display = "block";
}
// add listion to close modal
closeBtn.addEventListener("click", closeModal);

function closeModal() {
  modal.style.display = "none";
}

//Function to close modal when click outside
function outsideClick(click){
  if(click.target == modal){
    modal.style.display = "none"
  }
}


//Function to show filter button
function showFilter(){
  if(profileInfo.innerHTML !== ""){
    filterDropdown.style.display = "block";
    }else{
    filterDropdown.style.display = "none";
    }
}

//function to fetch data from ravelry
function getAPI(url) {
  const headers = new Headers();
  headers.append("Authorization", "Basic " + btoa(username + ":" + password));
  return fetch(url, { method: "GET", headers: headers })
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      console.log(json);
      return json;
    }).catch(function(error){
      window.alert("Your username is not available!")
    });

}

function generateText(name, size) {
  console.log(size)
  let coefficient = 1000000000000000;
  let index = "";

  for (i=0; i < lengths.length; i++) {
    if ((lengths[i].length / size) < coefficient && (lengths[i].length / size) > 1) {
      coefficient = lengths[i].length / size 
      index = i;
    }
  }
  
  if (lengths[index].description != null) {
    let factDesc = lengths[index].description
    return `The yarn in your ${name} project could span the ${lengths[index].dimension} of ${lengths[index].name}, ${factDesc}, ${coefficient.toFixed(2)} times`
  } else {
    return `The yarn in your ${name} project could span the ${lengths[index].dimension} of ${lengths[index].name} ${coefficient.toFixed(2)} times`
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function generateTimeText(name, time) {
  console.log(time)
  index = "";
  let coefficient = 0;
  while (true) {
    let ranIndex = getRandomInt(0, times.length)
    if ((time / times[ranIndex].time) > 1) {
      index = ranIndex
      coefficient = time / times[index].time
      break
    }
  }
  return `In the time it took you to make your ${name} project, you could ${times[index].task} ${coefficient.toFixed(2)} times (assuming you worked on it 3 hours every day).`
}

//add function to popularity filter button
filterPopularityBTN.addEventListener("click",()=>{
  let url = `https://api.ravelry.com/projects/${name}/list.json`
  getAPI(url).then(function(json){
    showFilterProjects(json)
  })
  console.log(url)
})

function showFilterProjects(json){
  profileInfo.innerHTML = ""
  let filter = json.projects.sort((a,b)=> b.favorites_count - a.favorites_count)
  console.log(filter)
  let projects = filter.map((project) => {
    let projectName = '';
    let title = ''
    let photo = ''
    if (project.name == null || project.name == "") {
      projectName = "No name"
    } else {
      projectName = project.name.replace(/'/g,"\\'")
      title = project.name.replace(/'/g,"\'")
    }
    if(project.first_photo == null){
      photo = 'images/placeholder.jpg'
    }else{
      photo = project.first_photo.square_url
    }
      return `<li class = "projectInfo">
                      <p>${title}</p>
                      <img src = ${photo}>
                      <div class="projectInfoBtns">
                        <button onclick="showState('${project.pattern_id}', '${photo}', '${projectName}')">Yardage</button>
                        <button onclick="showTime('${project.completed}', '${project.started}', '${photo}', '${projectName}')">Time</button>
                      </div>
                  </li>`;
  });
  profileInfo.insertAdjacentHTML("beforeend", projects.join(""));
}

//add Function to filter by Newest
filterNewest.addEventListener("click",()=>{
  let url = `https://api.ravelry.com/projects/${name}/list.json`
  getAPI(url).then(function(json){
    filterbyNewest(json)
  })
  console.log(url)
})

function filterbyNewest(json){
  profileInfo.innerHTML = ""
  let filter = json.projects.sort((a,b)=> b.id - a.id)
  let projects = filter.map((project) => {
    let projectName = '';
    let title = ''
    let photo = ''
    if (project.name == null || project.name == "") {
      projectName = "No name"
    } else {
      projectName = project.name.replace(/'/g,"\\'")
      title = project.name.replace(/'/g,"\'")
    }
    if(project.first_photo == null){
      photo = 'images/placeholder.jpg'
    }else{
      photo = project.first_photo.square_url
    }
      return `<li class = "projectInfo">
                      <p>${title}</p>
                      <img src = ${photo}>
                      <div class="projectInfoBtns">
                        <button onclick="showState('${project.pattern_id}', '${photo}', '${projectName}')">Yardage</button>
                        <button onclick="showTime('${project.completed}', '${project.started}', '${photo}', '${projectName}')">Time</button>
                      </div>
                  </li>`;
  });
  profileInfo.insertAdjacentHTML("beforeend", projects.join(""));
}

//add function to filter by Oldest
filterOldest.addEventListener("click",()=>{
  let url = `https://api.ravelry.com/projects/${name}/list.json`
  getAPI(url).then(function(json){
    filterbyOldest(json)
  })
  console.log(url)
})

function filterbyOldest(json){
  profileInfo.innerHTML = ""
  let filter = json.projects.sort((a,b)=> a.id - b.id)
  let projects = filter.map((project) => {
    let projectName = '';
    let title = ''
    let photo = ''
    if (project.name == null || project.name == "") {
      projectName = "No name"
    } else {
      projectName = project.name.replace(/'/g,"\\'")
      title = project.name.replace(/'/g,"\'")
    }
    if(project.first_photo == null){
      photo = 'images/placeholder.jpg'
    }else{
      photo = project.first_photo.square_url
    }
      return `<li class = "projectInfo">
                      <p>${title}</p>
                      <img src = ${photo}>
                      <div class="projectInfoBtns">
                        <button onclick="showState('${project.pattern_id}', '${photo}', '${projectName}')">Yardage</button>
                        <button onclick="showTime('${project.completed}', '${project.started}', '${photo}', '${projectName}')">Time</button>
                      </div>
                  </li>`;
  });
  profileInfo.insertAdjacentHTML("beforeend", projects.join(""));
}

//Add function to filter only completed project
filterComplete.addEventListener("click",()=>{
  let url = `https://api.ravelry.com/projects/${name}/list.json`
  getAPI(url).then(function(json){
    filterComp(json)
  })
  console.log(url)
})

function filterComp(json){
  profileInfo.innerHTML = ""
  let filter = json.projects.filter(project=>(
    project.completed
  ))
  let projects = filter.map((project) => {
    let projectName = '';
    let title = ''
    let photo = ''
    if (project.name == null || project.name == "") {
      projectName = "No name"
    } else {
      projectName = project.name.replace(/'/g,"\\'")
      title = project.name.replace(/'/g,"\'")
    }
    if(project.first_photo == null){
      photo = 'images/placeholder.jpg'
    }else{
      photo = project.first_photo.square_url
    }
      return `<li class = "projectInfo">
                      <p>${title}</p>
                      <img src = ${photo}>
                      <div class="projectInfoBtns">
                        <button onclick="showState('${project.pattern_id}', '${photo}', '${projectName}')">Yardage</button>
                        <button onclick="showTime('${project.completed}', '${project.started}', '${photo}', '${projectName}')">Time</button>
                      </div>
                  </li>`;
  });
  profileInfo.insertAdjacentHTML("beforeend", projects.join(""));
}