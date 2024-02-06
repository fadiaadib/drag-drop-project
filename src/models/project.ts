namespace App {
  // Status enumerator
  export enum Status {
    Active,
    Finished,
  }

  // Project Model
  export class Project {
    get personsText() {
      return this.people == 1
        ? `${this.people} person`
        : `${this.people} people`;
    }

    constructor(
      public id: string,
      public title: string,
      public description: string,
      public people: number,
      public status: Status
    ) {}
  }
}
