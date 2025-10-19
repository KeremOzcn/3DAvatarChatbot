import * as THREE from "three";

/**
 * Optimizes transparency rendering for better performance
 */
export class TransparencyOptimizer {
  /**
   * Optimizes transparent materials
   */
  public static optimize(object: THREE.Object3D): void {
    object.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

        materials.forEach((material) => {
          if (material && material.transparent) {
            // Set proper rendering order
            mesh.renderOrder = 1000;
            
            // Optimize alpha test
            if ('alphaTest' in material && material.alphaTest === 0) {
              material.alphaTest = 0.5;
            }
            
            // Disable depth write for transparent objects
            material.depthWrite = false;
          }
        });
      }
    });
  }
}

/**
 * Checks and optimizes transparency in a model
 */
export function checkAndOptimizeTransparency(object: THREE.Object3D): void {
  let transparentCount = 0;

  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

      materials.forEach((material) => {
        if (material && material.transparent) {
          transparentCount++;
          
          // Optimize transparent material
          material.depthWrite = false;
          material.side = THREE.DoubleSide;
          
          if ('alphaTest' in material) {
            material.alphaTest = 0.5;
          }
        }
      });
    }
  });

  if (transparentCount > 0) {
    console.log(`Optimized ${transparentCount} transparent materials`);
  }
}
