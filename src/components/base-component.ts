// Base class
export default abstract class Component<
  T extends HTMLElement,
  U extends HTMLElement
> {
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
