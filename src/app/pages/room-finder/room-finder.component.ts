import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { v4 } from 'uuid';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-room-finder',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './room-finder.component.html',
  styleUrl: './room-finder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomFinderComponent {

  private _router = inject(Router);
  roomUuid: string = '';

  joinRoom() {
    if (!this.roomUuid) return;

    this._router.navigate([`${this.roomUuid}`]);
  }

  createNewRoom() {
    const uuid = v4();
    this._router.navigate([`${uuid}`]);
  }

}
