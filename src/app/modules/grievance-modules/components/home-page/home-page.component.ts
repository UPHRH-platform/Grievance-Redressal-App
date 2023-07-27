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
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ' 
    },
    {
      title:'Dashboard',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ' 
    },

    {
      title:'User Management',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ' 
    },

  ]

  constructor(private router:Router){

  }
  ngOnInit(): void {
    
  }

  navigateto(item:any){
    console.log(item)
    this.router.navigate(['/user-manage'])
    
  }

}
