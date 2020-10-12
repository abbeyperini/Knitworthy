let nameInput = document.getElementById("username")
let nameSearch = document.getElementById("nameSearch")

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
    getAPI(url)
})