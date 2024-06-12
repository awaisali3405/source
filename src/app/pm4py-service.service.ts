import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Pm4pyService {
  webservicePath: string;

  constructor(private http: HttpClient) {
    /**
     * Constructor: initialize the web service path
     */
    this.webservicePath = environment.webServicePath;
  }

  newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  getProcessSchema(parameters: HttpParams) {
    /**
     * Gets the process schema (with the provided parameters)
     *
     * Parameters:
     * parameters: HttpParams -> Parameters to pass in GET to the service
     *
     * Returns:
     * observer object
     */
    let process = localStorage.getItem("process");
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("process", process);
    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl : string = this.webservicePath + "getProcessSchema";

    return this.http.get(completeUrl,{params: parameters});
  }

  getEventsPerTime(parameters: HttpParams) {
    /**
     * Gets the events per time graph
     *
     * Parameters:
     * parameters: HttpParams -> Parameters to pass in GET to the service
     *
     * Returns:
     * observer object
     */
    let process = localStorage.getItem("process");
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("process", process);
    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl : string = this.webservicePath + "getEventsPerTimeGraph";

    return this.http.get(completeUrl,{params: parameters});
  }

  getCaseDurationGraph(parameters: HttpParams) {
    /**
     * Gets the case duration graph
     *
     * Parameters:
     * parameters: HttpParams -> Parameters to pass in GET to the service
     *
     * Returns:
     * observer object
     */
    let process = localStorage.getItem("process");
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("process", process);
    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl : string = this.webservicePath + "getCaseDurationGraph";

    return this.http.get(completeUrl, {params: parameters});
  }

  getLogsList(parameters : HttpParams) {
    /**
     * Gets the list of logs loaded in the service
     *
     * Parameters:
     * parameters: HttpParams -> Parameters to pass in GET to the service
     *
     * Returns:
     * observer object
     */
    var completeUrl : string = this.webservicePath + "getLogsList";

    let sessionId = localStorage.getItem("sessionId");
    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    return this.http.get(completeUrl, {params: parameters});
  }

  getLogsListAdvanced(parameters : HttpParams) {
    /**
     * Gets the list of logs loaded in the service
     *
     * Parameters:
     * parameters: HttpParams -> Parameters to pass in GET to the service
     *
     * Returns:
     * observer object
     */
    var completeUrl : string = this.webservicePath + "getLogsListAdvanced";

    let sessionId = localStorage.getItem("sessionId");
    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    return this.http.get(completeUrl, {params: parameters});
  }

  transientAnalysis(parameters : HttpParams) {
    /**
     * Perform transient analysis of the given process
     *
     * Parameters:
     * parameters: HttpParams -> Parameters to pass in GET to the service
     *
     * Returns:
     * observer object
     */
    let process = localStorage.getItem("process");
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("process", process);
    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl : string = this.webservicePath + "transientAnalysis";

    return this.http.get(completeUrl, {params: parameters});
  }

  getNumericAttributeGraph(parameters : HttpParams) {
    /**
     * Get the numreic attribute graph
     *
     * parameters:
     * parameters: HttpParams -> Parameters to pass in GET to the service
     *
     * Returns:
     * observers object
     */
    let process = localStorage.getItem("process");
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("process", process);
    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl : string = this.webservicePath + "getNumericAttributeGraph";

    return this.http.get(completeUrl, {params: parameters});
  }

  getAllVariants(parameters : HttpParams) {
    /**
     * Gets all the variants from the given log
     *
     * Parameters:
     * parameters: HttpParams -> Parameters to pass in GET to the service
     *
     * Returns:
     * observer object
     */
    let process = localStorage.getItem("process");
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("process", process);
    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl : string = this.webservicePath + "getAllVariants";

    return this.http.get(completeUrl, {params: parameters});
  }

  getAllCases(parameters : HttpParams) {
    /**
     * Gets all the cases from the given log
     *
     * Parameters:
     * parameters: HttpParams -> Parameters to pass in GET to the service
     *
     * Returns:
     * observer object
     */
    let process = localStorage.getItem("process");
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("process", process);
    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl : string = this.webservicePath + "getAllCases";

    return this.http.get(completeUrl, {params: parameters});
  }

  getEvents(parameters : HttpParams) {
    /**
     * Gets all the events of a case in the given log
     *
     * Parameters:
     * parameters: HttpParams -> Parameters to pass in GET to the service
     *
     * Returns:
     * observer object
     */
    let process = localStorage.getItem("process");
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("process", process);
    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl : string = this.webservicePath + "getEvents";

    return this.http.get(completeUrl, {params: parameters});
  }

  getLogSummary(parameters : HttpParams) {
    /**
     * Gets the log summary
     *
     * Parameters:
     * parameters: HttpParams -> Parameters to pass in GET to the service
     *
     * Returns:
     * observer object
     */
    let process = localStorage.getItem("process");
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("process", process);
    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl : string = this.webservicePath + "getLogSummary";

    return this.http.get(completeUrl, {params: parameters});
  }

  getServicePath() {
    /**
     * Gets the service path
     *
     * Returns:
     * service path
     */
    return this.webservicePath;
  }

  getAlignmentsVisualizations(model : string, parameters : HttpParams) {
    let process = localStorage.getItem("process");
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("process", process);
    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl : string = this.webservicePath + "getAlignmentsVisualizations";

    return this.http.post(completeUrl, {"model": model}, {params: parameters});
  }

  downloadCsvLog(parameters : HttpParams) {
    let process = localStorage.getItem("process");
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("process", process);
    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl : string = this.webservicePath + "downloadCsvLog";

    return this.http.get(completeUrl, {params: parameters});
  }

  downloadXesLog(parameters : HttpParams) {
    let process = localStorage.getItem("process");
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("process", process);
    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl : string = this.webservicePath + "downloadXesLog";

    return this.http.get(completeUrl, {params: parameters});
  }

  uploadLog(data : FormData) {
    let sessionId = localStorage.getItem('sessionId');
  const params = new HttpParams()
    .set('session', sessionId)
    .set('uniqueCallId', this.newGuid());

  const completeUrl: string = this.webservicePath + 'uploadLog';
        console.log(data);
        console.log(params);
  return this.http.post(completeUrl, data, { params });
  }

  loginService(username : string, password : string) {
    var completeUrl : string = this.webservicePath + "loginService";

    let httpParams : HttpParams = new HttpParams();
    httpParams = httpParams.set("user", username);
    httpParams = httpParams.set("password", password);
    httpParams = httpParams.set("uniqueCallId", this.newGuid());

    return this.http.get(completeUrl, {params: httpParams});
  }

  getStartActivities(parameters : HttpParams) {
    let process = localStorage.getItem("process");
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("process", process);
    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl : string = this.webservicePath + "getStartActivities";

    return this.http.get(completeUrl, {params: parameters});
  }

  getEndActivities(parameters : HttpParams) {
    let process = localStorage.getItem("process");
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("process", process);
    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl : string = this.webservicePath + "getEndActivities";

    return this.http.get(completeUrl, {params: parameters});
  }

  getAttributesList(parameters : HttpParams) {
    let process = localStorage.getItem("process");
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("process", process);
    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl : string = this.webservicePath + "getAttributesList";

    return this.http.get(completeUrl, {params: parameters});
  }

  getTraceAttributes(parameters : HttpParams) {
    let process = localStorage.getItem("process");
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("process", process);
    parameters = parameters.set("session", sessionId);

    var completeUrl : string = this.webservicePath + "getTraceAttributes";

    return this.http.get(completeUrl, {params: parameters});
  }

  getAttributeValues(attributeKey : string, parameters : HttpParams) {
    let process = localStorage.getItem("process");
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("process", process);
    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("attribute_key", attributeKey);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl: string = this.webservicePath + "getAttributeValues";

    return this.http.get(completeUrl, {params: parameters});
  }

  getPaths(attributeKey : string, parameters : HttpParams) {
    let process = localStorage.getItem("process");
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("process", process);
    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("attribute_key", attributeKey);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl: string = this.webservicePath + "getAllPaths";

    return this.http.get(completeUrl, {params: parameters});
  }

  getUserLogVisibilities(parameters : HttpParams) {
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl: string = this.webservicePath + "getUserEventLogVisibility";

    return this.http.get(completeUrl, {params: parameters});
  }

  addUserLogVisibility(parameters : HttpParams) {
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl: string = this.webservicePath + "addUserLogVisibility";

    return this.http.get(completeUrl, {params: parameters});
  }

  removeUserLogVisibility(parameters : HttpParams) {
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl: string = this.webservicePath + "removeUserLogVisibility";

    return this.http.get(completeUrl, {params: parameters});
  }

  addUserLogDownloadable(parameters : HttpParams) {
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl: string = this.webservicePath + "addUserLogDownloadable";

    return this.http.get(completeUrl, {params: parameters});
  }

  removeUserLogDownloadable(parameters : HttpParams) {
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl: string = this.webservicePath + "removeUserLogDownloadable";

    return this.http.get(completeUrl, {params: parameters});
  }

  addUserLogRemovable(parameters : HttpParams) {
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl: string = this.webservicePath + "addUserLogRemovable";

    return this.http.get(completeUrl, {params: parameters});
  }

  removeUserLogRemovable(parameters : HttpParams) {
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl: string = this.webservicePath + "removeUserLogRemovable";

    return this.http.get(completeUrl, {params: parameters});
  }

  deleteEventLog(parameters : HttpParams) {
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl: string = this.webservicePath + "deleteEventLog";

    return this.http.get(completeUrl, {params: parameters});
  }

  privacyTlkc(parameters : HttpParams) {
    let sessionId = localStorage.getItem("sessionId");
    let process = localStorage.getItem("process");

    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("process", process);

    var completeUrl: string = this.webservicePath + "privacyTklc";

    return this.http.get(completeUrl, {params: parameters});
  }

  rolesPrivacyAware(parameters : HttpParams) {
    let sessionId = localStorage.getItem("sessionId");
    let process = localStorage.getItem("process");

    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("process", process);

    var completeUrl: string = this.webservicePath + "rolesPrivacyAware";

    return this.http.get(completeUrl, {params: parameters});
  }

  privacyConnectorMethod(parameters : HttpParams) {
    let sessionId = localStorage.getItem("sessionId");
    let process = localStorage.getItem("process");

    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("process", process);

    var completeUrl: string = this.webservicePath + "privacyConnectorMethod";

    return this.http.get(completeUrl, {params: parameters});
  }

  getContent(parameters : HttpParams) {
    let sessionId = localStorage.getItem("sessionId");
    let process = localStorage.getItem("process");

    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("process", process);

    var completeUrl: string = this.webservicePath + "getContent";

    return this.http.get(completeUrl, {params: parameters});
  }

  getContent2(parameters : HttpParams) {
    let sessionId = localStorage.getItem("sessionId");
    let process = localStorage.getItem("process");

    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("process", process);

    var completeUrl: string = this.webservicePath + "getContent";

    return this.http.get(completeUrl, {params: parameters});
  }

  getEventsForDotted(parameters : HttpParams) {
    let process = localStorage.getItem("process");
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("process", process);
    parameters = parameters.set("session", sessionId);
    parameters = parameters.set("uniqueCallId", this.newGuid());

    var completeUrl : string = this.webservicePath + "getEventsForDotted";

    return this.http.get(completeUrl, {params: parameters});

  }

  getCurrentProcess() {
    return localStorage.getItem('process');
  }
}
