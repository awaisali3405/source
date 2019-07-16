import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Pm4pyService} from '../../pm4py-service.service';
import {AuthenticationServiceService} from '../../authentication-service.service';
import {MatDialog} from '@angular/material';
import {HttpParams} from '@angular/common/http';
import {WaitingCircleComponentComponent} from '../waiting-circle-component/waiting-circle-component.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-privacy-roles',
  templateUrl: './privacy-roles.component.html',
  styleUrls: ['./privacy-roles.component.scss']
})
export class PrivacyRolesComponent implements OnInit {
  sanitizer: DomSanitizer;
  pm4pyService: Pm4pyService;
  public technique : string;
  public resource_aware : boolean;
  public hashed_activities : boolean;
  public selected_selective_option : string;
  public attributesList : string[];
  public traceAttributesList : string[];

  public selectedAttributeValues : string[];
  public selectedTraceAttributeValues : string[];

  constructor(private _sanitizer: DomSanitizer, private pm4pyServ: Pm4pyService, private authService: AuthenticationServiceService, public dialog: MatDialog, private _route : Router) {
    this.pm4pyService = pm4pyServ;
    this.sanitizer = _sanitizer;

    this.technique = "fixed_value";
    this.resource_aware = true;
    this.hashed_activities = true;
    this.selected_selective_option = "low";

    this.selectedAttributeValues = [];
    this.selectedTraceAttributeValues = [];

    this.authService.checkAuthentication().subscribe(data => {
    });

    this.getEventAttributesList();
    this.getTraceAttributesList();
  }

  getEventAttributesList() {
    let httpParams : HttpParams = new HttpParams();

    let thisDialog = this.dialog.open(WaitingCircleComponentComponent);

    this.pm4pyService.getAttributesList(httpParams).subscribe(data => {
      let attributesList = data as JSON;
      this.attributesList = attributesList["attributes_list"];

      console.log(this.attributesList);

      let index = this.attributesList.indexOf("concept:name");

      console.log(index);

      if (index > -1) {
        this.attributesList.splice(index, 1);
      }

      thisDialog.close();
    });
  }

  addRemoveEventAttribute(sa) {
    if (!this.selectedAttributeValues.includes(sa)) {
      this.selectedAttributeValues.push(sa);
    }
    else {
      let thisIndex : number = this.selectedAttributeValues.indexOf(sa, 0);
      this.selectedAttributeValues.splice(thisIndex, 1);
    }
  }

  getTraceAttributesList() {
    let httpParams : HttpParams = new HttpParams();

    let thisDialog = this.dialog.open(WaitingCircleComponentComponent);

    this.pm4pyService.getTraceAttributes(httpParams).subscribe(data => {
      let attributesList = data as JSON;
      this.traceAttributesList = attributesList["attributes_list"];

      let index = this.traceAttributesList.indexOf("concept:name");

      if (index > -1) {
        this.traceAttributesList.splice(index, -1);
      }

      thisDialog.close();
    });
  }

  addRemoveTraceAttribute(sa) {
    if (!this.selectedTraceAttributeValues.includes(sa)) {
      this.selectedTraceAttributeValues.push(sa);
    }
    else {
      let thisIndex : number = this.selectedTraceAttributeValues.indexOf(sa, 0);
      this.selectedTraceAttributeValues.splice(thisIndex, 1);
    }
  }

  ngOnInit() {
  }

  applyFilter() {
    let no_substitutions = (<HTMLInputElement>document.getElementById("no_substitutions")).value;
    let selective_lower_bound_applied = true;
    let selective_upper_bound_applied = true;

    if (this.selected_selective_option == "low") {
      selective_lower_bound_applied = true;
      selective_upper_bound_applied = false;
    }
    else if (this.selected_selective_option == "up") {
      selective_lower_bound_applied = false;
      selective_upper_bound_applied = true;
    }

    let fixed_value = (<HTMLInputElement>document.getElementById("fixed_value")).value;
    let event_attributes2remove = "";
    let trace_attributes2remove = "";

    let i = 0;
    while (i < this.selectedTraceAttributeValues.length) {
      if (i > 0) {
        trace_attributes2remove = trace_attributes2remove + "@@";
      }
      trace_attributes2remove = trace_attributes2remove + this.selectedTraceAttributeValues[i];
      i++;
    }

    i = 0;
    while (i < this.selectedAttributeValues.length) {
      if (i > 0) {
        event_attributes2remove = event_attributes2remove + "@@";
      }
      event_attributes2remove = event_attributes2remove + this.selectedAttributeValues[i];
      i++;
    }

    let httpParams : HttpParams = new HttpParams();
    httpParams = httpParams.set("no_substitutions", ""+no_substitutions);
    httpParams = httpParams.set("selective_lower_bound_applied", ""+selective_lower_bound_applied);
    httpParams = httpParams.set("selective_upper_bound_applied", ""+selective_upper_bound_applied);
    httpParams = httpParams.set("fixed_value", ""+fixed_value);
    httpParams = httpParams.set("technique", ""+this.technique);
    httpParams = httpParams.set("resource_aware", ""+this.resource_aware);
    httpParams = httpParams.set("hashed_activities", ""+this.hashed_activities);
    httpParams = httpParams.set("event_attributes2remove", ""+event_attributes2remove);
    httpParams = httpParams.set("trace_attributes2remove", ""+trace_attributes2remove);

    console.log("selective_lower_bound_applied");
    console.log(selective_lower_bound_applied);
    console.log("selective_upper_bound_applied");
    console.log(selective_upper_bound_applied);
    console.log(httpParams);

    let dia = this.dialog.open(WaitingCircleComponentComponent);

    this.pm4pyService.rolesPrivacyAware(httpParams).subscribe(data => {
      let resultJson = data as JSON;

      if (resultJson["status"] == "OK") {
        this._route.navigateByUrl("/real-ws/plist");
      }
      else {
        alert("Something has gone wrong in applying the privacy-preserving method!");
      }
      dia.close();
    }, err => {
      alert("Something has gone wrong in applying the privacy-preserving method!");
      dia.close();
    });
  }

  changeResourceAware() {
    this.resource_aware = !this.resource_aware;
  }

  changedHashedActivities() {
    this.hashed_activities = !this.hashed_activities;
  }

  changeSelectiveOption(event) {
    console.log(event);
    this.selected_selective_option = event.value;
  }

}
