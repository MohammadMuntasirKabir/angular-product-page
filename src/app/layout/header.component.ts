import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NavItem {
  label: string;
  url: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header" [class.header--menu-open]="mobileMenuOpen">
      <nav class="header__nav container" aria-label="Global">
        <!-- Apple logo -->
        <a href="/" class="header__logo" aria-label="Apple Home">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="18"
            viewBox="0 0 14 18"
            fill="currentColor"
            aria-hidden="true"
            role="img"
          >
            <path
              d="M13.1 10.6c-.3 3.1 2.6 4.3 2.6 4.3-.2.6-.9 2-1.9 3.2-1 1.1-2 2.2-3.9 2.2-1.7 0-2.2-1.1-4.1-1.1-1.9 0-2.4 1.1-4.2 1.1-1.8 0-3-1.9-4.1-3.1C-4 14.9-5.1 11.4-3.9 9c.6-1.2 1.7-2 2.9-2 1.2 0 2.3 1.1 3.9 1.1 1.6 0 2.5-1.1 3.9-1.1.6 0 2.3.2 3.3 1.6zM10.2.4c.9 1.1.5 2.4.5 2.4s-1.2.9-2.1 0c-.8-.8-.5-2-.5-2s1.3-.5 2.1-.4z"
            />
          </svg>
        </a>

        <!-- Primary nav: each item has a link + expand button -->
        <ul class="header__menu" role="list" [hidden]="isMobile() && !mobileMenuOpen">
          <li *ngFor="let item of navItems" class="header__menu-item">
            <ul class="header__menu-item-list" role="list">
              <li class="header__menu-item-link">
                <a [href]="item.url" class="header__link">{{ item.label }}</a>
              </li>
              <li class="header__menu-item-btn">
                <button
                  type="button"
                  class="header__menu-btn"
                  [attr.aria-label]="item.label + ' menu'"
                  aria-expanded="false"
                  (click)="onNavClick(item.label)"
                >
                  <svg
                    class="header__menu-btn-chevron"
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M1 2.5L4 5.5L7 2.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </li>
            </ul>
          </li>
        </ul>

        <!-- Right-side icons -->
        <div class="header__actions">
          <button class="header__icon-btn" aria-label="Search apple.com">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="44"
              viewBox="0 0 15 44"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M14.298 27.202l-3.87-3.87a5.53 5.53 0 1 0-.707.707l3.87 3.87a.5.5 0 1 0 .707-.707zM6.25 21.5a4.25 4.25 0 1 1 4.25-4.25A4.254 4.254 0 0 1 6.25 21.5z"
              />
            </svg>
          </button>
          <button class="header__icon-btn" aria-label="Shopping Bag">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="44"
              viewBox="0 0 14 44"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M11.35 16.03h-1.99V9.45a3.45 3.45 0 0 0-6.9 0v6.58h-2a.65.65 0 0 0-.65.65v9.14a.65.65 0 0 0 .65.65h10.89a.65.65 0 0 0 .65-.65v-9.14a.65.65 0 0 0-.65-.65zm-7.59 0V9.45a2.15 2.15 0 0 1 4.3 0v6.58H3.76zm7.59 9.79H.65v-9.14h10.7v9.14z"
              />
            </svg>
          </button>

          <!-- Mobile hamburger toggle -->
          <button
            *ngIf="isMobile()"
            class="header__menu-trigger"
            type="button"
            [attr.aria-expanded]="mobileMenuOpen"
            aria-controls="mobile-menu"
            [attr.aria-label]="mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'"
            (click)="toggleMobileMenu()"
          >
            <span class="header__menu-bar header__menu-bar--top" [class.header__menu-bar--open]="mobileMenuOpen"></span>
            <span class="header__menu-bar header__menu-bar--bottom" [class.header__menu-bar--open]="mobileMenuOpen"></span>
          </button>
        </div>
      </nav>
    </header>
  `,
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  mobileMenuOpen = false;

  readonly navItems: ReadonlyArray<NavItem> = [
    { label: 'Store',        url: '/store' },
    { label: 'Mac',          url: '/mac' },
    { label: 'iPad',         url: '/ipad' },
    { label: 'iPhone',       url: '/iphone' },
    { label: 'Watch',        url: '/watch' },
    { label: 'Vision',       url: '/vision' },
    { label: 'AirPods',      url: '/airpods' },
    { label: 'TV & Home',    url: '/tv-home' },
    { label: 'Entertainment',url: '/entertainment' },
    { label: 'Accessories',  url: '/accessories' },
    { label: 'Support',      url: '/support' },
  ];

  isMobile(): boolean {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
  }

  onNavClick(label: string): void {
    // Close the mobile menu when a nav item is selected so the overlay clears.
    if (this.mobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.isMobile() && this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
      document.body.style.overflow = '';
    }
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
      document.body.style.overflow = '';
    }
  }
}
