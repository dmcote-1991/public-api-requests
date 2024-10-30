import { Employee, Name, EmpLocation } from './Employee.js';

interface ApiEmployee {
  picture: { large: string };
  name: Name;
  email: string; 
  location: EmpLocation;
  dob: { date: string };
  cell: string;
}

export class EmployeeManager {
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
