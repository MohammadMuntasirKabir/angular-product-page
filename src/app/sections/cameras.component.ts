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

interface ZoomTab {
  label: string;
  image: string;
  alt: string;
}

@Component({
  selector: 'app-cameras',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="cameras" #camerasSection>
      <div class="cameras-content" #camerasContent>
        <span class="section-label" #camLabel>Cameras</span>
        <h2 class="cam-heading" #camHeading>A big zoom forward.</h2>

        <div class="stats-row" #statsRow>
          <div class="stat" #stat1>
            <span class="stat-number">Up to 8x</span>
            <span class="stat-desc">optical-quality zoom</span>
          </div>
          <div class="stat" #stat2>
            <span class="stat-number">All 48MP</span>
            <span class="stat-desc">rear cameras</span>
          </div>
        </div>

        <p class="cam-description" #camDesc>
          The new Telephoto camera uses a groundbreaking tetraprism design to
          fold light through a prism — bouncing it four times before reaching
          the sensor. The result is a stunning 200mm focal length in the
          thinnest pro camera system ever. Combined with a 48MP Fusion camera
          and a 48MP Ultra Wide camera, every shot at every distance is pro
          quality.
        </p>
      </div>

      <!-- Zoom length tabs -->
      <div class="zoom-section" #zoomSection>
        <nav class="zoom-tabs" #zoomTabNav>
          <ul>
            @for (tab of zoomTabList; track tab.label) {
            <li>
              <button
                [class.active]="activeZoom === tab.label"
                (click)="selectZoom(tab.label)"
              >
                {{ tab.label }}
              </button>
            </li>
            }
          </ul>
        </nav>

        <div class="zoom-image-wrapper" #zoomImageWrapper>
          @for (tab of zoomTabList; track tab.label) {
          <div
            class="zoom-image-container"
            [class.visible]="activeZoom === tab.label"
            [attr.data-zoom]="tab.label"
          >
            <img [src]="tab.image" [alt]="tab.alt" loading="lazy" />
            <span class="zoom-focal">{{ tab.label }}</span>
          </div>
          }
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./cameras.component.scss'],
})
export class CamerasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('camerasSection') sectionEl!: ElementRef;
  @ViewChild('camerasContent') contentEl!: ElementRef;
  @ViewChild('camLabel') labelEl!: ElementRef;
  @ViewChild('camHeading') headingEl!: ElementRef;
  @ViewChild('statsRow') statsRowEl!: ElementRef;
  @ViewChild('stat1') stat1El!: ElementRef;
  @ViewChild('stat2') stat2El!: ElementRef;
  @ViewChild('camDesc') descEl!: ElementRef;
  @ViewChild('zoomSection') zoomSectionEl!: ElementRef;
  @ViewChild('zoomTabNav') zoomTabNavEl!: ElementRef;
  @ViewChild('zoomImageWrapper') zoomImageEl!: ElementRef;
  @ViewChildren('zoomImageWrapper') zoomImageContainers!: QueryList<ElementRef>;

  activeZoom = '200mm';
  private scrollTriggers: ScrollTrigger[] = [];
  private gsapContexts: gsap.Context[] = [];

  zoomTabList: ZoomTab[] = [
    {
      label: '200mm',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/cameras/zoom/200mm__dns3fwdygoyi_xlarge.jpg',
      alt: 'Photo taken at 200mm focal length',
    },
    {
      label: '100mm',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/cameras/zoom/100mm__bxvi16q96pmi_xlarge.jpg',
      alt: 'Photo taken at 100mm focal length',
    },
    {
      label: '48mm',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/cameras/zoom/48mm__eh0vqrzleqo2_xlarge.jpg',
      alt: 'Photo taken at 48mm focal length',
    },
    {
      label: '35mm',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/cameras/zoom/35mm__bcfp0gzzh486_xlarge.jpg',
      alt: 'Photo taken at 35mm focal length',
    },
    {
      label: '28mm',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/cameras/zoom/28mm__eh0vqrzleqo2_xlarge.jpg',
      alt: 'Photo taken at 28mm focal length',
    },
    {
      label: '24mm',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/cameras/zoom/24mm__bxvi16q96pmi_xlarge.jpg',
      alt: 'Photo taken at 24mm focal length',
    },
    {
      label: '13mm',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/cameras/zoom/13mm__dns3fwdygoyi_xlarge.jpg',
      alt: 'Photo taken at 13mm focal length',
    },
    {
      label: 'Macro',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/cameras/zoom/macro__bcfp0gzzh486_xlarge.jpg',
      alt: 'Macro photo taken with iPhone 17 Pro',
    },
  ];

  private zoomImageMap: Map<string, HTMLImageElement> = new Map();

  selectZoom(label: string): void {
    if (label === this.activeZoom) return;

    const wrapper = this.zoomImageEl?.nativeElement;
    if (!wrapper) {
      this.activeZoom = label;
      return;
    }

    const containers = wrapper.querySelectorAll('.zoom-image-container');
    const currentContainer = wrapper.querySelector(
      `.zoom-image-container[data-zoom="${this.activeZoom}"]`
    ) as HTMLElement | null;
    const nextContainer = wrapper.querySelector(
      `.zoom-image-container[data-zoom="${label}"]`
    ) as HTMLElement | null;

    if (!nextContainer) {
      this.activeZoom = label;
      return;
    }

    // Prepare incoming container
    gsap.set(nextContainer, { opacity: 0, scale: 1.05, zIndex: 2 });
    gsap.set(currentContainer, { zIndex: 1 });

    const tl = gsap.timeline();

    // Fade out current, fade in new with subtle zoom-in
    if (currentContainer) {
      tl.to(currentContainer, {
        opacity: 0,
        scale: 0.98,
        duration: 0.35,
        ease: 'power2.in',
      });
    }

    tl.to(
      nextContainer,
      {
        opacity: 1,
        scale: 1,
        duration: 0.55,
        ease: 'power3.out',
        onComplete: () => {
          // Reset old container
          if (currentContainer) {
            gsap.set(currentContainer, { scale: 1, zIndex: 0 });
          }
          gsap.set(nextContainer, { zIndex: 0 });
        },
      },
      '-=0.1'
    );

    this.activeZoom = label;
  }

  ngAfterViewInit(): void {
    // Kill any existing triggers to avoid duplicates
    this.cleanup();

    // Main content reveal timeline
    const contentCtx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: this.sectionEl.nativeElement,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
        defaults: { ease: 'power3.out' },
      });

      tl.from(this.labelEl.nativeElement, {
        opacity: 0,
        y: 20,
        duration: 0.5,
      })
        .from(
          this.headingEl.nativeElement,
          { opacity: 0, y: 50, duration: 0.7 },
          '-=0.2'
        )
        .from(
          this.stat1El.nativeElement,
          { opacity: 0, y: 30, duration: 0.5 },
          '-=0.4'
        )
        .from(
          this.stat2El.nativeElement,
          { opacity: 0, y: 30, duration: 0.5 },
          '-=0.3'
        )
        .from(
          this.descEl.nativeElement,
          { opacity: 0, y: 30, duration: 0.6 },
          '-=0.3'
        );

      if (tl.scrollTrigger) {
        this.scrollTriggers.push(tl.scrollTrigger);
      }
    }, this.sectionEl.nativeElement);
    this.gsapContexts.push(contentCtx);

    // Zoom section entrance
    const zoomCtx = gsap.context(() => {
      const navTrigger = gsap.from(this.zoomTabNavEl.nativeElement, {
        scrollTrigger: {
          trigger: this.zoomSectionEl.nativeElement,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        ease: 'power3.out',
      });

      if (navTrigger.scrollTrigger) {
        this.scrollTriggers.push(navTrigger.scrollTrigger);
      }

      const imageTrigger = gsap.from(this.zoomImageEl?.nativeElement, {
        scrollTrigger: {
          trigger: this.zoomSectionEl.nativeElement,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: 'power3.out',
      });

      if (imageTrigger.scrollTrigger) {
        this.scrollTriggers.push(imageTrigger.scrollTrigger);
      }

      // Scroll-driven parallax on sample images
      const wrapper = this.zoomImageEl?.nativeElement;
      if (wrapper) {
        const parallaxTrigger = gsap.to(wrapper, {
          scrollTrigger: {
            trigger: this.zoomSectionEl.nativeElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
          y: -40,
          ease: 'none',
        });

        if (parallaxTrigger.scrollTrigger) {
          this.scrollTriggers.push(parallaxTrigger.scrollTrigger);
        }
      }
    }, this.zoomSectionEl.nativeElement);
    this.gsapContexts.push(zoomCtx);

    // Subtle continuous zoom-in on the active image
    const activeImg = this.zoomImageEl?.nativeElement?.querySelector(
      '.zoom-image-container.visible img'
    );
    if (activeImg) {
      gsap.to(activeImg, {
        scale: 1.03,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }
  }

  private cleanup(): void {
    this.scrollTriggers.forEach((st) => st.kill());
    this.scrollTriggers = [];
    this.gsapContexts.forEach((ctx) => ctx.revert());
    this.gsapContexts = [];
  }

  ngOnDestroy(): void {
    this.cleanup();
  }
}
