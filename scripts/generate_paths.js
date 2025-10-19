const fs = require('fs');
const fg = require('fast-glob');
const path = require('path');

const ROOT = path.join(__dirname, './../public').replace(/\\/g, '/');

console.log('ROOT:', ROOT);

const bgImagesRaw = fg.globSync(ROOT+"/bg/**/bg-*.jpg", {dot: true});
const vrmListRaw = fg.globSync(ROOT+"/vrm/**/*.vrm", {dot: true});
const speechT5SpeakerEmbeddingsListRaw = fg.globSync(ROOT+"/speecht5_speaker_embeddings/**/*.bin", {dot: true});
const animationListRaw = [].concat(
  fg.globSync(ROOT+"/animations/**/*.vrma", {dot: true}),
  fg.globSync(ROOT+"/animations/**/*.fbx", {dot: true})
);

console.log('Found VRM files:', vrmListRaw);

const bgImages = bgImagesRaw.map((p) => p.replace(ROOT, '').replace(/\\/g, '/'));
const vrmList = vrmListRaw.map((p) => p.replace(ROOT, '').replace(/\\/g, '/'));
const speechT5SpeakerEmbeddingsList = speechT5SpeakerEmbeddingsListRaw.map((p) => p.replace(ROOT, '').replace(/\\/g, '/'));
const animationList = animationListRaw.map((p) => p.replace(ROOT, '').replace(/\\/g, '/'));

console.log('Processed VRM list:', vrmList);

let str = "";
str += `export const bgImages = ${JSON.stringify(bgImages)};\n`;
str += `export const vrmList = ${JSON.stringify(vrmList)};\n`;
str += `export const speechT5SpeakerEmbeddingsList = ${JSON.stringify(speechT5SpeakerEmbeddingsList)};\n`;
str += `export const animationList = ${JSON.stringify(animationList)};\n`;

const outputPath = path.join(__dirname, './../src/paths.ts');
console.log('Writing to:', outputPath);
fs.writeFileSync(outputPath, str);
console.log('Done!');
