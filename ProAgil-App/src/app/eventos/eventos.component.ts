import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {defineLocale } from 'ngx-bootstrap/chronos'; // para funcionar o datepicker em pt-BR
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {ptBrLocale} from 'ngx-bootstrap/locale'; // para funcionar o datepicker em pt-BR
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

defineLocale('pt-br', ptBrLocale);


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  
  eventosFiltrados: Evento[];
  eventos: Evento[];

  evento: Evento;
  modoSalvar = 'post';
  
  imagemAltura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  registerForm: FormGroup;
  bodyDeletarEvento ='';
  
  // tslint:disable-next-line: variable-name
  _filtroLista = '';


  constructor(
      private eventoService: EventoService
    , private modalService: BsModalService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    ) {
      this.localeService.use('pt-br');
    }


  get filtroLista(): string {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEvento(this.filtroLista) : this.eventos;
  }

  openModal(template: any){
    this.registerForm.reset();
    template.show();
  }

  ngOnInit() {
    this.validation();
    this.getEventos();
  }

  filtrarEvento(filtarPor: string): Evento[] {
    filtarPor = filtarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtarPor) !== -1
    );
  }

  alterarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }



  validation() {
    this.registerForm = this.fb.group({
        tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
        local: ['',Validators.required],
        dataEvento: ['',Validators.required],
        qtdPessoas: ['',[Validators.required, Validators.max(120000)]],
        imagemURL: ['',Validators.required],
        telefone: ['',Validators.required],
        email: ['',[Validators.required, Validators.email]]
    });
  }

  editarEvento(evento: Evento, template: any){
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = evento;
    this.registerForm.patchValue(evento);
  }

  novoEvento(template: any){
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  salvarAlteracao(template: any){
    if(this.registerForm.valid){

      if(this.modoSalvar ==='post'){
            this.evento = Object.assign({}, this.registerForm.value);
              console.log(this.evento);

            this.eventoService.postEvento(this.evento).subscribe(
                (novoEvento: Evento) => {
                    template.hide();
                    this.getEventos();
              }, error => {
                console.log(error);
              }
           );
      }else{
        this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
        this.eventoService.putEvento(this.evento).subscribe(
            () => {
                template.hide();
                this.getEventos();
          }, error => {
            console.log(error);
          }
       );
      }

    }
  }

  excluirEvento(evento: Evento, template: any){
      this.openModal(template);
      this.evento = evento;
      this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código:${evento.id}`;
  }

confirmeDelete(template: any){
  this.eventoService.deleteEvento(this.evento.id).subscribe(
    () => {
      template.hide();
      this.getEventos();
    }, error =>{
      console.log(error);
      }
  );
}


  getEventos() {
    this.eventoService.getAllEvento().subscribe(
      (_eventos: Evento[]) => {
      this.eventos = _eventos;
      this.eventosFiltrados = this.eventos;
      console.log(_eventos);
    }, error => {
      console.log(error);
    });
  }

}
