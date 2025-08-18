import { Component, EventEmitter, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-in-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './sign-in-modal.component.html',
  styleUrl: './sign-in-modal.component.css'
})
export class SignInModalComponent {
  @Output() close = new EventEmitter<void>();

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  isLoading = false;
  errorMessage: string | null = null;

  forgotPassword = false;
  signUp = false;

  constructor(private authService: AuthService) { }

  get title() {
    return this.signUp ? "Sign Up" : "Sign In";
  }

  get titleLowercase() {
    return this.signUp ? "Sign up" : "Sign in";
  }

  get entryLink() {
    return this.signUp ? "Sign in" : "Sign up";
  }

  get entryLinkAdverb() {
    return this.signUp ? "Already" : "Don't";
  }

  onRegisterPress(event: Event) {
    this.signUp = !this.signUp;
    console.log("register clicked", this.signUp);
  }

  onForgotPress(event: Event) {
    this.forgotPassword = !this.forgotPassword;
    console.log("Forgot password clicked", this.forgotPassword);
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;

    const { email, password } = this.loginForm.value;

    if (this.signUp) {
      console.log("Query for signing up");
    } else {
      console.log("Query for signing in");
      this.authService.login(email!, password!).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.isLoading = false;
          // Handle successful login (redirect, store token, etc.)
        },
        error: (error) => {
          console.error('Login failed', error);
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Login failed';
        }
      })
    }
    console.log(email);
    console.log(password);
  }

  onClose() {
    this.close.emit();
  }
}
