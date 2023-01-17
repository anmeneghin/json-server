import {
  Component, OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  HostListener,
  Renderer2,
  Inject
} from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { of, pipe, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

import { JsonServerService, Item } from '../services/json-server.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() public icon!: string;
  @Input() public obj!: Item;
  @Input() public action!: string;
  @Input() public open: boolean = false;

  @ViewChild('modalId') modalId!: ElementRef;

  @Output() public closeEvent = new EventEmitter<boolean>();

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
    this.closeEvent.emit(false);
    this.document.body.classList.remove('overflow');
  }

  openDropdown: boolean = false;
  abrirAlert: boolean = false;

  subscriptions: Subscription[] = [];
  itemForm!: FormGroup;

  msgSuccess!: string;
  msgError!: string;
  msg!: string;
  valueSelected!: string;
  tipoAlert!: string;

  item!: Item | null;
  selectedOption!: any;
  prioridade!: any;

  constructor(
    private renderer: Renderer2,
    private jsonServerService: JsonServerService,
    @Inject(DOCUMENT) private document: Document
  ) {

    this.renderer.listen('window', 'click', (e: Event) => {

      if (e.target == this.modalId.nativeElement) {
        this.closeEvent.emit(false);
        this.document.body.classList.remove('overflow');
      }
    });
  }

  get nome(): any {
    return this.itemForm.get('nome');
  }
  get descricao(): any {
    return this.itemForm.get('descricao');
  }
  get data(): any {
    return this.itemForm.get('data');
  }
  get status(): any {
    return this.itemForm.get('status');
  }
  get responsavel(): any {
    return this.itemForm.get('responsavel');
  }

  ngOnInit(): void {
    this.document.body.classList.add('overflow');

    this.itemForm = new FormGroup({
      id: new FormControl(''),
      nome: new FormControl('', [Validators.required, Validators.maxLength(40)]),
      descricao: new FormControl('', [Validators.required, Validators.maxLength(40)]),
      data: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required, Validators.maxLength(40)]),
      responsavel: new FormControl('', [Validators.required, Validators.maxLength(40)])
    });

    if (this.action === 'Editar') {
      this.subscriptions.push(
        this.jsonServerService.obterItem(this.obj)
          .pipe(
            tap(item => this.item = item),
            tap((item) => {
              this.itemForm.get('nome')!.setValue(item?.nome);
              this.itemForm.get('descricao')!.setValue(item?.descricao);
              this.itemForm.get('data')!.setValue(item?.data);
              this.itemForm.get('status')!.setValue(item?.status);
              this.itemForm.get('responsavel')!.setValue(item?.responsavel);

              return of(item);
            }),
          )
          .subscribe()
      );
    }
  }

  onSubmit(): void {
    const novoItem: Item = this.itemForm.value as Item;

    if (this.action === 'Editar') {

      this.msgSuccess = 'Item atualizado com sucesso!';
      this.msgError = 'Erro ao editar item, tente novamente!';

      this.subscriptions.push(
        this.jsonServerService
          .editarItem(this.obj, novoItem)
          .pipe(
            tap(
              () => {
                this.mostrarAlert(this.msgSuccess, true, 'success');
                setTimeout(() => {
                  this.jsonServerService.filter('Item Atualizado');
                  this.closeEvent.emit(false);
                  this.document.body.classList.remove('overflow');
                }, 1000);
              }
            ),
            tap(() => this.mostrarAlert(this.msgSuccess, true, 'success'))
          )
          .subscribe()
      );
    } else if (this.action === 'Cadastrar') {
      this.msgSuccess = 'Item criado com sucesso!';
      this.msgError = 'Erro ao criar item, tente novamente!';

      this.subscriptions.push(
        this.jsonServerService
          .adicionarItem(novoItem)
          .pipe(
            tap(
              () => {
                setTimeout(() => {
                  this.jsonServerService.filter('Item Criado');
                  this.closeEvent.emit(false);
                  this.document.body.classList.remove('overflow');
                }, 1000);
              },
            ),
            tap(() => this.mostrarAlert(this.msgSuccess, true, 'success'))
          )
          .subscribe()
      );
    }
  }

  mostrarAlert(msg: string, open: boolean, tipoAlert: string) {
    this.msg = msg;
    this.abrirAlert = open;
    this.tipoAlert = tipoAlert;
  }


  excluirItem(): void {
    const item = this.obj;

    this.msgSuccess = 'Item excluído com sucesso!';
    this.msgError = 'Erro ao excluír Item, tente novamente!';

    this.subscriptions.push(
      this.jsonServerService.excluirItem(item.id)
        .pipe(
          tap(
            (res) => {
              setTimeout(() => {
                this.jsonServerService.filter('Item Excluído');
                this.closeEvent.emit(false);
                this.document.body.classList.remove('overflow');
              }, 1000);
            }
          ),
          tap(() => this.mostrarAlert(this.msgSuccess, true, 'success'))
        )
        .subscribe()
    );
  }

  closeModal(value: boolean) {
    this.closeEvent.emit(value);
    this.document.body.classList.remove('overflow');
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
