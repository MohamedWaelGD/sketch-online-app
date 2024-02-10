import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { ref, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage';
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
    uploadBytes(canvasImagesRef, blob).then((snapshot) => {
      console.log("Updated canvas");
    });
  }

  getImage(roomUuid: string) {
    const storage = getStorage();
    const canvasImagesRef = ref(storage, `canvas-images/${roomUuid}`);
    return from(getDownloadURL(canvasImagesRef));
  }
}

export interface StoreImage {
  room: string;
  blob: Blob;
}
