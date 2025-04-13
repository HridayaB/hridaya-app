import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { colorConfig } from './color_coordinate_generation.config';

@Component({
    selector: 'app-color-coordinate-generation',
    imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
    templateUrl: './color_coordinate_generation.component.html',
    styleUrl: './color_coordinate_generation.component.css'
})
export class ColorCoordinateGenerationComponent {
    config = colorConfig;
    coordinateForm: FormGroup;
    showTables = false;
    colorPalette = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'gray', 'brown', 'black', 'teal'];
    colorOptions = this.colorPalette.map((color, index) => ({
        color: color,
        selected: index === 0
    }));
    columnHeaders: string[] = [];
    rowIndices: number[] = [];
    selectedColorIndex = 0;

    constructor(private fb: FormBuilder) {
        this.coordinateForm = this.fb.group({
            rows: [
                5,
                [Validators.required, Validators.min(1), Validators.max(1000)]
            ],
            columns: [
                5,
                [Validators.required, Validators.min(1), Validators.max(702)]
            ],
            colors: [
                3,
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
        if (this.coordinateForm.invalid) {
            return;
        }

        this.showTables = true;
        this.generateColorSelectionTable();
        this.generatePaintingTable();
    }

    private generateColorSelectionTable() {
        const numColors = this.coordinateForm.value.colors;
        this.colorOptions = [];

        for (let i = 0; i < numColors; i++) {
            this.colorOptions.push({
                selected: i === 0,
                color: this.colorPalette[i % this.colorPalette.length]
            });
        }
    }

    private generatePaintingTable() {
        const numRows = this.coordinateForm.value.rows;
        const numColumns = this.coordinateForm.value.columns;

        this.columnHeaders = [''];
        for (let i = 0; i < numColumns; i++) {
            this.columnHeaders.push(this.getExcelColumnName(1));
        }

        this.rowIndices = Array.from({ length: numRows }, (_, i) => i + 1);
    }

    private getExcelColumnName(num: number): string {
        let columnName = '';
        while (num > 0) {
            const remainder = (num - 1) % 26;
            columnName = String.fromCharCode(65 + remainder) + columnName;
            num = Math.floor((num - remainder) / 26);
        }
        return columnName;
    }

    selectColor(index: number) {
        this.selectedColorIndex = index;
        this.colorOptions.forEach((opt, i) => {
            opt.selected = i === index;
        });
    }

    printPage() {
        window.print();
    }

    availableColors(currentIndex: number): string[] {
        return this.colorPalette.filter((color) => {
        const usedColors = this.colorOptions
            .filter((_, i) => i !== currentIndex)
            .map((opt) => opt.color);
        return !usedColors.includes(color) || this.colorOptions[currentIndex].color === color;
        });
    }
    
    isColorUsed(color: string): boolean {
        return this.colorOptions.some((opt) => opt.color === color);
    }
    
    onColorChange(newColor: string, index: number) {
        this.colorOptions[index].color = newColor;
    }
}
