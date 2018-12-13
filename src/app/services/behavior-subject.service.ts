import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class BehaviorSubjectService {

    constructor() { }


    imagesDBObj: object = { refresh: 'refresh' };
    imagesDB = new BehaviorSubject<object>(this.updateImagesDB());
    refreshImagesDB(refresh): void {
        this.imagesDBObj = { refresh: refresh['refresh'] };
        this.imagesDB.next(refresh);
    }
    private updateImagesDB(): object {
        return this.imagesDBObj;
    }


    elementsObj: object = { refresh: 'refresh' };
    elements = new BehaviorSubject<object>(this.updateElements());
    refreshElements(refresh): void {
        this.elementsObj = { refresh: refresh['refresh'] };
        this.elements.next(refresh);
    }
    private updateElements(): object {
        return this.elementsObj;
    }


}
