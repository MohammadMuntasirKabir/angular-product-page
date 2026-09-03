import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FooterColumn {
  heading: string;
  links: { label: string; url: string }[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer__inner container">
        <div class="footer__columns">
          <div class="footer__column" *ngFor="let col of columns">
            <h4 class="footer__heading">{{ col.heading }}</h4>
            <ul class="footer__list" role="list">
              <li *ngFor="let link of col.links" class="footer__item">
                <a [href]="link.url" class="footer__link">{{ link.label }}</a>
              </li>
            </ul>
          </div>
        </div>

        <div class="footer__bottom">
          <p class="footer__copyright">
            More ways to shop: <a href="#store" class="footer__link">Find an Apple Store</a> or
            <a href="#reseller" class="footer__link">other retailer</a>
            near you. Or call 1-800-MY-APPLE.
          </p>
          <p class="footer__legal">
            Copyright &copy; {{ currentYear }} Apple Inc. All rights reserved.
            <span class="footer__legal-links">
              <a href="#privacy" class="footer__link">Privacy Policy</a> |
              <a href="#terms" class="footer__link">Terms of Use</a> |
              <a href="#sales" class="footer__link">Sales and Refunds</a> |
              <a href="#legal" class="footer__link">Legal</a> |
              <a href="#sitemap" class="footer__link">Site Map</a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  `,
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();

  readonly columns: ReadonlyArray<FooterColumn> = [
    {
      heading: 'Shop and Learn',
      links: [
        { label: 'Store',       url: '#store' },
        { label: 'Mac',         url: '#mac' },
        { label: 'iPad',        url: '#ipad' },
        { label: 'iPhone',      url: '#iphone' },
        { label: 'Watch',       url: '#watch' },
        { label: 'Vision',      url: '#vision' },
        { label: 'AirPods',     url: '#airpods' },
        { label: 'TV & Home',   url: '#tv-home' },
        { label: 'AirTag',      url: '#airtag' },
        { label: 'Accessories', url: '#accessories' },
        { label: 'Gift Cards',  url: '#gift-cards' },
      ],
    },
    {
      heading: 'Apple Store',
      links: [
        { label: 'Find a Store',         url: '#find-store' },
        { label: 'Genius Bar',            url: '#genius-bar' },
        { label: 'Today at Apple',        url: '#today-apple' },
        { label: 'Apple Camp',            url: '#apple-camp' },
        { label: 'Apple Store App',       url: '#store-app' },
        { label: 'Certified Refurbished', url: '#refurbished' },
        { label: 'Apple Trade In',        url: '#trade-in' },
        { label: 'Financing',             url: '#financing' },
        { label: 'Carrier Deals at Apple',url: '#carrier-deals' },
        { label: 'Order Status',          url: '#order-status' },
        { label: 'Shopping Help',         url: '#shopping-help' },
      ],
    },
    {
      heading: 'For Business',
      links: [
        { label: 'Apple and Business',      url: '#business' },
        { label: 'Shop for Business',        url: '#business-shop' },
      ],
    },
    {
      heading: 'For Education',
      links: [
        { label: 'Apple and Education',       url: '#education' },
        { label: 'Shop for K-12',             url: '#k12' },
        { label: 'Shop for College',          url: '#college' },
      ],
    },
    {
      heading: 'Apple Values',
      links: [
        { label: 'Accessibility',  url: '#accessibility' },
        { label: 'Education',       url: '#edu-values' },
        { label: 'Environment',     url: '#environment' },
        { label: 'Privacy',         url: '#privacy' },
        { label: 'Supply Chain',    url: '#supply-chain' },
      ],
    },
    {
      heading: 'About Apple',
      links: [
        { label: 'Newsroom',        url: '#newsroom' },
        { label: 'Apple Leadership',url: '#leadership' },
        { label: 'Career Opportunities', url: '#careers' },
        { label: 'Investors',       url: '#investors' },
        { label: 'Ethics & Compliance', url: '#ethics' },
        { label: 'Events',          url: '#events' },
        { label: 'Contact Apple',   url: '#contact' },
      ],
    },
  ];
}
