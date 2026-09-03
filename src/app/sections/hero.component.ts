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
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero" #heroSection>
      <!-- Trade-in banner — sits in flow between nav and hero content -->
      <div class="tradein-banner" #tradeInBanner>
        <p>
          Get up to $195&ndash;$695 in credit toward iPhone&nbsp;17&nbsp;Pro when
          you trade in iPhone&nbsp;13 or higher.
          <a href="#">See what your device is worth &gt;</a>
        </p>
      </div>

      <div class="hero-inner">
        <div class="hero-content" #heroContent>
          <h1 class="hero-heading" #heroHeading>iPhone&nbsp;17&nbsp;Pro</h1>
          <p class="subtitle" #heroSubtitle>
            From $1099 or $45.79/mo. for 24&nbsp;mo.
          </p>
          <a href="#" class="buy-btn" #heroBuyBtn>
            Buy
            <span class="buy-btn__glow"></span>
          </a>
        </div>

        <div class="hero-image" #heroImage>
          <img
            src="https://www.apple.com/v/iphone-17-pro/f/images/overview/welcome/hero_endframe__gb7f6nb06rau_xlarge.jpg"
            alt="iPhone 17 Pro in Cosmic Orange"
            #heroImg
          />
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroSection') heroSection!: ElementRef;
  @ViewChild('tradeInBanner') tradeInBanner!: ElementRef;
  @ViewChild('heroContent') heroContent!: ElementRef;
  @ViewChild('heroHeading') heroHeading!: ElementRef;
  @ViewChild('heroSubtitle') heroSubtitle!: ElementRef;
  @ViewChild('heroBuyBtn') heroBuyBtn!: ElementRef;
  @ViewChild('heroImage') heroImage!: ElementRef;
  @ViewChild('heroImg') heroImg!: ElementRef;

  private scrollTriggerInstance?: ScrollTrigger;

  ngAfterViewInit(): void {
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      delay: 0.1,
    });

    tl.from(this.tradeInBanner.nativeElement, {
      opacity: 0, y: -20, duration: 0.6,
    }, 0)
    .from(this.heroHeading.nativeElement, {
      opacity: 0, y: 60, duration: 0.8,
    }, 0.2)
    .from(this.heroSubtitle.nativeElement, {
      opacity: 0, y: 40, duration: 0.7,
    }, 0.35)
    .from(this.heroBuyBtn.nativeElement, {
      opacity: 0, scale: 0.9, duration: 0.5,
    }, 0.5)
    .from(this.heroImg.nativeElement, {
      opacity: 0, y: 80, duration: 1.0,
    }, 0.3);

    // Scroll-driven parallax
    this.scrollTriggerInstance = ScrollTrigger.create({
      trigger: this.heroSection.nativeElement,
      start: 'top top',
      end: '+=80%',
      scrub: 0.8,
      onUpdate: (self) => {
        const p = self.progress;
        gsap.to(this.heroImg.nativeElement, {
          scale: 1 + p * 0.3, opacity: 1 - p * 1.1, y: -p * 100, ease: 'none',
        });
        gsap.to(this.heroContent.nativeElement, {
          opacity: 1 - p * 2.5, y: -p * 180, ease: 'none',
        });
        gsap.to(this.tradeInBanner.nativeElement, {
          opacity: 1 - p * 5, ease: 'none',
        });
      },
    });
  }

  ngOnDestroy(): void {
    this.scrollTriggerInstance?.kill();
    ScrollTrigger.getAll()
      .filter(st => st.trigger === this.heroSection?.nativeElement)
      .forEach(st => st.kill());
  }
}
