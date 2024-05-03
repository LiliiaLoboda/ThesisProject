const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask(){
    if(inputBox.value === ''){
        alert("You did not write anything");
    }
    else {
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);
        let iconDelete = document.createElement("span");
        iconDelete.innerHTML = "&#x1F5D1;"
        li.appendChild(iconDelete);


        // iconDelete.classList.add("icon-delete");
        // iconDelete.style.backgroundImage = "url('../images/delete.png')";
        // li.appendChild(iconDelete);

    }
    inputBox.value = "";
    saveList();
}

listContainer.addEventListener("click", function (e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked");
    }
    else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
    }
},false);

function saveList(){
    localStorage.setItem("list", listContainer.innerHTML);
}

function showList(){
    listContainer.innerHTML = localStorage.getItem("list");
}
showList();