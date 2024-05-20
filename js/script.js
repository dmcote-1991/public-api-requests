let employees = [];
const employeeURL = `https://randomuser.me/api/?results=12&inc=picture,name,email,location,dob,cell,&nat=us`;
const gallery = document.getElementById(`gallery`);
const modalContainer = document.querySelector(`.modal-container`);
const searchContainer = document.querySelector(`.search-container`);

/**
 * Fetches employee data from the API.
 * Parses the response as JSON and updates the employees array.
 * Calls displayEmployees to update the DOM.
 * Handles any errors that occur during the fetch operation.
 *
 * @param {string} url - The URL to fetch data from
 * @returns {Promise<Array>} - A promise that resolves to an array of employee objects
 */
async function getEmployees(url) {
    try {
        const response = await fetch(url);
        if(!response.ok) throw new Error(`Something went wrong`);
        const data = await response.json();
        employees = data.results;
        displayEmployees(employees);
        return employees;
    } catch (error) {
        console.log(error);
    }
}

/**
 * Generates and inserts HTML to display employee data in the gallery.
 * Each employee object is converted into a card element.
 *
 * @param {Array} employees - Array of employee objects to display
 */
function displayEmployees(employees) {
    const employeesHTML = employees
        .map(
            (employee) => `
            <div class="card">
                <div class="card-img-container">
                    <img class="card-img" src="${employee.picture.large}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                    <p class="card-text">${employee.email}</p>
                    <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
                </div>
            </div>
            `
        )
        .join('');
    gallery.insertAdjacentHTML(`beforeend`, employeesHTML);
}

getEmployees(employeeURL);

/**
 * Generates and inserts the HTML for the search bar into the search container.
 */
function displaySearch() {
    const searchHTML = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
    `;
    searchContainer.insertAdjacentHTML(`beforeend`, searchHTML);
}

displaySearch();

/**
 * Adds a keyup event listener to the search input field.
 * Filters the displayed employee cards by name based on the user's search input.
 */
const searchInput = document.getElementById(`search-input`);
searchInput.addEventListener(`keyup`, (e)=> {
    const userInput = e.target.value.toLowerCase();
    const employeeCards = document.querySelectorAll(`.card`);
    employeeCards.forEach((card) => {
        const nameElement = card.querySelector(`.card-name`);
        const employeeName = nameElement.textContent.toLocaleLowerCase();
        if (employeeName.includes(userInput)) {
            card.style.display = `flex`;
        } else {
            card.style.display = `none`;
        }
    })
 });

/**
 * Creates and displays a modal with detailed employee information.
 * The modal includes the employee's picture, name, email, location, cell, and birthdate.
 *
 * @param {Object} employee - The employee object to display in the modal
 */
function displayModal(employee) {
    const location = `${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}`;
    const dob = new Date(employee.dob.date);
    const dobFormatted = `${dob.getMonth() + 1}/${dob.getDate()}/${dob.getFullYear()}`;
    const modalHTML = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                    <p class="modal-text">${employee.email}</p>
                    <p class="modal-text cap">${employee.location.city}, ${employee.location.state}</p>
                    <hr>
                    <p class="modal-text">${employee.cell}</p>
                    <p class="modal-text">${location}</p>
                    <p class="modal-text">Birthday: ${dobFormatted}</p>
                </div>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML(`beforeend`, modalHTML);
}

/**
 * Opens modal when a card is clicked.
 * Finds the clicked card, retrieves the corresponding employee data,
 * and displays the modal with the employee's information.
 */
gallery.addEventListener(`click`, (e) => {
    const clickedCard = e.target.closest(`.card`);
    if (clickedCard) {
        const emailElement = clickedCard.querySelector(`.card-text`);
        const employeeEmail = emailElement.textContent;
        const employee = employees.find(employee => employee.email === employeeEmail);
        if (employee) {
            displayModal(employee);
        }
    }
});

/**
 * Removes the modal from the DOM.
 */
function closeModal() {
    const modalContainer = document.querySelector('.modal-container');
    if (modalContainer) {
        modalContainer.remove();
    }
}

/**
 * Closes the modal when the close button is clicked.
 */
document.addEventListener('click', (e) => {
    const closeBtn = document.getElementById(`modal-close-btn`);
    if (closeBtn && (e.target === closeBtn || closeBtn.contains(e.target))) {
        closeModal();
    }
});

/**
 * Closes the modal when the user clicks outside the modal.
 */
window.addEventListener('click', (e) => {
    const modalContainer = document.querySelector('.modal-container');
    if (e.target === modalContainer) {
        closeModal();
    }
});

/**
 * Closes the modal when the Escape key is pressed.
 */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

/**
 * Handles navigation between employee modals.
 * Closes the current modal and displays the modal for the previous or next employee,
 * if available, based on the clicked button (#modal-prev or #modal-next).
 */
document.addEventListener('click', (e) => {
    const btnContainer = e.target.closest('.modal-btn-container');
    if (!btnContainer) return;

    const displayedEmployeeElement = document.querySelector('.modal-name');
    if (!displayedEmployeeElement) return;

    const displayedEmployee = displayedEmployeeElement.textContent;
    const currentIndex = employees.findIndex(employee => `${employee.name.first} ${employee.name.last}` === displayedEmployee);
    
    if (e.target.matches('#modal-prev')) {
        closeModal();
        if (currentIndex > 0) {
            displayModal(employees[currentIndex - 1]);
        }
    } else if (e.target.matches('#modal-next')) {
        closeModal();
        if (currentIndex < employees.length - 1) {
            displayModal(employees[currentIndex + 1]);
        }
    }
});