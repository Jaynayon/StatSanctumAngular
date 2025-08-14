import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { SignInModalComponent } from './sign-in-modal/sign-in-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, SignInModalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'StatSanctumAngular';

  showSignInModal = false;

  openSignIn(event: Event) {
    event.preventDefault(); // prevent the <a> tag from navigating
    console.log('Sign in clicked');
    this.showSignInModal = true;
  }

  closeSignIn() {
    this.showSignInModal = false;
  }
}
