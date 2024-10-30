export interface Name {
  first: string;
  last: string;
};

export interface EmpLocation {
  street: {
      number: number;
      name: string;
  };
  city: string;
  state: string;
  postcode: string;
};

export class Employee {
  picture: { large: string };
  name: Name;
  email: string;
  location: EmpLocation;
  dob: Date;
  cell: string;

  constructor(
      picture: { large: string }, 
      name: Name, 
      email: string, 
      location: EmpLocation, 
      dob: string, 
      cell: string
  ) {
      this.picture = picture;
      this.name = name;
      this.email = email;
      this.location = location;
      this.dob = new Date(dob);
      this.cell = cell;
  }

  getFormattedDOB(): string {
      return `${this.dob.getMonth() + 1}/${this.dob.getDate()}/${this.dob.getFullYear()}`;
  }

  getLocationString(): string {
      return `${this.location.street.number} ${this.location.street.name}, ${this.location.city}, ${this.location.state} ${this.location.postcode}`;
  }

  getFullName(): string {
      return `${this.name.first} ${this.name.last}`;
  }
}
