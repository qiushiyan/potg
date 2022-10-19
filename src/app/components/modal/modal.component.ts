import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() id!: string;
  title: string = '';

  constructor(private modalService: ModalService, private el: ElementRef) {}

  ngOnInit(): void {
    document.body.appendChild(this.el.nativeElement);
    this.title = this.modalService.getModalTitle(this.id);
  }

  ngOnDestroy(): void {
    document.body.removeChild(this.el.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.title = this.modalService.getModalTitle(this.id);
  }

  isModalVisible(id: string) {
    return this.modalService.isModalVisible(id);
  }

  toggleModal(id: string, title?: string) {
    this.modalService.toggleModal(id, title);
  }
}
