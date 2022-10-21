import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[app-event-blocker]',
  standalone: true,
})
export class EventBlockerDirective {
  constructor() {}

  @HostListener('drop', ['$event'])
  @HostListener('dragover', ['$event'])
  public handeEvent(event: Event) {
    event.stopPropagation();
    event.preventDefault();
  }
}
