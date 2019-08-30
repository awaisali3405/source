import { Component, OnChanges, Input, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { eventsColorMap } from '../variants-explorer-model';
import {MatTableDataSource, MatSort, MatDialog} from '@angular/material';
import {DatePipe} from '@angular/common';
import { Pm4pyService } from "../../../pm4py-service.service";
import {HttpParams} from "@angular/common/http";
import {WaitingCircleComponentComponent} from "../../waiting-circle-component/waiting-circle-component.component";

interface CaseElement {
  caseId: string;
  caseDuration: any;
  startTime: any;
  endTime: any;
}

@Component({
  selector: 'app-graph-cases',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './graph-cases.component.html',
  styleUrls: ['./graph-cases.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state( 'expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class GraphCasesComponent implements OnChanges {
  //@ViewChild('cases', {static: false})
  //private chartContainer: ElementRef;

  @Input()
  cases: CaseElement[];

  // @ts-ignore
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  isExpanded: boolean;

  dataSource: MatTableDataSource<any>;
  pm4pyJsonEvents;
  events: any[];

  displayedColumns: string[] = ['caseId', 'caseDuration', 'startTime', 'endTime'];
  pageSizeOptions: number[] = [5];

  expandedElement: any | null;
  displayedEventsColumns: string[] = ['concept:name', 'time:timestamp', 'org:group'];


  constructor(
      private pm4pyService: Pm4pyService,
      public dialog: MatDialog
  ) {
  }

  ngOnChanges(): void {
    //console.log('graph-cases: onChanges');
    if (!this.cases) {
      this.cases = null;
      this.dataSource = null;
      this.pageSizeOptions = [5];
      return;
    }
    this.setPageSizeOptions();
    this.dataSource = new MatTableDataSource<any>(this.cases);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  setPageSizeOptions() {
    if (this.dataSource == null) this.pageSizeOptions = [5];
    this.pageSizeOptions = [5, 10, this.cases.length];
  }

  onClickEventByCaseId(caseId) {

    this.events = [];

    let params: HttpParams = new HttpParams();
    params = params.set('caseid', caseId);

    this.dialog.open(WaitingCircleComponentComponent);

    //console.log(caseId+" is clicked.");

    this.pm4pyService.getEvents(params).subscribe(data => {
      this.pm4pyJsonEvents = data as JSON;
      this.events = this.pm4pyJsonEvents['events'];

      //console.log("EVENTS=");
      //console.log(this.events);

      this.addEventsColor(this.events);
    });

    this.dialog.closeAll();
  }


  private addEventsColor(events) {
    events.forEach((event) => {
      event['color'] = eventsColorMap.get(event['concept:name']);
    })
  }

}
