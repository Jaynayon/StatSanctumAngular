import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://localhost:7294';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAuthOnInit(); // Verify auth status on app load
  }

  // Call this on app startup
  // Verify authentication status on initialization
  checkAuthOnInit(): void {
    this.http.get<{ message: string }>(
      `${this.API_URL}/auth/secure`,
      { withCredentials: true } // Crucial for sending cookies
    ).pipe(
      tap(response => {
        this.isAuthenticatedSubject.next(response.message == "User is authenticated");
        if (response.message != "User is authenticated") {
          this.router.navigate(['']);
        }
        this.router.navigate(['/dashboard']); // redirect to dashboard if authenticated
      }),
      catchError(() => {
        this.isAuthenticatedSubject.next(false);
        return of(false); // Return observable to continue stream
      })
    ).subscribe();
  }

  // Login method
  // login(email: string, password: string): Observable<any> {
  //   return this.http.post(`${this.API_URL}/auth/login`,
  //     { username: email, password },
  //     { withCredentials: true } // This is crucial for cookies
  //   );
  // }

  login(credentials: { username: string; password: string }): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/auth/login`, credentials, { withCredentials: true })
      .pipe(
        tap(() => { // tap() operator only runs when the request succeeds
          this.isAuthenticatedSubject.next(true);
          this.router.navigate(['/dashboard']);
        })
      );
  }

  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
}
