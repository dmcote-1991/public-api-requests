import { Employee, Name, EmpLocation } from './Employee.js';

// Define an interface to represent the structure of employee data from the API
interface ApiEmployee {
    picture: { large: string }; // Profile picture URL
    name: Name; // Name of employee (first and last)
    email: string; 
    location: EmpLocation; // Employee's location details
    dob: { date: string }; // Employee's date of birth in string format
    cell: string;
}

// The EmployeeManager class manages fetching, storing, filtering, and displaying employees
export class EmployeeManager {
    private url: string; // URL to fetch employee data
    employees: Employee[]; // Array to hold all fetched employees
    filteredEmployees: Employee[]; // Array for holding filtered employees based on search

    constructor(url: string) {
        this.url = url; // Set the URL for employee data
        this.employees = []; // Initialize employees array
        this.filteredEmployees = []; // Initialize filtered employees array
    }

    /**
     * Fetches employee data from the API, processes it, and displays the employees
     */
    async fetchEmployees(): Promise<void> {
        try {
            // Fetch data from the provided URL
            const response = await fetch(this.url);
            if (!response.ok) throw new Error('Something went wrong'); // Error handling if request fails

            const data = await response.json(); // Parse JSON data

            // Map API data to Employee instances and populate employees array
            this.employees = data.results.map((emp: ApiEmployee) => new Employee(
                emp.picture,
                emp.name,
                emp.email,
                emp.location,
                emp.dob.date,
                emp.cell
            ));

            // Initialize filteredEmployees with all employees
            this.filteredEmployees = [...this.employees];

            // Display the list of employees in the UI
            this.displayEmployees(this.filteredEmployees);
        } catch (error) {
            console.log(error); // Log any errors that occur during fetch
        }
    }

    /**
     * Renders a list of employees to the gallery element in the UI
     */
    displayEmployees(employeeList: Employee[]): void {
        const gallery = document.getElementById('gallery'); // Get the gallery container
        if (!gallery) return; // Exit if gallery not found
        gallery.innerHTML = ''; // Clear existing content

        // Generate HTML for each employee and insert it into the gallery
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

        // Add generated HTML to the gallery
        gallery.insertAdjacentHTML('beforeend', employeesHTML); 
    }

    /**
     * Filters the employee list based on a search term and updates the displayed list
     */
    filterEmployees(searchTerm: string): void {
        // Filter employees by checking if their full name includes the search term
        this.filteredEmployees = this.employees.filter(employee => 
            employee.getFullName().toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Display the filtered list of employees
        this.displayEmployees(this.filteredEmployees);
    }
}
