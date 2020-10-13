let nameInput = document.getElementById("username");
let nameSearch = document.getElementById("nameSearch");
let profileInfo = document.getElementById("profileInfo");
let projectDetail = document.getElementById("projectDetail");
let modal = document.getElementById("simpleModal");
let closeBtn = document.getElementById("closeBtn");

nameSearch.addEventListener("click", () => {
  let name = nameInput.value;
  let url = `https://api.ravelry.com/projects/${name}/list.json`;
  getAPI(url).then(function (json) {
    showProjects(json);
  });
});

function showProjects(json) {
  let projects = json.projects.map((project) => {
    return `<li class = "projectInfo">
                    <p>${project.name}</p>
                    <img src = ${project.first_photo.square_url}>
                    <button onclick="showState('${project.pattern_id}', '${project.first_photo.square_url}', '${project.name.replace(/'/g,"\\'")}')">Choose me</button>
                </li>`;
  });
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
      showProjectDetail(json, img, name);
    });
  }
  // call function to open modal
  openModal();
}

function showProjectDetail(json, img, name) {
  let details = `<div id = "imageDetails">
                    <p>${json.pattern.yardage_max}</p>
                    <img src = '${img}'>
                    <p id = "imageDetailsText">"${name}"</p>
                    </div>`;
  projectDetail.innerHTML = details;
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
    });
}