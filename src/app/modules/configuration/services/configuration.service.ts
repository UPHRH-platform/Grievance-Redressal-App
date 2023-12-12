import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  userTypes = [
    {
      userType: 'public',
      isActive: true,
      id: 1,
    },
    {
      userType: 'other',
      isActive: false,
      id: 2,
    },
    {
      userType: 'student',
      isActive: true,
      id: 3,
    },
  ];

  constructor() { }

  getUserTypes() {
    return of(this.userTypes);
  }
}
