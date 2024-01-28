import { Component, inject, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { Store } from '@ngxs/store';
import { SignIn } from '../../state/actions/user.actions';
import { Navigate } from '@ngxs/router-plugin';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CardModule, NgTemplateOutlet, DividerModule, InputTextModule, ButtonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  currentRoute = inject(ActivatedRoute);
  processing = signal(false);
  errorMessage = signal('');
  private store = inject(Store);
  state = inject(Router).getCurrentNavigation()?.extras.state;
  form = new FormGroup({
    email: new FormControl<string>(this.state?.['email'] ?? '', { validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { validators: [Validators.required] })
  });

  onFormSubmit() {
    this.processing.set(true);
    this.errorMessage.set('');
    this.store.dispatch(new SignIn(this.form.value.email ?? '', this.form.value.password ?? '')).subscribe({
      error: (error: Error) => {
        this.errorMessage.set(error.message);
        this.processing.set(false);
      },
      complete: () => {
        this.processing.set(false);
        this.store.dispatch(new Navigate([
          this.currentRoute.snapshot.queryParamMap.has('continue') ? decodeURIComponent(this.currentRoute.snapshot.queryParamMap.get('continue') as string) : '/console'
        ]));
      }
    })
  }
}
