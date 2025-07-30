import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Card } from '../detail-annauaire-pro.component';

@Component({
  selector: 'app-detail-header-annauaire-pro',
  templateUrl: './detail-header-annauaire-pro.component.html',
  styleUrls: ['./detail-header-annauaire-pro.component.scss']
})
export class DetailHeaderAnnauaireProComponent implements OnInit, OnDestroy, OnChanges {
  @Input() currentCard: Card | null = null;

  currentSlideIndex: number = 0;
  autoSlideInterval?: any;

  ngOnInit() {
    this.initializeSlideshow();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Restart slideshow when currentCard changes
    if (changes['currentCard'] && !changes['currentCard'].firstChange) {
      this.initializeSlideshow();
    }
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  get currentSlides(): string[] {
    return this.currentCard?.slides || [this.currentCard?.picture || ''];
  }

  get currentImage(): string {
    return this.currentSlides[this.currentSlideIndex] || '';
  }

  private initializeSlideshow(): void {
    // Reset slide index
    this.currentSlideIndex = 0;
    
    // Stop any existing interval
    this.stopAutoSlide();
    
    // Start new slideshow if there are multiple slides
    this.startAutoSlide();
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
    this.restartAutoSlide();
  }

  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.currentSlides.length;
    this.restartAutoSlide();
  }

  prevSlide(): void {
    this.currentSlideIndex = this.currentSlideIndex === 0
      ? this.currentSlides.length - 1
      : this.currentSlideIndex - 1;
    this.restartAutoSlide();
  }

  startAutoSlide(): void {
    // Only start auto-slide if there are multiple slides
    if (this.currentSlides.length > 1) {
      this.autoSlideInterval = setInterval(() => {
        this.nextSlide();
      }, 4000); // Change slide every 4 seconds
    }
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = undefined;
    }
  }

  restartAutoSlide(): void {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  isStarFilled(star: number, rating: number): boolean {
    return star <= rating;
  }
}