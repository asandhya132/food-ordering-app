import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Food } from '../models/food.model';
import { environment } from './api.config';

@Injectable({ providedIn: 'root' })
export class FoodService {
  private readonly baseUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) {}

  getAll(category?: string | null): Observable<Food[]> {
    let params = new HttpParams();
    if (category && category.toLowerCase() !== 'all') {
      params = params.set('category', category);
    }
    return this.http.get<Food[]>(`${this.baseUrl}/foods`, { params });
  }

  getById(id: number): Observable<Food> {
    return this.http.get<Food>(`${this.baseUrl}/foods/${id}`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/foods/categories`);
  }
}

