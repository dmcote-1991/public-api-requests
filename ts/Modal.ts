import { Employee } from './Employee.js';

export class Modal {
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
