import { Component, OnInit } from '@angular/core';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';



@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  // tslint:disable-next-line: variable-name
  _filtroLista: string;

  get filtroLista(): string {
    return this._filtroLista;
  }
  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this._filtroLista ? this.filtrarEventos(this._filtroLista) : this.eventos;
  }

  eventosFiltrados: Evento[];
  eventos: Evento[];
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;

  constructor(private eventoService: EventoService) { }

  ngOnInit() { // roda antes do html ficar pronto
    this.getEventos();
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  getEventos() {
    this.eventoService.getAllEvento().subscribe(
      // tslint:disable-next-line: variable-name
      (_eventos: Evento[]) => {
      this.eventos = _eventos;
      console.log(_eventos);
    }, error => {
        console.log(error);
    }
    );
  }

}
