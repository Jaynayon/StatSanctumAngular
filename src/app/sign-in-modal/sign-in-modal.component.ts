import { Component, EventEmitter, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'app-sign-in-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './sign-in-modal.component.html',
  styleUrl: './sign-in-modal.component.css'
})
export class SignInModalComponent {
  @Output() close = new EventEmitter<void>();

  private loginSubscription?: Subscription;

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

    if (!email || !password) {
      this.errorMessage = 'Email and password are required';
      this.isLoading = false;
      return;
    }

    if (this.signUp) {
      this.handleSignUp();
    } else {
      this.handleLogin(email, password);
    }
  }

  private handleLogin(email: string, password: string) {
    // Using take(1) to auto-unsubscribe after first emission
    this.authService.login({ username: email, password })
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.isLoading = false;
          // Login successful - authService already handles navigation
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = this.getErrorMessage(error);
        }
      });
  }

  private handleSignUp() {
    console.log("Sign up logic would go here");
    this.isLoading = false;
    // Implement similar pattern for signup
  }

  private getErrorMessage(error: any): string {
    return error.error?.message
      || error.message
      || 'Login failed. Please check your credentials.';
  }

  ngOnDestroy() {
    // Clean up any existing subscription
    this.loginSubscription?.unsubscribe();
  }

  onClose() {
    this.close.emit();
  }
}
