import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { ref, getStorage, uploadBytes, getBlob } from 'firebase/storage';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SketchFirebaseService {

  constructor(
    private _fireStore: Firestore
  ) { }

  setImage(blob: Blob, roomUuid: string) {
    const storage = getStorage();
    const canvasImagesRef = ref(storage, `canvas-images/${roomUuid}`);
    return uploadBytes(canvasImagesRef, blob);
  }

  getImageBlob(roomUuid: string) {
    const storage = getStorage();
    const canvasImagesRef = ref(storage, `canvas-images/${roomUuid}`);
    return from(getBlob(canvasImagesRef));
  }
}

export interface StoreImage {
  room: string;
  blob: Blob;
}
