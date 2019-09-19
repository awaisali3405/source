import {Component, OnInit, ViewEncapsulation, Input, ElementRef, ViewChild, OnChanges} from '@angular/core';
import { Pm4pyService } from 'app/pm4py-service.service';
import * as d3 from 'd3';
export * from 'd3-scale';
import {MatChip, MatDialog} from '@angular/material';
import {WaitingCircleComponentComponent} from "../../waiting-circle-component/waiting-circle-component.component";
import {HttpParams} from "@angular/common/http";
import { colorRange, eventsColorMap } from "../variants-explorer-model";
import {AngularResizableDirective} from "angular2-draggable";

interface VariantsModel {
  caseDuration: any;
  count: number;
  variant: string;
  events: string[];
}

@Component({
  selector: 'app-graph-variant-traces',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './graph-variant-traces.component.html',
  styleUrls: ['./graph-variant-traces.component.scss'],
  // host: {
  //   '(window:resize)': 'onResize($event)'
  // }
})

export class GraphVariantTracesComponent implements OnChanges {
  // @ts-ignore
  @ViewChild('chart', {static: false})
  private chartContainer: ElementRef;

  @Input()
  variants: VariantsModel[];
  @Input()
  isVisibleLegend: boolean;
  @Input()
  isVisibleCaseEventsExplorer: boolean;

  @Input('cdkDragFreeDragPosition')
  freeDragPosition: { x: number; y: number; };

  public isLoading: boolean;
  public variantsLoading: boolean;
  public casesLoading: boolean;

  polygonDimensionWidth;
  polygonDimensionHeight;
  polygonDimensionSpacing;
  polygonDimensionTailWidth;

  public events: Set<string> = new Set();
  private eventsColorMapForHtml;

  private selectedVariants: string[];
  private prevSelectedVariantIndex: number = null;

  private pm4pyJsonCases;
  private allCases;
  public cases;

  chartWidth: number;
  dragPosition = {x: 0, y: 0};
  zIndex = { chartBox: 10, caseBox: 20, legendBox: 30};
  maxZIndex: number = 100;

  //initial position
  boxInfo: any[] = [
    { id: 'chartBox', x: 0, y: 0, width: 0, height: 0, zIndex: 10},
    { id: 'legendBox', x: 0, y: 0, width: 0, height: 0, zIndex: 30},
    { id: 'caseBox', x: 0, y: 0, width: 0, height: 0, zIndex: 20}
  ];

  constructor(
      private pm4pyService: Pm4pyService,
      private dialog: MatDialog) {
    this.isLoading = false;
    this.variantsLoading = false;
    this.casesLoading = false;
  }

  ngOnChanges(): void {
    console.log('graph-traces: onChanges');
    if (!this.variants) { return; }
    this.selectedVariants = [];
    this.setColorMap();
    this.setPolygonDimension(25, 30, 3, 10);
    this.createChart();
    this.getAllCases();
    this.getInitialInfoOfBoxes();
  }

  private getInitialInfoOfBoxes() {
    this.boxInfo.forEach((box) => {
      var boxFromHtml = document.getElementById(box.id);
      box.x = boxFromHtml.offsetLeft;
      box.y = boxFromHtml.offsetTop;
      box.width = boxFromHtml.offsetWidth;
      box.height = boxFromHtml.offsetHeight;
    });
  }

  private setColorMap(): void {
    console.log(this.variants);
    for (let i = 0; i < this.variants.length; i++) {
      for ( let j = 0; j < this.variants[i].events.length; j++) {
        this.events.add(this.variants[i].events[j].split('+')[0]);
      }
    }

    const colors = d3.scaleOrdinal()
        .domain([0, this.events.size])
        .range(colorRange);

    let count = 0;
    this.events.forEach( (event) => {
      eventsColorMap.set(event, colors(count));
      count++;
    });
    this.eventsColorMapForHtml = eventsColorMap;
  }

