import { Component, Input, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from 'src/app/services/modal.service';

interface IModal {
  id: string;
  visible: boolean;
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() title!: string;
  @Input() id!: string;

  constructor(private modalService: ModalService, private el: ElementRef) {}

  ngOnInit(): void {
    document.body.appendChild(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    document.body.removeChild(this.el.nativeElement);
  }

  isModalVisible(id: string) {
    return this.modalService.isModalVisible(id);
  }

  toggleModal(id: string) {
    this.modalService.toggleModal(id);
  }
}
