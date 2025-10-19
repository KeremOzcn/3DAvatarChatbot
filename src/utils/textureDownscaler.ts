import * as THREE from "three";

/**
 * Downscales textures to improve performance
 * @param object - The 3D object to process
 * @param maxSize - Maximum texture size (default: 1024)
 */
export function downscaleModelTextures(object: THREE.Object3D, maxSize: number = 1024): void {
  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

      materials.forEach((material) => {
        if (material && 'map' in material) {
          downscaleTexture(material.map as THREE.Texture, maxSize);
        }
        if (material && 'normalMap' in material) {
          downscaleTexture(material.normalMap as THREE.Texture, maxSize);
        }
        if (material && 'emissiveMap' in material) {
          downscaleTexture(material.emissiveMap as THREE.Texture, maxSize);
        }
      });
    }
  });
}

/**
 * Downscales a single texture
 */
function downscaleTexture(texture: THREE.Texture | null, maxSize: number): void {
  if (!texture || !texture.image) return;

  const image = texture.image;
  if (image.width <= maxSize && image.height <= maxSize) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const scale = Math.min(maxSize / image.width, maxSize / image.height);
  canvas.width = Math.floor(image.width * scale);
  canvas.height = Math.floor(image.height * scale);

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  texture.image = canvas;
  texture.needsUpdate = true;
}

/**
 * Logs texture information for debugging
 */
export function logTextureInfo(object: THREE.Object3D): void {
  let textureCount = 0;
  let totalSize = 0;

  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

      materials.forEach((material) => {
        if (material && 'map' in material && material.map) {
          textureCount++;
          const texture = material.map as THREE.Texture;
          if (texture.image) {
            totalSize += texture.image.width * texture.image.height * 4; // RGBA
          }
        }
      });
    }
  });

  console.log(`Textures: ${textureCount}, Estimated size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
}
