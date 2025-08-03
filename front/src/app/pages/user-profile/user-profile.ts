import { Component, OnInit } from '@angular/core';
import { User } from '../../core/interfaces/user';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api/api';

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

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
      this.userProfileForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirm_password: ['', [Validators.required, Validators.minLength(6)]],
        avatar_url: ['', [Validators.required]],
      });
  }
  
  ngOnInit(): void {
    this.apiService.getCurrentUser().subscribe(user => {
      this.userProfileForm.patchValue(user);
      console
    });
  }
}
