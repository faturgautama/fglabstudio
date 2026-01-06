import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';

@Component({
    selector: 'app-product-image-gallery',
    imports: [
        CommonModule,
        GalleriaModule,
        ImageModule
    ],
    templateUrl: './product-image-gallery.html',
    styleUrl: './product-image-gallery.scss',
    standalone: true
})
export class ProductImageGallery {
    @Input() images: string[] = [];
    @Input() screenshots: string[] = [];
    @Input() productTitle: string = '';

    selectedImageIndex: number = 0;
    showGalleria: boolean = false;

    get displayImages(): string[] {
        return this.screenshots && this.screenshots.length > 0
            ? this.screenshots
            : this.images && this.images.length > 0
                ? this.images
                : [];
    }

    get mainImage(): string {
        return this.displayImages.length > 0
            ? this.displayImages[this.selectedImageIndex]
            : '/assets/image/placeholder.jpg';
    }

    selectImage(index: number): void {
        this.selectedImageIndex = index;
    }

    openGalleria(index: number): void {
        this.selectedImageIndex = index;
        this.showGalleria = true;
    }

    handleImageError(event: any): void {
        event.target.src = '/assets/image/placeholder.jpg';
    }
}
