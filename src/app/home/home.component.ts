import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { SignInModalComponent } from '../sign-in-modal/sign-in-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, SignInModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
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
