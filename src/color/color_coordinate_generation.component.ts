import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { colorConfig } from './color_coordinate_generation.config';
import { throws } from 'assert';
import { HostBinding } from '@angular/core';
import { ColorService } from "../manage/color.service";

interface CellCoordinate {
    row: number;
    column: string;
}

@Component({
    selector: 'app-color-coordinate-generation',
    imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
    templateUrl: './color_coordinate_generation.component.html',
    styleUrl: './color_coordinate_generation.component.css',
    standalone: true
})
export class ColorCoordinateGenerationComponent {
    config = colorConfig;
    coordinateForm: FormGroup;
    showTables = false;
    colorPalette = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'gray', 'brown', 'black', 'teal'];
    colorOptions = [
        { name: 'red', hex: '#FF0000', selected: true, coordinates: [] as string[] },
        { name: 'orange', hex: '#FFA500', selected: false, coordinates: [] as string[] },
        { name: 'yellow', hex: '#FFFF00', selected: false, coordinates: [] as string[] },
        { name: 'green', hex: '#008000', selected: false, coordinates: [] as string[] },
        { name: 'blue', hex: '#0000FF', selected: false, coordinates: [] as string[] },
        { name: 'purple', hex: '#800080', selected: false, coordinates: [] as string[] },
        { name: 'gray', hex: '#808080', selected: false, coordinates: [] as string[] },
        { name: 'brown', hex: '#A52A2A', selected: false, coordinates: [] as string[] },
        { name: 'black', hex: '#000000', selected: false, coordinates: [] as string[] },
        { name: 'teal', hex: '#008080', selected: false, coordinates: [] as string[] }
    ];
    
    maxAvailableColors: number = 10;
    columnHeaders: string[] = [];
    rowIndices: number[] = [];
    selectedColorIndex = 0;
    paintingTableData: any[][] = [];
    clickedCell: CellCoordinate | null = null;

    cellColors: { [key: string]: number} ={}

    constructor(private fb: FormBuilder, private colorService: ColorService) {
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
        this.loadDBColors();
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
            const colorName = this.colorPalette[i % this.colorPalette.length];
            const hexCode = this.colorOptions.find(opt => opt.name === colorName)?.hex || '#000000'; // Default to black if not found
            this.colorOptions.push({
                name: colorName,
                hex: hexCode,
                selected: i === 0,
                coordinates: [] as string[]
            });
        }
    }

    private generatePaintingTable() {
        const numRows = this.coordinateForm.value.rows;
        const numColumns = this.coordinateForm.value.columns;

        this.columnHeaders = [];
        for (let i = 1; i <= numColumns; i++) {
            this.columnHeaders.push(this.getExcelColumnName(i));
        }

        this.paintingTableData = [];
        const headerRow = [''].concat(this.columnHeaders);
        this.paintingTableData.push(headerRow);
        
        
        for (let row = 1; row <= numRows; row++) {
            const rowData = [row.toString()]; 
            for (let col = 1; col <= numColumns; col++) {
                rowData.push('');
            }
            this.paintingTableData.push(rowData);
        }

        this.cellColors = {};
        this.colorOptions.forEach(opt => opt.coordinates=[]);
    }
    
    onCellClick(row: number, col: number) {
        if (row === 0 || col === 0) return;

        const column = this.paintingTableData[0][col];
        const key = `${column}${row}`;
        const selectedColor = this.colorOptions[this.selectedColorIndex].name;

        this.cellColors[key] = this.selectedColorIndex;

        const colorEntry =  this.colorOptions[this.selectedColorIndex];
        if (!colorEntry.coordinates.includes(key)){
            colorEntry.coordinates.push(key);
            colorEntry.coordinates.sort((a, b) => a.localeCompare(b));
        }
    
        
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
            .map((opt) => opt.name);
        return !usedColors.includes(color) || this.colorOptions[currentIndex].name === color;
        });
    }
    
    isColorUsed(color: string): boolean {
        return this.colorOptions.some((opt) => opt.name === color);
    }
    
    onColorChange(newColor: string, index: number) {
        this.colorOptions[index].name = newColor;
    }

    @HostBinding('class.tables-visible') get tablesVisible() {
        return this.showTables;
    }

    getCellColor(row: number, col: number): string {
        if (row === 0 || col === 0) {
            return 'black'; 
        }
    
        const column = this.paintingTableData[0][col];
        const key = `${column}${row}`;
        const colorIndex = this.cellColors[key];
    
        return colorIndex !== undefined
            ? this.colorOptions[colorIndex].name
            : 'white';
    }

    loadDBColors(): void {
        this.colorService.getColors().subscribe(colors => {
            this.colorPalette = colors.map(c => c.name);
            this.colorOptions = colors.map((c, index) => ({
                name: c.name,
                hex: c.hexValue,
                selected: index === 0,
                coordinates : []
            }));
            const maxColors = this.colorOptions.length;
            this.maxAvailableColors = this.colorOptions.length;
            this.coordinateForm.get('colors')?.setValidators([
                Validators.required, 
                Validators.min(1),
                Validators.max(maxColors)
            ]);
            this.coordinateForm.get('colors')?.updateValueAndValidity();
        });
    }

}
