import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-sign-in-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-in-modal.component.html',
  styleUrl: './sign-in-modal.component.css'
})
export class SignInModalComponent {
  @Output() close = new EventEmitter<void>();

  emailControl = new FormControl('');
  passwordControl = new FormControl('');

  onSubmit() {
    console.log(this.emailControl.value);
    console.log(this.passwordControl.value);
  }

  onClose() {
    this.close.emit();
  }
}
