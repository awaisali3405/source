import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatCheckboxModule, MatSliderModule} from '@angular/material';
import {MatToolbarModule} from '@angular/material';
import {MatProgressBarModule} from '@angular/material';
import {MatButtonModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material';
import {MatOptionModule} from '@angular/material';
import {MatSelectModule} from '@angular/material';
import {MatRadioModule} from '@angular/material';
import {MatListModule} from '@angular/material';
import {MatProgressSpinnerModule} from '@angular/material';
import {MatMenuModule} from '@angular/material';
import {MatIconModule} from '@angular/material';
import {MatTableModule} from '@angular/material';
import {MatSortModule} from '@angular/material';
import {MatTabsModule} from '@angular/material';
import {MatCardModule} from '@angular/material';
import {MatDialogModule} from '@angular/material';
import {MatInputModule} from '@angular/material';
import {MatChipsModule} from '@angular/material';
import {FormsModule} from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppRoutingModule} from './app-routing.module';
import {SharedModule} from './shared/shared.module';
import {ToastrModule} from 'ngx-toastr';
import {AgmCoreModule} from '@agm/core';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {StoreModule} from '@ngrx/store';

import {
    PerfectScrollbarModule,
    PERFECT_SCROLLBAR_CONFIG,
    PerfectScrollbarConfigInterface
} from 'ngx-perfect-scrollbar';

import {AppComponent} from './app.component';
import {ContentLayoutComponent} from './layouts/content/content-layout.component';
import {FullLayoutComponent} from './layouts/full/full-layout.component';

import {DragulaService} from 'ng2-dragula';
import {AuthService} from './shared/auth/auth.service';
import {AuthGuard} from './shared/auth/auth-guard.service';

import {StartActivitiesFilterComponent} from './real-ws/start-activities-filter/start-activities-filter.component';
import {EndActivitiesFilterComponent} from './real-ws/end-activities-filter/end-activities-filter.component';
import {VariantsFilterComponent} from './real-ws/variants-filter/variants-filter.component';
import {AttributesFilterComponent} from './real-ws/attributes-filter/attributes-filter.component';
import {PerformanceFilterComponent} from './real-ws/performance-filter/performance-filter.component';
import {TimeframeFilterComponent} from './real-ws/timeframe-filter/timeframe-filter.component';

import {NumericAttributeFilterComponent} from './real-ws/numeric-attribute-filter/numeric-attribute-filter.component';
import {WaitingCircleComponentComponent} from './real-ws/waiting-circle-component/waiting-circle-component.component';
import {AlignmentsComponent} from './real-ws/alignments/alignments.component';
import {PmtkBpmnVisualizerComponent} from './real-ws/pmtk-bpmn-visualizer/pmtk-bpmn-visualizer.component';
import {LogSharingComponent} from './real-ws/log-sharing/log-sharing.component';
import {PathsFilterComponent} from './real-ws/paths-filter/paths-filter.component';
import {ActivityDashboardComponent} from './real-ws/activity-dashboard/activity-dashboard.component';
import {PrivacyMasterComponent} from './real-ws/privacy-master/privacy-master.component';
import {PrivacyRolesComponent} from './real-ws/privacy-roles/privacy-roles.component';
import { DragDropModule } from "@angular/cdk/drag-drop";
import {AngularDraggableModule} from "angular2-draggable";

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
    wheelPropagation: false
};

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [AppComponent, FullLayoutComponent, ContentLayoutComponent, StartActivitiesFilterComponent, EndActivitiesFilterComponent, VariantsFilterComponent, AttributesFilterComponent, PerformanceFilterComponent, TimeframeFilterComponent, NumericAttributeFilterComponent, WaitingCircleComponentComponent, PmtkBpmnVisualizerComponent, LogSharingComponent, PathsFilterComponent, ActivityDashboardComponent, PrivacyRolesComponent],
    imports: [
        BrowserAnimationsModule,
        StoreModule.forRoot({}),
        AppRoutingModule,
        SharedModule,
        HttpClientModule,
        MatSliderModule,
        MatToolbarModule,
        MatProgressBarModule,
        MatButtonModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        MatRadioModule,
        MatDialogModule,
        MatListModule,
        MatMenuModule,
        MatTableModule,
        MatIconModule,
        MatTabsModule,
        MatSortModule,
        MatCardModule,
        MatChipsModule,
        MatCheckboxModule,
        MatInputModule,
        FormsModule,
        MatProgressSpinnerModule,
        ToastrModule.forRoot(),
        NgbModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyCERobClkCv1U4mDijGm1FShKva_nxsGJY'
        }),
        PerfectScrollbarModule,
        DragDropModule,
        AngularDraggableModule,
        PlotlyModule
    ],
    entryComponents: [
        StartActivitiesFilterComponent, EndActivitiesFilterComponent, VariantsFilterComponent, AttributesFilterComponent, PerformanceFilterComponent, TimeframeFilterComponent, NumericAttributeFilterComponent, WaitingCircleComponentComponent, PmtkBpmnVisualizerComponent, LogSharingComponent, PathsFilterComponent, ActivityDashboardComponent, PrivacyRolesComponent
    ],
    providers: [
        AuthService,
        AuthGuard,
        DragulaService,
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        {provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
