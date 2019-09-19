import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartistModule } from 'ng-chartist';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PmodelComponent } from './pmodel/pmodel.component';
import { RealWsRoutingModule } from './real-ws-routing.module';
import {
    MatButtonModule, MatCardModule, MatChipsModule, MatDialogModule,
    MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule,
    MatOptionModule, MatPaginator, MatDividerModule, MatGridListModule,
    MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule,
    MatSliderModule, MatSortModule, MatTableModule, MatTabsModule, MatPaginatorModule,
    MatToolbarModule, MatSidenavModule, MatCheckboxModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import { CasesComponent } from './cases/cases.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { LoginComponentComponent } from './login-component/login-component.component';
import { PlistComponent } from './plist/plist.component';
import { SnaComponent } from './sna/sna.component';
import { TransientComponent } from './transient/transient.component';
import { AlignmentsComponent } from './alignments/alignments.component';
import { PathsFilterComponent } from './paths-filter/paths-filter.component';
import { ActivityDashboardComponent } from './activity-dashboard/activity-dashboard.component';
import { VariantsExplorerComponent } from './variants/variants-explorer/variants-explorer.component';
import { GraphVariantTracesComponent } from './variants/graph-variant-traces/graph-variant-traces.component';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { GraphCasesComponent } from './variants/graph-cases/graph-cases.component';
import {AngularDraggableModule} from "angular2-draggable";
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;
import {ScrollingModule} from '@angular/cdk/scrolling';

import { DottedchartComponent } from './dottedchart/dottedchart.component';

@NgModule({
  declarations: [PmodelComponent, CasesComponent, StatisticsComponent, LoginComponentComponent, PlistComponent, SnaComponent, TransientComponent, AlignmentsComponent, VariantsExplorerComponent, GraphVariantTracesComponent, GraphCasesComponent, DottedchartComponent],
    imports: [
        CommonModule,
        RealWsRoutingModule,
        ChartistModule,
        NgbModule,
        MatSliderModule,
        MatToolbarModule,
        MatProgressBarModule,
        MatButtonModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        MatRadioModule,
        MatDialogModule,
        MatDividerModule,
        MatListModule,
        MatMenuModule,
        MatTableModule,
        MatIconModule,
        MatTabsModule,
        MatSortModule,
        MatCardModule,
        MatChipsModule,
        MatInputModule,
        MatSidenavModule,
        MatGridListModule,
        FormsModule,
        MatProgressSpinnerModule,
        DragDropModule,
        MatPaginatorModule,
        AngularDraggableModule,
        PlotlyModule,
        ScrollingModule,
        MatCheckboxModule
    ],
})
export class RealWsModule { }
