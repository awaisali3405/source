import {Component, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {Pm4pyService} from '../../pm4py-service.service';
import {AuthenticationServiceService} from '../../authentication-service.service';
import {HttpParams} from '@angular/common/http';
import {Router, RoutesRecognized} from '@angular/router';
import {WaitingCircleComponentComponent} from '../waiting-circle-component/waiting-circle-component.component';
import {MatDialog, MatMenuTrigger} from '@angular/material';
import {environment} from '../../../environments/environment';
import {PmtkBpmnVisualizerComponent} from '../pmtk-bpmn-visualizer/pmtk-bpmn-visualizer.component';
import {FilterServiceService} from '../../filter-service.service';
import {ActivityDashboardComponent} from '../activity-dashboard/activity-dashboard.component';

import { graphviz } from 'd3-graphviz';
import * as d3 from 'd3';

@Component({
    selector: 'app-pmodel',
    templateUrl: './pmodel.component.html',
    styleUrls: ['./pmodel.component.scss'],
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class PmodelComponent implements OnInit {
    @ViewChild(MatMenuTrigger) appMenu: MatMenuTrigger;

    processModelBase64Original: string;
    processModelDecodedSVG: string;
    processModelBase64Sanitized: SafeResourceUrl;
    pm4pyJson: JSON;
    thisProcessModel: string;
    thisSecondProcessModel : string;
    thisHandler: string;
    simplicity = -1.45;
    selectedSimplicity = -1.45;
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
    public enableProcessModelChoice : boolean = true;
    decoration = 'freq';
    typeOfModel = 'dfg';
    sanitizer: DomSanitizer;
    pm4pyService: Pm4pyService;
    authenticationService: AuthenticationServiceService;
    public isLoading: boolean;
    public enableDownloadModel: boolean = false;
    public enableConformanceChecking: boolean = false;
    public enableBpmnDownload : boolean = false;
    public dotProvided : boolean = false;
    public dotString : string;
    public activityKey : string;
    public targetClass : string;
    public startActivities : any;
    public endActivities : any;
    public isStartActivity : boolean;
    public isEndActivity : boolean;
    public overallEnableBPMN : boolean;
    public overallEnableAlignments : boolean;

    constructor(private _sanitizer: DomSanitizer, private pm4pyServ: Pm4pyService, private router: Router, private authService: AuthenticationServiceService, public dialog: MatDialog, private filterService: FilterServiceService) {
        /**
         * Constructor
         */

        this.sanitizer = _sanitizer;
        this.pm4pyService = pm4pyServ;
        this.authenticationService = authService;

        this.overallEnableBPMN = environment.overallEnableBPMN;
        this.overallEnableAlignments = environment.overallEnableAlignments;

        this.decoration = localStorage.getItem("preferred_decoration");
        if (this.decoration == null || typeof(this.decoration) == "undefined") {
            this.decoration = "freq";
        }

        this.typeOfModel = localStorage.getItem("preferred_type_of_model");
        if (this.typeOfModel == null || typeof(this.typeOfModel) == "undefined") {
            this.typeOfModel = "dfg";
        }

        if (localStorage.getItem("smartFiltering") === null) {
            localStorage.setItem("smartFiltering", "true");
        }

        if (localStorage.getItem("smartFiltering") === "false") {
            this.simplicity = -5.0;
            this.selectedSimplicity = -5.0;
        }

        this.enableProcessModelChoice = environment.overallEnableDifferentProcessSchemas;

        this.isStartActivity = false;
        this.isEndActivity = false;

        this.authenticationService.checkAuthentication().subscribe(data => {
            //console.log(data);
        });
        // calls the retrieval of the process schema from the service
        // this.populateProcessSchema();
        // this.getLogSummary();

        this.populateProcessSchema();
        this.getLogSummary();

        this.router.events.subscribe((next) => {
            if (next instanceof RoutesRecognized) {
                if (next.url.startsWith('/process')) {
                    this.populateProcessSchema();
                    this.getLogSummary();
                }
            }
        });
    }

    public populateProcessSchema() {
        /**
         * Retrieves and shows the process schema
         */
        this.isLoading = true;
        let params: HttpParams = new HttpParams();
        if (this.selectedSimplicity >= -4.99) {
            params = params.set('simplicity', Math.exp(this.selectedSimplicity).toString());
        }
        else {
            params = params.set('simplicity', "0.0");
        }
        params = params.set('decoration', this.decoration);
        params = params.set('typeOfModel', this.typeOfModel);

        localStorage.setItem('preferred_decoration', this.decoration);
        localStorage.setItem('preferred_type_of_model', this.typeOfModel);

        this.dialog.open(WaitingCircleComponentComponent);

        this.pm4pyService.getProcessSchema(params).subscribe(data => {
            this.pm4pyJson = data as JSON;
            this.processModelBase64Original = this.pm4pyJson['base64'];
            this.thisProcessModel = this.pm4pyJson['model'];
            this.thisSecondProcessModel = this.pm4pyJson['second_model'];
            this.activityKey = this.pm4pyJson['activity_key'];
            this.startActivities = this.pm4pyJson['start_activities'];
            this.endActivities = this.pm4pyJson['end_activities'];
            this.processModelDecodedSVG = "";

            localStorage.setItem("activityKey", this.activityKey);

            this.dotString = this.pm4pyJson['gviz_base64'];

            if (this.dotString == null || typeof(this.dotString) == "undefined") {
                this.dotString = "";
            }

            if (this.dotString.length > 0) {
                this.dotString = atob(this.dotString);
            }

            if (this.processModelBase64Original.length > 0) {
                this.processModelDecodedSVG = atob(this.processModelBase64Original);
            }



            this.thisHandler = this.pm4pyJson['handler'];
            this.enableDownloadModel = this.typeOfModel === 'inductive' || this.typeOfModel === 'indbpmn';
            this.enableBpmnDownload = this.typeOfModel === 'indbpmn';
            this.enableConformanceChecking = this.typeOfModel === 'inductive' && this.thisVariantsNumber <= environment.maxNoVariantsForAlignments;

            if (this.enableDownloadModel) {
                localStorage.setItem('process_model', this.thisProcessModel);
            }
            if (this.enableBpmnDownload) {
                localStorage.setItem('bpmn_model', this.thisSecondProcessModel);
            }

            if (this.dotString.length > 0) {
                this.dotProvided = true;

                let targetInnerWidth = window.innerWidth * 0.74;
                let targetInnerHeight = window.innerHeight * 0.66;

                let targetWidth = window.innerWidth * 0.76;
                let targetHeight = window.innerHeight * 0.68;

                let currentWidth = parseInt(this.processModelDecodedSVG.split("width=\"")[1].split("pt\"")[0]);
                let currentHeight = parseInt(this.processModelDecodedSVG.split("height=\"")[1].split("pt\"")[0]);

                let ratioWidth : number = targetInnerWidth / currentWidth;
                let ratioHeight : number = targetInnerHeight / currentHeight;

                let ratio : number = Math.min(ratioWidth, ratioHeight);

                let thisEl = graphviz('#dotProvidedDiv').width(targetWidth+'px').height(targetHeight+'px').renderDot(this.dotString);

                let dotProvidedDiv = document.getElementById("dotProvidedDiv");
                let svgDoc = dotProvidedDiv.childNodes;

                console.log(svgDoc);

                (<SVGSVGElement>svgDoc[0]).currentScale = ratio;

                svgDoc[0].addEventListener("click", (e: Event) => this.manageClickOnSvg(e));
            }
            else {
                this.dotProvided = false;

                document.getElementById("svgWithInnerHtml").innerHTML = this.processModelDecodedSVG;

                let svgWithInnerHtml = document.getElementById("svgWithInnerHtml");

                svgWithInnerHtml.addEventListener("click", (e: Event) => this.manageClickOnSvg(e));
            }

            this.isLoading = false;

            this.dialog.closeAll();
        });
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

    manageClickOnSvg(event) {
        console.log("event.target.nodeName");
        console.log(event.target.nodeName);

        if (event.target.nodeName == "text") {
            let thisText = event.target.innerHTML;

            if (thisText.length > 0 && !(thisText == "@@S") && !(thisText == "@@E")) {
                this.targetClass = this.removeAfterLastSpace(event.target.innerHTML);

                console.log(event.target);

                localStorage.setItem("targetClass", this.targetClass);

                this.isStartActivity = this.startActivities.includes(this.targetClass);
                this.isEndActivity = this.endActivities.includes(this.targetClass);

                var menu = document.getElementById('openMenuButton');
                menu.style.display = '';
                menu.style.position = 'fixed';
                menu.style.left = Math.floor(event.pageX) + 'px';
                menu.style.top = Math.floor(event.pageY) + 'px';

                this.appMenu.openMenu();
            }
        }
        else if (event.target.nodeName == "path") {
            console.log(event.target);
        }
    }

    onMenuClosed():void {
        var menu = document.getElementById('openMenuButton');
        if (menu) {
            menu.style.display = 'none';
        }
    }

    removeAfterLastSpace(oldString : string) {
        let newString = "";

        let oldStringSplit = oldString.split(" ");

        if (oldStringSplit.length > 0 && oldStringSplit[oldStringSplit.length - 1].length > 0 && oldStringSplit[oldStringSplit.length - 1][0] == '(') {
            let i = 0;
            while (i < oldStringSplit.length - 1) {
                newString = newString + oldStringSplit[i];

                if (i < (oldStringSplit.length - 2)) {
                    newString = newString + " ";
                }
                i++;
            }

            return newString;
        }

        return oldString;
    }

    ngOnInit() {
        /**
         * Method that is called at the initialization of the component
         */
    }

    onResize(event) {
        /**
         * Manages the resizing of a page
         */
    }

    sliderIsChanged(event: any) {
        /**
         * Manages the change to the value selected in the slider
         */
        this.selectedSimplicity = event.value;
        // calls the retrieval of the process schema from the service
        this.populateProcessSchema();
    }

    decorationIsChanged(event: any) {
        /**
         * Manages the change of the type of decoration (frequency/performance)
         */
        this.decoration = event.value;
        // calls the retrieval of the process schema from the service
        this.populateProcessSchema();
    }

    typeOfModelIsChanged(event: any) {
        /**
         * Manages the change on the type of the model (discovery algorithm)
         */
        this.typeOfModel = event.value;
        // calls the retrieval of the process schema from the service
        this.populateProcessSchema();
    }

    mouseWheel(event: any) {
        if (event['deltaY'] < 0) {
            (<HTMLImageElement>document.getElementById('imageProcessModelImage')).height = (<HTMLImageElement>document.getElementById('imageProcessModelImage')).height * 1.1;
            (<HTMLImageElement>document.getElementById('imageProcessModelImage')).width = (<HTMLImageElement>document.getElementById('imageProcessModelImage')).width * 1.1;
        } else {
            (<HTMLImageElement>document.getElementById('imageProcessModelImage')).height = (<HTMLImageElement>document.getElementById('imageProcessModelImage')).height * 0.9;
            (<HTMLImageElement>document.getElementById('imageProcessModelImage')).width = (<HTMLImageElement>document.getElementById('imageProcessModelImage')).width * 0.9;
        }
    }

    uploadFile($event) {
        let reader = new FileReader();
        let filename : string = $event.target.files[0].name;
        let filetype : string = $event.target.files[0].type;

        reader.readAsDataURL($event.target.files[0]);
        reader.onload = () => {
            let processModel: string = atob(reader.result.toString().split("ctet-stream;base64,")[1]);
            localStorage.setItem("process_model", processModel);
            this.router.navigateByUrl("/real-ws/alignments");
        };
    }

    downloadModel($event) {
        this.downloadFile(this.thisProcessModel, "text/csv");
    }

    downloadBpmnModel($event) {
        this.downloadFile(this.thisSecondProcessModel, "text/csv");
    }

    downloadFile(data: string, type: string) {
        const blob = new Blob([data], { type: type });
        const url= window.URL.createObjectURL(blob);
        window.open(url);
    }

    visualizeBpmnModel($event) {
        this.dialog.open(PmtkBpmnVisualizerComponent);
    }

    applyTracesContaining() {
        console.log("applyTracesContaining "+this.targetClass);

        this.filterService.addFilter("attributes_pos_trace", [this.activityKey, [this.targetClass]]);
    }

    applyTracesNotContaining() {
        console.log("applyTracesNotContaining "+this.targetClass);

        this.filterService.addFilter("attributes_neg_trace", [this.activityKey, [this.targetClass]]);

    }

    applyTracesStartingWith() {
        console.log("applyTracesStartingWith "+this.targetClass);

        this.filterService.addFilter("start_activities", [this.targetClass]);
    }

    applyTracesEndingWith() {
        console.log("applyTracesEndingWith "+this.targetClass);

        this.filterService.addFilter("end_activities", [this.targetClass]);
    }

    openActivityDashboard() {
        console.log("openActivityDashboard "+this.targetClass);

        this.dialog.open(ActivityDashboardComponent);
    }

    filterLoop() {
        console.log("filterLoop "+this.targetClass);

        this.filterService.addFilter("paths_pos_trace", [this.activityKey, [this.targetClass+"@@"+this.targetClass]]);
    }
}
