let nav = 0;
let userID = localStorage.getItem('currentUserID'); // Change from objectId to userID
const backDrop = document.getElementById('modalBackDrop');
const calendar = document.getElementById('calendar');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatDateToISO(day, month, year) {
    const formattedMonth = month < 10 ? '0' + month : month.toString();
    const formattedDay = day < 10 ? '0' + day : day.toString();
    return `${year}-${formattedMonth}-${formattedDay}`;
}

let tasksByDate = {}; 

function fetchTasks() {
    return fetch('/tasks/getUser/' + userID)
        .then(response => response.json())
        .then(tasks => {
            tasksByDate = {}; 
            tasks.forEach(task => {
                const dueDate = new Date(task.taskDateDue).toISOString().split('T')[0]; 
                if (!tasksByDate[dueDate]) {
                    tasksByDate[dueDate] = [];
                }
                tasksByDate[dueDate].push(task);
            });
        })
        .catch(error => console.error('Error fetching tasks:', error));
}

function load() {
    const dt = new Date();

    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav);
    }

    const year = dt.getFullYear();
    const month = dt.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    document.getElementById('monthDisplay').innerText = `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

    calendar.innerHTML = '';

    fetch('/tasks/getUser/' + userID)
    .then(response => response.json())
    .then(tasks => {
        for (let i = 1; i <= paddingDays + daysInMonth; i++) {
            const daySquare = document.createElement('div');
            daySquare.classList.add('day');

            if (i > paddingDays) {
                const day = i - paddingDays;
                const isoDayString = formatDateToISO(day, month + 1, year);
                daySquare.innerText = day;

                const tasksForDay = tasks.filter(task => new Date(task.taskDateDue).toISOString().split('T')[0] === isoDayString);
                tasksForDay.forEach(task => {
                    if (!task.isTaskDeleted && task.taskStatus !== 'Complete') {
                        const taskElement = document.createElement('div');
                        taskElement.classList.add('event'); 
                        taskElement.textContent = task.taskName; 
                
                        const taskDueDate = new Date(task.taskDateDue);
                        const currentDate = new Date();
                        currentDate.setHours(0,0,0,0); 
                
                        if (task.taskStatus === 'Started') {
                            taskElement.classList.add('started'); 
                        } else if (taskDueDate < currentDate) {
                            taskElement.classList.add('overdue'); 
                        }
                
                        daySquare.appendChild(taskElement);
                    }
                });
                
                
            } else {
                daySquare.classList.add('padding');
            }

            calendar.appendChild(daySquare);
        }
    })
    .catch(error => console.error('Error fetching tasks:', error));
}

function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        load();
    });

    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        load();
    });

    document.getElementById('returnButton').addEventListener('click', () => {
        window.location.href = "/pages/main";
    });
}

initButtons();
load();
