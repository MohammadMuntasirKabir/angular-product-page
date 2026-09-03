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
  selector: 'app-pro-video',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="pro-video" #sectionEl>
      <div class="pro-video-content" #contentEl>
        <span class="section-label" #labelEl>Pro video</span>
        <h2 class="pro-video-heading" #headingEl>
          Hollywood quality.<br />iPhone quality.
        </h2>
        <p class="pro-video-desc" #descEl>
          iPhone 17 Pro shoots 4K Dolby Vision at 120 fps — the highest resolution
          and frame rate ever on iPhone. Record ProRes RAW and ProRes Log for
          maximum editing flexibility. And with genlock and timecode support,
          iPhone 17 Pro integrates seamlessly into professional workflows.
        </p>
      </div>

      <div class="pro-video-showcase" #showcaseEl>
        <div class="video-frame" #videoFrameEl>
          <img
            src="https://www.apple.com/v/iphone-17-pro/f/images/overview/cameras/pro-video/pro_video_endframe__fwo5u3efeve6_large.jpg"
            alt="Pro video sample"
            loading="lazy"
          />
          <div class="video-badge">4K 120 fps Dolby Vision</div>
        </div>
        <div class="pro-features-list" #featuresListEl>
          <div class="pro-feature" *ngFor="let feature of proFeatures; let i = index">
            <div class="pro-feature-icon">
              <img [src]="feature.icon" [alt]="feature.title" />
            </div>
            <div class="pro-feature-text">
              <h4>{{ feature.title }}</h4>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./pro-video.component.scss'],
})
export class ProVideoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sectionEl') sectionElRef!: ElementRef;
  @ViewChild('contentEl') contentElRef!: ElementRef;
  @ViewChild('labelEl') labelElRef!: ElementRef;
  @ViewChild('headingEl') headingElRef!: ElementRef;
  @ViewChild('descEl') descElRef!: ElementRef;
  @ViewChild('showcaseEl') showcaseElRef!: ElementRef;
  @ViewChild('videoFrameEl') videoFrameElRef!: ElementRef;
  @ViewChild('featuresListEl') featuresListRef!: ElementRef;

  private ctx!: gsap.Context;

  proFeatures = [
    {
      title: 'ProRes RAW',
      description: 'Record in ProRes RAW for maximum editing flexibility in Final Cut Pro and DaVinci Resolve.',
      icon: 'https://www.apple.com/v/iphone-17-pro/f/images/overview/cameras/pro-video/video_hw__q1n3m8u4dtu2_large.png',
    },
    {
      title: 'Pro Workflows',
      description: 'Transfer files at up to 20× faster with USB 3 speeds up to 20Gbps.',
      icon: 'https://www.apple.com/v/iphone-17-pro/f/images/overview/cameras/pro-video/video_hw__q1n3m8u4dtu2_large.png',
    },
    {
      title: 'Genlock & Timecode',
      description: 'Professional genlock and timecode support for multicam workflows.',
      icon: 'https://www.apple.com/v/iphone-17-pro/f/images/overview/cameras/pro-video/video_hw__q1n3m8u4dtu2_large.png',
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
        .from(this.descElRef.nativeElement, { opacity: 0, y: 30, duration: 0.6 }, '-=0.4')
        .from(this.videoFrameElRef.nativeElement, { opacity: 0, scale: 0.95, duration: 0.8 }, '-=0.3');

      gsap.from(this.featuresListRef.nativeElement?.children, {
        scrollTrigger: {
          trigger: this.featuresListRef.nativeElement,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 20,
        stagger: 0.12,
        duration: 0.5,
        ease: 'power2.out',
      });

      // Parallax on video frame
      gsap.fromTo(
        this.videoFrameElRef.nativeElement,
        { y: 30 },
        {
          y: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: this.showcaseElRef.nativeElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
