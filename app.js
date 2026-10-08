import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';

const {PDFDocument,degrees}=window.PDFLib;
const el=id=>document.getElementById(id);
const fileInput=el('fileInput');
const multiInput=el('multiInput');
const imageInput=el('imageInput');
const mixedInput=el('mixedInput');
const thumbs=el('thumbs');
const mobileThumbs=el('mobileThumbs');
const canvas=el('pdfCanvas');

const translations={
  en:{
    tagline:'Private PDF tools, beautifully simple',
    downloadPdf:'Download PDF',document:'DOCUMENT',pages:'Pages',tip:'Tip',tipText:'Drag pages to reorder them.',
    navigation:'NAVIGATION',pageActions:'PAGE',documentActions:'DOCUMENT',export:'EXPORT',
    home:'Home',previous:'Previous',next:'Next',rotateLeft:'Rotate left',rotateRight:'Rotate right',
    duplicate:'Duplicate',delete:'Delete',moveUp:'Move up',moveDown:'Move down',
    addFiles:'Add files',mergePdfs:'Merge PDFs',imagesToPdf:'Images to PDF',exportPage:'This page',
    browserOnly:'100% local processing · No upload required',
    hero1:'Your PDF workspace.',hero2:'Simple, private, fast.',
    heroCopy:'Edit PDFs, combine documents, and turn JPG or PNG images into one PDF — directly in your browser.',
    openPdf:'Open PDF',noAccount:'✓ No account',noUploads:'✓ Files stay on your device',freeStart:'✓ Free to use',
    popularTools:'POPULAR TOOLS',everything:'Everything you need for everyday PDFs',fastPrivate:'Fast · simple · private',
    editPdf:'Edit PDF',editPdfDesc:'Reorder, rotate and remove pages',
    mergePdf:'Merge PDF',mergePdfDesc:'Combine multiple PDF files',
    imagesToPdfDesc:'Combine JPG and PNG into one PDF',
    splitPdf:'Split PDF',splitPdfDesc:'Extract selected pages',soon:'Soon',
    moreTools:'More tools',moreToolsDesc:'More PDF workflows are on the way.',
    compressPdf:'Compress PDF',signPdf:'Sign PDF',aiAssistant:'AI Assistant',
    viewerHint:'Drag thumbnails to reorder pages',
    selectedPage:'SELECTED PAGE',properties:'Properties',pageSize:'Page size',rotation:'Rotation',position:'Position',
    privateLocal:'Private by default',privateLocalDesc:'Your files never leave this device.',
    ready:'Ready',loadingFiles:'Loading files…',pagesReady:n=>n+' page(s) ready',
    filesAdded:n=>n+' file(s) added',imagesAdded:n=>n+' image(s) added',
    couldNotOpen:'Could not open file',openError:'One of these files could not be opened. Please try a standard PDF, JPG or PNG file.',
    buildingPdf:'Building PDF…',downloadedPdf:'PDF downloaded',pageDownloaded:'Page downloaded',
    exportFailed:'Export failed',exportError:'PDF export failed. Please try again.',
    deleted:'Page deleted',duplicated:'Page duplicated',rotated:'Page rotated',
    pageOf:(a,b)=>'Page '+a+' of '+b,
    thumbRotate:'Rotate',thumbDuplicate:'Duplicate',thumbDelete:'Delete'
  },
  zh:{
    tagline:'漂亮、簡單、私密的 PDF 工具',
    downloadPdf:'下載 PDF',document:'文件',pages:'頁面',tip:'提示',tipText:'拖曳頁面即可重新排序。',
    navigation:'導覽',pageActions:'頁面',documentActions:'文件',export:'匯出',
    home:'首頁',previous:'上一頁',next:'下一頁',rotateLeft:'向左旋轉',rotateRight:'向右旋轉',
    duplicate:'複製頁面',delete:'刪除',moveUp:'上移',moveDown:'下移',
    addFiles:'加入檔案',mergePdfs:'合併 PDF',imagesToPdf:'圖片轉 PDF',exportPage:'匯出此頁',
    browserOnly:'100% 本機處理 · 無需上傳',
    hero1:'你的 PDF 工作空間。',hero2:'簡單、私密、快速。',
    heroCopy:'編輯 PDF、合併文件，或把 JPG / PNG 圖片合成一份 PDF，全都直接在瀏覽器完成。',
    openPdf:'開啟 PDF',noAccount:'✓ 無需帳戶',noUploads:'✓ 檔案留在你的裝置',freeStart:'✓ 免費使用',
    popularTools:'熱門工具',everything:'日常 PDF 所需工具，一站完成',fastPrivate:'快速 · 簡單 · 私密',
    editPdf:'編輯 PDF',editPdfDesc:'排序、旋轉及刪除頁面',
    mergePdf:'合併 PDF',mergePdfDesc:'合併多個 PDF 檔案',
    imagesToPdfDesc:'把 JPG 與 PNG 合成一份 PDF',
    splitPdf:'分割 PDF',splitPdfDesc:'擷取指定頁面',soon:'即將推出',
    moreTools:'更多工具',moreToolsDesc:'更多 PDF 功能正在開發中。',
    compressPdf:'壓縮 PDF',signPdf:'簽署 PDF',aiAssistant:'AI 助手',
    viewerHint:'拖曳縮圖即可重新排序頁面',
    selectedPage:'已選頁面',properties:'屬性',pageSize:'頁面尺寸',rotation:'旋轉',position:'位置',
    privateLocal:'預設私密',privateLocalDesc:'你的檔案不會離開這部裝置。',
    ready:'準備就緒',loadingFiles:'正在載入檔案…',pagesReady:n=>'已載入 '+n+' 頁',
    filesAdded:n=>'已加入 '+n+' 個檔案',imagesAdded:n=>'已加入 '+n+' 張圖片',
    couldNotOpen:'無法開啟檔案',openError:'其中一個檔案無法開啟。請使用標準 PDF、JPG 或 PNG 檔案再試一次。',
    buildingPdf:'正在建立 PDF…',downloadedPdf:'PDF 已下載',pageDownloaded:'頁面已下載',
    exportFailed:'匯出失敗',exportError:'PDF 匯出失敗，請再試一次。',
    deleted:'頁面已刪除',duplicated:'頁面已複製',rotated:'頁面已旋轉',
    pageOf:(a,b)=>'第 '+a+' 頁，共 '+b+' 頁',
    thumbRotate:'旋轉',thumbDuplicate:'複製',thumbDelete:'刪除'
  }
};

