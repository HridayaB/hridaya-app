import { Component } from "@angular/core";
import { aboutConfig } from "./about.config";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-about',
    imports: [CommonModule],
    templateUrl: './about.component.html',
    styleUrl: './about.component.css'
})

export class AboutComponent {
    config = aboutConfig;
}