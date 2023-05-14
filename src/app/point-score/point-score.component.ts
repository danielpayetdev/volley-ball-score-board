import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-point-score',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './point-score.component.html',
  styleUrls: ['./point-score.component.css']
})
export class PointScoreComponent {
  @Input({required: true}) score: number = 0;
}
