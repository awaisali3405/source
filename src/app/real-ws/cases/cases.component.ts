import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Pm4pyService} from '../../pm4py-service.service';
import {HttpParams} from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import {ViewChild} from '@angular/core';
import {MatDialog, MatSort} from '@angular/material';
import {AuthenticationServiceService} from '../../authentication-service.service';
import {WaitingCircleComponentComponent} from '../waiting-circle-component/waiting-circle-component.component';

interface Variant {
    variant: string;
    count: number;
}

@Component({
    selector: 'app-cases',
    templateUrl: './cases.component.html',
    styleUrls: ['./cases.component.scss'],
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class CasesComponent implements OnInit, AfterViewInit {

    public isLoading: boolean;
    public variantsLoading: boolean;
    public casesLoading: boolean;
    sanitizer: DomSanitizer;
    pm4pyService: Pm4pyService;
    pm4pyJsonVariants: JSON;
    pm4pyJsonCases: JSON;
    pm4pyJsonEvents: JSON;
    variants: any[];
    cases: any[];
    events: any[];
    columns: any[];
    displayedColumnsVariants: string[] = ['variant', 'count', 'caseDuration'];
    displayedColumnsCases: string[] = ['caseId', 'caseDuration', 'startTime', 'endTime'];
    displayedColumnsEvents: string[];

    dataSourceVariants = new MatTableDataSource<any>();
    dataSourceCases = new MatTableDataSource<any>();
    dataSourceEvents = new MatTableDataSource<any>();

    width: number = 1310;
    height: number = 170;
    caseIsSelected: boolean = false;
    caseSelected: string;
    variantSelected: string;

    logSummaryJson: JSON;
    public thisVariantsNumber = 0;
    public thisCasesNumber = 0;
    public thisEventsNumber = 0;
    public ancestorVariantsNumber = 0;
    public ancestorCasesNumber = 0;
    public ancestorEventsNumber = 0;
    public ratioVariantsNumber = 100;
    public ratioCasesNumber = 100;
    public ratioEventsNumber = 100;

    maxRetCases : number = 400;
    maxRetVariants : number = 100;

    @ViewChild(MatSort) casesSort: MatSort;

    constructor(private _sanitizer: DomSanitizer, private pm4pyServ: Pm4pyService, private authService: AuthenticationServiceService, public dialog: MatDialog) {
        /**
         * Constructor
         */

        this.sanitizer = _sanitizer;
        this.pm4pyService = pm4pyServ;
        this.variantsLoading = false;
        this.casesLoading = false;
        this.isLoading = false;

        this.variantSelected = null;

        this.authService.checkAuthentication().subscribe(data => {
        });

        if (localStorage.getItem("smartFiltering") === null) {
            localStorage.setItem("smartFiltering", "true");
        }

        if (localStorage.getItem("smartFiltering") === "false") {
            this.maxRetVariants = 10000000;
            this.maxRetCases = 10000000;
        }

        this.getAllVariants();
        this.getAllCases();
        this.getLogSummary();
    }

    public getLogSummary() {
        /**
         * Retrieves the log summary and updates the visualization
         */
        let params: HttpParams = new HttpParams();

        this.pm4pyService.getLogSummary(params).subscribe(data => {
            this.logSummaryJson = data as JSON;
            this.thisVariantsNumber = this.logSummaryJson['this_variants_number'];
            this.thisCasesNumber = this.logSummaryJson['this_cases_number'];
            this.thisEventsNumber = this.logSummaryJson['this_events_number'];
            this.ancestorVariantsNumber = this.logSummaryJson['ancestor_variants_number'];
            this.ancestorCasesNumber = this.logSummaryJson['ancestor_cases_number'];
            this.ancestorEventsNumber = this.logSummaryJson['ancestor_events_number'];
            if (this.ancestorVariantsNumber > 0) {
                this.ratioVariantsNumber = this.thisVariantsNumber / this.ancestorVariantsNumber * 100.0;
                this.ratioCasesNumber = this.thisCasesNumber / this.ancestorCasesNumber * 100.0;
                this.ratioEventsNumber = this.thisEventsNumber / this.ancestorEventsNumber * 100.0;
            } else {
                this.ratioVariantsNumber = 100;
                this.ratioCasesNumber = 100;
                this.ratioEventsNumber = 100;
            }
        });
    }

    ngOnInit() {
        /**
         * Manages the initialization of the component
         */
    }

    public secondsToString(seconds: number) {
        let numdays: number = Math.floor(seconds / 86400);
        let numhours: number = Math.floor((seconds % 86400) / 3600);
        let numminutes: number = Math.floor(((seconds % 86400) % 3600) / 60);
        let numseconds: number = Math.floor(((seconds % 86400) % 3600) % 60);

        if (numdays >= 1) {
            return numdays.toString() + ' days ' + numhours.toString() + ' hours';
        } else if (numhours >= 1) {
            return numhours.toString() + ' hours ' + numminutes.toString() + ' minutes';
        } else if (numminutes >= 1) {
            return numminutes.toString() + ' minutes ' + numseconds.toString() + 'seconds';
        } else if (numseconds >= 1) {
            return numseconds.toString() + ' seconds';
        }
        return '0 seconds';
    }

    public get_repr_time(s: number) {
        return new Date(s * 1e3).toISOString();
    }

    getAllVariants() {
        this.variantsLoading = true;
        this.isLoading = this.variantsLoading || this.casesLoading;
        let params: HttpParams = new HttpParams();
        params = params.set("max_no_variants", ""+this.maxRetVariants);
        this.pm4pyService.getAllVariants(params).subscribe(data => {
            this.pm4pyJsonVariants = data as JSON;
            this.variants = this.pm4pyJsonVariants['variants'];
            let i: number = 0;
            while (i < this.variants.length) {
                let keys: string[] = Object.keys(this.variants[i]);
                this.variants[i] = {
                    'variant': this.variants[i]['variant'],
                    'count': this.variants[i]['count'],
                    'caseDuration': this.variants[i]['caseDuration']
                };
                i++;
            }
            this.variantsLoading = false;
            this.isLoading = this.variantsLoading || this.casesLoading;
            this.dataSourceVariants.data = this.variants;
            console.log(this.variants);

            if (this.isLoading === false) {
                this.dialog.closeAll();
            }
        })
    }

    getAllCases() {
        this.dialog.open(WaitingCircleComponentComponent);

        this.casesLoading = true;
        this.isLoading = this.variantsLoading || this.casesLoading;
        let params: HttpParams = new HttpParams();

        if (this.variantSelected != null) {
            params = params.set('variant', this.variantSelected);
        }

        params = params.set('max_no_cases', ""+this.maxRetCases);

        this.pm4pyService.getAllCases(params).subscribe(data => {
            this.pm4pyJsonCases = data as JSON;
            this.cases = this.pm4pyJsonCases['cases'];
            this.casesLoading = false;
            this.isLoading = this.variantsLoading || this.casesLoading;
            this.dataSourceCases.data = this.cases;
            this.dataSourceCases.sort = this.casesSort;
            console.log(this.cases);

            if (this.isLoading === false) {
                this.dialog.closeAll();
            }
        })
    }

    setTableSize() {
        //this.height = Math.floor(0.25 * window.innerHeight);
        this.width = Math.floor(0.68 * window.innerWidth);

        console.log(this.width);
        //console.log(this.height);
    }

    onResize(event) {
        /**
         * Manages the resizing of a page
         */
        // sets the image size after the resizing
        this.setTableSize();
    }

    ngAfterViewInit() {
        this.setTableSize();
    }

    caseClicked(row) {
        this.caseSelected = row['caseId'];
        document.getElementById('tableEvents').style.display = '';

        let params: HttpParams = new HttpParams();
        params = params.set('caseid', this.caseSelected);

        this.dialog.open(WaitingCircleComponentComponent);

        this.pm4pyService.getEvents(params).subscribe(data => {
            //this.displayedColumnsEvents = ['concept:name', 'org:resource', 'time:timestamp', 'lifecycle:transition'];

            this.pm4pyJsonEvents = data as JSON;
            this.events = this.pm4pyJsonEvents['events'];

            console.log("EVENTS=");
            console.log(this.events);

            let allAttributesTypes = {};

            let i = 0;
            while (i < this.events.length) {
                for (const key of Object.keys(this.events[i])) {
                    // todo: add some typing here
                    allAttributesTypes[key] = 'string';
                    //console.log(key, this.events[i][key]);
                }
                i++;
            }

            let columnMapping = {'concept:name': 'Activity', 'org:resource': 'Resource', 'time:timestamp': 'Timestamp',
            'lifecycle:transition': 'Transition'};

            this.columns = [];
            this.displayedColumnsEvents = [];

            let displayedColumnsHeaders = [];

            for (const key of Object.keys(allAttributesTypes)) {
                if (key in columnMapping) {
                    if (!(key in this.displayedColumnsEvents) && !(columnMapping[key] in displayedColumnsHeaders)) {
                        this.columns.push({columnDef: key, header: columnMapping[key], cell: key});
                        this.displayedColumnsEvents.push(key);
                        displayedColumnsHeaders.push(columnMapping[key]);
                    }

                }
            }

            for (const key of Object.keys(allAttributesTypes)) {
                if (key in columnMapping) {
                }
                else {
                    if (!(key in this.displayedColumnsEvents) && !(key in displayedColumnsHeaders)) {
                        if (!(key.startsWith("@@")) && !(key.startsWith("case:"))) {
                            this.columns.push({columnDef: key, header: key, cell: key});
                            this.displayedColumnsEvents.push(key);
                            displayedColumnsHeaders.push(key);
                        }
                    }
                }
            }

            console.log(this.columns);

            //this.displayedColumnsEvents = this.columns.map(x => x.columnDef);

            this.dataSourceEvents.data = this.events;
            this.caseIsSelected = true;
            console.log(this.events);

            this.dialog.closeAll();

        })
    }

    variantClicked(row) {
        this.variantSelected = row['variant'];
        this.getAllCases();
    }


}
