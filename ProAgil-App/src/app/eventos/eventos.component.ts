import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventos: any;

  constructor(private http: HttpClient) { }

  ngOnInit() { // roda antes do html ficar pronto
    this.getEventos();
  }

  getEventos(){
    this.http.get('http://localhost:5000/api/values').subscribe(response => {
      this.eventos = response;
    }, error => {
        console.log(error);
    }
    );
  }

}
