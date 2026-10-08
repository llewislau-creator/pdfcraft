import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';

const {PDFDocument,degrees}=window.PDFLib;
const el=id=>document.getElementById(id);
const fileInput=el('fileInput');
const multiInput=el('multiInput');
const imageInput=el('imageInput');
const mixedInput=el('mixedInput');
const thumbs=el('thumbs');
const canvas=el('pdfCanvas');

let sourceDocs=[];
let imageSources=[];
let pages=[];
let selected=0;
let renderToken=0;

const uid=()=>Math.random().toString(36).slice(2);
const setStatus=m=>el('status').textContent=m;

function controls(){
  const h=pages.length>0;
  ['exportBtn','rotateLeft','rotateRight','deletePage','moveUp','moveDown'].forEach(id=>el(id).disabled=!h);
  el('moveUp').disabled=!h||selected===0;
  el('moveDown').disabled=!h||selected===pages.length-1;
  el('pageCount').textContent=pages.length;
  el('emptyState').classList.toggle('hidden',h);
  el('viewerWrap').classList.toggle('hidden',!h);
}

function resetDoc(){
  sourceDocs=[];
  imageSources=[];
  pages=[];
  selected=0;
}

async function loadPdf(bytes){
  const pdfjsBytes=new Uint8Array(bytes).slice();
  const pdfLibBytes=new Uint8Array(bytes).slice();
  const pdfjsDoc=await pdfjsLib.getDocument({data:pdfjsBytes}).promise;
  const libDoc=await PDFDocument.load(pdfLibBytes);
  const docIndex=sourceDocs.length;
  sourceDocs.push({pdfjsDoc,libDoc});
  for(let i=0;i<pdfjsDoc.numPages;i++){
    pages.push({type:'pdf',docIndex,pageIndex:i,rotation:0,id:uid()});
  }
}

async function loadImageFile(file){
  const bytes=new Uint8Array(await file.arrayBuffer());
  const mime=file.type==='image/png'||file.name.toLowerCase().endsWith('.png')?'image/png':'image/jpeg';
  const blob=new Blob([bytes],{type:mime});
  const bitmap=await createImageBitmap(blob);
  const imageIndex=imageSources.length;
  imageSources.push({
    bytes,
    mime,
    bitmap,
    width:bitmap.width,
    height:bitmap.height,
    name:file.name
  });
  pages.push({type:'image',imageIndex,rotation:0,id:uid()});
}

function isPdf(file){
  return file.type==='application/pdf'||file.name.toLowerCase().endsWith('.pdf');
}

function isImage(file){
  const n=file.name.toLowerCase();
  return file.type==='image/jpeg'||file.type==='image/png'||n.endsWith('.jpg')||n.endsWith('.jpeg')||n.endsWith('.png');
}

async function openMixed(files,replace=false){
  const list=[...files].filter(f=>isPdf(f)||isImage(f));
  if(!list.length)return;
  try{
    setStatus('Loading files…');
    if(replace)resetDoc();
    for(const file of list){
      if(isPdf(file)) await loadPdf(await file.arrayBuffer());
      else await loadImageFile(file);
    }
    if(selected>=pages.length)selected=Math.max(0,pages.length-1);
    await rebuild();
    setStatus(pages.length+' page(s) ready');
  }catch(e){
    console.error('File open error:',e);
    setStatus('Could not open file');
    alert('One of these files could not be opened. Please try a standard PDF, JPG or PNG file.');
  }
}

async function openPdfFiles(files,replace=false){
  return openMixed([...files].filter(isPdf),replace);
}

async function openImageFiles(files,replace=false){
  return openMixed([...files].filter(isImage),replace);
}

async function renderPdfItem(item){
  const token=++renderToken;
  const page=await sourceDocs[item.docIndex].pdfjsDoc.getPage(item.pageIndex+1);
  const base=page.getViewport({scale:1.4,rotation:item.rotation});
  const maxWidth=Math.min(920,Math.max(320,el('dropZone').clientWidth-80));
  const scale=Math.min(1.6,maxWidth/base.width*1.4);
  const vp=page.getViewport({scale,rotation:item.rotation});
  const dpr=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.floor(vp.width*dpr);
  canvas.height=Math.floor(vp.height*dpr);
  canvas.style.width=vp.width+'px';
  canvas.style.height=vp.height+'px';
  const c=canvas.getContext('2d');
  c.setTransform(dpr,0,0,dpr,0,0);
  if(token!==renderToken)return;
  await page.render({canvasContext:c,viewport:vp}).promise;
}

