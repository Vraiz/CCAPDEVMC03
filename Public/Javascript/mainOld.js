function goToCalendar() {
  window.location.href = '/pages/Calendar';
}
function goToCharacters() {
  window.location.href = '/pages/Character';
}
function goToGacha() {
  window.location.href = '/pages/gacha';
}
function goToStore() {
  window.location.href = '/pages/Store';
}
function logout() {
  localStorage.removeItem('currentUserID');
  window.location.href = '/pages/landingpage';
}
function closeProfileModal() {
  document.getElementById('profileModal').style.display = 'none';
}
function hideModal() {
  document.getElementById("form").style.display = "none";
}
let fetchUserData = async () => {
  try {
    let userID = localStorage.getItem('currentUserID');
    // Fetch user data from the database

    let response, userData
    if (userID != null){
      response = await fetch(`/userdatas/${userID}`); // Assuming you have an endpoint to retrieve user data
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      userData = await response.json();
    }


    // Populate profile information in the modal
    if(userID != null){
      document.getElementById("profileName").innerText = userData.userName;
      document.getElementById("profileEmail").innerText = userData.email;
      document.getElementById("profileDateCreated").innerText = userData.dateCreated;
      document.getElementById("profileTasksCompleted").innerText = userData.TotalTasksCompleted;
      document.getElementById("rolls").innerText = userData.Rolls;
      document.getElementById("coins").innerText = userData.credits;
      document.getElementById("5pity").innerText = userData.fiveStarPity;
      document.getElementById("4pity").innerText = userData.fourStarPity;   
    }else{
      document.getElementById("profileName").innerText = "Not logged in";
    }




    // Display the modal
    document.getElementById("profileModal").style.display = "block";
  } catch (err) {
    console.error("Error fetching user data:", err);
  }
};

function openProfileModal() {
  // Display the modal
  document.getElementById('profileModal').style.display = 'block';
  fetchUserData();
}

// Task form handling
let form = document.getElementById("form");
form.addEventListener('submit', (e) => {
  e.preventDefault();
  formValidation();
});

let formValidation = () => {
  let textInput = document.getElementById("textInput");
  let dateInput = document.getElementById("dateInput");
  let textArea = document.getElementById("textArea");
  let msg = document.getElementById("msg");

  if (textInput.value === "") {
    msg.innerHTML = "Task cannot be blank!";
  } else if (dateInput.value === "") {
    msg.innerHTML = "Due Date cannot be blank!";
  } else if (dateInput.value < Date(Date.now())){
    msg.innerHTML = "Due date cannot be in the past";
  } else {
    msg.innerHTML = "";
    if (currentTaskID) {
      updateTask(); // Update existing task if currentTaskID exists
    } else {
      createNewTask(); // Create new task if currentTaskID is null
    }
  }
};

let createNewTask = () => {
  let userID = localStorage.getItem('currentUserID');
  let textInput = document.getElementById("textInput");
  let dateInput = document.getElementById("dateInput");
  let textArea = document.getElementById("textArea");

  const taskData = {
    userID: userID,
    taskName: textInput.value,
    taskDesc: textArea.value,
    taskDateDue: dateInput.value
  };

  fetch('/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      return response.json();
    })
    .then(data => {
      alert('Task created successfully');
      displayTasks();
      resetForm();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while creating the task');
    });
};

let updateTask = () => {
  let textInput = document.getElementById("textInput");
  let dateInput = document.getElementById("dateInput");
  let textArea = document.getElementById("textArea");

  const taskData = {
    taskName: textInput.value,
    taskDesc: textArea.value,
    taskDateDue: dateInput.value
  };

  fetch(`/tasks/${currentTaskID}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      return response.text();
    })
    .then(data => {
      alert(data); // Display success message
      displayTasks(); // Refresh task list
      resetForm(); // Clear form fields
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while updating the task');
    });
};

// Delete task
let deleteTask = (taskID) => {
  fetch(`/tasks/${taskID}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      return response.text();
    })
    .then(data => {
      alert(data); // Display success message
      displayTasks(); // Refresh task list
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while deleting the task');
    });
};

