import * as THREE from "three";

/**
 * Analyzes GLTF models for optimization opportunities
 */
export class GLTFAnalyzer {
  /**
   * Analyzes a 3D object and logs statistics
   */
  public static analyze(object: THREE.Object3D): void {
    const stats = {
      meshCount: 0,
      vertexCount: 0,
      triangleCount: 0,
      materialCount: 0,
      textureCount: 0,
    };

    object.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        stats.meshCount++;

        if (mesh.geometry) {
          const positions = mesh.geometry.attributes.position;
          if (positions) {
            stats.vertexCount += positions.count;
          }
          
          if (mesh.geometry.index) {
            stats.triangleCount += mesh.geometry.index.count / 3;
          }
        }

        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        stats.materialCount += materials.length;

        materials.forEach((material) => {
          if (material && 'map' in material && material.map) {
            stats.textureCount++;
          }
        });
      }
    });

    console.log("GLTF Analysis:", stats);
  }

  /**
   * Gets memory usage estimate
   */
  public static getMemoryUsage(object: THREE.Object3D): number {
    let totalBytes = 0;

    object.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        
        if (mesh.geometry) {
          // Estimate geometry memory
          const positions = mesh.geometry.attributes.position;
          if (positions) {
            totalBytes += positions.count * positions.itemSize * 4; // Float32
          }
        }

        // Estimate texture memory
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((material) => {
          if (material && 'map' in material && material.map) {
            const texture = material.map as THREE.Texture;
            if (texture.image) {
              totalBytes += texture.image.width * texture.image.height * 4; // RGBA
            }
          }
        });
      }
    });

    return totalBytes;
  }
}
