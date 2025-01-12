import { Controller } from '@nestjs/common';
import { FirebaseStorageService } from './firebase-storage.service';

@Controller('firebase-storage')
export class FirebaseStorageController {
  constructor(private readonly firebaseStorageService: FirebaseStorageService) {}
}
