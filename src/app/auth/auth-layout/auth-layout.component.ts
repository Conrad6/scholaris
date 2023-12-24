import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthModule } from '@angular/fire/auth'

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, AuthModule],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {

}