function renderImageItem(item){
  const src=imageSources[item.imageIndex];
  const rot=((item.rotation%360)+360)%360;
  const maxWidth=Math.min(920,Math.max(320,el('dropZone').clientWidth-80));
  const naturalW=(rot===90||rot===270)?src.height:src.width;
  const naturalH=(rot===90||rot===270)?src.width:src.height;
  const scale=Math.min(1,maxWidth/naturalW);
  const cssW=Math.max(1,Math.round(naturalW*scale));
  const cssH=Math.max(1,Math.round(naturalH*scale));
  const dpr=Math.min(window.devicePixelRatio||1,2);

  canvas.width=Math.floor(cssW*dpr);
  canvas.height=Math.floor(cssH*dpr);
  canvas.style.width=cssW+'px';
  canvas.style.height=cssH+'px';

  const c=canvas.getContext('2d');
  c.setTransform(dpr,0,0,dpr,0,0);
  c.clearRect(0,0,cssW,cssH);
  c.save();
  c.translate(cssW/2,cssH/2);
  c.rotate(rot*Math.PI/180);
  const drawW=src.width*scale;
  const drawH=src.height*scale;
  c.drawImage(src.bitmap,-drawW/2,-drawH/2,drawW,drawH);
  c.restore();
}

async function renderPage(){
  if(!pages.length)return;
  const item=pages[selected];
  if(item.type==='image') renderImageItem(item);
  else await renderPdfItem(item);
  el('pageLabel').textContent='Page '+(selected+1)+' of '+pages.length;
}

async function makeThumbCanvas(item){
  const c=document.createElement('canvas');
  if(item.type==='image'){
    const src=imageSources[item.imageIndex];
    const rot=((item.rotation%360)+360)%360;
    const max=180;
    const rw=(rot===90||rot===270)?src.height:src.width;
    const rh=(rot===90||rot===270)?src.width:src.height;
    const scale=Math.min(max/rw,220/rh,.35);
    c.width=Math.max(1,Math.round(rw*scale));
    c.height=Math.max(1,Math.round(rh*scale));
    const x=c.getContext('2d');
    x.fillStyle='#fff';
    x.fillRect(0,0,c.width,c.height);
    x.save();
    x.translate(c.width/2,c.height/2);
    x.rotate(rot*Math.PI/180);
    x.drawImage(src.bitmap,-src.width*scale/2,-src.height*scale/2,src.width*scale,src.height*scale);
    x.restore();
    return c;
  }

  const p=await sourceDocs[item.docIndex].pdfjsDoc.getPage(item.pageIndex+1);
  const vp=p.getViewport({scale:.28,rotation:item.rotation});
  c.width=vp.width;
  c.height=vp.height;
  await p.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;
  return c;
}

async function thumb(item,index){
  const box=document.createElement('div');
  box.className='thumb'+(index===selected?' active':'');
  box.draggable=true;
  const c=await makeThumbCanvas(item);
  const meta=document.createElement('div');
  meta.className='thumb-meta';
  const typeLabel=item.type==='image'?'IMG':'PDF';
  meta.innerHTML='<span>'+(index+1)+' · '+typeLabel+'</span><span>'+(item.rotation?item.rotation+'°':'')+'</span>';
  box.append(c,meta);

  box.onclick=()=>{selected=index;rebuild(false)};
  box.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',String(index)));
  box.addEventListener('dragover',e=>e.preventDefault());
  box.addEventListener('drop',e=>{
    e.preventDefault();
    const from=Number(e.dataTransfer.getData('text/plain'));
    const to=index;
    if(from===to)return;
    const[m]=pages.splice(from,1);
    pages.splice(to,0,m);
    selected=to;
    rebuild();
  });

  thumbs.appendChild(box);
}

