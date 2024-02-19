import { Component, OnInit, inject, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { Store } from '@ngxs/store';
import { SignIn, SignOut } from '../../state/actions/user.actions';
import { Navigate } from '@ngxs/router-plugin';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CardModule, NgTemplateOutlet, DividerModule, InputTextModule, ButtonModule, ReactiveFormsModule, RouterLink, ToastModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  providers: [MessageService]
})
export class LoginPageComponent implements OnInit {
  currentRoute = inject(ActivatedRoute);
  processing = signal(false);
  private store = inject(Store);
  private messageService = inject(MessageService);
  state = inject(Router).getCurrentNavigation()?.extras.state;
  form = new FormGroup({
    email: new FormControl<string>(this.state?.['email'] ?? '', { validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { validators: [Validators.required] })
  });

  ngOnInit(): void {
    this.store.dispatch(new SignOut());
  }

  onFormSubmit() {
    this.processing.set(true);
    this.store.dispatch(new SignIn(this.form.value.email ?? '', this.form.value.password ?? '')).subscribe({
      error: (error: Error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Login Error',
          detail: error.message,
          life: 5000
        })
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
