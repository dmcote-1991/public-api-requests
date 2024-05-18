let employees = [];
const gallery = document.getElementById(`gallery`);
const employeeURL = `https://randomuser.me/api/?results=12&inc=picture,name,email,location`;

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
                    <img class="card-img" src="${employee.picture.thumbnail}" alt="profile picture">
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