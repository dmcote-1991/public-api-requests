interface Name {
    first: string;
    last: string;
};

interface EmpLocation {
    street: {
        number: number;
        name: string;
    };
    city: string;
    state: string;
    postcode: string;
};

class Employee {
    picture: { large: string };
    name: Name;
    email: string;
    location: EmpLocation;
    dob: Date;
    cell: string;

    constructor(
        picture: { large: string }, 
        name: Name, 
        email: string, 
        location: EmpLocation, 
        dob: string, 
        cell: string
    ) {
        this.picture = picture;
        this.name = name;
        this.email = email;
        this.location = location;
        this.dob = new Date(dob);
        this.cell = cell;
    }

    getFormattedDOB(): string {
        return `${this.dob.getMonth() + 1}/${this.dob.getDate()}/${this.dob.getFullYear()}`;
    }

    getLocationString(): string {
        return `${this.location.street.number} ${this.location.street.name}, ${this.location.city}, ${this.location.state} ${this.location.postcode}`;
    }

    getFullName(): string {
        return `${this.name.first} ${this.name.last}`;
    }
}

interface ApiEmployee {
    picture: { large: string };
    name: Name;
    email: string; 
    location: EmpLocation;
    dob: { date: string };
    cell: string;
}

class EmployeeManager {
    private url: string;
    employees: Employee[];
    filteredEmployees: Employee[];

    constructor(url: string) {
        this.url = url;
        this.employees = [];
        this.filteredEmployees = [];
    }

    async fetchEmployees(): Promise<void> {
        try {
            const response = await fetch(this.url);
            if (!response.ok) throw new Error('Something went wrong');

            const data = await response.json();

            this.employees = data.results.map((emp: ApiEmployee) => new Employee(
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

    displayEmployees(employeeList: Employee[]): void {
        const gallery = document.getElementById('gallery');
        if (!gallery) return;
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

    filterEmployees(searchTerm: string): void {
        this.filteredEmployees = this.employees.filter(employee => 
            employee.getFullName().toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.displayEmployees(this.filteredEmployees);
    }
}

class Modal {
    private modalContainer: HTMLElement | null = null;

    displayModal(employee: Employee, employeeList: Employee[]): void {
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
        document.getElementById('modal-prev')?.addEventListener('click', () => this.navigateModal(employeeList, employee, -1));
        document.getElementById('modal-next')?.addEventListener('click', () => this.navigateModal(employeeList, employee, +1));
        document.getElementById('modal-close-btn')?.addEventListener('click', () => this.closeModal());
    }

    navigateModal(employeeList: Employee[], currentEmployee: Employee, direction: number): void {
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

    closeModal(): void {
        if (this.modalContainer) {
            this.modalContainer.remove();
            this.modalContainer = null;
        }
    }
}

class Search {
    private employeeManager: EmployeeManager;

    constructor(employeeManager: EmployeeManager) {
        this.employeeManager = employeeManager;
    }

    init(): void {
        this.displaySearch();
        const searchInput = document.getElementById('search-input');
        searchInput?.addEventListener('keyup', (e) => {
            e.preventDefault();
            const userInput = (e.target as HTMLInputElement).value;
            this.employeeManager.filterEmployees(userInput);
        });
    }

    displaySearch(): void {
        const searchContainer = document.querySelector('.search-container');
        if (!searchContainer) return;
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
const employeeURL: string = `https://randomuser.me/api/?results=12&inc=picture,name,email,location,dob,cell,&nat=us`;
const employeeManager = new EmployeeManager(employeeURL);
const modal = new Modal();
const search = new Search(employeeManager);

// Fetch employees and set up the search
employeeManager.fetchEmployees();
search.init();

// Event listener for displaying modal
document.getElementById('gallery')?.addEventListener('click', (e) => {
    const clickedCard = (e.target as HTMLElement).closest('.card');
    if (clickedCard) {
        const emailElement = clickedCard.querySelector('.card-text') as HTMLElement;
        const employeeEmail = emailElement.textContent || '';
        const employee = employeeManager.filteredEmployees.find(emp => emp.email === employeeEmail);
        if (employee) {
            modal.displayModal(employee, employeeManager.filteredEmployees);
        }
    }
});

// Close the modal when clicking outside or pressing escape
window.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).classList.contains('modal-container')) {
        modal.closeModal();
    }
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modal.closeModal();
    }
});
