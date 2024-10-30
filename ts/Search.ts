// Import the EmployeeManager class to manage employee data
import { EmployeeManager } from './EmployeeManager.js';

// The Search class handles creating a search interface and filtering employees based on user input
export class Search {
    private employeeManager: EmployeeManager; // EmployeeManager instance to handle employee data

    // Initialize Search with an EmployeeManager instance
    constructor(employeeManager: EmployeeManager) {
        this.employeeManager = employeeManager;
    }

    /**
     * Initialize the search functionality by rendering the search bar and setting up event listeners
     */
    init(): void {
        this.displaySearch(); // Render the search input in the UI

        // Add an event listener to the search input field for filtering employees in real time
        const searchInput = document.getElementById('search-input');
        searchInput?.addEventListener('keyup', (e) => {
            e.preventDefault(); // Prevent any default behavior on keyup

            // Get the user's search input
            const userInput = (e.target as HTMLInputElement).value;

            // Filter the employees based on user input through EmployeeManager
            this.employeeManager.filterEmployees(userInput);
        });
    }

    /**
     * Renders the search input field in the search container
     */
    displaySearch(): void {
        const searchContainer = document.querySelector('.search-container');
        if (!searchContainer) return; // Exit if search container is not present in the DOM

        // HTML structure for the search form
        const searchHTML = `
            <form action="#" method="get">
                <input type="search" id="search-input" class="search-input" placeholder="Search...">
                <input type="submit" value"&#x1F50D;" id="search-submit" class="search-submit">
            </form>
        `;

        // Insert the search HTML into the search container
        searchContainer.insertAdjacentHTML('beforeend', searchHTML);
    }
}
