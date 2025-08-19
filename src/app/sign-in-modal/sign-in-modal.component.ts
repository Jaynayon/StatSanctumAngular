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


  private googleAuthWindow: Window | null = null;
  private cookieCheckInterval: any;

  onGoogleSubmit() {
    // Clear any existing interval
    if (this.cookieCheckInterval) {
      clearInterval(this.cookieCheckInterval);
    }

    // Open a new minimized window for Google OAuth
    this.googleAuthWindow = window.open(
      'https://localhost:7294/auth/google', // URL will be set by your backend
      'GoogleAuth',
      'width=500,height=550,left=10000,top=10000'
    );

    // Start checking for the cookie
    this.startCookieCheck();

    // if (this.signUp) {
    //   this.handleGoogleSignUp();
    // } else {
    //   this.handleGoogleLogin();
    // }
  }

  private startCookieCheck() {
    let checkCount = 0;
    const maxChecks = 100; // 20 seconds total (500ms * 40)

    this.cookieCheckInterval = setInterval(() => {
      checkCount++;
      console.log(`Checking for auth (attempt ${checkCount})`);

      // 1. First check if popup was closed by user
      if (this.googleAuthWindow?.closed) {
        console.log('Popup was already closed by user');
        clearInterval(this.cookieCheckInterval);
        return;
      }

      // 2. Check for auth cookie
      if (this.hasAuthCookie()) {
        console.log('Auth cookie found - closing popup');
        this.googleAuthWindow?.close(); // This DOES work if same-origin
        clearInterval(this.cookieCheckInterval);
        this.handleSuccessfulAuth();
        return;
      }

      // 3. Stop checking after max attempts
      if (checkCount >= maxChecks) {
        console.warn('Reached maximum auth checks');
        clearInterval(this.cookieCheckInterval);
        this.googleAuthWindow?.close();
      }
    }, 500);
  }

  private hasAuthCookie(): boolean {
    return document.cookie.split(';').some(item =>
      item.trim().startsWith('.AspNetCore.Cookies=')
    );
  }

  private handleSuccessfulAuth() {
    // Your post-auth logic here
    console.log('Authentication successful');
  }

  // private hasAuthCookie(): boolean {
  //   // Check if the ASP.NET Core auth cookie exists
  //   return document.cookie.split(';').some((item) => {
  //     return item.trim().startsWith('.AspNetCore.Cookies');
  //   });
  // }

  // private handleSuccessfulAuth() {
  //   // Clean up the interval
  //   clearInterval(this.cookieCheckInterval);

  //   // Close the popup if it's still open
  //   if (this.googleAuthWindow && !this.googleAuthWindow.closed) {
  //     this.googleAuthWindow.close();
  //   }

  //   // Handle any post-login logic
  //   console.log('User authenticated successfully');
  //   // You might want to redirect or refresh user data here
  // }










  private handleGoogleSignUp() {
    console.log("Google sign up invoked")
  }

  private handleGoogleLogin() {
    console.log("Google login invoked")
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

    if (this.cookieCheckInterval) {
      clearInterval(this.cookieCheckInterval);
    }
  }

  onClose() {
    this.close.emit();
  }
}
