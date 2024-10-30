import { EmployeeManager } from './EmployeeManager.js';

export class Search {
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
