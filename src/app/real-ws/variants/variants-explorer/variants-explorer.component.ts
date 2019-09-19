import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pm4pyService } from 'app/pm4py-service.service';
import { AuthenticationServiceService } from "../../../authentication-service.service";
import { HttpParams } from "@angular/common/http";
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-variants-explorer',
  templateUrl: './variants-explorer.component.html',
  styleUrls: ['./variants-explorer.component.scss'],
  host: {
    // '(window:resize)': 'onResize($event)'
  }
})
export class VariantsExplorerComponent implements OnInit {

  private pm4pyService: Pm4pyService;

  public isLoading: boolean;
  public variantsLoading: boolean;
  public casesLoading: boolean;

  process;
  pm4pyJsonVariants;
  variants;
  events;

  isVisibleLegend: boolean;
  isVisibleCaseEventsExplorer: boolean;

  constructor(
      private route: ActivatedRoute,
      private pm4pyServ: Pm4pyService,
      private authService: AuthenticationServiceService,
      private dialog: MatDialog) {

    this.isLoading = false;
    this.variantsLoading = false;
    this.casesLoading = false;

    this.isVisibleLegend = false;
    this.isVisibleCaseEventsExplorer = true;

    this.pm4pyService = pm4pyServ;
    this.authService.checkAuthentication().subscribe(data => {
    });

    this.getCurrentProcess();
    this.getAllVariants();

  }

  ngOnInit() {
  }

  getCurrentProcess() {
    this.process = this.pm4pyService.getCurrentProcess();
  }

  getAllVariants() {
    this.variantsLoading = true;
    this.isLoading = this.variantsLoading || this.casesLoading;
    let params: HttpParams = new HttpParams();
    this.pm4pyService.getAllVariants(params).subscribe(data => {
      this.pm4pyJsonVariants = data as JSON;
      this.variants = this.pm4pyJsonVariants['variants'];
      this.events = new Map();
      let i = 0;
      let totalCountForCase = 0;
      while (i < this.variants.length) {
        totalCountForCase += this.variants[i].count;
        // set events as array
        let jsonEvents = this.variants[i]['variant'];
        this.variants[i]['events'] = jsonEvents.split(',');
        i++;
      }
      this.variants.forEach((variant) => {
        variant['percentage'] = ((variant.count / totalCountForCase) * 100).toFixed(2);
      });

      this.variantsLoading = false;
      this.isLoading = this.variantsLoading || this.casesLoading;

      if (this.isLoading === false) {
        this.dialog.closeAll();
      }
    })
  }

}
