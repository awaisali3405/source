import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartistModule } from 'ng-chartist';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PmodelComponent } from './pmodel/pmodel.component';
import { RealWsRoutingModule } from './real-ws-routing.module';
import {
  MatButtonModule, MatCardModule, MatChipsModule, MatDialogModule,
  MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule,
  MatOptionModule,
  MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule,
  MatSliderModule, MatSortModule, MatTableModule, MatTabsModule,
  MatToolbarModule
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
import { PrivacyMasterComponent } from './privacy-master/privacy-master.component';
import { PrivacyRolesComponent } from './privacy-roles/privacy-roles.component';

@NgModule({
  declarations: [PmodelComponent, CasesComponent, StatisticsComponent, LoginComponentComponent, PlistComponent, SnaComponent, TransientComponent, AlignmentsComponent, PrivacyMasterComponent],
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
    MatListModule,
    MatMenuModule,
    MatTableModule,
    MatIconModule,
    MatTabsModule,
    MatSortModule,
    MatCardModule,
    MatChipsModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinnerModule,
  ]
})
export class RealWsModule { }
