import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

interface Accessory {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
}

@Component({
  selector: 'app-accessories',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="accessories" #accessoriesSection>
      <div class="accessories-header" #accessoriesHeader>
        <h2 #accessoriesHeading>Accessories</h2>
        <p #accessoriesDesc>
          Complete your iPhone experience with accessories designed to
          complement and protect your device.
        </p>
      </div>

      <div class="accessories-grid" #accessoriesGrid>
        @for (accessory of accessories; track accessory.id) {
        <div class="accessory-card" #accessoryCard>
          <div class="accessory-image">
            <img
              [src]="accessory.image"
              [alt]="accessory.name"
              loading="lazy"
            />
          </div>
          <div class="accessory-info">
            <h3>{{ accessory.name }}</h3>
            <p>{{ accessory.description }}</p>
            <span class="accessory-price">{{ accessory.price }}</span>
          </div>
        </div>
        }
      </div>

      <div class="shop-button-wrapper" #shopButton>
        <a href="#" class="shop-button">Shop iPhone accessories &gt;</a>
      </div>
    </section>
  `,
  styleUrls: ['./accessories.component.scss'],
})
export class AccessoriesComponent implements AfterViewInit {
  @ViewChild('accessoriesSection') sectionEl!: ElementRef;
  @ViewChild('accessoriesHeader') headerEl!: ElementRef;
  @ViewChild('accessoriesHeading') headingEl!: ElementRef;
  @ViewChild('accessoriesDesc') descEl!: ElementRef;
  @ViewChild('accessoriesGrid') gridEl!: ElementRef;
  @ViewChild('shopButton') shopBtnEl!: ElementRef;
  @ViewChildren('accessoryCard') accessoryCards!: QueryList<ElementRef>;

  accessories: Accessory[] = [
    {
      id: 'techwoven-case',
      name: 'TechWoven Case',
      description:
        'A premium woven fabric case that feels incredible in your hand. Precision-fitted with MagSafe built in.',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/accessories/techwoven_case__g1ni2o59lsku_xlarge.jpg',
      price: '$59',
    },
    {
      id: 'silicone-case',
      name: 'Silicone Case',
      description:
        'Soft-touch silicone with a microfiber lining for seamless protection. Available in a range of colors.',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/accessories/silicone_case__h2ni2o59lsku_xlarge.jpg',
      price: '$49',
    },
    {
      id: 'crossbody-strap',
      name: 'Crossbody Strap',
      description:
        'A versatile woven strap that keeps your iPhone close. Adjustable length with secure magnetic attachment.',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/accessories/crossbody_strap__i3ni2o59lsku_xlarge.jpg',
      price: '$59',
    },
  ];

  ngAfterViewInit(): void {
    // Header animation
    const headerTl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: this.headerEl.nativeElement,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    headerTl
      .from(this.headingEl.nativeElement, { opacity: 0, y: 40, duration: 0.7 })
      .from(this.descEl.nativeElement, { opacity: 0, y: 30, duration: 0.6 }, '-=0.3');

    // Accessory cards stagger
    gsap.from(this.accessoryCards.toArray().map((el) => el.nativeElement), {
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

    // Shop button animation
    gsap.from(this.shopBtnEl.nativeElement, {
      scrollTrigger: {
        trigger: this.shopBtnEl.nativeElement,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2.out',
    });
  }
}
