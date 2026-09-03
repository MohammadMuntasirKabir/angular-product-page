import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

interface HighlightTab {
  id: string;
  label: string;
  image: string;
  heading: string;
  description: string;
}

@Component({
  selector: 'app-highlights',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="highlights" #highlightsSection>
      <h2 #hlHeading>Get the highlights.</h2>

      <!-- Tab navigation -->
      <nav class="tab-nav" #tabNav>
        <ul>
          @for (tab of tabs; track tab.id) {
          <li>
            <button
              [class.active]="activeTab === tab.id"
              (click)="selectTab(tab.id)"
              #tabBtn
            >
              {{ tab.label }}
            </button>
          </li>
          }
        </ul>
      </nav>

      <!-- Watch the film button (separate from tabs) -->
      <button class="watch-film-btn" #watchFilmBtn>
        <span class="play-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        Watch the film
      </button>

      <!-- Tab content overlay stack -->
      <div class="tab-content-stack" #tabContentStack>
        @for (tab of tabs; track tab.id) {
        <div
          class="tab-content"
          [class.active]="activeTab === tab.id"
          [attr.data-tab]="tab.id"
          #tabContent
        >
          <div class="tab-image">
            <img [src]="tab.image" [alt]="tab.heading" loading="lazy" />
          </div>
          <div class="tab-text">
            <h3 class="tab-heading">{{ tab.heading }}</h3>
            <p class="tab-description">{{ tab.description }}</p>
            <a href="#" class="cta-link">Learn more &gt;</a>
          </div>
        </div>
        }
      </div>
    </section>
  `,
  styleUrls: ['./highlights.component.scss'],
})
export class HighlightsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('highlightsSection') sectionEl!: ElementRef;
  @ViewChild('hlHeading') headingEl!: ElementRef;
  @ViewChild('tabNav') tabNavEl!: ElementRef;
  @ViewChild('tabContentStack') tabContentStackEl!: ElementRef;
  @ViewChild('watchFilmBtn') watchFilmBtnEl!: ElementRef;
  @ViewChildren('tabBtn') tabBtns!: QueryList<ElementRef>;
  @ViewChildren('tabContent') tabContents!: QueryList<ElementRef>;

  activeTab = 'design';
  private scrollTriggers: ScrollTrigger[] = [];
  private animationTimeline: gsap.core.Timeline | null = null;

  tabs: HighlightTab[] = [
    {
      id: 'design',
      label: 'Design',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/highlights/highlights_design_endframe__eu8gj0kqlmoi_large.jpg',
      heading: 'A first for iPhone. A titanium design.',
      description:
        'iPhone 17 Pro features a refined titanium enclosure with a striking new contour edge that feels incredible in your hand. The thinnest bezels ever on iPhone deliver an edge‑to‑edge display.',
    },
    {
      id: 'chip',
      label: 'A19 Pro chip',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/highlights/highlights_chip_endframe__d06u2zxywxme_large.jpg',
      heading: 'A19 Pro chip. Built for performance.',
      description:
        'The A19 Pro chip is the fastest chip ever in a smartphone. A new GPU architecture and hardware‑accelerated ray tracing make everything feel incredibly responsive.',
    },
    {
      id: 'camera',
      label: 'Pro Fusion camera system',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/highlights/highlights_zoom_endframe__dyqkn2swjbsm_large.jpg',
      heading: 'Pro Fusion camera system. Detail that astounds.',
      description:
        'A 48MP Fusion camera with a 2× Telephoto and an all‑new 48MP Telephoto camera that gives you up to 4× optical zoom. Capture stunning photos at any distance.',
    },
    {
      id: 'front-camera',
      label: 'Center Stage front camera',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/highlights/highlights_camera_endframe__e72sxwhaxhyu_large.jpg',
      heading: 'Center Stage front camera. Stay in frame.',
      description:
        'The new front camera with Center Stage automatically adjusts to keep you in the frame as you move. Group selfies have never looked better.',
    },
    {
      id: 'ios',
      label: 'iOS 26',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/highlights/highlights_ios__e4213yr3208y_large.jpg',
      heading: 'iOS 26. Personal, intelligent, essential.',
      description:
        'iOS 26 introduces a beautiful new design, redesigned Lock Screen, and powerful features like Focus updates, Live Text richer interactions, and much more.',
    },
    {
      id: 'intelligence',
      label: 'Apple Intelligence',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/highlights/highlights_apple_intelligence__c9a098yssb8m_large.jpg',
      heading: 'Apple Intelligence. AI for the rest of us.',
      description:
        'Apple Intelligence uses on‑machine generative models to help you write, express yourself, and get things effortlessly done while setting a new standard for privacy.',
    },
  ];

  selectTab(id: string): void {
    if (this.activeTab === id) return;

    const previousTabId = this.activeTab;
    this.activeTab = id;

    const allContents = this.tabContents.toArray().map((el) => el.nativeElement);
    const outgoing = allContents.find(
      (el) => el.getAttribute('data-tab') === previousTabId
    );
    const incoming = allContents.find(
      (el) => el.getAttribute('data-tab') === id
    );

    // Kill any running animations on content
    if (this.animationTimeline) {
      this.animationTimeline.kill();
    }

    this.animationTimeline = gsap.timeline();

    // Fade out old content
    if (outgoing) {
      this.animationTimeline.to(
        outgoing,
        {
          opacity: 0,
          y: -12,
          duration: 0.3,
          ease: 'power2.in',
        },
        0
      );
    }

    // Fade in new content with stagger on inner elements
    if (incoming) {
      const img = incoming.querySelector('.tab-image') as HTMLElement;
      const heading = incoming.querySelector('.tab-heading') as HTMLElement;
      const desc = incoming.querySelector('.tab-description') as HTMLElement;
      const cta = incoming.querySelector('.cta-link') as HTMLElement;

      gsap.set(incoming, { opacity: 0, y: 16 });

      this.animationTimeline.to(
        incoming,
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power3.out',
        },
        0.15
      );

      // Stagger inner elements
      const innerElements = [img, heading, desc, cta].filter(Boolean);
      if (innerElements.length) {
        gsap.set(innerElements, { opacity: 0, y: 20 });

        this.animationTimeline.to(
          innerElements,
          {
            opacity: 1,
            y: 0,
            stagger: 0.07,
            duration: 0.4,
            ease: 'power2.out',
          },
          0.25
        );
      }
    }
  }

  ngAfterViewInit(): void {
    // Scroll-triggered heading animation
    const headingST = ScrollTrigger.create({
      trigger: this.headingEl.nativeElement,
      start: 'top 85%',
      onEnter: () => {
        gsap.fromTo(
          this.headingEl.nativeElement,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );
      },
      once: true,
    });
    this.scrollTriggers.push(headingST);

    // Fade in tab nav items with stagger
    const tabBtnArray = this.tabBtns.toArray().map((el) => el.nativeElement);
    const allTabButtons = [
      ...tabBtnArray,
      this.watchFilmBtnEl?.nativeElement,
    ].filter(Boolean);

    const navST = ScrollTrigger.create({
      trigger: this.tabNavEl.nativeElement,
      start: 'top 85%',
      onEnter: () => {
        gsap.fromTo(
          allTabButtons,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: 'power2.out',
          }
        );
      },
      once: true,
    });
    this.scrollTriggers.push(navST);

    // Initial content fade-in with stagger
    const firstContent = this.tabContents.first?.nativeElement;
    if (firstContent) {
      const img = firstContent.querySelector('.tab-image') as HTMLElement;
      const heading = firstContent.querySelector('.tab-heading') as HTMLElement;
      const desc = firstContent.querySelector('.tab-description') as HTMLElement;
      const cta = firstContent.querySelector('.cta-link') as HTMLElement;
      const innerElements = [img, heading, desc, cta].filter(Boolean);

      gsap.set(firstContent, { opacity: 1 });
      gsap.fromTo(
        innerElements,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.5,
          delay: 0.35,
          ease: 'power2.out',
        }
      );
    }

    // Set all non-active tab contents to opacity 0 (absolute position stack)
    this.tabContents.forEach((el) => {
      if (el.nativeElement.getAttribute('data-tab') !== this.activeTab) {
        gsap.set(el.nativeElement, { opacity: 0 });
      }
    });
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach((st) => st.kill());
    this.scrollTriggers = [];
    if (this.animationTimeline) {
      this.animationTimeline.kill();
    }
  }
}
