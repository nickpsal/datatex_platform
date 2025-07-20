import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideZonelessChangeDetection } from '@angular/core';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, {
	providers: [
		provideZonelessChangeDetection(),
		provideAnimations(),
	]
});