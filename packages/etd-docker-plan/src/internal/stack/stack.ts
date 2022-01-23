import yaml from "yaml";
import fs from "fs";
import { Configurations } from "../const/configurations";
import { ImageStack, Image } from "./image";
import { Container, ContainerStack } from "./container";

export interface StackInterface {
  update_time: string;
  images: ImageStack[];
  containers: ContainerStack[];
}

/**
 * Check whether an object is stack
 * @param object
 */
function isStackInterface(object: any): object is StackInterface {
  return (
    "update_time" in object && "images" in object && "containers" in object
  );
}

export class Stack {
  stacks?: StackInterface;

  private image: Image | undefined;

  private container: Container | undefined;

  /**
   * Update stack will create a list of update stacks based on the input new stacks.
   * @param stacks A new stack for current docker
   */
  public updateStack(stacks: StackInterface) {
    if (this.stacks === undefined) {
      this.stacks = this.newDefaultStack();
    }

    this.image = new Image(this.stacks.images);
    this.container = new Container(this.stacks.containers);

    // where one image exists in prev stack and not in current stack
    // remove it
    this.stacks.images
      .filter(
        (i) => stacks.images.find((si) => si.image === i.image) === undefined
      )
      .forEach((i) => this.image?.remove(i));

    this.stacks.containers
      .filter(
        (c) =>
          stacks.containers.find((sc) => sc.image.image === c.image.image) ===
          undefined
      )
      .forEach((c) => this.container?.remove(c));

    // where one image exists in current stack and may or may not in prev stack
    // update or add it

    stacks.images.forEach((i) => {
      this.image!.update(i);
    });

    stacks.containers.forEach((c) => {
      this.container!.update(c);
    });

    this.stacks.update_time = new Date().toISOString();
    this.stacks.images = this.image.images;
    this.stacks.containers = this.container.containers;
  }

  public readPreviousStack() {
    if (!fs.existsSync(Configurations.defaultStackPosition)) {
      return;
    }
    const data = fs.readFileSync(Configurations.defaultStackPosition, "utf-8");
    const parsedData = yaml.parse(data);
    if (isStackInterface(parsedData)) {
      this.stacks = yaml.parse(data);
      return;
    }
    throw Error("Cannot parse object as a stack");
  }

  public writeStack(): void {
    if (this.stacks === undefined) {
      throw Error("Stack is undefined");
    }
    fs.writeFileSync(
      Configurations.defaultStackPosition,
      yaml.stringify(this.stacks)
    );
  }

  /**
   * Get a list of images to be removed
   */
  public getRemovedImages() {
    return this.image?.imagesRemoved ?? [];
  }

  /**
   * Get a list of containers to be removed
   */
  public getRemovedContainers() {
    return this.container?.containersRemoved ?? [];
  }

  private newDefaultStack(): StackInterface {
    return {
      update_time: new Date().toISOString(),
      images: [],
      containers: [],
    };
  }
}
