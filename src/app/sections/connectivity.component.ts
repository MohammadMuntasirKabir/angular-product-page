import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-connectivity',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="connectivity" #sectionEl>
      <div class="connectivity-content" #contentEl>
        <span class="section-label" #labelEl>Connectivity</span>
        <h2 class="connectivity-heading" #headingEl>
          Stay connected<br />from anywhere.
        </h2>
        <p class="connectivity-desc" #descEl>
          iPhone 17 Pro features the latest Wi-Fi 7, Bluetooth 5.4, and Ultra Wideband
          technology. And with satellite connectivity, you can stay in touch even when
          you're completely off the grid.
        </p>
      </div>

      <div class="connectivity-grid" #gridEl>
        <div class="connectivity-card" *ngFor="let feature of features">
          <div class="connectivity-card__image">
            <img [src]="feature.image" [alt]="feature.title" loading="lazy" />
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./connectivity.component.scss'],
})
export class ConnectivityComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sectionEl') sectionElRef!: ElementRef;
  @ViewChild('contentEl') contentElRef!: ElementRef;
  @ViewChild('labelEl') labelElRef!: ElementRef;
  @ViewChild('headingEl') headingElRef!: ElementRef;
  @ViewChild('descEl') descElRef!: ElementRef;
  @ViewChild('gridEl') gridElRef!: ElementRef;

  private ctx!: gsap.Context;

  features = [
    {
      title: 'eSIM',
      description: 'Set up cellular service instantly with eSIM. No physical SIM card needed.',
      image: 'https://www.apple.com/v/iphone-17-pro/f/images/overview/shared-features/connectivity-gallery/esim__e0hyg3mvzc66_large.jpg',
    },
    {
      title: 'Messages via Satellite',
      description: 'Send and receive messages when you\'re out of cellular and Wi-Fi range.',
      image: 'https://www.apple.com/v/iphone-17-pro/f/images/overview/shared-features/connectivity-gallery/messages__jbs2xx97ltu2_large.jpg',
    },
    {
      title: 'Roadside Assistance via Satellite',
      description: 'Get help when you\'re stranded without cellular or Wi-Fi coverage.',
      image: 'https://www.apple.com/v/iphone-17-pro/f/images/overview/shared-features/connectivity-gallery/roadside__b41dk5h9st36_large.jpg',
    },
    {
      title: 'Emergency SOS via Satellite',
      description: 'Text emergency services when no cellular or Wi-Fi is available.',
      image: 'https://www.apple.com/v/iphone-17-pro/f/images/overview/shared-features/connectivity-gallery/esos__cnn8hqwav8r6_large.jpg',
    },
    {
      title: 'Crash Detection',
      description: 'iPhone can detect a severe car crash and call for help when you can\'t.',
      image: 'https://www.apple.com/v/iphone-17-pro/f/images/overview/shared-features/connectivity-gallery/crash_detection__enjqx7t6ouoi_large.jpg',
    },
    {
      title: 'Find My via Satellite',
      description: 'Locate your devices even when they\'re offline using the Find My network.',
      image: 'https://www.apple.com/v/iphone-17-pro/f/images/overview/shared-features/connectivity-gallery/find_my__d1l2hw5oucwi_large.jpg',
    },
  ];

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: this.sectionElRef.nativeElement,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
        defaults: { ease: 'power3.out' },
      });

      tl.from(this.labelElRef.nativeElement, { opacity: 0, y: 20, duration: 0.5 })
        .from(this.headingElRef.nativeElement, { opacity: 0, y: 50, duration: 0.8 }, '-=0.2')
        .from(this.descElRef.nativeElement, { opacity: 0, y: 30, duration: 0.6 }, '-=0.4');

      gsap.from(this.gridElRef.nativeElement?.children, {
        scrollTrigger: {
          trigger: this.gridElRef.nativeElement,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 30,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power2.out',
      });
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
