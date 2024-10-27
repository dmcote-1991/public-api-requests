class Employee {
    constructor(picture, name, email, location, dob, cell) {
        this.picture = picture;
        this.name = name;
        this.email = email;
        this.location = location;
        this.dob = new Date(dob);
        this.cell = cell;
    }

    getFormattedDOB() {
        return `${this.dob.getMonth() + 1}/${this.dob.getDate()}/${this.dob.getFullYear()}`;
    }

    getLocationString() {
        return `${this.location.street.number} ${this.location.street.name}, ${this.location.city}, ${this.location.state} ${this.location.postcode}`;
    }

    getFullName() {
        return `${this.name.first} ${this.name.last}`;
    }
}

class EmployeeManager {
    constructor(url) {
        this.url = url;
        this.employees = [];
        this.filteredEmployees = [];
    }

    async fetchEmployees() {
        try {
            const response = await fetch(this.url);
            if (!response.ok) throw new Error('Something went wrong');

            const data = await response.json();

            this.employees = data.results.map(emp => new Employee(
                emp.picture,
                emp.name,
                emp.email,
                emp.location,
                emp.dob.date,
                emp.cell
            ));
            this.filteredEmployees = [...this.employees];
            this.displayEmployees(this.filteredEmployees);
        } catch (error) {
            console.log(error);
        }
    }

    displayEmployees(employeeList) {
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = '';
        const employeesHTML = employeeList.map(employee => `
            <div class="card">
                <div class="card-img-container">
                    <img class="card-img" src="${employee.picture.large}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${employee.getFullName()}</h3>
                    <p class="card-text">${employee.email}</p>
                    <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
                </div>
            </div>
        `).join('');
        gallery.insertAdjacentHTML('beforeend', employeesHTML);
    }

    filterEmployees(searchTerm) {
        this.filteredEmployees = this.employees.filter(employee => 
            employee.getFullName().toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.displayEmployees(this.filteredEmployees);
    }
}

class Modal {
    constructor() {
        this.modalContainer = null;
    }

    displayModal(employee, employeeList) {
        const location = employee.getLocationString();
        const dobFormatted = employee.getFormattedDOB();
        const modalHTML = `
            <div class="modal-container">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${employee.getFullName()}</h3>
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
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modalContainer = document.querySelector('.modal-container');
        document.getElementById('modal-prev').addEventListener('click', () => this.navigateModal(employeeList, employee, -1));
        document.getElementById('modal-next').addEventListener('click', () => this.navigateModal(employeeList, employee, +1));
        document.getElementById('modal-close-btn').addEventListener('click', () => this.closeModal());
    }

    navigateModal(employeeList, currentEmployee, direction) {
        const currentIndex = employeeList.indexOf(currentEmployee);
        let newIndex = currentIndex + direction;

        // Handle wrapping around list
        if (newIndex < 0) {
            newIndex = employeeList.length - 1;
        } else if (newIndex >= employeeList.length) {
            newIndex = 0;
        }

        // Close the current modal and display the new one
        this.closeModal();
        this.displayModal(employeeList[newIndex], employeeList);
    }

    closeModal() {
        if (this.modalContainer) {
            this.modalContainer.remove();
            this.modalContainer = null;
        }
    }
}

class Search {
    constructor(employeeManager) {
        this.employeeManager = employeeManager;
    }

    init() {
        this.displaySearch();
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('keyup', (e) => {
            e.preventDefault();
            const userInput = e.target.value;
            this.employeeManager.filterEmployees(userInput);
        });
    }

    displaySearch() {
        const searchContainer = document.querySelector('.search-container');
        const searchHTML = `
            <form action="#" method="get">
                <input type="search" id="search-input" class="search-input" placeholder="Search...">
                <input type="submit" value"&#x1F50D;" id="search-submit" class="search-submit">
            </form>
        `;
        searchContainer.insertAdjacentHTML('beforeend', searchHTML);
    }
}

// Initialize the app
const employeeURL = `https://randomuser.me/api/?results=12&inc=picture,name,email,location,dob,cell,&nat=us`;
const employeeManager = new EmployeeManager(employeeURL);
const modal = new Modal();
const search = new Search(employeeManager);

// Fetch employees and set up the search
employeeManager.fetchEmployees();
search.init();

// Event listener for displaying modal
document.getElementById('gallery').addEventListener('click', (e) => {
    const clickedCard = e.target.closest('.card');
    if (clickedCard) {
        const emailElement = clickedCard.querySelector('.card-text');
        const employeeEmail = emailElement.textContent;
        const employee = employeeManager.filteredEmployees.find(emp => emp.email === employeeEmail);
        if (employee) {
            modal.displayModal(employee, employeeManager.filteredEmployees);
        }
    }
});

// Close the modal when clicking outside or pressing escape
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-container')) {
        modal.closeModal();
    }
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modal.closeModal();
    }
});
