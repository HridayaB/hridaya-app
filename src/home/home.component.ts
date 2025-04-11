import { Component } from "@angular/core";
import { homeConfig } from "./home.config";  

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})

export class HomeComponent {
    config = homeConfig;
    logoPath = './src/assets/images/group_project_logo.png';
}