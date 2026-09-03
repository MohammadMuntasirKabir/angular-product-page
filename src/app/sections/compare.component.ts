import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

interface IphoneModel {
  id: string;
  name: string;
  image: string;
  startingPrice: string;
  display: string;
  chip: string;
  camera: string;
  battery: string;
  appleIntelligence: boolean;
}

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="compare" #compareSection>
      <div class="compare-header" #compareHeader>
        <h2 #compareHeading>Which iPhone is right for you?</h2>
      </div>

      <div class="compare-grid" #compareGrid>
        @for (phone of phones; track phone.id) {
        <div class="phone-column" #phoneColumn>
          <div class="phone-image">
            <img [src]="phone.image" [alt]="phone.name" loading="lazy" />
          </div>
          <h3 class="phone-name">{{ phone.name }}</h3>
          <p class="phone-price">From {{ phone.startingPrice }}</p>

          <div class="phone-features">
            <div class="feature-row">
              <span class="feature-label">Display</span>
              <span class="feature-value">{{ phone.display }}</span>
            </div>
            <div class="feature-row">
              <span class="feature-label">Chip</span>
              <span class="feature-value">{{ phone.chip }}</span>
            </div>
            <div class="feature-row">
              <span class="feature-label">Camera</span>
              <span class="feature-value">{{ phone.camera }}</span>
            </div>
            <div class="feature-row">
              <span class="feature-label">Battery</span>
              <span class="feature-value">{{ phone.battery }}</span>
            </div>
            <div class="feature-row">
              <span class="feature-label">Apple Intelligence</span>
              <span class="feature-value">
                @if (phone.appleIntelligence) {
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="10" cy="10" r="10" fill="#30d158" />
                  <path
                    d="M6 10.5l2.5 2.5L14 8"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                } @else {
                <span class="not-available">—</span>
                }
              </span>
            </div>
          </div>

          <a href="#" class="learn-more">Learn more &gt;</a>
        </div>
        }
      </div>
    </section>
  `,
  styleUrls: ['./compare.component.scss'],
})
export class CompareComponent implements AfterViewInit {
  @ViewChild('compareSection') sectionEl!: ElementRef;
  @ViewChild('compareHeader') headerEl!: ElementRef;
  @ViewChild('compareHeading') headingEl!: ElementRef;
  @ViewChild('compareGrid') gridEl!: ElementRef;
  @ViewChild('phoneColumn') phoneColumn!: ElementRef;

  phones: IphoneModel[] = [
    {
      id: 'iphone-17-pro',
      name: 'iPhone 17 Pro',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/compare/iphone_17_pro__c7ni2o59lsku_xlarge.jpg',
      startingPrice: '$1099',
      display: '6.3" Super Retina XDR',
      chip: 'A19 Pro',
      camera: '48MP Pro Fusion',
      battery: 'Up to 31 hours video',
      appleIntelligence: true,
    },
    {
      id: 'iphone-17-pro-max',
      name: 'iPhone 17 Pro Max',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/compare/iphone_17_pro_max__d8ni2o59lsku_xlarge.jpg',
      startingPrice: '$1199',
      display: '6.9" Super Retina XDR',
      chip: 'A19 Pro',
      camera: '48MP Pro Fusion',
      battery: 'Up to 37 hours video',
      appleIntelligence: true,
    },
    {
      id: 'iphone-air',
      name: 'iPhone Air',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/compare/iphone_air__e9ni2o59lsku_xlarge.jpg',
      startingPrice: '$999',
      display: '6.5" Super Retina XDR',
      chip: 'A19',
      camera: '48MP Fusion',
      battery: 'Up to 27 hours video',
      appleIntelligence: true,
    },
    {
      id: 'iphone-17',
      name: 'iPhone 17',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/compare/iphone_17__f0ni2o59lsku_xlarge.jpg',
      startingPrice: '$799',
      display: '6.3" Super Retina XDR',
      chip: 'A19',
      camera: '48MP Fusion',
      battery: 'Up to 26 hours video',
      appleIntelligence: true,
    },
  ];

  ngAfterViewInit(): void {
    // Heading animation
    gsap.from(this.headingEl.nativeElement, {
      scrollTrigger: {
        trigger: this.headingEl.nativeElement,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out',
    });

    // Phone columns stagger
    gsap.from(this.phoneColumn.nativeElement.children, {
      scrollTrigger: {
        trigger: this.gridEl.nativeElement,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 50,
      stagger: 0.15,
      duration: 0.7,
      ease: 'power2.out',
    });
  }
}
