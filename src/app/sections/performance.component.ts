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

interface StatData {
  value: string;
  label: string;
  numericValue: number;
  suffix: string;
}

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="performance" #performanceSection>
      <div class="performance-content" #performanceContent>
        <span class="section-label" #sectionLabel>Performance</span>
        <h2 class="performance-heading" #performanceHeading>
          A19 Pro chip
        </h2>
        <p class="performance-description" #performanceDesc>
          A19 Pro is the fastest chip ever in a smartphone. Its new CPU and GPU
          architecture delivers up to 40% faster performance than the previous
          generation, while the 16-core Neural Engine handles on-device machine
          learning tasks with unprecedented speed. Whether you're gaming with
          hardware-accelerated ray tracing, editing 4K ProRes video, or running
          advanced AI models, A19 Pro handles it all with ease.
        </p>

        <div class="stats-grid" #statsGrid>
          @for (stat of stats; track stat.label) {
          <div class="stat-item">
            <span class="stat-value">
              <span class="stat-number" [attr.data-target]="stat.numericValue"
                >0</span
              ><span class="stat-suffix">{{ stat.suffix }}</span>
            </span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
          }
        </div>
      </div>

      <div class="chip-image" #chipImage>
        <div class="chip-glow"></div>
        <img
          src="https://www.apple.com/v/iphone-17-pro/f/images/overview/performance/chip/performance__fnvbyhvy8wy2_xlarge.jpg"
          alt="A19 Pro chip"
          #chipImg
        />
      </div>
    </section>
  `,
  styleUrls: ['./performance.component.scss'],
})
export class PerformanceComponent implements AfterViewInit, OnDestroy {
  @ViewChild('performanceSection') sectionEl!: ElementRef;
  @ViewChild('performanceContent') contentEl!: ElementRef;
  @ViewChild('sectionLabel') labelEl!: ElementRef;
  @ViewChild('performanceHeading') headingEl!: ElementRef;
  @ViewChild('performanceDesc') descEl!: ElementRef;
  @ViewChild('statsGrid') statsGrid!: ElementRef;
  @ViewChild('chipImage') imageEl!: ElementRef;
  @ViewChild('chipImg') imgEl!: ElementRef;
  @ViewChildren('statItem') statItems!: QueryList<ElementRef>;

  private scrollTriggers: ScrollTrigger[] = [];
  private gsapContexts: gsap.Context[] = [];

  stats: StatData[] = [
    { value: '6-core', label: 'CPU', numericValue: 6, suffix: '-core' },
    { value: '6-core', label: 'GPU', numericValue: 6, suffix: '-core' },
    {
      value: '16-core',
      label: 'Neural Engine',
      numericValue: 16,
      suffix: '-core',
    },
  ];

  ngAfterViewInit(): void {
    this.cleanup();

    const ctx = gsap.context(() => {
      // Main reveal timeline with stagger
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: this.sectionEl.nativeElement,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });

      tl.from(this.labelEl.nativeElement, {
        opacity: 0,
        y: 30,
        duration: 0.6,
      })
        .from(
          this.headingEl.nativeElement,
          { opacity: 0, y: 50, duration: 0.8 },
          '-=0.3'
        )
        .from(
          this.descEl.nativeElement,
          { opacity: 0, y: 40, duration: 0.7 },
          '-=0.4'
        );

      if (tl.scrollTrigger) {
        this.scrollTriggers.push(tl.scrollTrigger);
      }

      // Staggered stat cards with animated counters
      const statElements =
        this.statsGrid?.nativeElement?.querySelectorAll('.stat-item');
      if (statElements?.length) {
        const statTl = gsap.timeline({
          scrollTrigger: {
            trigger: this.statsGrid.nativeElement,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });

        statElements.forEach((el: HTMLElement, i: number) => {
          const numberEl = el.querySelector('.stat-number') as HTMLElement;

          statTl.from(
            el,
            {
              opacity: 0,
              y: 30,
              duration: 0.5,
              ease: 'power3.out',
            },
            i * 0.12
          );

          // Animated counter
          if (numberEl) {
            const target = parseInt(
              numberEl.getAttribute('data-target') || '0',
              10
            );
            const suffix = numberEl.nextElementSibling?.textContent || '';

            const counter = { val: 0 };
            statTl.to(
              counter,
              {
                val: target,
                duration: 1.2,
                ease: 'power2.out',
                onUpdate: () => {
                  numberEl.textContent = Math.round(counter.val).toString();
                },
              },
              '-=0.8'
            );
          }
        });

        if (statTl.scrollTrigger) {
          this.scrollTriggers.push(statTl.scrollTrigger);
        }
      }

      // Chip image with scroll-driven animation
      if (this.imgEl?.nativeElement) {
        const chipTl = gsap.timeline({
          scrollTrigger: {
            trigger: this.imageEl.nativeElement,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });

        chipTl.from(this.imgEl.nativeElement, {
          opacity: 0,
          scale: 0.92,
          y: 30,
          duration: 1,
          ease: 'power3.out',
        });

        if (chipTl.scrollTrigger) {
          this.scrollTriggers.push(chipTl.scrollTrigger);
        }

        // Scroll-driven parallax on chip
        const parallax = gsap.to(this.imgEl.nativeElement, {
          scrollTrigger: {
            trigger: this.imageEl.nativeElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
          y: -30,
          ease: 'none',
        });

        if (parallax.scrollTrigger) {
          this.scrollTriggers.push(parallax.scrollTrigger);
        }
      }

      // Chip glow pulse
      const glow = this.imageEl?.nativeElement?.querySelector('.chip-glow');
      if (glow) {
        gsap.to(glow, {
          opacity: 0.4,
          scale: 1.08,
          duration: 2.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }
    }, this.sectionEl.nativeElement);

    this.gsapContexts.push(ctx);
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
