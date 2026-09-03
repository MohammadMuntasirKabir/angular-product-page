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
  selector: 'app-trade-in',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="trade-in" #sectionEl>
      <div class="trade-in-content" #contentEl>
        <h2 class="trade-in-heading" #headingEl>
          Trade in your smartphone.<br />Get credit toward a new one.
        </h2>
        <p class="trade-in-desc" #descEl>
          With Apple Trade In, you can get credit toward your next iPhone when you
          trade in an eligible device. It's good for you and the planet.
        </p>
        <div class="trade-in-cta" #ctaEl>
          <a href="#" class="trade-in-link">
            See what your device is worth
            <span class="arrow">›</span>
          </a>
        </div>
      </div>
      <div class="trade-in-image" #imageEl>
        <img
          src="https://www.apple.com/v/iphone-17-pro/f/images/overview/upgrade/trade_in__dgo0xd1r38ae_large.jpg"
          alt="Apple Trade In"
          loading="lazy"
        />
      </div>
    </section>
  `,
  styleUrls: ['./trade-in.component.scss'],
})
export class TradeInComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sectionEl') sectionElRef!: ElementRef;
  @ViewChild('contentEl') contentElRef!: ElementRef;
  @ViewChild('headingEl') headingElRef!: ElementRef;
  @ViewChild('descEl') descElRef!: ElementRef;
  @ViewChild('ctaEl') ctaElRef!: ElementRef;
  @ViewChild('imageEl') imageElRef!: ElementRef;

  private ctx!: gsap.Context;

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

      tl.from(this.headingElRef.nativeElement, { opacity: 0, y: 40, duration: 0.7 })
        .from(this.descElRef.nativeElement, { opacity: 0, y: 30, duration: 0.6 }, '-=0.3')
        .from(this.ctaElRef.nativeElement, { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
        .from(this.imageElRef.nativeElement, { opacity: 0, scale: 0.95, duration: 0.8 }, '-=0.4');
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
