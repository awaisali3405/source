import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Pm4pyService} from '../../pm4py-service.service';
import {AuthenticationServiceService} from '../../authentication-service.service';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-privacy-roles',
  templateUrl: './privacy-roles.component.html',
  styleUrls: ['./privacy-roles.component.scss']
})
export class PrivacyRolesComponent implements OnInit {
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

  applyFilter() {

  }

}
