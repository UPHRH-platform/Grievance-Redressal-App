import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';
import { TableColumn, GrievancesTableData } from '../../../../interfaces/interfaces';
import { Tabs } from 'src/app/shared/config';
import { AuthService } from 'src/app/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { BreadcrumbItem, ConfigService } from 'src/app/shared';
import { GrievanceServiceService } from '../../services/grievance-service.service';
import { ToastrServiceService } from 'src/app/shared/services/toastr/toastr.service';
import { PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription, mergeMap, of } from 'rxjs';


@Component({
  selector: 'app-grievance-management',
  templateUrl: './grievance-management.component.html',
  styleUrls: ['./grievance-management.component.scss']
})
export class GrievanceManagementComponent  {
  grievances: GrievancesTableData[] = [];
  grievancesTableColumns: TableColumn[] = [];
  isDataLoading : boolean = false;
  userRole: string;
  tabs: any[] = [];
  selectedTab:any=null;
  length: number;
  startDate = new Date("2020/03/03").getTime();
  endDate = new Date().getTime();
  grievanceType:any;
  councilId: string | undefined;
  departmentId: string | undefined;
  userTypeId: string | undefined;
  accumulatedSearchTerm:string = '';
  private timeoutId: any;
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Grievance Management', url: '/home' },
    { label: 'Ticket Management', url: 'grievance/manage-tickets' },
  ];
  grievancesTypes:any[] = [];
  getGrievancesRequest: any;
  selectedTabName: any;
  searchForm:FormGroup;
  resetFields:boolean =false;
  councilsList: any[] = [];
  departmentsList: any[] = [];
  userTypesList: any[] = [];
  showUserType: Boolean = true;
  noDepartments = false;
  apiSubscription: Subscription | undefined;
  showRating = true;
  rating: number | null = null;
  constructor( 
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private configService: ConfigService,
    private grievanceService: GrievanceServiceService,
    private toastrService:ToastrServiceService,
    private sharedService: SharedService ){
      this.searchForm =  new FormGroup({
        searchData:  new FormControl('')
      })
    }

  pageIndex: number = 0;
  pageSize: number = 10;
  searchParams:string = '';
  sortHeader: string = 'createdDateTS';
  direction: string = 'desc';
  userId: string;
  activeTabIndex: number;
  grievanceTypeName: any;

  ngOnInit(): void {
    this.grievancesTypes = this.configService.dropDownConfig.GRIEVANCE_TYPES;
    this.userRole = this.authService.getUserRoles()[0];
    this.showUserType = this.userRole === this.configService.rolesConfig.ROLES.NODALOFFICER ? true : false;
    this.userId = this.authService.getUserData().userRepresentation.id;
    this.route.queryParams.subscribe((param) => {
      if(!!param){
        this.selectedTabName = param['tabName'];
        if(this.tabs.length) {
          if(!!this.selectedTabName) {
            this.selectedTab = this.tabs.find(tab => tab.name === this.selectedTabName);
            //console.log("inside onInit",this.selectedTab);
            this.activeTabIndex= this.tabs.findIndex(tab => tab.name === this.selectedTabName);
          }
        } 
      }
    });
    this.initializeTabs();
    if (this.showUserType) {
      this.getUserTypes();
    } else {
      this.getCouncils();
    }
  }

  getCouncils() {
    this.sharedService.getCouncils()
      .pipe((mergeMap((response) => {
        const counciles = response.responseData.filter((council: any) => council.ticketDepartmentDtoList);
        return of(counciles)
      })))
      .subscribe({
        next: (response) => {
          if (response) {
            this.councilsList = response;
          }
        },
        error: (error) => {
          this.toastrService.showToastr(error.error.error, 'Error', 'error');
        }
      });
  }

  getDeparmentsList(ticketCouncilId: any) {
    this.departmentsList = [];
    const conucil: any = this.councilsList.find((council: any) => council.ticketCouncilId === ticketCouncilId);
    if (conucil && conucil.ticketDepartmentDtoList && conucil.ticketDepartmentDtoList.length > 0) {
      this.noDepartments = false;
      this.departmentsList = conucil.ticketDepartmentDtoList
    } else {
      this.noDepartments = true;
    }
  }

  getUserTypes() {
    this.sharedService.getUserTypes()
    .subscribe({
      next: (response) => {
        this.userTypesList = response.responseData;
      },
      error: (error) => {
        this.toastrService.showToastr(error.error.error, 'Error', 'error');
      }
    });
  }

  navigateToHome(){
    this.router.navigate(['/home'])
  }

  initializeTabs(): void {
    const Roles = this.configService.rolesConfig.ROLES;
    switch(this.userRole ){
      case Roles.NODALOFFICER:
        this.tabs = Tabs['Nodal Officer'];
        break;
      case Roles.SUPERADMIN:
        this.tabs = Tabs['Secretary'];
        break;
      case Roles.GRIEVANCEADMIN:
        this.tabs = Tabs['Grievance Nodal'];
        break;
    }
    //To get count on tab header
    this.tabs.forEach((tab: any) => {
      const getCount = true;
      tab['count'] = '-';
      this.getTicketsRequestObject(getCount, tab.name);
    })
    // end
    if(!!this.selectedTabName) {
      this.selectedTab = this.tabs.find(tab => tab.name === this.selectedTabName);
      //console.log("inside initializeTabs", this.selectedTab);
      this.activeTabIndex= this.tabs.findIndex(tab => tab.name === this.selectedTabName);
    } else {
      //console.log("Entered here");
      this.selectedTab =this.tabs[0];
      this.activeTabIndex=0;
      this.selectedTabName = this.tabs[0].name;
    }
    //Initialize column as per user Role
    //console.log("line 134", this.grievanceType);
    this.initializeColumns();
    //Fetch grievances as per user  role
    this.getTicketsRequestObject();
    //console.log("line 138", this.grievanceType);
  
  }

  initializeColumns(): void {
    switch (this.selectedTab.name) {
      case 'Junk':
        this.grievancesTableColumns = [
          {
            columnDef: 'ticketId',
            header: 'ID',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => `${element['ticketId']}`
          },
          {
            columnDef: 'firstName',
            header: 'Grievance Raiser',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => `${element['firstName'] + ' ' + element['lastName']}`
          },
          {
            columnDef: 'ticketUserTypeName',
            header: 'User Type',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => `${element['ticketUserTypeName']}`
          },
          {
            columnDef: 'ticketCouncilName',
            header: 'Council',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => `${element['ticketCouncilName']}` ? `${element['ticketCouncilName']}`: '-'
          },
          {
            columnDef: 'ticketDepartmentName',
            header: 'Department',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => `${element['ticketDepartmentName']}` ? `${element['ticketDepartmentName']}`: '-'
          },
          {
            columnDef: 'createdDateTS',
            header: 'Creation Time',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => `${element['createdDate']}`
          },
          {
            columnDef: 'escalatedDateTS',
            header: 'Escalation Time',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => 
              `${element['escalatedDate']}` !== "null" ? `${element['escalatedDate']}` : '-'
          },
          {
            columnDef: 'updatedDate',
            header: 'Marked Junk',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => 
              `${element['updatedDate']}` !== "null" ? `${element['updatedDate']}` : '-'
          },
          {
            columnDef: 'junkedByName',
            header: 'Junked By',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => 
              `${element['junkedByName']}` !== "null" ? `${element['junkedByName']}` : '-'
          },
          {
            columnDef: 'rating',
            header: 'Rating',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => `${element['rating']}`
          },
          {
            columnDef: 'isLink',
            header: '',
            isSortable: false,
            isLink: true,
            isAction: true,
            cell: (element: Record<string, any>) => `View Ticket`
          },
        ];
        break;
      case 'Nudged':
        this.grievancesTableColumns = [
          {
            columnDef: 'ticketId',
            header: 'ID',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => `${element['ticketId']}`
          },
          {
            columnDef: 'firstName',
            header: 'Grievance Raiser',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => `${element['firstName'] + ' ' + element['lastName']}`
          },
          {
            columnDef: 'ticketUserTypeName',
            header: 'User Type',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => `${element['ticketUserTypeName']}`
          },
          {
            columnDef: 'ticketCouncilName',
            header: 'Council',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => `${element['ticketCouncilName']}` ? `${element['ticketCouncilName']}`: '-'
          },
          {
            columnDef: 'ticketDepartmentName',
            header: 'Department',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => `${element['ticketDepartmentName']}` ? `${element['ticketDepartmentName']}`: '-'
          },
          {
            columnDef: 'createdDateTS',
            header: 'Creation Time',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => `${element['createdDate']}`
          },
          {
            columnDef: 'escalatedDateTS',
            header: 'Escalation Time',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => 
              `${element['escalatedDate']}` !== "null" ? `${element['escalatedDate']}` : '-'
          },
          {
            columnDef: 'rating',
            header: 'Rating',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => `${element['rating']}`
          },
          {
            columnDef: 'reminderCounter',
            header: 'Reminder',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => `${element['reminderCounter']}`
          },          
          {
            columnDef: 'isLink',
            header: '',
            isSortable: false,
            isLink: true,
            isAction: true,
            cell: (element: Record<string, any>) => `View Ticket`
          },
        ];
        break;
      default:
        this.grievancesTableColumns = [
          {
            columnDef: 'ticketId',
            header: 'ID',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => `${element['ticketId']}`
          },
          {
            columnDef: 'firstName',
            header: 'Grievance Raiser',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => `${element['firstName'] + ' ' + element['lastName']}`
          },
          {
            columnDef: 'ticketUserTypeName',
            header: 'User Type',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => `${element['ticketUserTypeName']}`
          },
          {
            columnDef: 'ticketCouncilName',
            header: 'Council',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => `${element['ticketCouncilName']}` ? `${element['ticketCouncilName']}`: '-'
          },
          {
            columnDef: 'ticketDepartmentName',
            header: 'Department',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => `${element['ticketDepartmentName']}` ? `${element['ticketDepartmentName']}`: '-'
          },
          {
            columnDef: 'createdDateTS',
            header: 'Creation Time',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => `${element['createdDate']}`
          },
          {
            columnDef: 'escalatedDateTS',
            header: 'Escalation Time',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => 
              `${element['escalatedDate']}` !== "null" ? `${element['escalatedDate']}` : '-'
          },
          {
            columnDef: 'rating',
            header: 'Rating',
            isSortable: true,
            isLink: false,
            cell: (element: Record<string, any>) => `${element['rating']}`
          },
          
          {
            columnDef: 'isLink',
            header: '',
            isSortable: false,
            isLink: true,
            isAction: true,
            cell: (element: Record<string, any>) => `View Ticket`
          },
        ];
        break;
    }
  }

  onTabChange(event: MatTabChangeEvent): void {
    this.grievancesTableColumns = []
    setTimeout(() => {
      this.initializeColumns()
    }, 100);
    const selectedIndex = event.index;
    this.selectedTab = this.tabs[selectedIndex];
    this.router.navigate(['/grievance/manage-tickets/'],{ queryParams: {tabName: this.selectedTab.name}});
    this.searchParams = "";
    this.resetFields = true;
    this.sortHeader =  'createdDateTS';
    this.direction = 'desc';
    this.grievanceService.resetFilterValue.next(this.resetFields);
    this.resetFilterValueData('');  
    // Here  we  have userrole and tab index with these 2 we know we need to fetch data for which tab of which user role so we pass relevant payload in get grievance service

    // this.getgrievances();
  }

  applyFilter(searchterms:any){
   clearTimeout(this.timeoutId) 
    this.searchParams  = searchterms
     this.timeoutId= setTimeout(()=>{
      this.getTicketsRequestObject()
    },1000
    ) 
  }

  resetFilterValueData(event:any){
    this.startDate = new Date("2020/03/03").getTime();
    this.endDate = new Date().getTime();
    this.grievanceType = null;
    this.councilId = undefined;
    this.departmentId = undefined;
    this.userTypeId = undefined;
    this.departmentsList = [];
    this.userTypesList = [];
    this.rating = null;
    this.searchForm.reset();
    if (event !== undefined) {
      this.getTicketsRequestObject();
    }
  }

  onClickApplyFilter(event:any){
    // this.grievanceType = event.grievanceType
    this.councilId = event.council;
    this.departmentId = event.department;
    this.userTypeId = event.userType
    this.rating = event.rating;
    if(event.startDate && event.endDate){
      this.startDate =  new Date(event.startDate).getTime();
      this.endDate = new Date(event.endDate).getTime() + ((23*60*60 + 59*60+59) * 1000);
    }
    this.getTicketsRequestObject();
  }

  onClickItem(e: any) {
    e.tabName= this.selectedTab.name
    let id = parseInt(e?.row.ticketId)
    //console.log("Line 251", this.grievanceType);
    this.router.navigate(['/grievance/manage-tickets/'+ id],{ queryParams: {tabName:this.selectedTab.name}});
  }

  getTicketsRequestObject(getCount = false, tabName: string = '') {
    let userData: any;
    userData = localStorage.getItem('userDetails');
    if(userData !== undefined) {
      const userDetails = JSON.parse(userData);
      this.grievanceTypeName = userDetails.attributes?.departmentName;
      this.grievanceType = this.grievanceTypeName ? userDetails.id : null;
    }
    // if(this.grievanceTypeName !== undefined && this.grievanceTypeName !== null) {
    // this.grievancesTypes.map((obj, index) => {
    //   if(this.grievanceTypeName.toLowerCase() === obj.name.toLowerCase()) {
    //     this.grievanceType = obj.id;
    //   }
    // })
  // }
    this.getGrievancesRequest = {
      searchKeyword: this.searchParams,
       filter: {
       },
       date:{to: this.endDate, from:this.startDate},
      "page": this.pageIndex,
      "size": getCount ? 0 : this.pageSize,
      "sort":{
           [this.sortHeader]: this.direction
      },
    }
    const selectedTabName = tabName === '' ? this.selectedTab.name : tabName
    if(selectedTabName === 'Junk') {
      this.getGrievancesRequest['sort']['updatedDateTS'] = this.direction
    }
    const Roles = this.configService.rolesConfig.ROLES;
    switch(selectedTabName) {
      case 'Pending': 
        this.getGrievancesRequest = {
          ...this.getGrievancesRequest,
          filter:{
            status:['OPEN'],
            cc: (this.userRole == 'Secretary' || this.userRole === 'Grievance Nodal')? 0 : this.grievanceType ? this.grievanceType: null
          },
          isJunk: false
        }
        break;
      case 'Resolved': 
      this.getGrievancesRequest = {
        ...this.getGrievancesRequest,
        filter:{
          status:['CLOSED'],
          cc: (this.userRole == 'Secretary' || this.userRole === 'Grievance Nodal')? 0: this.grievanceType ? this.grievanceType: null,
        },
        isJunk: false
      }
      break;
      // this is failing
      // case 'Priority': 
      // this.getGrievancesRequest = {
      //   ...this.getGrievancesRequest,
      //   filter:{
      //     status:['OPEN'],
      //     cc: this.grievanceType ? this.grievanceType: null,
      //   },
      //   priority: "HIGH",
      //   isJunk: false
      // }
      break;
      case 'Escalated to me': 
      this.getGrievancesRequest = {
        ...this.getGrievancesRequest,
        filter:{
          status:['OPEN'],
          cc: this.grievanceType ? this.grievanceType: null,
        },
        isEscalated: true,
        priority: "MEDIUM",
        isJunk: false
      }
      break;
      case 'Not Assigned':
        this.getGrievancesRequest = {
          ...this.getGrievancesRequest,
          filter:{
            status:['OPEN'],
            cc: (this.userRole == 'Secretary' || this.userRole === 'Grievance Nodal')? -1 : this.grievanceType ? this.grievanceType: null,
          },
          isJunk: false
        }
      break;
      case 'Junk': 
      this.getGrievancesRequest = {
        ...this.getGrievancesRequest,
        filter:{
          status:['INVALID'],
          // status:['CLOSED'],
          cc: (this.userRole === 'Grievance Nodal')? null : this.grievanceType ? this.grievanceType: null,
        },
        isJunk: true
      }
      break;
      case 'Nudged': 
      // this.getGrievancesRequest = {
      //   ...this.getGrievancesRequest,
      //   filter:{
      //     status:['OPEN']
      //   },
      //   priority: "HIGH",
      //   isJunk: false
      // }
      this.getGrievancesRequest = {
        ...this.getGrievancesRequest,
        filter:{
          status:['OPEN'],
          cc: this.grievanceType && Roles.NODALOFFICER === this.userRole ? this.grievanceType: null,
        },
        priority: "HIGH",
        isJunk: false
      }
      break;
      case 'Juncked By': 
      this.getGrievancesRequest = {
        ...this.getGrievancesRequest,
        filter:{
          status:['INVALID'],
          // status:['CLOSED'],
          cc: (this.userRole === 'Grievance Nodal')? null : this.grievanceType ? this.grievanceType: null,
        },
        isJunk: true
      }
      break;
      default: 
      this.getGrievancesRequest
      break;
    }

    this.getGrievancesRequest.filter['ticketCouncilId'] = this.councilId ? this.councilId : undefined;
    this.getGrievancesRequest.filter['ticketDepartmentId'] = this.departmentId ? this.departmentId : undefined;
    this.getGrievancesRequest.filter['ticketUserTypeId'] = this.userTypeId ? this.userTypeId : undefined;
    this.getGrievancesRequest['rating'] = this.rating;
    this.getAllTickets(getCount, tabName);
  }

  /** integration */
  getAllTickets(getCount = false, tabName = '') {
    this.isDataLoading = true;
    this.length = 0;
    if (this.apiSubscription && !getCount) {
      this.apiSubscription.unsubscribe();
      this.apiSubscription.remove;
    }
    this.apiSubscription = this.grievanceService.getAllTickets(this.getGrievancesRequest)
    .pipe(mergeMap((res: any) => {
      res.responseData.results.forEach((ticket: any) => {
        if (ticket.rating === 0) {
          ticket.rating = 'NA';
        }
      })
      return of(res)
    }))
    .subscribe({
      next: (res) => {
        if (getCount) {
          this.tabs.filter(tab => {
            if (tab.name === tabName) {
              tab['count'] = res.responseData.count;
            }
          });
        } else {
          this.isDataLoading = false;
          this.length = res.responseData.count;
          this.grievances = res.responseData.results;
          this.tabs.filter(tab => {
            if (tab.name === this.selectedTab.name) {
              tab['count'] = res.responseData.count;
            }
          });
          // if(this.grievances.length > 0) {
          //   this.grievances.map((obj: any) => {
          //     this.grievancesTypes.map((grievanceType, index) => {
          //       if(obj.assignedToId == grievanceType.id) {
          //         obj.assignedTo = grievanceType.name;
          //       }
          //     })
          //   })
          // }
        }
      },
      error: (err) => {
        // Handle the error here in case of Api failure
        this.toastrService.showToastr('Something went wrong. Please try again', 'Error', 'error', '');
        this.isDataLoading = false;
        this.tabs.filter(tab => {
          if (tab.name === tabName) {
            tab['count'] = 0;
          }
        });
      }
    })
    if(getCount) {
      this.apiSubscription = undefined;
    }
  }

  handlePageChange(event: PageEvent) {
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
      this.length = event.length;
      this.getTicketsRequestObject();
      // call API here
  }

  handleSortChange(e: any) {
    this.sortHeader = e.active;
    this.direction = e.direction;
    this.getTicketsRequestObject();
  }

}