let currentLang='en';
try{currentLang=localStorage.getItem('pdfcraft-lang')||'en';}catch(e){}

let sourceDocs=[];
let imageSources=[];
let pages=[];
let selected=0;
let renderToken=0;
let toastTimer=0;

const uid=()=>Math.random().toString(36).slice(2);
const t=(key,...args)=>{
  const value=translations[currentLang][key]??translations.en[key]??key;
  return typeof value==='function'?value(...args):value;
};
const setStatus=m=>{const node=el('status');if(node)node.textContent=m;};

function showToast(message,type='success'){
  setStatus(message);
  const stack=el('toastStack');
  if(!stack)return;
  const toast=document.createElement('div');
  toast.className='toast '+type;
  toast.innerHTML='<span class="toast-icon">'+(type==='error'?'!':type==='info'?'i':'✓')+'</span><span></span>';
  toast.lastElementChild.textContent=message;
  stack.appendChild(toast);
  requestAnimationFrame(()=>toast.classList.add('show'));
  window.clearTimeout(toastTimer);
  toastTimer=window.setTimeout(()=>{
    toast.classList.remove('show');
    window.setTimeout(()=>toast.remove(),220);
  },2600);
}

function applyLanguage(){
  document.documentElement.lang=currentLang==='zh'?'zh-Hant':'en';
  document.querySelectorAll('[data-i18n]').forEach(node=>{
    const key=node.dataset.i18n;
    if(translations[currentLang][key]!==undefined)node.textContent=t(key);
  });
  const langBtn=el('langBtn');
  if(langBtn)langBtn.textContent=currentLang==='en'?'中文':'EN';
  if(!pages.length)setStatus(t('ready'));
  else setStatus(t('pagesReady',pages.length));
  if(pages.length){
    const label=el('pageLabel');
    if(label)label.textContent=t('pageOf',selected+1,pages.length);
  }
}

