/**
 * Converts a Base64 string to a Blob
 * @param base64 - The Base64 encoded string
 * @param contentType - The MIME type of the blob (default: 'application/octet-stream')
 * @returns A Blob object
 */
export function Base64ToBlob(base64: string, contentType: string = 'application/octet-stream'): Blob {
  // Remove data URL prefix if present
  const base64Data = base64.replace(/^data:[^;]+;base64,/, '');
  
  // Decode base64 string
  const byteCharacters = atob(base64Data);
  const byteArrays: BlobPart[] = [];

  // Convert to byte array
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

/**
 * Converts a Blob to a Base64 string
 * @param blob - The Blob to convert
 * @returns A promise that resolves to a Base64 encoded string
 */
export function BlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Downloads a blob as a file
 * @param blob - The Blob to download
 * @param filename - The name of the file to download
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
