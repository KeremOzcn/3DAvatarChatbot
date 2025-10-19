import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

/**
 * Optimized GLTF Loader with performance improvements
 */
export class OptimizedGLTFLoader extends GLTFLoader {
  constructor(manager?: THREE.LoadingManager) {
    super(manager);
  }

  /**
   * Loads and optimizes a GLTF model
   */
  public async loadOptimized(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.load(
        url,
        (gltf) => {
          this.optimizeModel(gltf.scene);
          resolve(gltf);
        },
        undefined,
        reject
      );
    });
  }

  /**
   * Optimizes the loaded model
   */
  private optimizeModel(scene: THREE.Object3D): void {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        
        // Enable frustum culling
        mesh.frustumCulled = true;
        
        // Optimize geometry
        if (mesh.geometry) {
          mesh.geometry.computeBoundingSphere();
          mesh.geometry.computeBoundingBox();
        }
        
        // Optimize materials
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((material) => {
          if (material) {
            material.needsUpdate = false;
          }
        });
      }
    });
  }
}
