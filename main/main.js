const inputBox = document.getElementById("input-box");
const datePickerBox = document.getElementById("date-picker-box");
const listContainer = document.getElementById("list-container");
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

function addTask() {
    if (inputBox.value === '') {
        alert("You did not write anything");
    } else if (datePickerBox.value === '') {
        alert("You did not select a date");
    } else {
        let li = document.createElement("li");
        li.innerHTML=`${inputBox.value}`;


        let taskDate = document.createElement("span");
        taskDate.classList.add("task-date");
        taskDate.textContent = `(${datePickerBox.value})`;

        let iconDelete = document.createElement("span");
        iconDelete.innerHTML = "&#x1F5D1;";
        iconDelete.classList.add("delete-icon");

        li.appendChild(taskDate);
        li.appendChild(iconDelete);

        listContainer.appendChild(li);

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
    } else if (e.target.classList.contains("delete-icon")) {
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
        monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
    for (var i = DNlast; i < 7; i++) calendar += '<td>';
    document.querySelector('#' + id + ' tbody').innerHTML = calendar;
    document.querySelector('#' + id + ' thead td:nth-child(2)').innerHTML = monthNames[D.getMonth()] + ' ' + D.getFullYear();
    document.querySelector('#' + id + ' thead td:nth-child(2)').dataset.month = D.getMonth();
    document.querySelector('#' + id + ' thead td:nth-child(2)').dataset.year = D.getFullYear();
    if (document.querySelectorAll('#' + id + ' tbody tr').length < 6) {  // чтобы при перелистывании месяцев не "подпрыгивала" вся страница, добавляется ряд пустых клеток. Итог: всегда 6 строк для цифр
        document.querySelector('#' + id + ' tbody').innerHTML += '<tr><td> <td> <td> <td> <td> <td> <td>';
    }
    highlightTasks();
}

function prevMonth() {
    currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    currentYear = currentMonth === 11 ? currentYear - 1 : currentYear;
    calendar("calendar", currentYear, currentMonth);
}

function nextMonth() {
    currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    currentYear = currentMonth === 0 ? currentYear + 1 : currentYear;
    calendar("calendar", currentYear, currentMonth);
}

function highlightTasks() {
    const tasks = listContainer.querySelectorAll("li");
    tasks.forEach(task => {
        const taskDate = task.querySelector('.task-date').innerText.replace(/[()]/g, '');
        const [year, month, day] = taskDate.split('-');
        if (parseInt(year) === currentYear && parseInt(month) - 1 === currentMonth) {
            const dateElement = [...document.querySelectorAll('#calendar tbody td')]
                .find(td => td.innerText === String(parseInt(day)) && td.innerText !== '');
            if (dateElement) {
                dateElement.classList.add('task-date-highlight');
            }
        }
    });
}

function updateCalendar() {
    calendar("calendar", currentYear, currentMonth);
}

$(function () {
    $("#date-picker-box").datepicker({ dateFormat: 'yy-mm-dd' });
    $(".datepicker-icon").on("click", function () {
        $("#date-picker-box").focus();
    });
});

// Initialize
$(document).ready(function() {
    showList();
    updateCalendar();
});
