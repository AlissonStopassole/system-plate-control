import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EmitterComponentService {
    public evento: EventEmitter<any> = new EventEmitter<any>();

    constructor() { }

    emit(data): void {
        this.evento.emit(data);
    }
}
