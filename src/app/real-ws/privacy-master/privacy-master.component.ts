import { Component, OnInit } from '@angular/core';
import {WaitingCircleComponentComponent} from '../waiting-circle-component/waiting-circle-component.component';
import {DomSanitizer} from '@angular/platform-browser';
import {Pm4pyService} from '../../pm4py-service.service';
import {AuthenticationServiceService} from '../../authentication-service.service';
import {MatDialog} from '@angular/material';
import {PrivacyRolesComponent} from '../privacy-roles/privacy-roles.component';

@Component({
  selector: 'app-privacy-master',
  templateUrl: './privacy-master.component.html',
  styleUrls: ['./privacy-master.component.scss']
})
export class PrivacyMasterComponent implements OnInit {
  sanitizer: DomSanitizer;
  pm4pyService: Pm4pyService;

  constructor(private _sanitizer: DomSanitizer, private pm4pyServ: Pm4pyService, private authService: AuthenticationServiceService, public dialog: MatDialog) {
    this.pm4pyService = pm4pyServ;
    this.sanitizer = _sanitizer;

    this.authService.checkAuthentication().subscribe(data => {
    });
  }

  ngOnInit() {
  }

  openPrivacyRoles() {
    this.dialog.open(PrivacyRolesComponent);
  }

}
