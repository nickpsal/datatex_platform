import { Component, OnInit } from '@angular/core';
import { User } from '../../core/interfaces/user';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss'
})
export class UserProfileComponent implements OnInit {
  userProfileForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
      this.userProfileForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        avatar_url: ['', [Validators.required]],
        isActive: [true]
      });
  }
  
  ngOnInit(): void {
    this.userProfileForm.patchValue(this.user);
  }

  user: User = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'securepassword',
    avatar_url: 'https://api.datatex.gr/public/assets/images/nickpsal.jpg',
    isActive: true
  }
}