let currentTaskID = null;
function showModal() {
  // Check if the elements exist before accessing their properties
  const profileNameElement = document.getElementById("profileName");
  const profileEmailElement = document.getElementById("profileEmail");
  const profileDateCreatedElement = document.getElementById("profileDateCreated");
  const profileTasksCompletedElement = document.getElementById("profileTasksCompleted");
  const coinsElement = document.getElementById("coins");

  // Check if elements are found before accessing properties
  if (profileNameElement && profileEmailElement && profileDateCreatedElement && profileTasksCompletedElement && coinsElement) {
    // Set innerText properties
    profileNameElement.innerText = "Some Name";
    profileEmailElement.innerText = "email@example.com";
    profileDateCreatedElement.innerText = "Some Date";
    profileTasksCompletedElement.innerText = "Some Tasks Completed";
    coinsElement.innerText = "Some Coins";
    // Other actions in showModal()
  } else {
    console.error("Elements not found");
  }
}
function editTask(taskID) {
  fetch(`/tasks/getTask/${taskID}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch task data');
      }
      return response.json();
    })
    .then(taskData => {
      const dateDue = new Date(taskData.taskDateDue).toISOString().split('T')[0];
      // Populate form fields with task data for editing
      document.getElementById("textInput").value = taskData.taskName;
      document.getElementById("dateInput").value = dateDue;
      document.getElementById("textArea").value = taskData.taskDesc;
      // Set the currentTaskID to the taskID for updating
      currentTaskID = taskID;
      showModal();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while fetching task data');
    });
}



let resetForm = () => {
  document.getElementById("textInput").value = "";
  document.getElementById("dateInput").value = "";
  document.getElementById("textArea").value = "";
  form.removeAttribute("data-task-id");
};

document.addEventListener("DOMContentLoaded", function () {
  const editButtons = document.querySelectorAll(".edit-btn");

  // Attach click event listener to each edit button
  editButtons.forEach(button => {
    button.addEventListener("click", function () {
      // Extract task ID from the button's dataset
      const taskID = button.dataset.taskId;
      // Call editTask function with the task ID
      editTask(taskID);
    });
  });

  displayTasks();
});
function displayTasks() {
  let userID = localStorage.getItem('currentUserID');
  let tasksContainer = document.getElementById("tasks");
  tasksContainer.innerHTML = ''; // Clear existing tasks

  fetch('/tasks/getUser/' + userID)
    .then(response => response.json())
    .then(tasks => {
      tasks.forEach(task => {
        const taskElement = document.createElement("div");
        taskElement.id = `task-${task._id}`;

        const taskNameHeader = document.createElement("h3");
        taskNameHeader.textContent = task.taskName;
        taskElement.appendChild(taskNameHeader);

        const taskDescParagraph = document.createElement("p");
        taskDescParagraph.textContent = task.taskDesc;
        taskElement.appendChild(taskDescParagraph);

        const taskDueSpan = document.createElement("span");
        taskDueSpan.textContent = `Due: ${new Date(task.taskDateDue).toLocaleDateString()}`;
        taskElement.appendChild(taskDueSpan);

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.setAttribute("type", "button"); // Ensure it's not a submit button
        editButton.setAttribute("data-bs-toggle", "modal"); // Add data-toggle attribute
        editButton.setAttribute("data-bs-target", "#form"); // Add data-target attribute
        editButton.setAttribute("data-task-id", task._id); // Add data-task-id attribute
        editButton.classList.add("edit-btn");
        editButton.addEventListener("click", () => editTask(task._id));
        taskElement.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteTask(task._id));
        taskElement.appendChild(deleteButton);

        tasksContainer.appendChild(taskElement);
      });
    })
    .catch(error => {
      console.error('Error fetching tasks:', error);
    });
}

//Copy over
window.onload = function() {
  let userID = localStorage.getItem("currentUserID")
  if (userID == null || userID == undefined) {
      window.location.href = "/"
      console.log(userID)
  } else {
      console.log("no user")
  }
};
