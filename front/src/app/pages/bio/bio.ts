import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-bio',
  standalone: true,
  imports: [],
  templateUrl: './bio.html',
  styleUrl: './bio.scss'
})
export class BioComponent {
  fullname = signal('Νίκος Ψαλτάκης - Nikolaos Psaltakis');
  title = signal('Junior Full Stack Developer');
  email = signal('psaltakisnikolaos@gmail.com');

}
