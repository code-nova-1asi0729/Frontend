import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Welcome view of the application.
 */
@Component({
  selector: 'app-home',
  imports: [RouterLink, MatButtonModule, TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