  private createChart(): void {
    d3.select('#chart').select('svg').remove();
    const element = this.chartContainer.nativeElement;
    const data = this.variants;

    // set chart width
    var maxLength = 0;
    data.forEach( (variant) => {
      if (variant.events.length > maxLength) maxLength = variant.events.length;
    });
    this.chartWidth = 55 * maxLength + 100;


    const chartDiv = d3.select(element).append('div').append('svg')
        .attr('width', this.chartWidth)
        .attr('height', data.length * 50);
    const g = chartDiv.selectAll('g')
        .data(data)
        .enter()
        .append('svg:g')
        .attr('width', (d) => (this.polygonDimensionWidth + this.polygonDimensionTailWidth) * d.events.length)
        .attr('height', 50)
        .attr('transform', (d, i) => 'translate(0, ' + i * 50 + ')')
        .on('click', (d, i) => {
          if (this.selectedVariants.includes(d.variant)) { // click already selected variants
            let removeIndex: number = this.selectedVariants.indexOf(d.variant);
            this.selectedVariants.splice(removeIndex, 1);
            this.foldingTrace(d, i);                // folding trace graph
            this.removeCases();                     // reset case table
            this.prevSelectedVariantIndex = i;      // set prev index
          } else {
            if (d3.event.ctrlKey || d3.event.metaKey) {   // ctrl or command + click

            }
             else {
              for (let j=0; j<data.length; j++) {   // single select -> all other selected trace should be folded.
                this.foldingTrace(d, j);
              }
              this.selectedVariants = [];
              this.removeCases();
            }
            this.selectedVariants.push(d.variant); // add variant to the array of selected variants
            this.expandingTrace(d, i);
            this.getAllCases(this.variants[i]['variant']);
            this.prevSelectedVariantIndex = i;
            //console.log("selected variants: " + this.selectedVariants);
          }
              // if (i == this.prevSelectedVariantIndex) {
              //   if (this.selectedVariants.includes(d.variants)) {
              //     this.foldingTrace(d, i);
              //     this.removeCases();
              //     this.selectedVariants[i] = false;
              //   }
              //   else {
              //     this.expandingTrace(d, i);
              //     this.getAllCases(this.variants[i]['variant']);
              //     this.prevSelectedVariantIndex = i;
              //     this.selectedVariants[i] = true;
              //   }
              // } else { // click different trace
              //   if (d3.event.ctrlKey || d3.event.metaKey) { // press ctrl or command key
              //
              //   } else {
              //     for (let j = 0; j<this.selectedVariants.length; j++) {
              //       if (this.selectedVariants[j]) {
              //         this.foldingTrace(d, j);
              //         this.removeCases();
              //         this.selectedVariants[j] = false;
              //       }
              //     }
              //   }
              //   this.expandingTrace(d, i);
              //   this.getAllCases(this.variants[i]['variant']);
              //   this.prevSelectedVariantIndex = i;
              //   this.selectedVariants[i] = true;
              // }
            }
        );

    const polygon = g.selectAll('polygon')
        .data((d) => d.events)
        .enter()
        .append('svg:polygon')
        .attr('points', (d, i) => this.getTracePoints(i))
        .style('fill', (d, i) => eventsColorMap.get(d.split('+')[0]))
        .attr('transform', (d, i) => 'translate(' + i * (this.polygonDimensionWidth + this.polygonDimensionSpacing) + ', 0)');
  }

  private setPolygonDimension(w, h, s, tw): void {
    this.polygonDimensionWidth = w;
    this.polygonDimensionHeight = h;
    this.polygonDimensionSpacing = s;
    this.polygonDimensionTailWidth = tw;
  }

