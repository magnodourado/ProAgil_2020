import { Component, OnInit } from '@angular/core';
import { EventoService } from 'src/app/_services/evento.service';
import { BsLocaleService } from 'ngx-bootstrap';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/_models/Evento';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-evento-edit',
  templateUrl: './eventoEdit.component.html',
  styleUrls: ['./eventoEdit.component.css']
})

export class EventoEditComponent implements OnInit {

  titulo = 'Editar Evento';
  registerForm: FormGroup;
  evento: Evento = new Evento();
  imagemURL = 'assets/img/upload_2.png';
  nomeArquivoUpload: string;
  dataAtual = {};
  file: File;

  get lotes(): FormArray {
    return this.registerForm.get('lotes') as FormArray;
  }

  get redesSociais(): FormArray {
    return this.registerForm.get('redesSociais') as FormArray;
  }

  constructor(
    private eventoService: EventoService,
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: ActivatedRoute
  ) {
    this.localeService.use('pt-br');
  }

  ngOnInit() {
    this.validation();
    this.carregarEvento();
  }

  carregarEvento() {
    const idEvento = +this.router.snapshot.paramMap.get('id');
    this.eventoService.getEventoById(idEvento)
      .subscribe(
        (evento: Evento) => {
          this.evento = Object.assign({}, evento);
          this.nomeArquivoUpload = this.evento.imagemURL.toString();

          this.imagemURL = `http://localhost:5000/resources/images/${this.evento.imagemURL}?_ts=${this.dataAtual}`;

          this.evento.lotes.forEach(lote => {
            this.lotes.push(this.criaLote(lote));
          });
          this.evento.redesSociais.forEach(redesocial => {
            this.redesSociais.push(this.criaRedeSocial(redesocial));
          });

          this.evento.imagemURL = '';
          this.registerForm.patchValue(this.evento);
        }
      );
  }

  validation() {
    this.registerForm = this.fb.group({
      id: [],
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      imagemURL: [''],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lotes: this.fb.array([]),
      redesSociais: this.fb.array([])
    });
  }

  criaLote(lote: any): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim]
    });
  }

  criaRedeSocial(redeSocial: any): FormGroup {
    return this.fb.group({
      id: [redeSocial.id],
      nome: [redeSocial.nome, Validators.required],
      url: [redeSocial.url, Validators.required]
    });
  }

  adicionarLote() {
    this.lotes.push(this.criaLote({ id: 0 }));
  }

  adicionarRedeSocial() {
    this.redesSociais.push(this.criaRedeSocial({ id: 0 }));
  }

  removerLote(id: number) {
    this.lotes.removeAt(id);
  }

  removerRedeSocial(id: number) {
    this.redesSociais.removeAt(id);
  }

  onFileChange(file: FileList) {
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    // this.file = event.target.file;
    reader.readAsDataURL(file[0]);
  }

  uploadimagem() {
    if (this.registerForm.get('imagemURL').value !== '') {
      this.eventoService.postUpload(this.file, this.evento.imagemURL).subscribe(
        () => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.imagemURL = `http://localhost:5000/resources/images/${this.evento.imagemURL}?_ts=${this.dataAtual}`;
        }
      );
    }
  }

  salvarEvento() {
    this.evento = Object.assign({ id: this.evento.id }, this.registerForm.value);
    this.evento.imagemURL = this.nomeArquivoUpload;

    this.uploadimagem();

    this.evento.imagemURL = this.nomeArquivoUpload;

    this.eventoService.putEvento(this.evento).subscribe(
      () => {
        this.toastr.success('Editado com sucesso!', 'Evento', {
          progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
        });
      }, error => {
        this.toastr.error(`Erro ao editar: ${error}`, 'Evento', {
          progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
        });
      }
    );
  }

}