function setDisabled(id,value){
  const node=el(id);
  if(node)node.disabled=value;
}

function controls(){
  const h=pages.length>0;
  const shell=el('appShell');
  if(shell)shell.classList.toggle('editor-mode',h);
  ['exportBtn','exportToolbarBtn','exportPageBtn','rotateLeft','rotateRight','duplicatePage','deletePage','moveUp','moveDown']
    .forEach(id=>setDisabled(id,!h));
  setDisabled('prevBtn',!h||selected===0);
  setDisabled('nextBtn',!h||selected===pages.length-1);
  setDisabled('moveUp',!h||selected===0);
  setDisabled('moveDown',!h||selected===pages.length-1);
  const count=el('pageCount');if(count)count.textContent=pages.length;
  const mobileCount=el('mobilePageCount');if(mobileCount)mobileCount.textContent=pages.length;
  const empty=el('emptyState');if(empty)empty.classList.toggle('hidden',h);
  const viewer=el('viewerWrap');if(viewer)viewer.classList.toggle('hidden',!h);
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
  let bitmap;
  if('createImageBitmap' in window){
    try{bitmap=await createImageBitmap(blob);}catch(e){console.warn('ImageBitmap fallback',e);}
  }
  if(!bitmap){
    bitmap=await new Promise((resolve,reject)=>{
      const url=URL.createObjectURL(blob);
      const img=new Image();
      img.onload=()=>{URL.revokeObjectURL(url);resolve(img);};
      img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Image decode failed'));};
      img.src=url;
    });
  }
  const width=bitmap.naturalWidth||bitmap.width;
  const height=bitmap.naturalHeight||bitmap.height;
  const imageIndex=imageSources.length;
  imageSources.push({bytes,mime,bitmap,width,height,name:file.name});
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
  const before=pages.length;
  try{
    setStatus(t('loadingFiles'));
    if(replace)resetDoc();
    for(const file of list){
      if(isPdf(file))await loadPdf(await file.arrayBuffer());
      else await loadImageFile(file);
    }
    if(selected>=pages.length)selected=Math.max(0,pages.length-1);
    await rebuild();
    const added=pages.length-(replace?0:before);
    showToast(list.every(isImage)?t('imagesAdded',added):t('filesAdded',list.length));
  }catch(e){
    console.error('File open error:',e);
    setStatus(t('couldNotOpen'));
    showToast(t('openError'),'error');
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
  const base=page.getViewport({scale:1,rotation:item.rotation});
  const maxWidth=Math.min(900,Math.max(300,el('dropZone').clientWidth-120));
  const scale=Math.min(1.5,maxWidth/base.width);
  const vp=page.getViewport({scale,rotation:item.rotation});
  const dpr=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.floor(vp.width*dpr);
  canvas.height=Math.floor(vp.height*dpr);
  canvas.style.width=vp.width+'px';
  canvas.style.height=vp.height+'px';
  const ctx=canvas.getContext('2d');
  ctx.setTransform(dpr,0,0,dpr,0,0);
  if(token!==renderToken)return;
  await page.render({canvasContext:ctx,viewport:vp}).promise;
}

function renderImageItem(item){
  const src=imageSources[item.imageIndex];
  const rot=((item.rotation%360)+360)%360;
  const maxWidth=Math.min(900,Math.max(300,el('dropZone').clientWidth-120));
  const rw=(rot===90||rot===270)?src.height:src.width;
  const rh=(rot===90||rot===270)?src.width:src.height;
  const scale=Math.min(1,maxWidth/rw);
  const cssW=Math.max(1,Math.round(rw*scale));
  const cssH=Math.max(1,Math.round(rh*scale));
  const dpr=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.floor(cssW*dpr);
  canvas.height=Math.floor(cssH*dpr);
  canvas.style.width=cssW+'px';
  canvas.style.height=cssH+'px';
  const ctx=canvas.getContext('2d');
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,cssW,cssH);
  ctx.save();
  ctx.translate(cssW/2,cssH/2);
  ctx.rotate(rot*Math.PI/180);
  ctx.drawImage(src.bitmap,-src.width*scale/2,-src.height*scale/2,src.width*scale,src.height*scale);
  ctx.restore();
}