  private getTracePoints(i) {
    const points = [];
    points.push('0,0');
    points.push(this.polygonDimensionWidth + ',0');
    points.push(this.polygonDimensionWidth + this.polygonDimensionTailWidth + ',' + (this.polygonDimensionHeight / 2));
    points.push(this.polygonDimensionWidth + ',' + this.polygonDimensionHeight);
    points.push('0,' + this.polygonDimensionHeight);
    if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
      points.push(this.polygonDimensionTailWidth + ',' + (this.polygonDimensionHeight / 2));
    }
    return points.join(' ');
  }

  private foldingTrace(d, i) {
    this.setPolygonDimension(25, 30, 3, 10);
    const prev_g = d3.selectAll('g').filter((d, j) => j === i);
    prev_g.selectAll('polygon').remove();
    prev_g.selectAll('polygon')
        .data((d) => d.events)
        .enter()
        .append('svg:polygon')
        .attr('points', (d, i) => this.getTracePoints(i))
        .style('fill', (d, i) => eventsColorMap.get(d.split('+')[0]))
        .attr('transform', (d, i) => 'translate(' + i * (this.polygonDimensionWidth + this.polygonDimensionSpacing) + ', 0)');
    prev_g.selectAll('text').remove();
  }

  private expandingTrace(d, i) {
    this.setPolygonDimension(55, 30, 3, 10);
    const g = d3.selectAll('g').filter((d, j) => j === i);
    g.selectAll('polygon').remove();
    g.selectAll('polygon')
        .data((d) => d.events)
        .enter()
        .append('svg:polygon')
        .attr('points', (d, i) => this.getTracePoints(i))
        .style('fill', (d, i) => eventsColorMap.get(d.split('+')[0]))
        .attr('transform', (d, i) => 'translate(' + i * (this.polygonDimensionWidth + this.polygonDimensionSpacing) + ', 0)');
    const text = g.selectAll('text')
        .data(d => d.events)
        .enter()
        .append('text')
        .attr('x', 15)
        .attr('y', 15)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'start')
        .text((d) => d)
        .each(this.wrappingText)
        .attr('transform', (d, i) => 'translate(' + i * (this.polygonDimensionWidth + this.polygonDimensionSpacing) + ', 0)');
  }

  private wrappingText() {
    var self = d3.select(this),
        textLength = self.node().getComputedTextLength(),
        text = self.text();
    console.log('self: '+self+", text"+text, ", textlength: " + textLength);
    while (textLength > 35 && text.length > 0) {
      text = text.slice(0, -1);
      self.text(text);
      textLength = self.node().getComputedTextLength();
    }
    self.text(text + '...');
  }

  getAllCases(variant?: string) {
    this.dialog.open(WaitingCircleComponentComponent);

    //console.log("selected variants: " + variant);
    this.casesLoading = true;
    this.isLoading = this.variantsLoading || this.casesLoading;
    let params: HttpParams = new HttpParams();

    if (variant != null) {
      params = params.set('variant', variant);
    }

    this.pm4pyService.getAllCases(params).subscribe(data => {
      this.pm4pyJsonCases = data as JSON;
      this.cases = this.pm4pyJsonCases['cases'];
      this.casesLoading = false;
      this.isLoading = this.variantsLoading || this.casesLoading;

      if (variant == null) {
        this.allCases = this.cases;
      }
      if (this.isLoading === false) {
        this.dialog.closeAll();
      }
    })
  }

  private removeCases() {
    this.cases = this.allCases;
  }

  resetBox(boxId) {
    console.log("resetBox");
    // this.boxInfo.forEach( (box) => {
    //   if (box.id === boxId) {
    //     console.log(boxId);
    //     var element = document.getElementById(boxId);
    //     element.setAttribute('style', 'position: absolute; ' +
    //         'top: ' + box.top+'; ' +
    //         'left: ' + box.left + '; ' +
    //         'width: ' + box.width + '; ' +
    //         'height: ' + box.height +';' );
        // element.style.position = 'absolute';
        // element.style.top = box.top;
        // element.style.left = box.left;
        // element.style.width = box.width;
        // element.style.height = box.height;
    //   }
    // });

    // var movableBox = event.source.parentElement;
    // console.log(movableBox.id);
    // movableBox.setAttribute("cdkDragFreeDragPosition", '{x: 0, y: 0}');
  }

  dragStarted(dragEvent) {
    //console.log("drag started");
    dragEvent.source.getRootElement().style.zIndex = this.maxZIndex;
  }

  dragEnded(dragEvent) {
    var dragElement = dragEvent.source.getRootElement();
    //console.log(dragElement.id + " ended");
    if (dragElement.id === "legendBox") { dragElement.style.zIndex = this.zIndex.legendBox; }
    else if (dragElement.id === "chartBox") { dragElement.style.zIndex = this.zIndex.chartBox; }
    else if (dragElement.id === "caseBox") { dragElement.style.zIndex = this.zIndex.caseBox; }
  }


}

