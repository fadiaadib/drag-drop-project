// Drag and Drop interfaces
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}
interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

// Status enumerator
enum Status {
  Active,
  Finished,
}

// Listener type
type Listener<T> = (items: T[]) => void;

// Project Model
class Project {
  get personsText() {
    return this.people == 1 ? `${this.people} person` : `${this.people} people`;
  }

  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: Status
  ) {}
}

// Abstract State model
abstract class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listener: Listener<T>) {
    this.listeners.push(listener);
  }
}

// Project State Management (singleton)
class ProjectState extends State<Project> {
  private static _instance: ProjectState;
  private projects: Project[] = [];

  static instance() {
    if (!this._instance) {
      this._instance = new ProjectState();
    }
    return this._instance;
  }

  private constructor() {
    super();
  }

  private updateListeners() {
    for (const listener of this.listeners) {
      // Call slice to create a copy
      listener(this.projects.slice());
    }
  }

  addProject(title: string, description: string, people: number) {
    // Create a new project object
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      people,
      Status.Active
    );

    // Add the new project to the list
    this.projects.push(newProject);

    // Update listeners
    this.updateListeners();
  }

  moveProject(id: string, newStatus: Status) {
    const project = this.projects.find((project) => project.id === id);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      // Update listeners
      this.updateListeners();
    }
  }
}

// Autobind method decorator
function Autobind(_: any, _2: string, propertyDesc: PropertyDescriptor) {
  const newPropertDescriptor: PropertyDescriptor = {
    enumerable: false,
    configurable: true,
    get() {
      return propertyDesc.value.bind(this);
    },
  };

  return newPropertDescriptor;
}

// Validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
}

function validate(input: Validatable) {
  let valid = true;

  if (input.required) {
    valid = valid && input.value.toString().trim().length != 0;
  }
  if (input.minLength != null && typeof input.value === "string") {
    valid = valid && input.value.trim().length >= input.minLength;
  }
  if (input.maxLength != null && typeof input.value === "string") {
    valid = valid && input.value.trim().length <= input.maxLength;
  }
  if (input.minValue != null && typeof input.value === "number") {
    valid = valid && input.value >= input.minValue;
  }
  if (input.maxValue != null && typeof input.value === "number") {
    valid = valid && input.value <= input.maxValue;
  }

  return valid;
}

// Base class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateID: string,
    hostID: string,
    atStart: boolean,
    elementID?: string
  ) {
    // Extract the template element
    this.templateElement = document.getElementById(
      templateID
    )! as HTMLTemplateElement;

    // Extract the host
    this.hostElement = document.getElementById(hostID)! as T;

    // Extract the section
    // Save the HTML inside the project input template (deep = true)
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if (elementID) {
      this.element.id = elementID;
    }

    this.attach(atStart);
  }

  private attach(atStart: boolean) {
    // Insert the importedNode inside the hostElement
    this.hostElement.insertAdjacentElement(
      atStart ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

// Project Item class
class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  constructor(hostID: string, private project: Project) {
    super("single-project", hostID, true, project.id);

    this.configure();
    this.renderContent();
  }

  configure(): void {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent(): void {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent =
      this.project.personsText + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }

  // Draggable methods
  @Autobind
  dragStartHandler(event: DragEvent): void {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  @Autobind
  dragEndHandler(event: DragEvent): void {
    console.log("DragEnd", event);
  }
}

// Project List class
class ProjectList
  extends Component<HTMLDivElement, HTMLDivElement>
  implements DragTarget
{
  projects: Project[] = [];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);

    this.configure();

    // Add the new sectionElement into the app
    this.renderContent();
  }

  configure() {
    // Add self as a listener
    ProjectState.instance().addListener((projects: any[]) => {
      this.projects = projects.filter((item: Project) => {
        return (
          (item.status === Status.Active && this.type === "active") ||
          (item.status === Status.Finished && this.type === "finished")
        );
      });

      this.renderProjects();
    });

    // Drop events handlers
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("drop", this.dropHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
  }

  renderContent() {
    // Get the ul element and add an ID to id
    this.element.querySelector("ul")!.id = `${this.type}-projects-list`;

    // Get the h2 element
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  private renderProjects() {
    // Get the ul of the projects list
    const projectListElement = document.getElementById(
      `${this.type}-projects-list`
    )!;
    projectListElement.innerHTML = "";

    // Loop on all projects
    this.projects.map(
      (project) => new ProjectItem(projectListElement.id, project)
    );
  }

  @Autobind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer?.types[0] === "text/plain") {
      event.preventDefault();
      // Change appearance when a draggable item enters the element
      this.element.querySelector("ul")?.classList.add("droppable");
    }
  }

  @Autobind
  dragLeaveHandler(_: DragEvent): void {
    // Change appearance back to normal
    this.element.querySelector("ul")?.classList.remove("droppable");
  }

  @Autobind
  dropHandler(event: DragEvent): void {
    const projectId = event.dataTransfer?.getData("text/plain");
    if (projectId) {
      ProjectState.instance().moveProject(
        projectId,
        this.type === "active" ? Status.Active : Status.Finished
      );
      this.element.querySelector("ul")?.classList.remove("droppable");
    }
  }
}

// Project Input class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
