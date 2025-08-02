import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Portofolio } from '../../core/interfaces/portofolio';
import { ApiService } from '../../core/services/api/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-portofolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portofolio.html',
  styleUrl: './portofolio.scss'
})
export class PortofolioComponent implements OnInit {
  
  portofolioList$: Observable<Portofolio[]> | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.portofolioList$ = this.apiService.getPortoflio();
  } 
}
