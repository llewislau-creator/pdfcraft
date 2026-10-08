import { mkdir, rm, copyFile, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const out=path.join(root,'desktop-dist');
const vendor=path.join(out,'vendor');

await rm(out,{recursive:true,force:true});
await mkdir(vendor,{recursive:true});

for(const file of ['index.html','styles.css','app.js']){
  await copyFile(path.join(root,file),path.join(out,file));
}

const assets=[
  ['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs','pdf.min.mjs'],
  ['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs','pdf.worker.min.mjs'],
  ['https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js','pdf-lib.min.js']
];

for(const [url,name] of assets){
  const res=await fetch(url);
  if(!res.ok)throw new Error('Failed to download '+url+' ('+res.status+')');
  await writeFile(path.join(vendor,name),Buffer.from(await res.arrayBuffer()));
}

let app=await readFile(path.join(out,'app.js'),'utf8');
app=app
  .replace("import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs';","import * as pdfjsLib from './vendor/pdf.min.mjs';")
  .replace("pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';","pdfjsLib.GlobalWorkerOptions.workerSrc='./vendor/pdf.worker.min.mjs';");
await writeFile(path.join(out,'app.js'),app);

let html=await readFile(path.join(out,'index.html'),'utf8');
html=html
  .replace('https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js','./vendor/pdf-lib.min.js')
  .replace(/app\.js\?v=[^"']+/,'app.js')
  .replace(/styles\.css\?v=[^"']+/,'styles.css')
  .replace('<link rel="preconnect" href="https://cdnjs.cloudflare.com" />','');
await writeFile(path.join(out,'index.html'),html);

console.log('Prepared offline desktop assets in desktop-dist/');
