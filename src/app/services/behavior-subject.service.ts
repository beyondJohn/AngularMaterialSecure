import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class BehaviorSubjectService {

    constructor() { }

    deleteObj: object = { refresh: 'refresh' };
    delete = new BehaviorSubject<object>(this.updateDeletes());
    refreshDelete(refresh): void {
        this.deleteObj = { refresh: refresh['refresh'] };
        this.delete.next(refresh);
    }
    private updateDeletes(): object {
        return this.deleteObj;
    }

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

    acceptedInviteObj: object = {accept:''};
    acceptedInvite = new BehaviorSubject<object>(this.updateAcceptedInvite());
    refreshAccepted(accept): void {
        this.acceptedInviteObj = { accept: accept['accept'] };
        this.acceptedInvite.next(accept);
    }
    private updateAcceptedInvite(): object {
        return this.acceptedInviteObj;
    }

}
