import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RoleContentService } from 'src/app/core/services/role-content-service/role-content.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  allowedContent: string[];
  cardList: any[] = [
    {
      title: 'Dashboard',
      description: '',
        // 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ',
      type: 'dashboard',
    },
    {
      title: 'Ticket Management',
      description: '',
        // 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ',
      type: 'grievances',
    },

    {
      title: 'User Management',
      description: '',
        // 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ',
      type: 'users',
    },
  ];

  constructor(private router:Router, private roleContentService: RoleContentService,){

  }

  ngOnInit(): void {
      // Get the content from the route data
    this.allowedContent = this.roleContentService.getContentForRoles();
    this.updateCardList();
  }

  updateCardList(): void {
    this.cardList = this.cardList.filter((card) => this.allowedContent.includes(card.type));
  }

  navigateto(item: any) {
    //console.log(item);
    switch (item.type) {
      case 'grievances':
        this.router.navigate(['grievance/manage-tickets']);
        break;

      case 'dashboard':
        this.router.navigate(['dashboard']);
        break;
      case 'users':
        this.router.navigate(['user-manage']);
        break;

      default:
        return '';
    }
    return;

    // this.router.navigate(['/user-manage'])
  }
}
