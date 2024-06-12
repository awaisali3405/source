import { Component, Output, EventEmitter, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from '../services/layout.service';
import { Subscription } from 'rxjs';
import { ConfigService } from '../services/config.service';
import {AuthenticationServiceService} from '../../authentication-service.service';
import {Router, RoutesRecognized} from '@angular/router';
import {HttpParams} from '@angular/common/http';
import {Pm4pyService} from '../../pm4py-service.service';
import {LogSharingComponent} from '../../real-ws/log-sharing/log-sharing.component';
import {FilterServiceService} from '../../filter-service.service';

import {MatDialog} from '@angular/material';

import {StartActivitiesFilterComponent} from "../../real-ws/start-activities-filter/start-activities-filter.component";
import {EndActivitiesFilterComponent} from "../../real-ws/end-activities-filter/end-activities-filter.component";
import {VariantsFilterComponent} from "../../real-ws/variants-filter/variants-filter.component";
import {AttributesFilterComponent} from "../../real-ws/attributes-filter/attributes-filter.component";
import {TimeframeFilterComponent} from '../../real-ws/timeframe-filter/timeframe-filter.component';
import {PerformanceFilterComponent} from '../../real-ws/performance-filter/performance-filter.component';
import {NumericAttributeFilterComponent} from '../../real-ws/numeric-attribute-filter/numeric-attribute-filter.component';
import {WaitingCircleComponentComponent} from '../../real-ws/waiting-circle-component/waiting-circle-component.component';

import {PathsFilterComponent} from '../../real-ws/paths-filter/paths-filter.component';
import {environment} from '../../../environments/environment';

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  currentLang = "en";
  toggleClass = "ft-maximize";
  placement = "bottom-right";
  public isCollapsed = true;
  layoutSub: Subscription;
  @Output()
  toggleHideSidebar = new EventEmitter<Object>();

  public filters : any;

  public config: any = {};

  public enableSmartFiltering : boolean;

  public sessionId : string;
  public userId : string;
  public isNotLogin : boolean;
  public enableDownload : boolean;
  public enableUpload : boolean;
  public thisProcess : string;
  public isAdmin : boolean;
  public isProcessModelPage : boolean;
  public isPlistPage : boolean;
  public enableSharing: boolean = true;

  public dialog : MatDialog;

  public filterCorrespondence : any = {};

  constructor(public translate: TranslateService, private layoutService: LayoutService, private configService:ConfigService, private authService: AuthenticationServiceService, private _route : Router, private pm4pyServ: Pm4pyService, public _dialog: MatDialog, private filterService: FilterServiceService) {
    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|es|pt|de/) ? browserLang : "en");

    this.layoutSub = layoutService.changeEmitted$.subscribe(
      direction => {
        const dir = direction.direction;
        if (dir === "rtl") {
          this.placement = "bottom-left";
        } else if (dir === "ltr") {
          this.placement = "bottom-right";
        }
      });

    this.dialog = _dialog;

    this.getFilters();
    _route.events.subscribe((val) => {
      this.getFilters();
    });

    if (localStorage.getItem("smartFiltering") === null) {
      localStorage.setItem("smartFiltering", "true");
    }

    if (localStorage.getItem("smartFiltering") === "true") {
      this.enableSmartFiltering = true;
    }
    else {
      this.enableSmartFiltering = false;
    }

    this.enableSharing = environment.overallEnableSharing;


    this.sessionId = null;
    this.userId = null;
    this.isNotLogin = false;
    this.enableDownload = false;
    this.enableUpload = true;
    this.thisProcess = null;
    this.isAdmin = false;

    this.isProcessModelPage = false;
    this.isPlistPage = true;

    this.filterCorrespondence["ltl"] = "LTL";
    this.filterCorrespondence["start_activities"] = "Start act.";
    this.filterCorrespondence["end_activities"] = "End act.";
    this.filterCorrespondence["attributes_pos_trace"] = "Attributes";
    this.filterCorrespondence["attributes_neg_trace"] = "Attributes";
    this.filterCorrespondence["attributes_pos_events"] = "Attributes";
    this.filterCorrespondence["attributes_neg_events"] = "Attributes";
    this.filterCorrespondence["paths_pos_trace"] = "Paths";
    this.filterCorrespondence["paths_neg_trace"] = "Paths";
    this.filterCorrespondence["case_performance_filter"] = "Performance";
    this.filterCorrespondence["timestamp_trace_intersecting"] = "Timeframe";
    this.filterCorrespondence["timestamp_trace_containing"] = "Timeframe";
    this.filterCorrespondence["timestamp_events"] = "Timeframe";
    this.filterCorrespondence["variants"] = "Variants";
    this.filterCorrespondence["numeric_attr_traces"] = "Num. attr.";
    this.filterCorrespondence["numeric_attr_events"] = "Num. attr.";


    this.authService.checkAuthentication().subscribe(data => {

      console.log("AAAAAA2");
      console.log(data);

      this.sessionId = data.sessionId;
      this.userId = data.userId;
      this.isNotLogin = data.isNotLogin;
      this.enableDownload = data.enableDownload;
      this.enableUpload = data.enableUpload;
      this.isAdmin = data.isAdmin;
      this.thisProcess = localStorage.getItem("process");
  });

    this._route.events.subscribe((next) => {
      if (next instanceof RoutesRecognized) {
        this.authService.checkAuthentication().subscribe(data => {

          console.log("AAAAAA");
          console.log(data);

          this.sessionId = data.sessionId;
          this.userId = data.userId;
          this.isNotLogin = data.isNotLogin;
          this.enableDownload = data.enableDownload;
          this.enableUpload = data.enableUpload;
          this.isAdmin = data.isAdmin;
          this.thisProcess = localStorage.getItem("process");
        });

        if (next.url.startsWith("/real-ws/pmodel")) {
          this.isProcessModelPage = true;
          this.isPlistPage = false;
        }
        else if (next.url.startsWith("/real-ws/plist")) {
          this.isProcessModelPage = false;
          this.isPlistPage = true;
        }
        else if (next.url.startsWith("/real-ws") || next.url.startsWith("/pages/login")) {
          this.isProcessModelPage = false;
          this.isPlistPage = false;
        }
      }
    });
  }

  ngOnInit() {
    this.config = this.configService.templateConf;
  }

  ngAfterViewInit() {
    if(this.config.layout.dir) {
      setTimeout(() => {
        const dir = this.config.layout.dir;
        if (dir === "rtl") {
          this.placement = "bottom-left";
        } else if (dir === "ltr") {
          this.placement = "bottom-right";
        }
      }, 0);
     
    }
  }

  ngOnDestroy() {
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
  }

  public getFilters() {
    this.filters = this.filterService.getFilters();
  }

  ChangeLanguage(language: string) {
    this.translate.use(language);
  }

  ToggleClass() {
    if (this.toggleClass === "ft-maximize") {
      this.toggleClass = "ft-minimize";
    } else {
      this.toggleClass = "ft-maximize";
    }
  }

  toggleNotificationSidebar() {
    this.layoutService.emitNotiSidebarChange(true);
  }

  toggleSidebar() {
    const appSidebar = document.getElementsByClassName("app-sidebar")[0];
    if (appSidebar.classList.contains("hide-sidebar")) {
      this.toggleHideSidebar.emit(false);
    } else {
      this.toggleHideSidebar.emit(true);
    }
  }

  logout() {
    this.authService.doLogout();
  }

  goToHome() {
    this._route.navigateByUrl("/real-ws/plist");
  }

  downloadCSV() {
    let httpParams : HttpParams = new HttpParams();

    this.dialog.open(WaitingCircleComponentComponent);

    this.pm4pyServ.downloadCsvLog(httpParams).subscribe(data => {
      let csvJson : JSON = data as JSON;

      this.dialog.closeAll();

      this.downloadFile(csvJson['content'], 'text/csv');
    });
  }

  downloadXES() {
    let httpParams : HttpParams = new HttpParams();

    this.dialog.open(WaitingCircleComponentComponent);

    this.pm4pyServ.downloadXesLog(httpParams).subscribe(data => {
      let xesJson : JSON = data as JSON;

      this.dialog.closeAll();

      this.downloadFile(xesJson['content'], 'text/xml');
    });
  }

  downloadFile(data: string, type: string) {
    const blob = new Blob([data], { type: type });
    const url= window.URL.createObjectURL(blob);
    window.open(url);
  }

  uploadFile($event) {
    let reader = new FileReader();
    let filename : string = $event.target.files[0].name;
    let filetype : string = $event.target.files[0].type;
    let extension : string = filename.split(".")[1];
    if (extension === "xes" || extension === "csv") {
      this.dialog.open(WaitingCircleComponentComponent);

      reader.readAsDataURL($event.target.files[0]);
      reader.onload = () => {
        let base64: string = reader.result.toString();
         // Verify base64 encoding integrity
         if (base64.startsWith('data:') && base64.includes(';base64,')) {
          base64 = base64.split(';base64,')[1];
        } else {
          console.error('Invalid base64 encoding');
          alert('Invalid base64 encoding!');
          return;
        }

        // Check base64 string length
        if (base64.length % 4 !== 0 || /[^A-Za-z0-9+/=]/.test(base64)) {
          console.error('Corrupt base64 string');
          alert('Corrupt base64 string!');
          return;
        }

        console.log(`Base64 length: ${base64.length} characters`);
        let data : any = {"filename": filename, "base64": base64};
        this.pm4pyServ.uploadLog(data).subscribe(data => {
          let responseJson : JSON = data as JSON;

          this.dialog.closeAll();

          if (responseJson["status"] === "OK") {
            if (this._route.url === "/real-ws/plist") {
              this._route.navigateByUrl("/real-ws/plist2");
            }
            else {
              this._route.navigateByUrl("/real-ws/plist");
            }
            //window.location.reload();
          }
          else {
            console.log('Upload error response:', responseJson);
            alert("Something has gone wrong in the upload!");
          }
        },
        (error) => {
          console.log('Upload error:', error);
          alert('Something has gone wrong in the upload!');
          this.dialog.closeAll();
        })
      }
    }
    else {
      alert("unsupported file type for direct upload!")
    }
  }

  startActivitiesFilter() {
    this.dialog.open(StartActivitiesFilterComponent);
  }

  endActivitiesFilter() {
    this.dialog.open(EndActivitiesFilterComponent);
  }

  variantsFilter() {
    this.dialog.open(VariantsFilterComponent);
  }

  attributesFilter() {
    this.dialog.open(AttributesFilterComponent);
  }

  pathsFilter() {
    this.dialog.open(PathsFilterComponent);
  }

  performanceFilter() {
    this.dialog.open(PerformanceFilterComponent);
  }

  timeframeFilter() {
    this.dialog.open(TimeframeFilterComponent);
  }

  numericAttributeFilter() {
    this.dialog.open(NumericAttributeFilterComponent);
  }

  shareLog() {
      this.dialog.open(LogSharingComponent);
  }

  changeSmartFiltering() {
    if (this.enableSmartFiltering) {
      this.enableSmartFiltering = false;
      localStorage.setItem("smartFiltering", "false");
      alert("Smart filtering has been disabled for the next calculations.");
    }
    else {
      this.enableSmartFiltering = true;
      localStorage.setItem("smartFiltering", "true");
      alert("Smart filtering has been enabled for the next calculations.");
    }
  }
}
