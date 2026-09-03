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

interface IosFeature {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'ios' | 'intelligence';
}

@Component({
  selector: 'app-ios-features',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="ios-features" #iosFeaturesSection>
      <div class="section-header">
        <h2 #iosHeading>iOS 26</h2>
        <p #iosDesc>
          A stunning new design. More ways to personalize. And new features that
          make iPhone even more delightful and effortless to use every day.
        </p>
      </div>

      <div class="features-grid ios-grid" #iosGrid>
        <div
          class="feature-card"
          *ngFor="let feature of iosFeatures"
          #iosCard
        >
          <div class="feature-image">
            <img [src]="feature.image" [alt]="feature.title" loading="lazy" />
          </div>
          <div class="feature-text">
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>

      <div class="divider" #divider></div>

      <div class="section-header intelligence-header">
        <span class="intelligence-badge" #intelligenceBadge>
          Apple Intelligence
        </span>
        <h2 #intelligenceHeading>Apple Intelligence</h2>
        <p #intelligenceDesc>
          Personal intelligence system that puts powerful generative models right
          at the core of your iPhone. Deeply private, with groundbreaking privacy
          protections built in from the start.
        </p>
      </div>

      <div class="features-grid intelligence-grid" #intelligenceGrid>
        <div
          class="feature-card"
          *ngFor="let feature of intelligenceFeatures"
          #aiCard
        >
          <div class="feature-image">
            <img [src]="feature.image" [alt]="feature.title" loading="lazy" />
          </div>
          <div class="feature-text">
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./ios-features.component.scss'],
})
export class IosFeaturesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('iosFeaturesSection') sectionEl!: ElementRef;
  @ViewChild('iosHeading') iosHeadingEl!: ElementRef;
  @ViewChild('iosDesc') iosDescEl!: ElementRef;
  @ViewChild('iosGrid') iosGridEl!: ElementRef;
  @ViewChild('divider') dividerEl!: ElementRef;
  @ViewChild('intelligenceBadge') intelligenceBadgeEl!: ElementRef;
  @ViewChild('intelligenceHeading') intelligenceHeadingEl!: ElementRef;
  @ViewChild('intelligenceDesc') intelligenceDescEl!: ElementRef;
  @ViewChild('intelligenceGrid') intelligenceGridEl!: ElementRef;
  @ViewChildren('iosCard') iosCards!: QueryList<ElementRef>;
  @ViewChildren('aiCard') aiCards!: QueryList<ElementRef>;

  private ctx!: gsap.Context;

  iosFeatures: IosFeature[] = [
    {
      id: 'liquid-glass',
      title: 'Liquid Glass design',
      description:
        'A new translucent material that feels alive under your fingertips, with depth and dimension that makes every interaction more delightful.',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/shared-features/ios-gallery/liquid_glass__f3e4ro3o20ey_large.jpg',
      category: 'ios',
    },
    {
      id: 'lock-screen',
      title: 'Lock Screen',
      description:
        'A completely redesigned Lock Screen with dynamic widgets, live activities, and new ways to make it uniquely yours.',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/shared-features/ios-gallery/lock_screen__emz68nbp82aa_large.jpg',
      category: 'ios',
    },
    {
      id: 'call-screening',
      title: 'Call Screening',
      description:
        'Automatically answers unknown calls and asks who they are and why they\'re calling, so you can decide whether to pick up.',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/shared-features/ios-gallery/call_screening__gmqlen1knwq6_large.jpg',
      category: 'ios',
    },
    {
      id: 'hold-assist',
      title: 'Hold Assist',
      description:
        'When you\'re on hold, iPhone can wait for you and notify you when a live person is available.',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/shared-features/ios-gallery/hold_assist__dtwdrqn3q46e_large.jpg',
      category: 'ios',
    },
    {
      id: 'polls-messages',
      title: 'Polls in Messages',
      description:
        'Create polls right in your group chats to quickly gather opinions and make decisions together.',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/shared-features/ios-gallery/polls__gfitf2udgm6i_large.jpg',
      category: 'ios',
    },
  ];

  intelligenceFeatures: IosFeature[] = [
    {
      id: 'visual-intelligence',
      title: 'Visual Intelligence',
      description:
        'Point your camera at something to instantly learn more about it, translate text, or take action with just a tap.',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/shared-features/ai-gallery/visual_intelligence__dzuk4k0u50cy_large.jpg',
      category: 'intelligence',
    },
    {
      id: 'live-translation',
      title: 'Live Translation',
      description:
        'Translate conversations in real time across languages, so you can communicate naturally with anyone, anywhere.',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/shared-features/ai-gallery/ai_live_translation_alt__c4493qnkdkeq_large.jpg',
      category: 'intelligence',
    },
    {
      id: 'clean-up',
      title: 'Clean Up',
      description:
        'Remove unwanted objects from your photos with a tap. Apple Intelligence fills in the background seamlessly.',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/shared-features/ai-gallery/clean_up__djkablowcniq_large.jpg',
      category: 'intelligence',
    },
    {
      id: 'genmoji',
      title: 'Genmoji',
      description:
        'Create custom emoji by describing what you want. Express yourself with unique, personalized emoji in Messages and beyond.',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/shared-features/ai-gallery/genmoji__bmoajzac51yq_large.jpg',
      category: 'intelligence',
    },
    {
      id: 'writing-tools',
      title: 'Writing Tools',
      description:
        'Proofread, rewrite, and adjust the tone of your text anywhere you type. Summarize long emails, notes, and more with a tap.',
      image:
        'https://www.apple.com/v/iphone-17-pro/f/images/overview/shared-features/ai-gallery/writing_tools__dmyk5restfgy_large.jpg',
      category: 'intelligence',
    },
  ];

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      // iOS section entrance
      const iosTl = gsap.timeline({
        scrollTrigger: {
          trigger: this.iosHeadingEl.nativeElement,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        defaults: { ease: 'power3.out' },
      });

      iosTl
        .from(this.iosHeadingEl.nativeElement, { opacity: 0, y: 40, duration: 0.7 })
        .from(this.iosDescEl.nativeElement, { opacity: 0, y: 30, duration: 0.6 }, '-=0.3');

      // iOS cards stagger
      const iosCardEls = this.iosCards.toArray().map(c => c.nativeElement);
      if (iosCardEls.length > 0) {
        gsap.from(iosCardEls, {
          scrollTrigger: {
            trigger: this.iosGridEl.nativeElement,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          opacity: 0,
          y: 40,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
        });
      }

      // Divider animation
      gsap.from(this.dividerEl.nativeElement, {
        scrollTrigger: {
          trigger: this.dividerEl.nativeElement,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
        scaleX: 0,
        duration: 0.8,
        ease: 'power2.out',
      });

      // Intelligence section entrance
      const intTl = gsap.timeline({
        scrollTrigger: {
          trigger: this.intelligenceHeadingEl.nativeElement,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        defaults: { ease: 'power3.out' },
      });

      intTl
        .from(this.intelligenceBadgeEl.nativeElement, { opacity: 0, y: 20, duration: 0.5 })
        .from(this.intelligenceHeadingEl.nativeElement, { opacity: 0, y: 40, duration: 0.7 }, '-=0.2')
        .from(this.intelligenceDescEl.nativeElement, { opacity: 0, y: 30, duration: 0.6 }, '-=0.3');

      // Intelligence cards stagger
      const aiCardEls = this.aiCards.toArray().map(c => c.nativeElement);
      if (aiCardEls.length > 0) {
        gsap.from(aiCardEls, {
          scrollTrigger: {
            trigger: this.intelligenceGridEl.nativeElement,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          opacity: 0,
          y: 40,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
