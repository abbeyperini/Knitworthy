let nameInput = document.getElementById("username")
let nameSearch = document.getElementById("nameSearch")
let profileInfo = document.getElementById("profileInfo")
let projectDetail = document.getElementById("projectDetail")


nameSearch.addEventListener("click", () => {
    let name = nameInput.value
    let url = `https://api.ravelry.com/projects/${name}/list.json`
    function getAPI(url) {
        const headers = new Headers();
        headers.append('Authorization', 'Basic ' + btoa(username + ":" + password));
        return fetch(url, { method: 'GET', headers: headers }).then(function(response) {
            return response.json();
        }).then(function(json) { 
            console.log(json)
            return json; 
        }); 
    }
    let json = getAPI(url)
    .then(function(json){
        showProjects(json)
    })

})

function showProjects(json) {
    let projects = json.projects.map((project) => {
        return `<li class = "projectInfo">
                    <p>${project.name}</p>
                    <img src = ${project.first_photo.square_url}>
                    <button onclick="showState('${project.pattern_id}')">Choose me</button>
                </li>`
    })
    profileInfo.insertAdjacentHTML('beforeend', projects.join(''))
}
function showState(id){
    if (id == "null"){
        window.alert("Please choose a project with a pattern selected in Project info.")
    }else{
    let url = `https://api.ravelry.com/patterns/${id}.json`
    function getAPI(url) {
        const headers = new Headers();
        headers.append('Authorization', 'Basic ' + btoa(username + ":" + password));
        return fetch(url, { method: 'GET', headers: headers }).then(function(response) {
            return response.json();
        }).then(function(json) { 
            console.log(json)
            return json; 
        }).catch((error)=>{
            window.alert("Please choose a project with a pattern selected in Project info.")
        }); 
    }
    let json = getAPI(url)
    .then(function(json){
        showProjectDetail(json)
    })}

}

function showProjectDetail(json){
    let details = `<p>${json.pattern.yardage_max}</p>`
    projectDetail.innerHTML = details
}