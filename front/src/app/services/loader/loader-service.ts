import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {

    public issue: EventEmitter<any> = new EventEmitter<any>();

    constructor() { }

    create(): void {
        this.issue.emit({ value: true });
    }

    destroy(): void {
        this.issue.emit(false);
    }

}