let nameInput = document.getElementById("username")
let nameSearch = document.getElementById("nameSearch")
let profileInfo = document.getElementById("profileInfo")


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
                    <p>Completed on ${project.completed}</p>
                    <p>Craft name ${project.craft_name}</p>
                    <img src = ${project.first_photo.square_url}>
                </li>`
    })
    profileInfo.insertAdjacentHTML('beforeend', projects.join(''))
}