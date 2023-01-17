import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';


@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss']
})
export class AlertModalComponent {
  @Input() tipoAlert = '';
  @Input() mensagem!: string;
  @Input() public open: boolean = false;

  @Output() public closeAlert = new EventEmitter<boolean>();

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
    this.closeAlert.emit(false);
  }

  constructor() { /* - */ }

  fecharModal(value: boolean): void {
    this.closeAlert.emit(value);
  }
}
