/// <reference path="./base-component.ts"/>
/// <reference path="../models/drag-drop.ts"/>
/// <reference path="../models/project.ts"/>
/// <reference path="../decorators/autobind.ts"/>

namespace App {
  // Project Item class
  export class ProjectItem
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
}
