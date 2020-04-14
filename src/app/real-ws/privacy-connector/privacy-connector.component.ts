import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Pm4pyService} from '../../pm4py-service.service';
import {AuthenticationServiceService} from '../../authentication-service.service';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {HttpParams} from '@angular/common/http';
import {Http} from '@angular/http';
import {WaitingCircleComponentComponent} from '../waiting-circle-component/waiting-circle-component.component';

@Component({
  selector: 'app-privacy-connector',
  templateUrl: './privacy-connector.component.html',
  styleUrls: ['./privacy-connector.component.scss']
})
export class PrivacyConnectorComponent implements OnInit {
  sanitizer: DomSanitizer;
  pm4pyService: Pm4pyService;
  public relation_depth : boolean;
  public trace_length : boolean;
  public trace_id : boolean;

  constructor(private _sanitizer: DomSanitizer, private pm4pyServ: Pm4pyService, private authService: AuthenticationServiceService, public dialog: MatDialog, private _route: Router) {
    this.sanitizer = _sanitizer;
    this.pm4pyService = pm4pyServ;

    this.relation_depth = true;
    this.trace_length = true;
    this.trace_id = true;
    this.authService.checkAuthentication().subscribe(data => {
    });
  }

  ngOnInit() {
  }

  checkPassword() {
    let key = (<HTMLInputElement>document.getElementById("key")).value;

    if (key.length == 0) {
      key = "CHIAVECHIAVECHIA";
    }

    if (key.length < 16) {
      alert("The provided keyphrase must be exactly 16 characters long!");
      return false;
    }
    
    return true;
  }

  applyFilter(event) {
    let key = (<HTMLInputElement>document.getElementById("key")).value;

    if (key.length == 0) {
      key = "CHIAVECHIAVECHIA";
    }

    if (this.checkPassword()) {
      let httpParams : HttpParams = new HttpParams();

      httpParams = httpParams.set("relation_depth", this.relation_depth.toString());
      httpParams = httpParams.set("trace_length", this.trace_length.toString());
      httpParams = httpParams.set("trace_id", this.trace_id.toString());
      httpParams = httpParams.set("key", key);
  
      let dia = this.dialog.open(WaitingCircleComponentComponent);
  
      this.pm4pyService.privacyConnectorMethod(httpParams).subscribe(data => {
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
    else {
      alert("Error applying connector method!");
      event.preventDefault();
    }
  }

  changeRelationDepth() {
    this.relation_depth = !this.relation_depth;
  }

  changeTraceLength() {
    this.trace_length = !this.trace_length;
  }

  changeTraceId() {
    this.trace_id = !this.trace_id;
  }
}
