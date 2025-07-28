import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreService } from './core/services/core/core';
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
  protected readonly title = signal('Datatex Platform');
  constructor(private auth: AuthService, private core: CoreService) { }

  ngOnInit(): void {
    if (this.core.hasJwtCookie()) {
      this.auth.checkAuth().subscribe();
    }
  }
}