async function rebuild(rebuildThumbs=true){
  controls();
  if(rebuildThumbs){
    thumbs.innerHTML='';
    for(let i=0;i<pages.length;i++) await thumb(pages[i],i);
  }else{
    [...thumbs.children].forEach((n,i)=>n.classList.toggle('active',i===selected));
  }
  await renderPage();
}

async function exportPdf(){
  if(!pages.length)return;
  setStatus('Building PDF…');
  try{
    const out=await PDFDocument.create();

    for(const item of pages){
      if(item.type==='image'){
        const src=imageSources[item.imageIndex];
        const embedded=src.mime==='image/png'
          ? await out.embedPng(src.bytes)
          : await out.embedJpg(src.bytes);

        const maxDim=1440;
        const scale=Math.min(1,maxDim/Math.max(src.width,src.height));
        const w=Math.max(1,Math.round(src.width*scale));
        const h=Math.max(1,Math.round(src.height*scale));
        const page=out.addPage([w,h]);
        page.drawImage(embedded,{x:0,y:0,width:w,height:h});
        if(item.rotation) page.setRotation(degrees(item.rotation%360));
      }else{
        const src=sourceDocs[item.docIndex].libDoc;
        const [copied]=await out.copyPages(src,[item.pageIndex]);
        if(item.rotation){
          const current=copied.getRotation().angle||0;
          copied.setRotation(degrees((current+item.rotation)%360));
        }
        out.addPage(copied);
      }
    }

    const bytes=await out.save();
    const blob=new Blob([bytes],{type:'application/pdf'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='pdfcraft-document.pdf';
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
    setStatus('Downloaded PDF');
  }catch(e){
    console.error('Export error:',e);
    setStatus('Export failed');
    alert('PDF export failed. Please try again.');
  }
}

function rotate(d){
  if(!pages.length)return;
  pages[selected].rotation=(pages[selected].rotation+d+360)%360;
  rebuild();
}

function del(){
  if(!pages.length)return;
  pages.splice(selected,1);
  if(selected>=pages.length)selected=Math.max(0,pages.length-1);
  rebuild();
}

function move(d){
  const to=selected+d;
  if(to<0||to>=pages.length)return;
  [pages[selected],pages[to]]=[pages[to],pages[selected]];
  selected=to;
  rebuild();
}

el('openBtn').onclick=()=>fileInput.click();
el('chooseBtn').onclick=()=>fileInput.click();
el('mergeBtn').onclick=()=>multiInput.click();
el('chooseMultiBtn').onclick=()=>multiInput.click();
el('imagesBtn').onclick=()=>imageInput.click();
el('chooseImagesBtn').onclick=()=>imageInput.click();
el('toolEditCard').onclick=()=>fileInput.click();
el('toolMergeCard').onclick=()=>multiInput.click();
el('toolImageCard').onclick=()=>imageInput.click();
el('addBtn').onclick=()=>mixedInput.click();

fileInput.onchange=e=>openPdfFiles(e.target.files,true);
multiInput.onchange=e=>openPdfFiles(e.target.files,false);
imageInput.onchange=e=>openImageFiles(e.target.files,pages.length===0);
mixedInput.onchange=e=>openMixed(e.target.files,false);

el('exportBtn').onclick=exportPdf;
el('rotateLeft').onclick=()=>rotate(-90);
el('rotateRight').onclick=()=>rotate(90);
el('deletePage').onclick=del;
el('moveUp').onclick=()=>move(-1);
el('moveDown').onclick=()=>move(1);

const drop=el('dropZone');
['dragenter','dragover'].forEach(t=>drop.addEventListener(t,e=>{
  e.preventDefault();
  drop.classList.add('dragover');
}));
['dragleave','drop'].forEach(t=>drop.addEventListener(t,e=>{
  e.preventDefault();
  drop.classList.remove('dragover');
}));
drop.addEventListener('drop',e=>openMixed(e.dataTransfer.files,pages.length===0));

window.addEventListener('resize',()=>{if(pages.length)renderPage()});
controls();
