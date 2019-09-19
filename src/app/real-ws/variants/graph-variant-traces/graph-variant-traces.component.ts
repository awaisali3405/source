import {Component, ViewEncapsulation, Input, ElementRef, ViewChild, OnChanges} from '@angular/core';
import { Pm4pyService } from 'app/pm4py-service.service';
import * as d3 from 'd3';
export * from 'd3-scale';
import { MatDialog } from '@angular/material';
import { WaitingCircleComponentComponent } from "../../waiting-circle-component/waiting-circle-component.component";
import { HttpParams } from "@angular/common/http";
import { colorRange, eventsColorMap } from "../variants-explorer-model";

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

  public polygonFoldingWidth: number = 25;
  polygonDimensionWidth: number = 0;
  polygonDimensionHeight: number = 30;
  polygonDimensionSpacing: number = 3;
  polygonDimensionTailWidth: number = 10;

  public events: Set<string> = new Set();
  private eventsColorMapForHtml;

  private selectedVariants: string[];
  private prevSelectedVariantIndex: number = null;

  private pm4pyJsonCases;
  private allCases;
  public cases;

  chartWidth: number;
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
    this.setPolygonDimensionWidth(this.polygonFoldingWidth);
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
    var maxCountOfEvents = 0, maxLengthOfEventName = 0;
    data.forEach( (variant) => {
      if (variant.events.length > maxCountOfEvents) {
          maxCountOfEvents = variant.events.length;
          maxLengthOfEventName = this.measureStringOnCanvas(this.getEventNameOfMaxLength(variant.events));
      }
    });
    this.chartWidth = (maxLengthOfEventName) * maxCountOfEvents;
    console.log(this.chartWidth);

    const chartDiv = d3.select(element).append('div').append('svg')
        .attr('width', this.chartWidth)
        .attr('height', data.length * 70);
    const g = chartDiv.selectAll('g')
        .data(data)
        .enter()
        .append('svg:g')
        .attr('width', (d) => (this.polygonDimensionWidth + this.polygonDimensionTailWidth) * d.events.length)
        .attr('height', 50)
        .attr('transform', (d, i) => 'translate(0, ' + (i * 50 + 20) + ')')
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
          }
        });

    g.selectAll('polygon')
        .data((d) => d.events)
        .enter()
        .append('svg:polygon')
        .attr('points', (d, i) => this.getTracePoints(i))
        .style('fill', (d, i) => eventsColorMap.get(d.split('+')[0]))
        .attr('transform', (d, i) => 'translate(' + i * (this.polygonDimensionWidth + this.polygonDimensionSpacing) + ', 0)')
        .on('mouseover', this.mouseOverPolygon)
        .on('mouseout', this.mouseOutPolygon);
    g.selectAll('text')
        .data(d => d.events)
        .enter()
        .append('text')
        .attr('x', 0)
        .attr('y', 15)
        .attr('dy', '-1.8em')
        .attr('text-anchor', 'start')
        .text((d) => d)
        .attr('transform', (d, i) => 'translate(' + i * (this.polygonDimensionWidth + this.polygonDimensionSpacing) + ', 0)')
        .attr('visibility', 'hidden')
        .style('fill', '#000');
  }

  private mouseOverPolygon(d, i) {
      var parentNode = d3.select(this).node().parentNode;
    d3.select(parentNode).selectAll('text').filter((d, j) => j === i)
        .attr('visibility', 'visible');
  }

  private mouseOutPolygon(d, i) {
      var parentNode = d3.select(this).node().parentNode;
      d3.select(parentNode).selectAll('text').filter((d, j) => j === i)
          .attr('visibility', 'hidden');
  }

  private setPolygonDimensionWidth(w): void {
    this.polygonDimensionWidth = w;
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
    this.setPolygonDimensionWidth(this.polygonFoldingWidth);
    const prev_g = d3.selectAll('g').filter((d, j) => j === i);
    prev_g.selectAll('polygon').remove();
    prev_g.selectAll('polygon')
        .data((d) => d.events)
        .enter()
        .append('svg:polygon')
        .attr('points', (d, i) => this.getTracePoints(i))
        .style('fill', (d, i) => eventsColorMap.get(d.split('+')[0]))
        .attr('transform', (d, i) => 'translate(' + i * (this.polygonDimensionWidth + this.polygonDimensionSpacing) + ', 0)')
        .on('mouseover', this.mouseOverPolygon)
        .on('mouseout', this.mouseOutPolygon);
    prev_g.selectAll('text').remove();
    prev_g.selectAll('text')
        .data(d => d.events)
        .enter()
        .append('text')
        .attr('x', 0)
        .attr('y', 15)
        .attr('dy', '-1.8em')
        .attr('text-anchor', 'start')
        .text((d) => d)
        .attr('transform', (d, i) => 'translate(' + i * (this.polygonDimensionWidth + this.polygonDimensionSpacing) + ', 0)')
        .attr('visibility', 'hidden')
        .style('fill', '#000');
  }

  private expandingTrace(d, i) {
    var positionX = 0;
    const g = d3.selectAll('g').filter((d, j) => j === i);
    g.selectAll('polygon').remove();
    g.selectAll('text').remove();

    g.selectAll('polygon')
        .data((d) => d.events)
        .enter()
        .append('svg:polygon')
        .style('fill', (d, i) => eventsColorMap.get(d.split('+')[0]))
        .each((d, i) => {
            if (i > 0) {
                positionX = positionX + this.polygonDimensionWidth + this.polygonDimensionSpacing
            }
            this.setPolygonWidthByLengthOfEvent(d);
            g.selectAll('polygon').filter((d, j) => j === i)
                .attr('points',this.getTracePoints(i))
                .attr('transform', 'translate(' + positionX + ', 0)');
        });

    positionX = 0;
    g.selectAll('text')
        .data(d => d.events)
        .enter()
        .append('text')
        .attr('x', 15)
        .attr('y', 15)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'start')
        .text((d) => d)
        .each((d, i) => {
            if (i > 0) {
                positionX = positionX + this.polygonDimensionWidth + this.polygonDimensionSpacing
            }
            this.setPolygonWidthByLengthOfEvent(d);
            g.selectAll('text').filter((d, j) => j === i)
                .attr('transform', 'translate(' + positionX + ', 0)');
        });
  }

  private setPolygonWidthByLengthOfEvent(event: string) {
      const width = this.measureStringOnCanvas(event);
      this.setPolygonDimensionWidth(width + 15);
  }

  private measureStringOnCanvas(str: string): number {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext("2d");
      ctx.font = "0.8rem Rubik";
      return Math.round(ctx.measureText(str).width);
  }

  private getEventNameOfMaxLength(events: string[]): string {
      var max = 0;
      var maxEvent: string = events[0];
      events.forEach((event) => {
          if (event.length > max) {
              max = event.length;
              maxEvent = event;
          }
      });
      return maxEvent;
  }

  getAllCases(variant?: string) {
    this.dialog.open(WaitingCircleComponentComponent);
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

  dragStarted(dragEvent) {
    dragEvent.source.getRootElement().style.zIndex = this.maxZIndex;
  }

  dragEnded(dragEvent) {
    var dragElement = dragEvent.source.getRootElement();
    if (dragElement.id === "legendBox") { dragElement.style.zIndex = this.zIndex.legendBox; }
    else if (dragElement.id === "chartBox") { dragElement.style.zIndex = this.zIndex.chartBox; }
    else if (dragElement.id === "caseBox") { dragElement.style.zIndex = this.zIndex.caseBox; }
  }


}

