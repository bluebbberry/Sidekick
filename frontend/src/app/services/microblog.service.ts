import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Sidekick } from "../model/sidekick";

@Injectable({
  providedIn: 'root'
})
export class MicroblogService {
  private url: string = "http://localhost:3000";
  public statuses?: any[];

  constructor(private http: HttpClient) { }

  sendMessage(message: string, sidekick: Sidekick, onSuccess: any): void {
    const headers = { 'content-type': 'application/json'};

    this.http
      .post<any>(`${this.url}/statuses`, {message: message, sidekick: sidekick.name}, { headers: headers})
      .subscribe(
        (response: any) => {
          console.log("Success");
          onSuccess();
        },
        (error) => {
          console.error(error);
          onSuccess();
      });
  }

  fetchStatuses() {
    this.statuses = undefined;
    const headers = { 'content-type': 'application/json'};
    return this.http.get<any>(`${this.url}/statuses`, { headers: headers }).subscribe((response: any) => {
      console.log(response);
      response["requestBody"].forEach((status: any) => { status.descendants = [] });
      this.statuses = response["requestBody"];
    });
  }

  getDescendantsOfPost(status: any, onSuccess: any) {
    const headers = { 'content-type': 'application/json'};
    return this.http.get<any>(`${this.url}/statuses/${status.id}/children`, { headers: headers }).subscribe((response: any) => {
      console.log(response);
      onSuccess(response);
    });
  }

  addDescendant(status: any, responseElement: any) {
    let filter = this.statuses?.filter(s => s.id === status.id);
    if (filter) {
      filter.forEach(status => {
        status.descendants.push(responseElement);
      });
      console.log(filter);
    }
  }
}
