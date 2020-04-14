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
  templateUrl: './privacy-tlkc.component.html',
  styleUrls: ['./privacy-tlkc.component.scss']
})
export class PrivacyTlkcComponent implements OnInit {
  sanitizer: DomSanitizer;
  pm4pyService: Pm4pyService;
  public attributesList : string[];
  public traceAttributesList : string[];

  public selectedAttributeValues : string[];
  public selectedTraceAttributeValues : string[];

  public timeAccuracy: string;
  public backgroundKnowledgeType: string;

  constructor(private _sanitizer: DomSanitizer, private pm4pyServ: Pm4pyService, private authService: AuthenticationServiceService, public dialog: MatDialog, private _route : Router) {
    this.pm4pyService = pm4pyServ;
    this.sanitizer = _sanitizer;

    this.selectedAttributeValues = [];
    this.selectedTraceAttributeValues = [];

    this.timeAccuracy = "minutes";
    this.backgroundKnowledgeType = "set";

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

    let attribute2remove = "";
    let i = 0;
    while (i < this.selectedTraceAttributeValues.length) {
      if (attribute2remove.length > 0) {
        attribute2remove = attribute2remove + "@@";
      }
      attribute2remove = attribute2remove + this.selectedTraceAttributeValues[i];
      i++;
    }

    i = 0;
    while (i < this.selectedAttributeValues.length) {
      if (attribute2remove.length > 0) {
        attribute2remove = attribute2remove + "@@";
      }
      attribute2remove = attribute2remove + this.selectedAttributeValues[i];
      i++;
    }

    let L = (<HTMLInputElement>document.getElementById("L")).value;
    let C = (<HTMLInputElement>document.getElementById("C")).value;
    let K = (<HTMLInputElement>document.getElementById("K")).value;
    let K2 = (<HTMLInputElement>document.getElementById("K2")).value;

    let httpParams : HttpParams = new HttpParams();
    httpParams = httpParams.set("sensitive", attribute2remove);
    httpParams = httpParams.set("bk_type", this.backgroundKnowledgeType);
    httpParams = httpParams.set("T", this.timeAccuracy);
    httpParams = httpParams.set("L", ""+L);
    httpParams = httpParams.set("C", ""+C);
    httpParams = httpParams.set("K", ""+K);
    httpParams = httpParams.set("K2", ""+K2);

    let dia = this.dialog.open(WaitingCircleComponentComponent);

    this.pm4pyService.privacyTlkc(httpParams).subscribe(data => {
      let resultJson = data as JSON;

      if (resultJson["status"] == "OK") {
        this._route.navigateByUrl("/real-ws/plist");
      }
      else {
        alert("Something has gone wrong in applying the TLKC method!");
      }
      dia.close();
    }, err => {
      alert("Something has gone wrong in applying the TLKC method!");
      dia.close();
    });
  }
}
