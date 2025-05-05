export interface Image {
    _id?: string; // Optional because MongoDB will generate this
    productId: string; // ID of the product this image belongs to
    url: string; // URL or file path of the image
    description?: string; // Optional description of the image
    createdAt?: Date; // Optional, can be set by the database
    updatedAt?: Date; // Optional, can be set by the database
}