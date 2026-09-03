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
  selector: 'app-design',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="design" #designSection>
      <div class="design-layout">
        <div class="design-content" #designContent>
          <span class="section-label" #sectionLabel>Design</span>
          <h2 class="design-heading" #designHeading>
            Unibody enclosure.<br />Makes a strong case for itself.
          </h2>
          <p class="design-description" #designDesc>
            Crafted from a single piece of heat-forged aluminum, the unibody
            enclosure delivers exceptional rigidity and a seamless fit and finish
            that's never been seen on an iPhone before. Every curved surface is
            precision-milled and polished to perfection — the result is a phone
            that feels as extraordinary as it looks, combining aerospace-grade
            strength with an all-new contoured edge designed to rest naturally in
            your hand.
          </p>

          <div class="compare-btn-wrapper" #compareBtn>
            <a href="#compare" class="compare-btn">
              Compare iPhone models
              <span class="btn-arrow" aria-hidden="true">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 7h8M9 4l3 3-3 3"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </a>
          </div>
        </div>

        <div class="design-image" #designImage>
          <img
            src="https://www.apple.com/v/iphone-17-pro/f/images/overview/design/design_endframe__7k7qs1qlnpu6_large.jpg"
            alt="iPhone 17 Pro back showing unibody design"
            #designImg
            loading="lazy"
          />
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./design.component.scss'],
})
export class DesignComponent implements AfterViewInit, OnDestroy {
  @ViewChild('designSection') sectionEl!: ElementRef;
  @ViewChild('designContent') contentEl!: ElementRef;
  @ViewChild('sectionLabel') labelEl!: ElementRef;
  @ViewChild('designHeading') headingEl!: ElementRef;
  @ViewChild('designDesc') descEl!: ElementRef;
  @ViewChild('compareBtn') compareBtnEl!: ElementRef;
  @ViewChild('designImage') imageEl!: ElementRef;
  @ViewChild('designImg') imgEl!: ElementRef;

  private ctx!: gsap.Context;

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      // Entrance timeline
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: this.sectionEl.nativeElement,
          start: 'top 75%',
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
          '-=0.3',
        )
        .from(
          this.descEl.nativeElement,
          { opacity: 0, y: 40, duration: 0.7 },
          '-=0.4',
        )
        .from(
          this.compareBtnEl.nativeElement,
          { opacity: 0, y: 20, duration: 0.5 },
          '-=0.3',
        );

      // Parallax: image scales up slightly as user scrolls through section
      gsap.fromTo(
        this.imgEl.nativeElement,
        { scale: 0.92 },
        {
          scale: 1.06,
          ease: 'none',
          scrollTrigger: {
            trigger: this.sectionEl.nativeElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        },
      );

      // Parallax: image container moves at different rate
      gsap.fromTo(
        this.imageEl.nativeElement,
        { y: 40 },
        {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: this.sectionEl.nativeElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        },
      );

      // Animated arrow on compare button (repeating)
      const arrow = this.compareBtnEl.nativeElement.querySelector('.btn-arrow');
      if (arrow) {
        gsap.to(arrow, {
          x: 4,
          duration: 0.8,
          ease: 'power1.inOut',
          repeat: -1,
          yoyo: true,
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
