const inputBox = document.getElementById("input-box");
const datePickerBox = document.getElementById("date-picker-box");
const listContainer = document.getElementById("list-container");

function addTask() {
    if (inputBox.value === '') {
        alert("You did not write anything");
    } else {
        let li = document.createElement("li");
        li.innerHTML = `${inputBox.value} <span class="task-date">(${datePickerBox.value})</span>`;
        listContainer.appendChild(li);

        let iconDelete = document.createElement("span");
        iconDelete.innerHTML = "&#x1F5D1;";
        iconDelete.classList.add("delete-icon");
        li.appendChild(iconDelete);

        // Reset input fields
        inputBox.value = "";
        datePickerBox.value = "";

        saveList();
        updateCalendar();
    }
}

listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveList();
        updateCalendar();
    } else if (e.target.tagName === "SPAN" && e.target.classList.contains("delete-icon")) {
        e.target.parentElement.remove();
        saveList();
        updateCalendar();
    }
}, false);

function saveList() {
    localStorage.setItem("list", listContainer.innerHTML);
}

function showList() {
    listContainer.innerHTML = localStorage.getItem("list");
}
showList();

function filterInProcess() {
    let tasks = listContainer.querySelectorAll("li");
    tasks.forEach(task => {
        if (!task.classList.contains("checked")) {
            task.style.display = "block"; // Show only incomplete tasks
        } else {
            task.style.display = "none"; // Hide completed tasks
        }
    });
}

function filterDone() {
    let tasks = listContainer.querySelectorAll("li");
    tasks.forEach(task => {
        if (task.classList.contains("checked")) {
            task.style.display = "block"; // Show only completed tasks
        } else {
            task.style.display = "none"; // Hide incomplete tasks
        }
    });
}

document.getElementById("in-process-btn").addEventListener("click", filterInProcess);
document.getElementById("done-btn").addEventListener("click", filterDone);

function calendar(id, year, month) {
    var Dlast = new Date(year, month + 1, 0).getDate(),
        D = new Date(year, month, Dlast),
        DNlast = new Date(D.getFullYear(), D.getMonth(), Dlast).getDay(),
        DNfirst = new Date(D.getFullYear(), D.getMonth(), 1).getDay(),
        calendar = '<tr>',
        month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (DNfirst != 0) {
        for (var i = 1; i < DNfirst; i++) calendar += '<td>';
    } else {
        for (var i = 0; i < 6; i++) calendar += '<td>';
    }
    for (var i = 1; i <= Dlast; i++) {
        if (i == new Date().getDate() && D.getFullYear() == new Date().getFullYear() && D.getMonth() == new Date().getMonth()) {
            calendar += '<td class="today">' + i;
        } else {
            calendar += '<td>' + i;
        }
        if (new Date(D.getFullYear(), D.getMonth(), i).getDay() == 0) {
            calendar += '<tr>';
        }
    }
    if (month == "April" && id == 28)
        calendar += '<td class="hol">';
    else
        calendar += "<td>"
    for (var i = DNlast; i < 7; i++) calendar += '<td> ';
    document.querySelector('#' + id + ' tbody').innerHTML = calendar;
    document.querySelector('#' + id + ' thead td:nth-child(2)').innerHTML = month[D.getMonth()] + ' ' + D.getFullYear();
    document.querySelector('#' + id + ' thead td:nth-child(2)').dataset.month = D.getMonth();
    document.querySelector('#' + id + ' thead td:nth-child(2)').dataset.year = D.getFullYear();
    if (document.querySelectorAll('#' + id + ' tbody tr').length < 6) {  // чтобы при перелистывании месяцев не "подпрыгивала" вся страница, добавляется ряд пустых клеток. Итог: всегда 6 строк для цифр
        document.querySelector('#' + id + ' tbody').innerHTML += '<tr><td> <td> <td> <td> <td> <td> <td> ';
    }
}
calendar("calendar", new Date().getFullYear(), new Date().getMonth());
// переключатель минус месяц
document.querySelector('#calendar thead tr:nth-child(1) td:nth-child(1)').onclick = function () {
    calendar("calendar", document.querySelector('#calendar thead td:nth-child(2)').dataset.year, parseFloat(document.querySelector('#calendar thead td:nth-child(2)').dataset.month) - 1);
}
// переключатель плюс месяц
document.querySelector('#calendar thead tr:nth-child(1) td:nth-child(3)').onclick = function () {
    calendar("calendar", document.querySelector('#calendar thead td:nth-child(2)').dataset.year, parseFloat(document.querySelector('#calendar thead td:nth-child(2)').dataset.month) + 1);
}

function highlightTasks() {
    const tasks = listContainer.querySelectorAll("li");
    tasks.forEach(task => {
        const taskDate = task.querySelector('.task-date').innerText.replace(/[()]/g, '');
        const dateElement = [...document.querySelectorAll('#calendar tbody td')]
            .find(td => td.innerText === taskDate.split('-')[2] && td.innerText !== '');
        if (dateElement) {
            dateElement.classList.add('task-date-highlight');
        }
    });
}

function updateCalendar() {
    calendar("calendar", new Date().getFullYear(), new Date().getMonth());
    highlightTasks();
}

$(function () {
    $("#date-picker-box").datepicker({ dateFormat: 'yy-mm-dd' });
    $(".datepicker-icon").on("click", function () {
        $("#date-picker-box").focus();
    });
});

