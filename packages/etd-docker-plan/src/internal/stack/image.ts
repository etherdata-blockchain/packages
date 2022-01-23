export interface ImageStack {
  imageId?: string;
  image: string;
  tag: string;
}

export class Image {
  /**
   * List of images to be pull
   */
  images: ImageStack[];

  private readonly originImages: ImageStack[];

  /**
   * List of images to be removed
   */
  imagesRemoved: ImageStack[] = [];

  constructor(images: ImageStack[]) {
    this.images = JSON.parse(JSON.stringify(images));
    this.originImages = JSON.parse(JSON.stringify(images));
    this.imagesRemoved = [];
  }

  /**
   * Update current image list.
   * If there is an existing image, then remove the old one and update with the latest one
   * @param image
   */
  update(image: ImageStack): void {
    const foundIndex = this.images.findIndex((i) => i.image === image.image);
    if (foundIndex > -1) {
      const foundInRemoved = this.imagesRemoved.find(
        (i) => i.image === image.image
      );

      const inOriginalImage = this.originImages.find(
        (i) => i.image === image.image
      );

      const isSameTag = this.images[foundIndex].tag === image.tag;

      if (!foundInRemoved && inOriginalImage && !isSameTag) {
        this.imagesRemoved.push(this.images[foundIndex]);
      }

      this.images[foundIndex] = image;
    } else {
      this.images.push(image);
    }
  }

  /**
   * Remove image from image stack
   * @param image
   */
  remove(image: ImageStack): void {
    const index = this.images.findIndex(
      (i) => i.image === image.image && i.tag === image.tag
    );
    if (index > -1) {
      this.images.splice(index, 1);
      this.imagesRemoved.push(image);
    } else {
      throw Error(`Image <${image.image}:${image.tag}> not found`);
    }
  }
}
