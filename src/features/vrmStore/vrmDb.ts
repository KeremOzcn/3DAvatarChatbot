import Dexie, { Table } from 'dexie';
import VrmDbModel from './vrmDbModel';

export class VrmDexie extends Dexie {
  vrms!: Table<VrmDbModel>;

  constructor() {
    super('AmicaVrmDatabase');
    this.version(1).stores({
      vrms: 'hash', // Primary key and indexed props
    });
  }
}

// Sadece tarayıcıda (IndexedDB mevcutken) gerçek DB oluştur
export const db: VrmDexie | null =
  typeof window !== 'undefined' && typeof indexedDB !== 'undefined'
    ? new VrmDexie()
    : null;