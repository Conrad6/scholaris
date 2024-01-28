import { NgTemplateOutlet } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SignUp } from '../../state/actions/user.actions';
import { Navigate } from '@ngxs/router-plugin';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    RouterLink,
    InputTextModule,
    CheckboxModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    ReactiveFormsModule
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  errorMessage = signal('');
  saving = signal(false);
  private readonly store = inject(Store);
  private readonly currentRoute = inject(ActivatedRoute);
  form = new FormGroup({
    firstName: new FormControl<string>('', { validators: [Validators.required] }),
    lastName: new FormControl<string | null>(null),
    email: new FormControl<string>('', { validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { validators: [Validators.required, Validators.pattern(/.{8,}/), Validators.pattern(/[A-Z]/), Validators.pattern(/[a-z]/), Validators.pattern(/\d/), Validators.pattern(/\W/)] }),
    termsAndConditionsAgreed: new FormControl<boolean>(false, { validators: [Validators.requiredTrue] })
  });

  onFormSubmit() {
    this.errorMessage.set('');
    this.saving.set(true);
    this.store.dispatch(new SignUp(
      `${this.form.value.firstName ?? ''} ${this.form.value.lastName ?? ''}`.trim(),
      this.form.value.email ?? '',
      this.form.value.password ?? ''
    )).subscribe({
      error: (error: Error) => {
        this.saving.set(false);
        this.errorMessage.set(error.message);
      },
      complete: () => {
        this.saving.set(false);
        this.store.dispatch(new Navigate(['../login'], undefined, {
          relativeTo: this.currentRoute,
          queryParamsHandling: 'preserve',
          state: {
            newAccount: true,
            email: this.form.value.email
          }
        }));
      }
    });
  }
}
