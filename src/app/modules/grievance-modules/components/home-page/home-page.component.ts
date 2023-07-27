import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  cardList:any[]=[
    {
      title:'Ticket Management',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ' ,
      type:'grievances'
    },
    {
      title:'Dashboard',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ' ,
      type:'dashboard'
    },

    {
      title:'User Management',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ',
      type:'users'
    },

  ]

  constructor(private router:Router){

  }
  ngOnInit(): void {
    
  }

  navigateto(item:any){
    console.log(item)
    switch (item.type) {

      case 'grievances':
      this.router.navigate(['grievance/manage-tickets'])
        break;

      case 'dashboard':
        break;
        case 'users':
          this.router.navigate(['user-manage'])
        break;

      default:

        return '';
    }
    return;
    
    // this.router.navigate(['/user-manage'])
    
  }

}
