import { Component, OnInit } from '@angular/core';
import {Pm4pyService} from "../../pm4py-service.service";
import {HttpParams} from "@angular/common/http";
import {Router, RoutesRecognized} from "@angular/router";
import {AuthenticationServiceService} from '../../authentication-service.service';
import {WaitingCircleComponentComponent} from '../waiting-circle-component/waiting-circle-component.component';
import {MatDialog} from '@angular/material';
import {Http} from '@angular/http';

@Component({
  selector: 'app-plist',
  templateUrl: './plist.component.html',
  styleUrls: ['./plist.component.scss']
})
export class PlistComponent implements OnInit {

  pm4pyService: Pm4pyService;
  logsListJson: JSON;
  router : Router;
  public logsList: string[];

  constructor(private pm4pyServ: Pm4pyService, private _route : Router, private authService: AuthenticationServiceService, public dialog: MatDialog) {
    /**
     * Constructor
     */
    this.pm4pyService = pm4pyServ;
    this.router = _route;

    this.authService.checkAuthentication().subscribe(data => {
    });

    this.getProcessList();

    /*this.router.events.subscribe((next) => {
      if (next instanceof RoutesRecognized) {
        if (next.url.startsWith("/logsList")) {
          this.getProcessList();
        }
      }
    });*/
  }

  getProcessList() {
    /**
     * Gets the list of processes loaded into the service
     */
    let params: HttpParams = new HttpParams();

    this.dialog.open(WaitingCircleComponentComponent);

    this.pm4pyService.getLogsListAdvanced(params).subscribe(data => {
      this.logsListJson = data as JSON;
      this.logsList = this.logsListJson["logs"];

      this.dialog.closeAll();
    });
  }

  ngOnInit() {
    /**
     * Manages the initialization of the component
     */
    localStorage.removeItem("process");
  }

  logClicked(log, log_type) {
    /**
     * Manages the click on a process
     */
    localStorage.setItem("process", log);

    if (log_type === "xml") {
      let parameters : HttpParams = new HttpParams();
      this.pm4pyService.getContent(parameters).subscribe(data => {
        let dataasjson = data as JSON;
        let ext = dataasjson["ext"];
        let content = dataasjson["base64"];

        var image = new Image();
        image.src = "data:image/png;base64," + content;

        var w = window.open("");
        w.document.write(image.outerHTML);
      });
    }
    else {

      this.router.navigate(["/real-ws/pmodel"]);
    }
  }

  downloadFile(data: string, type: string) {
    const blob = new Blob([data], { type: type });
    const url= window.URL.createObjectURL(blob);
    window.open(url);
  }

  deleteLog(log) {
    if (confirm("Are you really willing to delete the log: "+log)) {
      let httpParams : HttpParams = new HttpParams();
      httpParams = httpParams.set("process", log);

      this.pm4pyService.deleteEventLog(httpParams).subscribe(data => {
        alert("deleted log " + log);

        if (this._route.url === "/real-ws/plist") {
          this.router.navigateByUrl("/real-ws/plist2");
        } else {
          this.router.navigateByUrl("/real-ws/plist");
        }
      });

      if (this._route.url === "/real-ws/plist") {
        this.router.navigateByUrl("/real-ws/plist2");
      } else {
        this.router.navigateByUrl("/real-ws/plist");
      }
    }
  }

}
