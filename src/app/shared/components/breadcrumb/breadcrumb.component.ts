import { Component, Input } from '@angular/core';
import { BreadcrumbItem } from '../../interfaces';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  @Input() breadcrumbItems: BreadcrumbItem[];
}