async function updateProperties(){
  if(!pages.length)return;
  const item=pages[selected];
  const num=el('propertyPageNumber');
  const type=el('propertyType');
  const size=el('propertySize');
  const rotation=el('propertyRotation');
  const position=el('propertyPosition');
  if(num)num.textContent=selected+1;
  if(type)type.textContent=item.type==='image'?'IMAGE':'PDF';
  if(rotation)rotation.textContent=((item.rotation%360)+360)%360+'°';
  if(position)position.textContent=(selected+1)+' / '+pages.length;
  if(size){
    if(item.type==='image'){
      const src=imageSources[item.imageIndex];
      size.textContent=src.width+' × '+src.height+' px';
    }else{
      try{
        const p=await sourceDocs[item.docIndex].pdfjsDoc.getPage(item.pageIndex+1);
        const vp=p.getViewport({scale:1,rotation:0});
        size.textContent=Math.round(vp.width)+' × '+Math.round(vp.height)+' pt';
      }catch(e){size.textContent='—';}
    }
  }
}

async function renderPage(){
  if(!pages.length)return;
  const item=pages[selected];
  if(item.type==='image')renderImageItem(item);
  else await renderPdfItem(item);
  const label=el('pageLabel');
  if(label)label.textContent=t('pageOf',selected+1,pages.length);
  await updateProperties();
}

async function makeThumbCanvas(item){
  const c=document.createElement('canvas');
  if(item.type==='image'){
    const src=imageSources[item.imageIndex];
    const rot=((item.rotation%360)+360)%360;
    const rw=(rot===90||rot===270)?src.height:src.width;
    const rh=(rot===90||rot===270)?src.width:src.height;
    const scale=Math.min(160/rw,190/rh,.32);
    c.width=Math.max(1,Math.round(rw*scale));
    c.height=Math.max(1,Math.round(rh*scale));
    const x=c.getContext('2d');
    x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);
    x.save();x.translate(c.width/2,c.height/2);x.rotate(rot*Math.PI/180);
    x.drawImage(src.bitmap,-src.width*scale/2,-src.height*scale/2,src.width*scale,src.height*scale);x.restore();
    return c;
  }
  const p=await sourceDocs[item.docIndex].pdfjsDoc.getPage(item.pageIndex+1);
  const vp=p.getViewport({scale:.24,rotation:item.rotation});
  c.width=vp.width;c.height=vp.height;
  await p.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;
  return c;
}

function closeAllThumbMenus(){
  document.querySelectorAll('.thumb-menu.open').forEach(m=>m.classList.remove('open'));
}

function handleThumbAction(action,index){
  selected=index;
  if(action==='rotate')rotate(90);
  if(action==='duplicate')duplicateSelected();
  if(action==='delete')del();
}

async function createThumb(item,index,mobile=false){
  const box=document.createElement('div');
  box.className='thumb'+(index===selected?' active':'')+(mobile?' mobile-thumb':'');
  box.draggable=!mobile;
  box.dataset.index=index;
  const preview=document.createElement('div');
  preview.className='thumb-preview';
  const c=await makeThumbCanvas(item);
  preview.appendChild(c);

  const menuBtn=document.createElement('button');
  menuBtn.type='button';menuBtn.className='thumb-more';menuBtn.textContent='•••';
  menuBtn.setAttribute('aria-label','Page actions');

  const menu=document.createElement('div');
  menu.className='thumb-menu';
  [['rotate','↷',t('thumbRotate')],['duplicate','⧉',t('thumbDuplicate')],['delete','⌫',t('thumbDelete')]].forEach(([action,icon,label])=>{
    const b=document.createElement('button');
    b.type='button';b.dataset.action=action;
    b.innerHTML='<span>'+icon+'</span><span></span>';
    b.lastElementChild.textContent=label;
    if(action==='delete')b.classList.add('danger');
    b.onclick=e=>{e.stopPropagation();closeAllThumbMenus();handleThumbAction(action,index);};
    menu.appendChild(b);
  });
  preview.append(menuBtn,menu);

  menuBtn.onclick=e=>{
    e.stopPropagation();
    const wasOpen=menu.classList.contains('open');
    closeAllThumbMenus();
    menu.classList.toggle('open',!wasOpen);
  };

  const meta=document.createElement('div');
  meta.className='thumb-meta';
  const kind=item.type==='image'?'IMG':'PDF';
  meta.innerHTML='<span>'+(index+1)+'</span><span>'+kind+'</span>';

  box.append(preview,meta);
  box.onclick=()=>{selected=index;closeMobileDrawer();rebuild(false);};

  if(!mobile){
    box.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',String(index)));
    box.addEventListener('dragover',e=>e.preventDefault());
    box.addEventListener('drop',e=>{
      e.preventDefault();
      const from=Number(e.dataTransfer.getData('text/plain'));
      if(from===index)return;
      const[m]=pages.splice(from,1);
      pages.splice(index,0,m);
      selected=index;
      rebuild();
    });
  }
  return box;
}

