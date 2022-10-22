import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppConfig } from 'src/app/app.config';
import { InputComponent } from 'src/app/components/input/input.component';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-video-edit',
  standalone: true,
  imports: [CommonModule, ModalComponent, ReactiveFormsModule, InputComponent],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class VideoEditComponent implements OnInit, OnDestroy {
  modalId: string = AppConfig.modals.VIDEO_EDIT_MODAL.id;
  modalTitle: string = AppConfig.modals.VIDEO_EDIT_MODAL.title;
  title = new FormControl('');
  description = new FormControl('');
  public = new FormControl(false);
  editForm = new FormGroup({
    title: this.title,
    description: this.description,
    public: this.public,
  });
  inSubmission: boolean = false;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.register(this.modalId, this.modalTitle);
  }

  ngOnDestroy(): void {
    this.modalService.deregister(this.modalId);
  }

  onSubmit() {}
}
