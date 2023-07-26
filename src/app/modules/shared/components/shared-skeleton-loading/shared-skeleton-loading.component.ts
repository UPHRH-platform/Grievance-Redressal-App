import { Component, Input, OnInit  } from '@angular/core';

@Component({
  selector: 'app-shared-skeleton-loading',
  templateUrl: './shared-skeleton-loading.component.html',
  styleUrls: ['./shared-skeleton-loading.component.scss']
})
export class SharedSkeletonLoadingComponent  implements OnInit  {
  @Input() isLoading: boolean;
  ngOnInit(): void {
 // this.isLoading = this.isLoading;
  }
}
