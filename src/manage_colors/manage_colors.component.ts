import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ReactiveFormsModule } from '@angular/forms';
import { ColorService } from "./color.service";
import { CommonModule } from "@angular/common";

interface Color {
    id: number;
    name: string;
    hexValue: string;
}

@Component({
    selector: 'app-color-management',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './manage_colors.component.html',
    styleUrl: './manage_colors.component.css'
})

export class ColorManagementComponent implements OnInit {
    colors: Color[] = [];
    addForm: FormGroup;
    editForm: FormGroup;
    deleteForm: FormGroup;

    activeTab: 'add' | 'edit' | 'delete' = 'add';
    isLoading = true;
    errorMessage = '';
    successMessage = '';

    constructor (
        private fb: FormBuilder,
        private colorService: ColorService
    ) {
        this.addForm = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(50)]],
            hexValue: ['', [Validators.required, Validators.pattern(/^#[0-9A-F]{6}$/i)]]
        });
        this.editForm = this.fb.group({
            selectedColor: [null, Validators.required],
            name: ['', [Validators.required, Validators.maxLength(50)]],
            hexValue: ['', [Validators.required, Validators.pattern(/^#[0-9A-F]{6}$/i)]]
        });
        this.deleteForm = this.fb.group({
            selectedColor: [null, Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadColors();
    }

    loadColors(): void {
        this.isLoading = true;
        this.colorService.getColors().subscribe({
            next: (colors) => {
              this.colors = colors;
              this.isLoading = false;
            },
            error: (err) => {
              this.errorMessage = 'Failed to load colors';
              this.isLoading = false;
            }
        });
    }

    onAddSubmit(): void {
        if (this.addForm.invalid) return;
        
        const newColor = {
          name: this.addForm.value.name,
          hexValue: this.addForm.value.hexValue.toUpperCase()
        };
    
        this.colorService.addColor(newColor).subscribe({
          next: () => {
            this.successMessage = 'Color added successfully!';
            this.addForm.reset();
            this.loadColors();
          },
          error: (err) => {
            this.errorMessage = err.error?.message || 'Failed to add color';
          }
        });
    }

    onEditSubmit(): void {
        if (this.editForm.invalid) return;
        
        const updatedColor = {
          id: this.editForm.value.selectedColor,
          name: this.editForm.value.name,
          hexValue: this.editForm.value.hexValue.toUpperCase()
        };
    
        this.colorService.updateColor(updatedColor).subscribe({
          next: () => {
            this.successMessage = 'Color updated successfully!';
            this.editForm.reset();
            this.loadColors();
          },
          error: (err) => {
            this.errorMessage = err.error?.message || 'Failed to update color';
          }
        });
    }

    onDeleteSubmit(): void {
        if (this.deleteForm.invalid || this.colors.length <= 2) return;
        
        this.colorService.deleteColor(this.deleteForm.value.selectedColor).subscribe({
          next: () => {
            this.successMessage = 'Color deleted successfully!';
            this.deleteForm.reset();
            this.loadColors();
          },
          error: (err) => {
            this.errorMessage = err.error?.message || 'Failed to delete color';
          }
        });
    }

    onColorSelectForEdit(colorId: number): void {
        const color = this.colors.find(c => c.id === colorId);
        if (color) {
          this.editForm.patchValue({
            name: color.name,
            hexValue: color.hexValue
          });
        }
    }

    clearMessages(): void {
        this.errorMessage = '';
        this.successMessage = '';
    }
    
    switchTab(tab: 'add' | 'edit' | 'delete'): void {
        this.activeTab = tab;
        this.clearMessages();
    }
}