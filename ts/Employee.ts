// Define an interface for employee names
export interface Name {
  first: string; // First name of the employee
  last: string; // Last name of the employee
};

// Define an interface for employee location details
export interface EmpLocation {
  street: {
      number: number; // Street number of the employee's address
      name: string; // Street name of the employee's address
  };
  city: string; // City where the employee resides
  state: string; // State where the employee resides
  postcode: string; // Postal code of the employee's location
};

// Define an Employee class for handling employee data
export class Employee {
  picture: { large: string }; // URL for the employee's profile picture
  name: Name;                 // Name details (first and last name) of the employee
  email: string;              // Employee's email address
  location: EmpLocation;      // Employee's location details
  dob: Date;                  // Employee's date of birth, stored as a Date object
  cell: string;               // Employee's cell phone number

  constructor(
      picture: { large: string },  // Profile Picture URL
      name: Name,                  // Name (first and last)
      email: string,               // Email address
      location: EmpLocation,       // Location details
      dob: string,                 // Date of birth as a string, converted to Date type
      cell: string                 // Cell phone number
  ) {
      this.picture = picture;
      this.name = name;
      this.email = email;
      this.location = location;
      this.dob = new Date(dob); // Convert dob string to Date object
      this.cell = cell;
  }

  /**
   * Method to return the employee's date of birth in MM/DD/YYYY format
   */
  getFormattedDOB(): string {
      return `${this.dob.getMonth() + 1}/${this.dob.getDate()}/${this.dob.getFullYear()}`;
  }

  /**
   * Method to return a formatted address string for the employee's location
   */
  getLocationString(): string {
      return `${this.location.street.number} ${this.location.street.name}, ${this.location.city}, ${this.location.state} ${this.location.postcode}`;
  }

  /**
   * Method to return the full name of the employee (first and last name)
   */
  getFullName(): string {
      return `${this.name.first} ${this.name.last}`;
  }
}
