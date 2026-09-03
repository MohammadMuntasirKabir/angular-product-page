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
import * as THREE from 'three';

interface ColorOption {
  name: string;
  label: string;
  hex: number;
}

interface PhoneLabel {
  id: string;
  text: string;
  position: { x: number; y: number };
  visible: boolean;
}

@Component({
  selector: 'app-product-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="product-viewer" #viewerSection>
      <div class="viewer-content" #viewerContent>
        <h2 class="viewer-heading" #viewerHeading>Take a closer look.</h2>
        <p class="viewer-sub" #viewerSub>
          Explore every angle of iPhone 17 Pro.
        </p>

        <div class="canvas-wrapper" #canvasWrapper>
          <canvas #threeCanvas></canvas>
          <div class="phone-labels" #phoneLabels>
            @for (label of phoneLabelsList; track label.id) {
            <div
              class="phone-label"
              [class.visible]="label.visible"
              [style.left.%]="label.position.x"
              [style.top.%]="label.position.y"
              #phoneLabel
            >
              <span class="label-dot"></span>
              <span class="label-text">{{ label.text }}</span>
            </div>
            }
          </div>
        </div>

        <div class="color-picker" #colorPicker>
          @for (color of colorOptions; track color.name) {
          <button
            class="color-btn"
            [class.active]="selectedColor === color.name"
            (click)="changeColor(color)"
            #colorBtn
          >
            <span
              class="color-dot"
              [style.background]="color.name === 'cosmic-orange' ? '#C75B2A' : color.name === 'deep-blue' ? '#1D3A6B' : '#C0C0C4'"
            ></span>
            <span class="color-label">{{ color.label }}</span>
          </button>
          }
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./product-viewer.scss'],
})
export class ProductViewerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('viewerSection') sectionEl!: ElementRef;
  @ViewChild('viewerContent') contentEl!: ElementRef;
  @ViewChild('viewerHeading') headingEl!: ElementRef;
  @ViewChild('viewerSub') subEl!: ElementRef;
  @ViewChild('canvasWrapper') canvasWrapperEl!: ElementRef;
  @ViewChild('threeCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('colorPicker') pickerEl!: ElementRef;
  @ViewChildren('colorBtn') colorBtns!: QueryList<ElementRef>;
  @ViewChild('phoneLabels') phoneLabelsContainer!: ElementRef;
  @ViewChildren('phoneLabel') phoneLabelEls!: QueryList<ElementRef>;

  selectedColor = 'deep-blue';
  baseRotationY = 0;
  isUserInteracting = false;
  private floatingTween: gsap.core.Tween | null = null;

  colorOptions: ColorOption[] = [
    { name: 'cosmic-orange', label: 'Cosmic Orange', hex: 0xc75b2a },
    { name: 'deep-blue', label: 'Deep Blue', hex: 0x1d3a6b },
    { name: 'silver', label: 'Silver', hex: 0xc0c0c4 },
  ];

  phoneLabelsList: PhoneLabel[] = [
    { id: 'camera', text: '48MP Pro Camera System', position: { x: 75, y: 32 }, visible: false },
    { id: 'chip', text: 'A19 Pro chip', position: { x: 25, y: 50 }, visible: false },
    { id: 'screen', text: '6.3" Super Retina XDR', position: { x: 70, y: 72 }, visible: false },
  ];

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private phoneGroup!: THREE.Group;
  private animationId!: number;
  private resizeObserver!: ResizeObserver;
  private gsapCtx!: gsap.Context;

  ngAfterViewInit(): void {
    this.initThree();
    this.setupAnimations();
    this.animateLoop();
    this.startFloating();
  }

  ngOnDestroy(): void {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.renderer) this.renderer.dispose();
    if (this.resizeObserver) this.resizeObserver.disconnect();
    this.floatingTween?.kill();
    this.gsapCtx?.revert();
    ScrollTrigger.getAll().forEach(t => t.kill());
  }

  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;
    const wrapperEl = this.canvasWrapperEl.nativeElement;
    const width = wrapperEl.clientWidth;
    const height = wrapperEl.clientHeight;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    this.camera.position.set(0, 0.3, 4.5);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(3, 5, 5);
    keyLight.castShadow = true;
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x2997ff, 0.5);
    rimLight.position.set(-3, 1, -2);
    this.scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-2, -2, 3);
    this.scene.add(fillLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 0.3);
    topLight.position.set(0, 5, 0);
    this.scene.add(topLight);

    // Build phone group
    this.phoneGroup = this.createDetailedPhone(0x1d3a6b);
    this.scene.add(this.phoneGroup);

    // Show labels on hover
    wrapperEl.addEventListener('mouseenter', () => {
      this.phoneLabelsList.forEach(l => l.visible = true);
    });
    wrapperEl.addEventListener('mouseleave', () => {
      this.phoneLabelsList.forEach(l => l.visible = false);
    });

    // Resize observer
    this.resizeObserver = new ResizeObserver(() => {
      const w = wrapperEl.clientWidth;
      const h = wrapperEl.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
    this.resizeObserver.observe(wrapperEl);
  }

  private createRoundedRectShape(w: number, h: number, r: number): THREE.Shape {
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2 + r, -h / 2);
    shape.lineTo(w / 2 - r, -h / 2);
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    shape.lineTo(w / 2, h / 2 - r);
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    shape.lineTo(-w / 2 + r, h / 2);
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    shape.lineTo(-w / 2, -h / 2 + r);
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    return shape;
  }

  private createDetailedPhone(color: number): THREE.Group {
    const group = new THREE.Group();

    // Phone body
    const bodyW = 0.82;
    const bodyH = 1.7;
    const bodyR = 0.12;
    const bodyShape = this.createRoundedRectShape(bodyW, bodyH, bodyR);
    const bodyExtrudeSettings = {
      depth: 0.15,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 6,
    };
    const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, bodyExtrudeSettings);
    bodyGeo.center();
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0.75,
      roughness: 0.2,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    // Screen (front face)
    const screenShape = this.createRoundedRectShape(bodyW - 0.06, bodyH - 0.08, bodyR - 0.02);
    const screenGeo = new THREE.ShapeGeometry(screenShape);
    const screenMat = new THREE.MeshPhysicalMaterial({
      color: 0x111111,
      metalness: 0.1,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = 0.076;
    group.add(screenMesh);

    // Dynamic Island / camera cutout
    const cutoutGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 32);
    const cutoutMat = new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      metalness: 0.2,
      roughness: 0.3,
    });
    const cutout = new THREE.Mesh(cutoutGeo, cutoutMat);
    cutout.rotation.x = Math.PI / 2;
    cutout.position.set(0, 0.72, 0.077);
    group.add(cutout);

    // Camera bump (back)
    const bumpW = 0.32;
    const bumpH = 0.32;
    const bumpShape = this.createRoundedRectShape(bumpW, bumpH, 0.07);
    const bumpExtrudeSettings = {
      depth: 0.04,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 4,
    };
    const bumpGeo = new THREE.ExtrudeGeometry(bumpShape, bumpExtrudeSettings);
    bumpGeo.center();
    const bumpMat = new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0.8,
      roughness: 0.18,
      clearcoat: 0.6,
      clearcoatRoughness: 0.1,
    });
    const cameraBump = new THREE.Mesh(bumpGeo, bumpMat);
    cameraBump.position.set(-bodyW / 2 + bumpW / 2 + 0.06, bodyH / 2 - bumpH / 2 - 0.08, -0.09);
    cameraBump.castShadow = true;
    group.add(cameraBump);

    // Three camera lenses on the bump
    const lensPositions = [
      { x: -0.07, y: 0.07 },
      { x: 0.07, y: 0.07 },
      { x: -0.07, y: -0.07 },
    ];
    lensPositions.forEach(pos => {
      const lensGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.025, 32);
      const lensMat = new THREE.MeshPhysicalMaterial({
        color: 0x1a1a2e,
        metalness: 0.3,
        roughness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
      });
      const lens = new THREE.Mesh(lensGeo, lensMat);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(
        cameraBump.position.x + pos.x,
        cameraBump.position.y + pos.y,
        cameraBump.position.z - 0.035
      );
      group.add(lens);

      // Lens glass
      const glassGeo = new THREE.CircleGeometry(0.032, 32);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x0a0a1a,
        metalness: 0.1,
        roughness: 0.05,
        clearcoat: 1,
      });
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.position.set(
        cameraBump.position.x + pos.x,
        cameraBump.position.y + pos.y,
        cameraBump.position.z - 0.048
      );
      group.add(glass);
    });

    // Side buttons (Volume & Power)
    const volumeBtnGeo = new THREE.BoxGeometry(0.01, 0.12, 0.03);
    const btnMat = new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0.8,
      roughness: 0.2,
    });
    const volumeUp = new THREE.Mesh(volumeBtnGeo, btnMat);
    volumeUp.position.set(-bodyW / 2 - 0.005, 0.35, 0);
    group.add(volumeUp);

    const volumeDown = new THREE.Mesh(volumeBtnGeo, btnMat);
    volumeDown.position.set(-bodyW / 2 - 0.005, 0.18, 0);
    group.add(volumeDown);

    const powerBtnGeo = new THREE.BoxGeometry(0.01, 0.18, 0.03);
    const powerBtn = new THREE.Mesh(powerBtnGeo, btnMat);
    powerBtn.position.set(bodyW / 2 + 0.005, 0.3, 0);
    group.add(powerBtn);

    // Action button (left side)
    const actionBtnGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.01, 24);
    const actionBtn = new THREE.Mesh(actionBtnGeo, btnMat);
    actionBtn.rotation.z = Math.PI / 2;
    actionBtn.position.set(-bodyW / 2 - 0.005, 0.52, 0);
    group.add(actionBtn);

    // USB-C port
    const usbGeo = new THREE.BoxGeometry(0.14, 0.01, 0.045);
    const usbMat = new THREE.MeshPhysicalMaterial({
      color: 0x333333,
      metalness: 0.9,
      roughness: 0.2,
    });
    const usbPort = new THREE.Mesh(usbGeo, usbMat);
    usbPort.position.set(0, -bodyH / 2 - 0.005, 0);
    group.add(usbPort);

    // Speaker grilles (bottom right)
    for (let i = 0; i < 6; i++) {
      const grillGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.01, 8);
      const grill = new THREE.Mesh(grillGeo, usbMat);
      grill.rotation.x = Math.PI / 2;
      grill.position.set(0.2 + i * 0.025, -bodyH / 2 - 0.005, 0.08);
      group.add(grill);
    }

    group.rotation.x = -0.1;
    return group;
  }

  private animateLoop = (): void => {
    if (!this.phoneGroup) return;

    if (!this.isUserInteracting) {
      // Very subtle auto-rotation when not interacting
      this.phoneGroup.rotation.y += 0.002;
    }

    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(this.animateLoop);
  };

  private startFloating(): void {
    if (this.phoneGroup) {
      this.floatingTween = gsap.to(this.phoneGroup.position, {
        y: 0.04,
        duration: 2.5,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      });
    }
  }

  changeColor(colorOption: ColorOption): void {
    if (this.selectedColor === colorOption.name) return;
    this.selectedColor = colorOption.name;

    const targetColor = new THREE.Color(colorOption.hex);

    this.phoneGroup.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhysicalMaterial) {
        // Only animate the body/screen frame materials (not lens, button, etc.)
        if (child.material.clearcoat !== undefined && child.material.metalness > 0.5) {
          gsap.to(child.material.color, {
            r: targetColor.r,
            g: targetColor.g,
            b: targetColor.b,
            duration: 0.6,
            ease: 'power2.inOut',
          });
        }
      }
    });

    // Scale bounce on color change
    gsap.fromTo(
      this.phoneGroup.scale,
      { x: 0.96, y: 0.96, z: 0.96 },
      { x: 1, y: 1, z: 1, duration: 0.5, ease: 'back.out(1.7)' },
    );

    // Pause floating during transition
    this.floatingTween?.pause();
    gsap.delayedCall(0.6, () => this.floatingTween?.play());
  }

  private setupAnimations(): void {
    this.gsapCtx = gsap.context(() => {
      // Entrance animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: this.sectionEl.nativeElement,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      tl.from(this.headingEl.nativeElement, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
      })
        .from(
          this.subEl.nativeElement,
          { opacity: 0, y: 30, duration: 0.5, ease: 'power3.out' },
          '-=0.4',
        )
        .from(
          this.canvasWrapperEl.nativeElement,
          { opacity: 0, scale: 0.92, y: 40, duration: 1, ease: 'power3.out' },
          '-=0.5',
        )
        .from(
          this.pickerEl.nativeElement,
          { opacity: 0, y: 20, duration: 0.4, ease: 'power2.out' },
          '-=0.5',
        );

      // Color button stagger
      const btns = this.colorBtns.toArray().map(el => el.nativeElement);
      tl.from(btns, {
        opacity: 0,
        y: 10,
        stagger: 0.08,
        duration: 0.3,
        ease: 'power2.out',
      }, '-=0.3');

      // Scroll-driven rotation: phone rotates as user scrolls
      gsap.to(this.phoneGroup.rotation, {
        y: this.baseRotationY + Math.PI * 0.75,
        ease: 'none',
        scrollTrigger: {
          trigger: this.sectionEl.nativeElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
    });
  }
}
