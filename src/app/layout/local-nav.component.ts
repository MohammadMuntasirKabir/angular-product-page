import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ExploreItem {
  label: string;
  url: string;
}

@Component({
  selector: 'app-local-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="local-nav" role="navigation" aria-label="iPhone 17 Pro">
      <div class="local-nav__inner container">
        <h1 class="local-nav__title">iPhone 17 Pro</h1>

        <div class="local-nav__actions">
          <!-- Explore dropdown -->
          <div class="local-nav__dropdown">
            <button
              class="local-nav__dropdown-trigger"
              [attr.aria-expanded]="isOpen"
              [attr.aria-haspopup]="'true'"
              [attr.aria-controls]="'explore-menu'"
              (click)="toggle()"
              id="explore-button"
            >
              Explore iPhone 17 Pro
              <svg
                class="local-nav__chevron"
                [class.local-nav__chevron--open]="isOpen"
                xmlns="http://www.w3.org/2000/svg"
                width="9"
                height="9"
                viewBox="0 0 9 9"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M1.35 2.7 4.5 5.85 7.65 2.7 8.55 3.6l-4.05 4.05L.45 3.6z" />
              </svg>
            </button>

            <ul
              class="local-nav__dropdown-menu"
              *ngIf="isOpen"
              role="list"
              id="explore-menu"
              [attr.aria-labelledby]="'explore-button'"
            >
              <li role="listitem" *ngFor="let item of exploreItems">
                <a
                  [href]="item.url"
                  class="local-nav__dropdown-link"
                  (click)="close()"
                >{{ item.label }}</a>
              </li>
            </ul>
          </div>

          <!-- Buy button -->
          <a href="#buy" class="local-nav__buy btn btn--primary btn--sm">Buy</a>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./local-nav.component.scss'],
})
export class LocalNavComponent {
  isOpen = false;

  readonly exploreItems: ReadonlyArray<ExploreItem> = [
    { label: 'Overview',            url: '#overview' },
    { label: 'Tech Specs',          url: '#specs' },
    { label: 'Compare',             url: '#compare' },
    { label: 'Switch from Android', url: '#switch' },
  ];

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  close(): void {
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.local-nav__dropdown')) {
      this.isOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.isOpen = false;
  }
}
