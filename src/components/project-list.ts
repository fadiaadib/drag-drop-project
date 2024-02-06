import Component from "./base-component";
import { DragTarget } from "../models/drag-drop";
import { Project, Status } from "../models/project";
import { ProjectState } from "../state/project-state";
import { ProjectItem } from "./project-item";
import { Autobind } from "../decorators/autobind";

// Project List class
export class ProjectList
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
