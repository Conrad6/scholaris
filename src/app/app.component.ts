import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { ChipsModule } from 'primeng/chips';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChipsModule, CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  values = ['foo', 'bar'];
  constructor(primeConfig: PrimeNGConfig) {
    primeConfig.ripple = true;
  }
}
