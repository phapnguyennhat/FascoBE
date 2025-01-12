import { Injectable, NotFoundException } from '@nestjs/common';
import { initializeApp } from 'firebase/app';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';

@Injectable()
export class FirebaseStorageService {
  constructor() {
    const firebaseConfig = {
      apiKey: process.env.APIKEY,
      authDomain: process.env.AUTHDOMAIN,
      projectId: process.env.PROJECTID,
      storageBucket: process.env.STORAGEBUCKET,
      messagingSenderId: process.env.MESSAGINGSENDERID,
      appId: process.env.APPID,
      measurementId: process.env.MEASUREMENTID,
    };
    initializeApp(firebaseConfig);
  }

  async uploadFile(file: Express.Multer.File) {
    const storage = getStorage();
    const storageRef = ref(storage);
    const metadata = {
      contentType: file.mimetype, // Đảm bảo lưu đúng loại file
    };
    const key = `${Date.now()}-${file.originalname}`;
    const snapshot = await uploadBytes(
      ref(storageRef, key),
      file.buffer,
      metadata,
    );
    const url = await getDownloadURL(snapshot.ref);

    return { url, key };
  }

  async deleteFile(key: string) {
    const storage = getStorage();

    // Create a reference to the file to delete
    const desertRef = ref(storage, key);

    // Delete the file
    try {
      await deleteObject(desertRef);
      return { message: 'Xóa file thành công' };
    } catch (error) {
      throw new NotFoundException(`Không tìm thấy file ${key}`);
    }
  }
}
