import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalService } from 'ngx-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {defineLocale, BsLocaleService, ptBrLocale} from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventosAll: Evento[];
  eventos: Evento[];
  evento: any;
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  registerForm: FormGroup;
  modoSalvar: string;
  bodyDeletarEvento: any;

  // tslint:disable-next-line: variable-name
  _filtroLista = '' ;

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private toastr: ToastrService
    ) {
      this.localeService.use('pt-br');
    }

  get filtroLista(): string {
    return this._filtroLista;
  }
  set filtroLista(value: string) {
    this._filtroLista = value;
    console.log(this._filtroLista.length);
    console.log(this._filtroLista.length);
    this.eventos = this._filtroLista  ? this.filtrarEventos(this._filtroLista) : this.eventosAll;
  }

  ngOnInit() { // roda antes do html ficar pronto
    console.log('ngOnInit');
    this.validation();
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

  validation() {
    this.registerForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      imagemURL: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  openModal(template: any) {
    this.registerForm.reset();
    template.show();
  }

  getEventos() {
    console.log('getEventos');
    this.eventoService.getAllEvento().subscribe(
      (eventosAll: Evento[]) => {
      this.eventos = eventosAll;
      this.eventosAll = eventosAll;
    }, error => {
        console.log(error);
        this.toastr.error(`Erro ao carregar dados: ${error}`, 'Evento');
    }
    );
  }

  novoEvento(template: any) {
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  editarEvento(evento: Evento, template: any) {
    this.evento = evento;
    this.modoSalvar = 'put';
    this.openModal(template);
    this.registerForm.patchValue(evento);
  }

  excluirEvento(evento: Evento, template: any){
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.id}`;
  }

  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
          template.hide();
          this.getEventos();
          this.toastr.success('Deletado com sucesso!', 'Evento');
        }, error => {
          this.toastr.error(`Erro ao deletar: ${error}`, 'Evento');
          console.log(error);
        }
    );
  }

  salvarAlteracoes(template: any) {
    if (this.registerForm.valid) {
      if (this.modoSalvar === 'post') {
        this.evento = Object.assign({}, this.registerForm.value);
        this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento: Evento) => {
            template.hide();
            this.getEventos();
            this.toastr.success('Incluído com sucesso!', 'Evento');
          }, error => {
            this.toastr.error(`Erro ao incluir: ${error}`, 'Evento');
            console.log(error);
          }
        );
      } else {
        this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
        this.eventoService.putEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.getEventos();
            this.toastr.success('Editado com sucesso!', 'Evento');
          }, error => {
            this.toastr.error(`Erro ao editar: ${error}`, 'Evento');
            console.log(error);
          }
        );
      }
    }
  }

}
