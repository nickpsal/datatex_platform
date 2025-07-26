import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-topnav',
  imports: [CommonModule, RouterModule],
  templateUrl: './topnav.html',
  styleUrl: './topnav.scss'
})
export class Topnav {

}
