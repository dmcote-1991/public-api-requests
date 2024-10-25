# Awesome Startup Employee Directory

This project is a dynamic employee directory for a fictional startup company. It fetches employee data from the [Random User API](https://randomuser.me/) and displays it in an interactive gallery format, allowing users to view detailed information and search for employees by name.

## Features

- **Dynamic Employee Gallery**: Displays a list of employees with details such as name, email, and location.
- **Search Functionality**: Users can search for employees by name to filter the displayed results.
- **Employee Detail Modal**: Clicking on an employee card displays additional details, such as cell number, address, and birthdate, in a modal.
- **Modal Navigation**: Users can navigate between employee details using "Next" and "Prev" buttons in the modal.
- **Modal Close Options**: The modal can be closed by clicking the close button, clicking outside the modal, or pressing the "Escape" key.

## Technologies Used

- **HTML5**: For structuring the content.
- **CSS3**: For styling the user interface.
- **JavaScript (ES6)**: For fetching data, manipulating the DOM, and adding interactive features.
- **Fetch API**: For retrieving employee data from the [Random User API](https://randomuser.me/).

## Getting Started

### Prerequisites

To run this project, you'll need a modern web browser that supports ES6 JavaScript features.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dmcote-1991/public-api-requests.git

2. Navigate to the project directory:
   ```bash
   cd public-api-requests

3. Open `index.html` in your web browser

## Directory Structure

```bash
public-api-requests/
├── css/
│   ├── normalize.css
│   └── styles.css
├── js/
│   └── script.js
├── index.html
└── README.md
```

## Usage

1. Open the project in your web browser.
2. The homepage will display a list of employees fetched from the Random User API.
3. Use the search bar to filter employees by name.
4. Click on an employee card to view more details in a modal window.
5. Navigate between employee details using the "Next" and "Prev" buttons in the modal.
6. Close the modal by clicking the "X" button, clicking outside the modal, or pressing the "Escape" key.

## Code Overview

### `script.js`

- **`getEmployees(url)`**: Fetches employee data from the specified API URL, handles errors, and updates the displayed list of employees.
- **`displayEmployees(employees)`**: Renders the employee cards in the gallery based on the provided data.
- **`displaySearch()`**: Inserts a search form into the DOM.
- **`filterEmployees(userInput)`**: Filters the list of employees based on the search input.
- **`displayModal(employee, employeeList)`**: Creates a modal displaying detailed information about the selected employee.
- **`navigateModal(employeeList, currentEmployee, direction)`**: Allows navigation through employee details within the modal.
- **`closeModal()`**: Closes the currently open modal.

### Event Listeners

- **Card Click**: Opens the modal with the clicked employee's details.
- **Search Input**: Filters employees as the user types in the search bar.
- **Modal Navigation Buttons**: Switches between employee details.
- **Modal Close Options**: Closes the modal on various user actions.

## API Reference

- The project uses the [Random User API](https://randomuser.me/), fetching 12 randomly generated user profiles from the United States.
- Query parameters:
  - `results=12`: Limits the number of results to 12.
  - `inc=picture,name,email,location,dob,cell`: Specifies which fields to include in the response.
  - `nat=us`: Limits results to users from the United States.

## Acknowledgments

- Thanks to [Random User Generator](https://randomuser.me/) for providing a free API for random user data.
