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

interface BatteryStat {
  value: string;
  numericValue: number;
  suffix: string;
  label: string;
}

@Component({
  selector: 'app-battery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="battery" #batterySection>
      <div class="battery-content" #batteryContent>
        <span class="section-label" #sectionLabel>Battery</span>
        <h2 class="battery-heading" #batteryHeading>
          Up to <span class="highlight">31 hours</span> of video playback.
        </h2>
        <p class="battery-description" #batteryDesc>
          iPhone 17 Pro delivers the longest battery life ever in an iPhone.
          Powered by the incredibly efficient A19 Pro chip and a larger battery,
          you can go all day on a single charge. And when you do need a boost,
          MagSafe and USB-C fast charging get you back up to speed quickly.
        </p>

        <div class="battery-icon-wrapper" #batteryIcon>
          <div class="battery-visual">
            <div class="battery-body">
              <div class="battery-fill" #batteryFill></div>
            </div>
            <div class="battery-cap"></div>
          </div>
          <span class="battery-percentage" #batteryPercentage>0%</span>
        </div>

        <div class="battery-stats" #batteryStatsEl>
          @for (stat of batteryStatsData; track stat.label) {
          <div class="battery-stat">
            <span class="stat-number">
              <span class="count-up" [attr.data-target]="stat.numericValue"
                >0</span
              ><span class="count-suffix">{{ stat.suffix }}</span>
            </span>
            <span class="stat-name">{{ stat.label }}</span>
          </div>
          }
        </div>
      </div>

      <div class="battery-image" #batteryImage>
        <img
          src="https://www.apple.com/v/iphone-17-pro/f/images/overview/battery/battery__fnlwe1uwg66a_xlarge.jpg"
          alt="iPhone 17 Pro battery life"
          #batteryImg
        />
      </div>
    </section>
  `,
  styleUrls: ['./battery.component.scss'],
})
export class BatteryComponent implements AfterViewInit, OnDestroy {
  @ViewChild('batterySection') sectionEl!: ElementRef;
  @ViewChild('batteryContent') contentEl!: ElementRef;
  @ViewChild('sectionLabel') labelEl!: ElementRef;
  @ViewChild('batteryHeading') headingEl!: ElementRef;
  @ViewChild('batteryDesc') descEl!: ElementRef;
  @ViewChild('batteryIcon') iconEl!: ElementRef;
  @ViewChild('batteryFill') batteryFillEl!: ElementRef;
  @ViewChild('batteryPercentage') batteryPercentageEl!: ElementRef;
  @ViewChild('batteryStatsEl') statsEl!: ElementRef;
  @ViewChild('batteryImage') imageEl!: ElementRef;
  @ViewChild('batteryImg') imgEl!: ElementRef;

  private scrollTriggers: ScrollTrigger[] = [];
  private gsapContexts: gsap.Context[] = [];

  batteryStatsData: BatteryStat[] = [
    { value: '31 hrs', numericValue: 31, suffix: ' hrs', label: 'Video playback' },
    { value: '28 hrs', numericValue: 28, suffix: ' hrs', label: 'Video streaming' },
    { value: '50%', numericValue: 50, suffix: '%', label: 'Charge in 30 min' },
  ];

  ngAfterViewInit(): void {
    this.cleanup();

    const ctx = gsap.context(() => {
      // Main reveal timeline
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
        )
        .from(
          this.iconEl.nativeElement,
          { opacity: 0, scale: 0.8, duration: 0.6 },
          '-=0.3'
        );

      if (tl.scrollTrigger) {
        this.scrollTriggers.push(tl.scrollTrigger);
      }

      // Battery fill bar animation
      if (this.batteryFillEl?.nativeElement) {
        const fillTrigger = gsap.to(this.batteryFillEl.nativeElement, {
          scrollTrigger: {
            trigger: this.iconEl.nativeElement,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
          width: '100%',
          duration: 1.5,
          ease: 'power3.inOut',
        });

        if (fillTrigger.scrollTrigger) {
          this.scrollTriggers.push(fillTrigger.scrollTrigger);
        }

        // Battery percentage counter
        if (this.batteryPercentageEl?.nativeElement) {
          const counter = { val: 0 };
          const pctTrigger = gsap.to(counter, {
            scrollTrigger: {
              trigger: this.iconEl.nativeElement,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
            val: 100,
            duration: 1.5,
            ease: 'power3.inOut',
            onUpdate: () => {
              this.batteryPercentageEl.nativeElement.textContent =
                Math.round(counter.val) + '%';
            },
          });

          if (pctTrigger.scrollTrigger) {
            this.scrollTriggers.push(pctTrigger.scrollTrigger);
          }
        }
      }

      // Battery stats with count-up
      const statElements =
        this.statsEl?.nativeElement?.querySelectorAll('.battery-stat');
      if (statElements?.length) {
        const statTl = gsap.timeline({
          scrollTrigger: {
            trigger: this.statsEl.nativeElement,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });

        statElements.forEach((el: HTMLElement, i: number) => {
          const countEl = el.querySelector('.count-up') as HTMLElement;

          statTl.from(
            el,
            {
              opacity: 0,
              y: 24,
              duration: 0.5,
              ease: 'power3.out',
            },
            i * 0.1
          );

          if (countEl) {
            const target = parseInt(
              countEl.getAttribute('data-target') || '0',
              10
            );
            const counter = { val: 0 };

            statTl.to(
              counter,
              {
                val: target,
                duration: 1.2,
                ease: 'power2.out',
                onUpdate: () => {
                  countEl.textContent = Math.round(counter.val).toString();
                },
              },
              '-=0.7'
            );
          }
        });

        if (statTl.scrollTrigger) {
          this.scrollTriggers.push(statTl.scrollTrigger);
        }
      }

      // Battery image reveal with parallax
      if (this.imgEl?.nativeElement) {
        const imgTl = gsap.timeline({
          scrollTrigger: {
            trigger: this.imageEl.nativeElement,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });

        imgTl.from(this.imgEl.nativeElement, {
          opacity: 0,
          scale: 0.95,
          y: 20,
          duration: 1,
          ease: 'power3.out',
        });

        if (imgTl.scrollTrigger) {
          this.scrollTriggers.push(imgTl.scrollTrigger);
        }

        // Scroll-driven parallax
        const parallax = gsap.to(this.imgEl.nativeElement, {
          scrollTrigger: {
            trigger: this.imageEl.nativeElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
          y: -25,
          ease: 'none',
        });

        if (parallax.scrollTrigger) {
          this.scrollTriggers.push(parallax.scrollTrigger);
        }
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
