import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7294/auth';

  constructor(private http: HttpClient) { }

  // Login method
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`,
      { username: email, password },
      { withCredentials: true } // This is crucial for cookies
    );
  }

  // Signup method (optional)
  signup(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password });
  }
}
