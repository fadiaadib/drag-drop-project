import { Validatable, validate } from "../utils/validation";
import Component from "./base-component";
import { ProjectState } from "../state/project-state";
import { Autobind } from "../decorators/autobind";

// Project Input class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

    // Get access to the internal elements of the form
    this.titleInputElement = this.element.querySelector("#title")!;
    this.descriptionInputElement = this.element.querySelector("#description")!;
    this.peopleInputElement = this.element.querySelector("#people")!;

    // Attach the new element into the app div
    this.configure();
  }

  configure() {
    // Add event listener to the submit form
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent(): void {}

  private getUserInput(): [string, string, number] | void {
    // Fetch the values from the form
    const title = this.titleInputElement.value;
    const description = this.descriptionInputElement.value;
    const people = +this.peopleInputElement.value;

    const titleValidator: Validatable = {
      value: title,
      required: true,
    };
    const descriptionValidator: Validatable = {
      value: description,
      required: true,
      minLength: 5,
    };
    const peopleValidator: Validatable = {
      value: people,
      required: true,
      minValue: 1,
    };

    // Validate the inputs
    if (
      !validate(titleValidator) ||
      !validate(descriptionValidator || !validate(peopleValidator))
    ) {
      alert("Invalid input, try again!");
      return;
    } else {
      // Return the inputs
      return [title, description, people];
    }
  }

  private clearUserInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @Autobind
  private submitHandler(event: Event) {
    // Prevent default binding
    event.preventDefault();

    // Get the user inputs
    const userInput = this.getUserInput();
    if (Array.isArray(userInput)) {
      // Deconstruct the user inputs
      const [title, description, people] = userInput;

      // Create a new project object
      ProjectState.instance().addProject(title, description, people);

      // Clear user inputs
      this.clearUserInputs();
    }
  }
}
