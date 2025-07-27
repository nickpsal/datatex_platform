import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './core/services/auth/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('front');
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    if (this.auth.hasJwtCookie()) {
      this.auth.checkAuth().subscribe();
    }
  }
}
