import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services';
import { RoleContentService } from '../../services/role-content-service/role-content.service';

// content-mapping.ts
export const roleContentMapping: { [role: string]: string[] } = {
  'Admin': ['dashboard', 'users', 'configuration'],
  'Grievance Nodal': ['grievances'],
  'Nodal Officer': ['grievances'],
  'Secretary': ['dashboard', 'grievances'],
};

// role-content.guard.ts
@Injectable({ providedIn: 'root' })
export class RoleContentGuard implements CanActivate {
  constructor(private authService: AuthService, private roleContentService: RoleContentService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const allowedRoles: string[] = route.data['allowedRoles'];
    const userRoles: string[] = this.authService.getUserRoles(); // Replace this with your method to get user roles

    const hasAccess: boolean = allowedRoles.some((role) => userRoles.includes(role));

    if (hasAccess) {
      const content = this.getContentForRoles(userRoles);

      // Now you can use the content to display the appropriate content on the page
      console.log('Content for allowed roles:', content);
      this.roleContentService.setContentForRoles(content);
      return true;
    } else {
      // Redirect or show unauthorized message
      console.log('User does not have access to this route.');
      return false;
    }
  }

  private getContentForRoles(allowedRoles: string[]): string[] {
    // Get the content for each allowed role
    let contentForRoles: string[]= [];
    allowedRoles.forEach((role) => {
      contentForRoles.push(...roleContentMapping[role]);
    });
    return contentForRoles;
  }
}
