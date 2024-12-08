// Import necessary classes to manage employees, display modals, and handle search functionality
import { EmployeeManager } from './EmployeeManager.js';
import { Modal } from './Modal.js';
import { Search } from './Search.js';

// Main application class to initialize and manage core functionalities, including employee data, modals, and search
class App {
    private employeeURL: string; // API URL for fetching employee data
    private employeeManager: EmployeeManager; // Instance to manage employee data
    private modal: Modal; // Instance to handle displaying and navigating modals
    private search: Search; // Instance to handle search functionality

    constructor(employeeURL: string) {
        this.employeeURL = employeeURL;
        this.employeeManager = new EmployeeManager(this.employeeURL); // Initializes employee manager with API URL
        this.modal = new Modal(); // Initializes modal for employee details
        this.search = new Search(this.employeeManager); // Initializes search with employee manager reference
    }

    /**
     * Initialize the app by fetching employee data, setting up search, and adding event listeners
     */
    init() {
        // Fetch employee data and initialize the search component
        this.employeeManager.fetchEmployees();
        this.search.init();

        // Set up event listeners for UI interactions
        this.setupEventListeners();
    }

    /**
     * Private method for setting up event listeners
     */ 
    private setupEventListeners() {
        // Event listener for opening the modal on click
        document.getElementById('gallery')?.addEventListener('click', (e) => this.handleGalleryClick(e));

        // Event listener for opening the modal on Enter key press
        document.getElementById('gallery')?.addEventListener('keyup', (e) => this.handleGalleryKeyup(e));
        
        // Close the modal when clicking outside or pressing escape
        window.addEventListener('click', (e) => this.handleOutsideModalClick(e));
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    /**
     * Handler for gallery clicks, identifies the clicked card and displays the corresponding employee's modal
     */
    private handleGalleryClick(e: Event) {
        // Check if the clicked element is an employee card
        const clickedCard = (e.target as HTMLElement).closest('.card');
        if (clickedCard) {
            // Retrieve the employee's email from the card and find the employee object
            const emailElement = clickedCard.querySelector('.card-text') as HTMLElement;
            const employeeEmail = emailElement?.textContent || '';
            const employee = this.employeeManager.filteredEmployees.find(emp => emp.email === employeeEmail);

            // If employee is found, display their details in the modal
            if (employee) {
                this.modal.displayModal(employee, this.employeeManager.filteredEmployees);
                this.trapFocus(this.modal.modalContainer!);
            }
        }
    }

    /** 
     * Handler for keydown events on gallery cards.
     * Opens the modal if Enter is pressed while focussing on a card.
     */
    private handleGalleryKeyup(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            // Ensure that the focused card is an employee card
            const focusedCard = document.activeElement?.closest('.card');
            if (focusedCard) {
                // Retrieve the employee's email from the card and find the employee object
                const emailElement = focusedCard.querySelector('.card-text') as HTMLElement;
                const employeeEmail = emailElement?.textContent || '';
                const employee = this.employeeManager.filteredEmployees.find(emp => emp.email === employeeEmail);
    
                // If employee is found, display their details in the modal
                if (employee) {
                    this.modal.displayModal(employee, this.employeeManager.filteredEmployees);
                    this.trapFocus(this.modal.modalContainer!);
                }
            }
        }
    }
    
    /**
     * Handler for clicking outside the modal to close it
     */
    private handleOutsideModalClick(e: Event) {
        // Check if the click was on the modal container itself, indicating an outside click
        if ((e.target as HTMLElement).classList.contains('modal-container')) {
            this.modal.closeModal();
        }
    }

    /**
     * Handler for closing the modal when the Escape key is pressed
     */
    private handleKeydown(e: KeyboardEvent) {
        const activeModal = document.querySelector('.modal-container') as HTMLElement;
        if (e.key === 'Escape' && activeModal) {
            this.modal.closeModal();
        } else if (e.key === 'Tab' && activeModal) {
            e.preventDefault();
            this.trapFocus(activeModal);
        }
    }

    private trapFocus(modalElement: HTMLElement): void {
        const focusableElements = modalElement.querySelectorAll<HTMLElement>(
            'button, a, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        console.log(focusableElements);

    
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
    
        // Focus the first element initially
        firstElement.focus();
    
        const focusHandler = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) { // Shift + Tab (reverse order)
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement?.focus();
                    }
                } else { // Tab (forward order)
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement?.focus();
                    }
                }
            }
        };
    
        // Attach the handler specifically for the modal
        modalElement.addEventListener('keydown', focusHandler);
    
        // Cleanup listener when the modal is closed
        this.modal.closeModal = (() => {
            const originalCloseModal = this.modal.closeModal.bind(this.modal);
            return () => {
                modalElement.removeEventListener('keydown', focusHandler);
                originalCloseModal();
            };
        })();
    }    
}

// Instantiate and initialize the app with a URL for fetching employee data
const employeeURL = `https://randomuser.me/api/?results=12&inc=picture,name,email,location,dob,cell,&nat=us`;
const appInstance = new App(employeeURL);
appInstance.init();
