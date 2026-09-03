import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layout/header.component';
import { LocalNavComponent } from './layout/local-nav.component';
import { FooterComponent } from './layout/footer.component';
import { HeroComponent } from './sections/hero.component';
import { HighlightsComponent } from './sections/highlights.component';
import { DesignComponent } from './sections/design.component';
import { ProductViewerComponent } from './sections/product-viewer.component';
import { CamerasComponent } from './sections/cameras.component';
import { PerformanceComponent } from './sections/performance.component';
import { BatteryComponent } from './sections/battery.component';
import { IosFeaturesComponent } from './sections/ios-features.component';
import { CompareComponent } from './sections/compare.component';
import { AccessoriesComponent } from './sections/accessories.component';
import { ProVideoComponent } from './sections/pro-video.component';
import { ConnectivityComponent } from './sections/connectivity.component';
import { TradeInComponent } from './sections/trade-in.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    LocalNavComponent,
    FooterComponent,
    HeroComponent,
    HighlightsComponent,
    DesignComponent,
    ProductViewerComponent,
    CamerasComponent,
    PerformanceComponent,
    BatteryComponent,
    IosFeaturesComponent,
    CompareComponent,
    AccessoriesComponent,
    ProVideoComponent,
    ConnectivityComponent,
    TradeInComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  isScrolled = false;
  showScrollTop = false;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const scrollY = window.scrollY || window.pageYOffset;
    this.isScrolled = scrollY > 10;
    this.showScrollTop = scrollY > 800;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit(): void {
    // Prevent FOUC
    document.body.style.visibility = 'visible';
  }

  ngOnDestroy(): void {}
}
