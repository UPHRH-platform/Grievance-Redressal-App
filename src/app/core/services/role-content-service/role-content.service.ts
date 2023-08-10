import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleContentService {
  private contentForRoles: string[] = [];

  setContentForRoles(content: string[]): void {
    this.contentForRoles = content;
  }

  getContentForRoles(): string[] {
    return this.contentForRoles;
  }
}
