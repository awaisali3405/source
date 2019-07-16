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

  constructor(private _sanitizer: DomSanitizer, private pm4pyServ: Pm4pyService, private authService: AuthenticationServiceService, public dialog: MatDialog, private _route : Router) {
    this.pm4pyService = pm4pyServ;
    this.sanitizer = _sanitizer;

    this.technique = "fixed_value";
    this.resource_aware = true;
    this.hashed_activities = true;
    this.selected_selective_option = "low";

    this.authService.checkAuthentication().subscribe(data => {
    });
  }

  ngOnInit() {
  }

  applyFilter() {
    let no_substitutions = (<HTMLInputElement>document.getElementById("no_substitutions")).value;
    let selective_lower_bound_applied = true;
    let selective_upper_bound_applied = true;

    console.log(this.technique);
    console.log(this.selected_selective_option);

    if (this.selected_selective_option == "low") {
      selective_lower_bound_applied = true;
      selective_upper_bound_applied = false;
    }
    else {
      selective_lower_bound_applied = false;
      selective_upper_bound_applied = true;
    }

    let fixed_value = (<HTMLInputElement>document.getElementById("fixed_value")).value;
    let event_attributes2remove = "";
    let trace_attributes2remove = "";

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
