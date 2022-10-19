import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
  title?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modals = new Map<string, IModal>();

  constructor() {}

  register(id: string, title?: string) {
    this.modals.set(id, { id, visible: false, title: title });
  }

  deregister(id: string) {
    this.modals.delete(id);
  }

  isModalVisible(id: string): boolean {
    return Boolean(this.modals.get(id)?.visible);
  }

  getModalTitle(id: string): string {
    return this.modals.get(id)?.title || '';
  }

  toggleModal(id: string, title?: string): void {
    if (this.modals.has(id)) {
      const modal = this.modals.get(id)!;
      modal.visible = !modal.visible;
      if (title) {
        modal.title = title;
      }
    }
  }
}
