import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-color-coordinate-generation',
    templateUrl: './color-coordinate-generation.component.html',
    styleUrls: ['./color-coordinate-generation.component.css']
})
export class ColorCoordinateGenerationComponent {
    coordinateForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.coordinateForm = this.fb.group({
            rows: [
                null,
                [Validators.required, Validators.min(1), Validators.max(1000)]
            ],
            columns: [
                null,
                [Validators.required, Validators.min(1), Validators.max(702)]
            ],
            colors: [
                null,
                [Validators.required, Validators.min(1), Validators.max(10)]
            ]
        });
    }

    get rows() {
        return this.coordinateForm.get('rows');
    }   

    get columns() {
        return this.coordinateForm.get('columns');
    }

    get colors() {
        return this.coordinateForm.get('colors');
    }

    onSubmit() {
        //TODO: use the sizes for a table
    }
}
