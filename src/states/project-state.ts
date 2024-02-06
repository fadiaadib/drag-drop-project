/// <reference path="../models/project.ts"/>

namespace App {
  // Listener type
  type Listener<T> = (items: T[]) => void;

  // Abstract State model
  abstract class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listener: Listener<T>) {
      this.listeners.push(listener);
    }
  }

  // Project State Management (singleton)
  export class ProjectState extends State<Project> {
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
}
