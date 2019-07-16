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

  constructor(private _sanitizer: DomSanitizer, private pm4pyServ: Pm4pyService, private authService: AuthenticationServiceService, public dialog: MatDialog, private _route : Router) {
    this.pm4pyService = pm4pyServ;
    this.sanitizer = _sanitizer;

    this.authService.checkAuthentication().subscribe(data => {
    });
  }

  ngOnInit() {
  }

  applyFilter() {
    let httpParams : HttpParams = new HttpParams();

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

}
