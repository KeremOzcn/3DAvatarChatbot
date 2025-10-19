import { VrmDexie } from "./vrmDb";
import VrmDbModel from "./vrmDbModel";
import { db as realDb } from "./vrmDb";
import { Base64ToBlob } from "@/utils/blobDataUtils";

const isClient = typeof window !== "undefined" && typeof indexedDB !== "undefined";

export class VrmDataProvider {
  private db: VrmDexie | null;

  constructor() {
    this.db = isClient ? (realDb as VrmDexie) : null;
  }

  componentWillUnmount() {
    this.db?.close();
  }

  public addItem(
    hash: string,
    saveType: "local" | "web",
    vrmData: string = "",
    vrmUrl: string = "",
    thumbData: string = "",
  ): void {
    if (!this.db) return;
    this.db.vrms.put(new VrmDbModel(hash, saveType, vrmData, vrmUrl, thumbData));
  }

  public async getItems(): Promise<VrmDbModel[]> {
    if (!this.db) return [];
    return this.db.vrms.toArray();
  }

  public updateItemThumb(hash: string, vrmThumbData: string): void {
    if (!this.db) return;
    this.db.vrms.where("hash").equals(hash).modify({ thumbData: vrmThumbData });
  }

  public getItemAsBlob(hash: string): Promise<Blob | undefined> {
    if (!this.db) return Promise.resolve(undefined);
    return this.db.vrms
      .where("hash")
      .equals(hash)
      .first()
      .then((vrmDbModel) =>
        vrmDbModel ? Base64ToBlob(vrmDbModel.vrmData) : undefined,
      );
  }

  public addItemUrl(hash: string, url: string) {
    if (!this.db) return;
    this.db.vrms.where("hash").equals(hash).modify({ vrmUrl: url, saveType: "web" });
  }
}

export const vrmDataProvider = new VrmDataProvider();