// Import the Employee class to use its data structure
import { Employee } from './Employee.js';

// The Modal class handles displaying and navigating through employee details in a modal window
export class Modal {
    // Container element for the modal, initially null
    public modalContainer: HTMLElement | null = null;

    /**
     * Displays the modal with the employee's details
     * @param employee - The employee to display in the modal
     * @param employeeList - The list of all employees, used for navigation
     */
    displayModal(employee: Employee, employeeList: Employee[]): void {
        // Format location and date of birth for display
        const location = employee.getLocationString();
        const dobFormatted = employee.getFormattedDOB();

        // Create the modal HTML structure with employee details
        const modalHTML = 
            `<div class="modal-container" role="dialog" aria-labelledby="modal-title" aria-describedby="modal-info">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn" aria-label="Close Modal">
                        <strong>X</strong>
                    </button>
                    <div id="modal-info class="modal-info-container">
                        <img class="modal-img" src="${employee.picture.large}" alt="profile picture of ${employee.getFullName()}">
                        <h3 id="modal-title" class="modal-name cap">${employee.getFullName()}</h3>
                        <p class="modal-text">${employee.email}</p>
                        <p class="modal-text cap">${employee.location.city}, ${employee.location.state}</p>
                        <hr>
                        <p class="modal-text">${employee.cell}</p>
                        <p class="modal-text">${location}</p>
                        <p class="modal-text">Birthday: ${dobFormatted}</p>
                    </div>
                </div>
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn" aria-label="Previous Employee">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn" aria-label="Next Employee">Next</button>
                </div>
            </div>`;

        // Insert the modal HTML into the document body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Set modalContainer to the newly created modal element
        this.modalContainer = document.querySelector('.modal-container');

        // Set up navigation and close event listeners for the modal
        document.getElementById('modal-prev')?.addEventListener('click', () => this.navigateModal(employeeList, employee, -1));
        document.getElementById('modal-next')?.addEventListener('click', () => this.navigateModal(employeeList, employee, +1));
        document.getElementById('modal-close-btn')?.addEventListener('click', () => this.closeModal());
    }

    /**
     * Navigates through the employee list within the modal
     * @param employeeList - List of employees to navigate through
     * @param currentEmployee - The employee currently displayed in the modal
     * @param direction - The navigation direction (-1 for previous, +1 for next)
     */
    navigateModal(employeeList: Employee[], currentEmployee: Employee, direction: number): void {
        // Find the index of the current employee
        const currentIndex = employeeList.indexOf(currentEmployee);
        let newIndex = currentIndex + direction;

        // Handle wrapping around the list if at the beginning or end
        if (newIndex < 0) {
            newIndex = employeeList.length - 1;
        } else if (newIndex >= employeeList.length) {
            newIndex = 0;
        }

        // Close the current modal and display the next or precious employee's modal
        this.closeModal();
        this.displayModal(employeeList[newIndex], employeeList);
    }

    /**
     * Closes the modal and removes it from the DOM
     */
    closeModal(): void {
        if (this.modalContainer) {
            this.modalContainer.remove(); // Remove the modal from the document
            this.modalContainer = null; // Reset modalContainer to null
        }
    }
}
