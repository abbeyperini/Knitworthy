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
let ravelryData = []

nameInput.addEventListener('keypress',function(e){
  if(e.key=='Enter'){
    let name = this.value;
    getData(name)
  }
})
nameSearch.addEventListener("click", () => {
  let name = nameInput.value;
  getData(name)
  })


function getData(name){
  let url = `https://api.ravelry.com/projects/${name}/list.json`;
  getAPI(url).then(function (json) {
    createDataArray(collectData(json))
    displayData(ravelryData)
    showFilter()
  }).catch((error)=>{
    filterDropdown.style.display = "none"
  })
}
function collectData(json) {
  profileInfo.innerHTML = ''
  projecObjectList = []
  let projects= json.projects.map((project)=>{
    projecObjectList.push(project)
  })
  if(projecObjectList.length !== 0){
  return projecObjectList
  }else{
    window.alert("Please choose a username with at least one project.")
    filterDropdown.style.display = "none"
    return projecObjectList
  }
}


function createDataArray (dataArray){
  ravelryData = []
  let projects = dataArray.map((project)=>{
    let projectName = '';
      let title = ''
      let photo = ''
      if (project.name == null || project.name == "") {
        projectName = "No name"
      } else {
        projectName = project.name.replace(/'/g,"\\'")
        title = project.name.replace(/'/g,"\'")
      }
      project.first_photo? photo = project.first_photo.square_url : photo = 'images/placeholder.jpg'
      let dataValue = [title,projectName,photo,project.pattern_id,project.completed,project.started,project.favorites_count,project.id]
      ravelryData.push(dataValue)
  })
}
function returnValue(title,projectName,photo,id,completed,started){
  return `<li class = "projectInfo">
                        <p>${title}</p>
                        <img src = ${photo}>
                        <div class="projectInfoBtns">
                          <button onclick="showState('${id}', '${photo}', '${projectName}')">Yardage</button>
                          <button onclick="showTime('${completed}', '${started}', '${photo}', '${projectName}')">Time</button>
                        </div>
                    </li>`
}
function displayData(dataArray){
  profileInfo.innerHTML = ''
  let projects = dataArray.map((project)=>{
    return returnValue(project[0],project[1],project[2],project[3],project[4],project[5])
  })
  profileInfo.insertAdjacentHTML("beforeend", projects.join(""));
}

function showState(id, img, name) {
  if (id == "null") {
    window.alert(
      "Please choose a project with a pattern selected in Project info."
    );
  } else {
    let url = `https://api.ravelry.com/patterns/${id}.json`;
    getAPI(url).then(function (json) {
      let max_yardage = json.pattern.yardage_max;
      let yardage = json.pattern.yardage;
      showProjectDetail(max_yardage, yardage, img, name);
    });
  }
}

function showTime(completed, started, img, name, randomize) {
  if (started != "null" && completed != "null") {
    let startDate = new Date(started)
    let endDate = new Date(completed)
    if (startDate - endDate == 0) {
      let totalTime = 3;
      let timeText = generateTimeText(name, totalTime, randomize)
      let details = `<div id = "imageDetails">
                        <img src = '${img}'>
                        <p>${timeText}</p>
                        <button onclick="showTime('${completed}', '${started}', '${img}', '${name}', 'randomize')">Randomize</button>
                    </div>`

      projectDetail.innerHTML = details;
      // call function to open modal
      openModal();
    } else {
      let totalTime = (((endDate - startDate) / 3600000) * .125)
      let timeText = generateTimeText(name, totalTime, randomize)
      let details = `<div id = "imageDetails">
                        <img src = '${img}'>
                        <p>${timeText}</p>
                        <button onclick="showTime('${completed}', '${started}', '${img}', '${name}', 'randomize')">Randomize</button>
                    </div>`

      projectDetail.innerHTML = details;
      // call function to open modal
      openModal();
    }
  } else {
    window.alert("Please choose a project with a started and completed date.")
  }
}

function showProjectDetail(max_yardage, yardage, img, name, randomize) {
  if (max_yardage != null && max_yardage != undefined && max_yardage != "null") {
    let lengthText = generateText(name, max_yardage, randomize)
    let details = `<div id = "imageDetails">
                      <img src = '${img}'>
                      <p>${lengthText}</p>
                      <button onclick="showProjectDetail('${max_yardage}', '${yardage}', '${img}', '${name}', 'randomize')">Randomize</button>
                      </div>`;
    projectDetail.innerHTML = details;
    
    // call function to open modal
    openModal();

  } else if (yardage != null && yardage != undefined && yardage != "null") {
    let lengthText = generateText(name, yardage, randomize)
    let details = `<div id = "imageDetails">
                      <img src = '${img}'>
                      <p>${lengthText}</p>
                      <button onclick="showProjectDetail('${max_yardage}', '${yardage}', '${img}', '${name}', 'randomize')">Randomize</button>
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
      return json;
    }).catch(function(error){
      window.alert("Your username is not available!")
      filterDropdown.style.display = "none";
    });

}

function generateText(name, size, randomize) {
  console.log(size)
  let coefficient = 1000000000000000;
  let index = "";

  if (randomize == 'randomize') {
    while (true) {
      let ranIndex = getRandomInt(0, times.length)
      if ((lengths[ranIndex].length / size) > 0.01) {
        index = ranIndex
        coefficient = lengths[index].length / size
        break
      }
    }
  } else {
    for (i=0; i < lengths.length; i++) {
      if ((lengths[i].length / size) < coefficient && (lengths[i].length / size) > 1) {
        coefficient = lengths[i].length / size 
        index = i;
      }
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

function generateTimeText(name, time, randomize) {
  console.log(time)
  index = "";
  let coefficient = 0;

  if (randomize == 'randomize') {
    while (true) {
      let ranIndex = getRandomInt(0, times.length)
      if ((time / times[ranIndex].time) > 0.01) {
        index = ranIndex
        coefficient = time / times[index].time
        break
      }
    }
  } else {
    while (true) {
      let ranIndex = getRandomInt(0, times.length)
      if ((time / times[ranIndex].time) > 1) {
        index = ranIndex
        coefficient = time / times[index].time
        break
      }
    }
  }
  return `In the time it took you to make your ${name} project, you could ${times[index].task} ${coefficient.toFixed(2)} times (assuming you worked on it 3 hours every day).`
}

//add function to popularity filter button
filterPopularityBTN.addEventListener("click",()=>{
  filterAndSort('favourite')
})

//add function to filter by Newest
filterNewest.addEventListener("click",()=>{
  filterAndSort('newest')
})

//add function to filter by Oldest
filterOldest.addEventListener("click",()=>{
  filterAndSort('oldest')
})

//Add function to filter only completed project
filterComplete.addEventListener("click",()=>{
  filterAndSort('completed')
})

function filterAndSort(type){
  let filter
  if(type ==='favourite'){
    filter = ravelryData.sort((a,b)=> b[6] - a[6])
  }else if(type=='newest'){
    filter = ravelryData.sort((a,b)=> b[7] - a[7])
  }else if( type =='oldest'){
    filter = ravelryData.sort((a,b)=> a[7] - b[7])
  }else if(type =='completed'){
    filter = ravelryData.filter(project=>(project[4]))
  }
  displayData(filter)
}

