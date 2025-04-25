import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Color {
  id: number;
  name: string;
  hexValue: string;
}

@Injectable({
  providedIn: 'root'
})

export class ColorService {
  private apiUrl = 'api/colors'; 

  constructor(private http: HttpClient) { }

  getColors(): Observable<Color[]> {
    return this.http.get<Color[]>(this.apiUrl);
  }

  addColor(color: Omit<Color, 'id'>): Observable<Color> {
    return this.http.post<Color>(this.apiUrl, color);
  }

  updateColor(color: Color): Observable<Color> {
    return this.http.put<Color>(`${this.apiUrl}/${color.id}`, color);
  }

  deleteColor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}