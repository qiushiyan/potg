import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modals = new Map<string, IModal>();

  constructor() {}

  register(id: string) {
    this.modals.set(id, { id, visible: false });
  }

  deregister(id: string) {
    this.modals.delete(id);
  }

  isModalVisible(id: string): boolean {
    return Boolean(this.modals.get(id)?.visible);
  }

  toggleModal(id: string): void {
    if (this.modals.has(id)) {
      const modal = this.modals.get(id)!;
      modal.visible = !modal.visible;
    }
  }
}