async function renderThumbLists(){
  if(thumbs)thumbs.innerHTML='';
  if(mobileThumbs)mobileThumbs.innerHTML='';
  for(let i=0;i<pages.length;i++){
    if(thumbs)thumbs.appendChild(await createThumb(pages[i],i,false));
    if(mobileThumbs)mobileThumbs.appendChild(await createThumb(pages[i],i,true));
  }
}

async function rebuild(rebuildThumbs=true){
  controls();
  applyLanguage();
  if(rebuildThumbs)await renderThumbLists();
  else{
    document.querySelectorAll('.thumb').forEach(node=>{
      node.classList.toggle('active',Number(node.dataset.index)===selected);
    });
  }
  await renderPage();
}

async function addItemToPdf(out,item){
  if(item.type==='image'){
    const src=imageSources[item.imageIndex];
    const embedded=src.mime==='image/png'?await out.embedPng(src.bytes):await out.embedJpg(src.bytes);
    const maxDim=1440;
    const scale=Math.min(1,maxDim/Math.max(src.width,src.height));
    const w=Math.max(1,Math.round(src.width*scale));
    const h=Math.max(1,Math.round(src.height*scale));
    const page=out.addPage([w,h]);
    page.drawImage(embedded,{x:0,y:0,width:w,height:h});
    if(item.rotation)page.setRotation(degrees(item.rotation%360));
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

function downloadBytes(bytes,name){
  const blob=new Blob([bytes],{type:'application/pdf'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download=name;a.click();
  window.setTimeout(()=>URL.revokeObjectURL(a.href),1200);
}

async function exportPdf(){
  if(!pages.length)return;
  setStatus(t('buildingPdf'));
  try{
    const out=await PDFDocument.create();
    for(const item of pages)await addItemToPdf(out,item);
    downloadBytes(await out.save(),'pdfcraft-document.pdf');
    showToast(t('downloadedPdf'));
  }catch(e){
    console.error(e);showToast(t('exportError'),'error');
  }
}

async function exportSelectedPage(){
  if(!pages.length)return;
  setStatus(t('buildingPdf'));
  try{
    const out=await PDFDocument.create();
    await addItemToPdf(out,pages[selected]);
    downloadBytes(await out.save(),'pdfcraft-page-'+(selected+1)+'.pdf');
    showToast(t('pageDownloaded'));
  }catch(e){
    console.error(e);showToast(t('exportError'),'error');
  }
}

function rotate(d){
  if(!pages.length)return;
  pages[selected].rotation=(pages[selected].rotation+d+360)%360;
  rebuild();
  showToast(t('rotated'),'info');
}

function duplicateSelected(){
  if(!pages.length)return;
  const copy={...pages[selected],id:uid()};
  pages.splice(selected+1,0,copy);
  selected++;
  rebuild();
  showToast(t('duplicated'));
}

function del(){
  if(!pages.length)return;
  pages.splice(selected,1);
  if(selected>=pages.length)selected=Math.max(0,pages.length-1);
  if(!pages.length)goHome();
  else rebuild();
  showToast(t('deleted'),'info');
}

function move(d){
  const to=selected+d;
  if(to<0||to>=pages.length)return;
  [pages[selected],pages[to]]=[pages[to],pages[selected]];
  selected=to;
  rebuild();
}

function goPage(d){
  const to=selected+d;
  if(to<0||to>=pages.length)return;
  selected=to;
  rebuild(false);
}

function goHome(){
  resetDoc();
  if(thumbs)thumbs.innerHTML='';
  if(mobileThumbs)mobileThumbs.innerHTML='';
  if(canvas){
    const ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    canvas.width=0;canvas.height=0;
  }
  closeMobileDrawer();
  controls();
  applyLanguage();
}

function openMobileDrawer(){
  const drawer=el('mobilePagesDrawer');
  const backdrop=el('mobileDrawerBackdrop');
  if(drawer)drawer.classList.add('open');
  if(backdrop)backdrop.classList.add('open');
}
function closeMobileDrawer(){
  const drawer=el('mobilePagesDrawer');
  const backdrop=el('mobileDrawerBackdrop');
  if(drawer)drawer.classList.remove('open');
  if(backdrop)backdrop.classList.remove('open');
}

const on=(id,handler)=>{
  const node=el(id);
  if(node)node.onclick=handler;
};

on('brandHomeBtn',goHome);
on('homeBtn',goHome);
on('prevBtn',()=>goPage(-1));
on('nextBtn',()=>goPage(1));
on('chooseBtn',()=>fileInput&&fileInput.click());
on('toolEditCard',()=>fileInput&&fileInput.click());
on('chooseMultiBtn',()=>multiInput&&multiInput.click());
on('toolMergeCard',()=>multiInput&&multiInput.click());
on('chooseImagesBtn',()=>imageInput&&imageInput.click());
on('toolImageCard',()=>imageInput&&imageInput.click());
on('openBtn',()=>mixedInput&&mixedInput.click());
on('addBtn',()=>mixedInput&&mixedInput.click());
on('mergeBtn',()=>multiInput&&multiInput.click());
on('imagesBtn',()=>imageInput&&imageInput.click());
on('exportBtn',exportPdf);
on('exportToolbarBtn',exportPdf);
on('exportPageBtn',exportSelectedPage);
on('rotateLeft',()=>rotate(-90));
on('rotateRight',()=>rotate(90));
on('duplicatePage',duplicateSelected);
on('deletePage',del);
on('moveUp',()=>move(-1));
on('moveDown',()=>move(1));
on('propRotateBtn',()=>rotate(90));
on('propDuplicateBtn',duplicateSelected);
on('propExportBtn',exportSelectedPage);
on('propDeleteBtn',del);
on('mobilePagesBtn',openMobileDrawer);
on('closeDrawerBtn',closeMobileDrawer);
on('mobileDrawerBackdrop',closeMobileDrawer);
on('langBtn',async()=>{
  currentLang=currentLang==='en'?'zh':'en';
  try{localStorage.setItem('pdfcraft-lang',currentLang);}catch(e){}
  applyLanguage();
  if(pages.length)await renderThumbLists();
});

if(fileInput)fileInput.onchange=async e=>{await openPdfFiles(e.target.files,true);e.target.value='';};
if(multiInput)multiInput.onchange=async e=>{await openPdfFiles(e.target.files,false);e.target.value='';};
if(imageInput)imageInput.onchange=async e=>{await openImageFiles(e.target.files,pages.length===0);e.target.value='';};
if(mixedInput)mixedInput.onchange=async e=>{await openMixed(e.target.files,false);e.target.value='';};

const drop=el('dropZone');
if(drop){
  ['dragenter','dragover'].forEach(name=>drop.addEventListener(name,e=>{
    e.preventDefault();drop.classList.add('dragover');
  }));
  ['dragleave','drop'].forEach(name=>drop.addEventListener(name,e=>{
    e.preventDefault();drop.classList.remove('dragover');
  }));
  drop.addEventListener('drop',e=>openMixed(e.dataTransfer.files,pages.length===0));
}

document.addEventListener('click',e=>{
  if(!e.target.closest('.thumb-preview'))closeAllThumbMenus();
});

window.addEventListener('resize',()=>{if(pages.length)renderPage();});
controls();
applyLanguage();
