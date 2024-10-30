import { EmployeeManager } from './EmployeeManager.js';
import { Modal } from './Modal.js';
import { Search } from './Search.js';

class App {
    private employeeURL: string;
    private employeeManager: EmployeeManager;
    private modal: Modal;
    private search: Search;

    constructor(employeeURL: string) {
        this.employeeURL = employeeURL;
        this.employeeManager = new EmployeeManager(this.employeeURL);
        this.modal = new Modal();
        this.search = new Search(this.employeeManager);
    }

    init() {
        // Fetch employees and initialize search
        this.employeeManager.fetchEmployees();
        this.search.init();

        // Set up event listeners
        this.setupEventListeners();
    }

    private setupEventListeners() {
        // Event listener for displaying the modal
        document.getElementById('gallery')?.addEventListener('click', (e) => this.handleGalleryClick(e));
        
        // Close the modal when clicking outside or pressing escape
        window.addEventListener('click', (e) => this.handleOutsideModalClick(e));
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    private handleGalleryClick(e: Event) {
        const clickedCard = (e.target as HTMLElement).closest('.card');
        if (clickedCard) {
            const emailElement = clickedCard.querySelector('.card-text') as HTMLElement;
            const employeeEmail = emailElement?.textContent || '';
            const employee = this.employeeManager.filteredEmployees.find(emp => emp.email === employeeEmail);
            if (employee) {
                this.modal.displayModal(employee, this.employeeManager.filteredEmployees);
            }
        }
    }

    private handleOutsideModalClick(e: Event) {
        if ((e.target as HTMLElement).classList.contains('modal-container')) {
            this.modal.closeModal();
        }
    }

    private handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            this.modal.closeModal();
        }
    }
}

// Instantiate and initialize the app
const employeeURL = `https://randomuser.me/api/?results=12&inc=picture,name,email,location,dob,cell,&nat=us`;
const app = new App(employeeURL);
app.init();
