import { Component } from "@angular/core";
import { aboutConfig } from "./about.config";
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-about',
    imports: [CommonModule, RouterModule],
    templateUrl: './about.component.html',
    styleUrl: './about.component.css'
})

export class AboutComponent {
    config = aboutConfig;
}