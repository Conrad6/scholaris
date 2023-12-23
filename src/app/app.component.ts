import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChipModule, CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(primeConfig: PrimeNGConfig) {
    primeConfig.ripple = true;
  }
}
