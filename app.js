import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';

const {PDFDocument,degrees,StandardFonts,rgb}=window.PDFLib;
const el=id=>document.getElementById(id);
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>[...r.querySelectorAll(s)];
const icon=id=>'<svg><use href="#'+id+'"/></svg>';

const fileInput=el('fileInput');
const multiInput=el('multiInput');
const imageInput=el('imageInput');
const mixedInput=el('mixedInput');
const compressInput=el('compressInput');
const signInput=el('signInput');
const watermarkInput=el('watermarkInput');
const splitInput=el('splitInput');
const pageNumberInput=el('pageNumberInput');
const thumbs=el('thumbs');
const mobileThumbs=el('mobileThumbs');
const canvas=el('pdfCanvas');
const overlayLayer=el('overlayLayer');
const paperWrap=el('paperWrap');

const translations={
  en:{
    tagline:'Private PDF tools, beautifully simple',downloadPdf:'Download PDF',download:'Download',
    document:'DOCUMENT',pages:'Pages',tip:'Tip',tipText:'Shift-click for a range. Cmd/Ctrl-click to select multiple pages.',
    home:'Home',undo:'Undo',redo:'Redo',rotateLeft:'Rotate left',rotateRight:'Rotate right',duplicate:'Duplicate',delete:'Delete',
    addFiles:'Add files',tools:'Tools',browserOnly:'100% local processing · No upload required',
    hero1:'Your private PDF workspace.',hero2:'Edit without uploading.',
    heroCopy:'Edit, merge, sign and export PDFs while your files stay on your device.',openPdf:'Open PDF',
    dropCopy:'or drag PDF, JPG and PNG files here',mergePdfs:'Merge PDFs',imagesToPdf:'Images to PDF',
    noAccount:'✓ No account',noUploads:'✓ Files stay on your device',freeStart:'✓ Free to use',
    popularTools:'POPULAR TOOLS',everything:'Everything you need for everyday PDFs',fastPrivate:'Fast · simple · private',
    editPdf:'Edit PDF',editPdfDesc:'Reorder, rotate and remove pages',compressPdf:'Compress PDF',
    compressPdfDesc:'Reduce file size with quality control',mergePdf:'Merge PDF',mergePdfDesc:'Combine multiple PDF files',
    imagesToPdfDesc:'Turn JPG and PNG into a polished PDF',allTools:'ALL TOOLS',moreTools:'More PDF workflows',
    splitPdf:'Split PDF',splitPdfDesc:'Extract selected pages',signPdf:'Sign PDF',signPdfDesc:'Draw and place a signature',
    watermarkPdf:'Watermark PDF',watermarkPdfDesc:'Add text watermark',pageNumbers:'Page numbers',
    pageNumbersDesc:'Add page numbers to every page',viewerHint:'Select multiple pages with Shift or Cmd/Ctrl',
    documentTools:'DOCUMENT TOOLS',selectedPage:'SELECTED PAGE',properties:'Properties',pageSize:'Page size',
    rotation:'Rotation',position:'Position',applied:'Applied',clickToRemove:'click × to remove',
    nothingApplied:'Nothing applied to this page.',exportPage:'Export page',privateLocal:'Private by default',
    privateLocalDesc:'Your files never leave this device.',unsaved:'UNSAVED CHANGES',leaveTitle:'Leave this document?',
    leaveNote:'You have changes that have not been downloaded yet.',keepEditing:'Keep editing',leave:'Leave',
    compressTitle:'Choose compression mode',compressPreserve:'Preserve text',
    compressPreserveDesc:'Keeps selectable text. Size reduction may be modest.',compressBalanced:'Balanced',
    compressBalancedDesc:'Rebuilds pages as optimized images.',compressStrong:'Maximum',
    compressStrongDesc:'Smallest file, lower image quality.',
    compressWarning:'Balanced and Maximum compression remove selectable text because pages are rasterized.',
    compressDownload:'Compress & Download',cancel:'Cancel',signatureTitle:'Draw your signature',
    signatureNote:'Draw your signature, then drag it into position on the page.',clear:'Clear',addSignature:'Add signature',
    watermarkTitle:'Add text watermark',watermarkText:'Watermark text',fontSize:'Font size',opacity:'Opacity',angle:'Angle',
    watermarkColor:'Color',repeatWatermark:'Repeat across page',applyTo:'Apply to',currentPage:'Current page',
    selectedPages:'Selected pages',allPages:'All pages',applyWatermark:'Apply watermark',
    splitTitle:'Extract selected pages',useSelectedPages:'Use selected pages',enterRange:'Enter page range',
    pageRange:'Page range',oddPages:'Odd pages',evenPages:'Even pages',extractDownload:'Extract & Download',
    imageLayout:'Page layout',orientation:'Orientation',originalSize:'Original image size',auto:'Auto',
    portrait:'Portrait',landscape:'Landscape',margin:'Margin',none:'None',small:'Small',large:'Large',
    imageFit:'Image fit',fit:'Fit',fill:'Fill',continue:'Continue',addPageNumbers:'Add page numbers',
    pageNumberPosition:'Position',bottomCenter:'Bottom center',bottomRight:'Bottom right',topRight:'Top right',
    startNumber:'Start number',apply:'Apply',ready:'Ready',loadingFiles:'Loading files…',
    filesAdded:n=>n+' file(s) added',imagesAdded:n=>n+' image(s) added',pagesReady:n=>n+' page(s) ready',
    couldNotOpen:'Could not open file',passwordPdf:'This PDF is encrypted or password-protected.',
    openError:'This file could not be opened. Try a standard PDF, JPG or PNG file.',
    largeFileWarning:mb=>'This file is about '+mb+' MB. Large PDFs may use significant browser memory. Continue?',
    buildingPdf:'Building PDF…',downloadedPdf:'PDF downloaded',pageDownloaded:'Page downloaded',
    selectedDownloaded:'Selected pages downloaded',exportError:'PDF export failed. Please try again.',
    deleted:'Page deleted',deletedMany:n=>n+' pages deleted',duplicated:'Page duplicated',rotated:'Page rotated',
    rotatedMany:n=>n+' pages rotated',signatureAdded:'Signature added — drag it to position.',
    drawSignatureFirst:'Draw a signature first.',watermarkAdded:'Watermark applied',watermarkEmpty:'Enter watermark text.',
    removed:'Removed',pageNumbersAdded:'Page numbers added',splitDownloaded:'Extracted PDF downloaded',
    splitInvalid:'Enter a valid page range.',splitOutOfRange:'One or more page numbers are outside this document.',
    selectedCount:n=>n+' selected',selectedPagesCount:n=>n+' page(s) selected',compressing:'Compressing PDF…',
    compressed:'Compressed PDF downloaded',cancelled:'Operation cancelled',loadingPage:(a,b)=>'Loading '+a+' / '+b,
    renderingPage:(a,b)=>'Processing '+a+' / '+b,working:'Working…',imageSettingsApplied:'Image layout applied',
    watermarkLabel:'Watermark',signatureLabel:'Signature',pageNumberLabel:'Page number',remove:'Remove',
    pageOf:(a,b)=>'Page '+a+' of '+b
  },
  zh:{
    tagline:'漂亮、簡單、私密的 PDF 工具',downloadPdf:'下載 PDF',download:'下載',
    document:'文件',pages:'頁面',tip:'提示',tipText:'Shift 點選範圍；Cmd/Ctrl 點選可多選頁面。',
    home:'首頁',undo:'復原',redo:'重做',rotateLeft:'向左旋轉',rotateRight:'向右旋轉',duplicate:'複製',delete:'刪除',
    addFiles:'加入檔案',tools:'工具',browserOnly:'100% 本機處理 · 無需上傳',
    hero1:'你的私密 PDF 工作空間。',hero2:'不用上傳也能編輯。',
    heroCopy:'編輯、合併、簽署及匯出 PDF，檔案始終留在你的裝置。',openPdf:'開啟 PDF',
    dropCopy:'或直接拖放 PDF、JPG、PNG 到這裡',mergePdfs:'合併 PDF',imagesToPdf:'圖片轉 PDF',
    noAccount:'✓ 無需帳戶',noUploads:'✓ 檔案留在你的裝置',freeStart:'✓ 免費使用',
    popularTools:'熱門工具',everything:'日常 PDF 所需工具，一站完成',fastPrivate:'快速 · 簡單 · 私密',
    editPdf:'編輯 PDF',editPdfDesc:'排序、旋轉及刪除頁面',compressPdf:'壓縮 PDF',
    compressPdfDesc:'控制畫質並縮小檔案',mergePdf:'合併 PDF',mergePdfDesc:'合併多個 PDF 檔案',
    imagesToPdfDesc:'把 JPG、PNG 製作成整齊的 PDF',allTools:'所有工具',moreTools:'更多 PDF 工作流程',
    splitPdf:'分割 PDF',splitPdfDesc:'擷取指定頁面',signPdf:'簽署 PDF',signPdfDesc:'手寫並拖曳放置簽名',
    watermarkPdf:'PDF 加水印',watermarkPdfDesc:'加入文字水印',pageNumbers:'加入頁碼',
    pageNumbersDesc:'在每一頁加入頁碼',viewerHint:'使用 Shift 或 Cmd/Ctrl 多選頁面',
    documentTools:'文件工具',selectedPage:'已選頁面',properties:'屬性',pageSize:'頁面尺寸',
    rotation:'旋轉',position:'位置',applied:'已套用',clickToRemove:'按 × 即可移除',
    nothingApplied:'此頁尚未套用其他元素。',exportPage:'匯出此頁',privateLocal:'預設私密',
    privateLocalDesc:'你的檔案不會離開這部裝置。',unsaved:'尚未下載',leaveTitle:'要離開目前文件嗎？',
    leaveNote:'目前有尚未下載的變更。',keepEditing:'繼續編輯',leave:'離開',
    compressTitle:'選擇壓縮模式',compressPreserve:'保留文字',
    compressPreserveDesc:'保留可選取文字；縮小幅度可能較少。',compressBalanced:'平衡',
    compressBalancedDesc:'把頁面重建成最佳化圖片。',compressStrong:'最大壓縮',
    compressStrongDesc:'檔案最小，但圖片品質較低。',
    compressWarning:'平衡及最大壓縮會把頁面點陣化，因此文字將無法選取。',
    compressDownload:'壓縮並下載',cancel:'取消',signatureTitle:'繪製你的簽名',
    signatureNote:'手寫簽名後，可直接在頁面上拖曳到需要的位置。',clear:'清除',addSignature:'加入簽名',
    watermarkTitle:'加入文字水印',watermarkText:'水印文字',fontSize:'字體大小',opacity:'透明度',angle:'旋轉角度',
    watermarkColor:'顏色',repeatWatermark:'整頁重複水印',applyTo:'套用到',currentPage:'目前頁面',
    selectedPages:'已選頁面',allPages:'全部頁面',applyWatermark:'套用水印',
    splitTitle:'擷取指定頁面',useSelectedPages:'使用已選頁面',enterRange:'輸入頁碼範圍',
    pageRange:'頁碼範圍',oddPages:'奇數頁',evenPages:'偶數頁',extractDownload:'擷取並下載',
    imageLayout:'頁面版面',orientation:'方向',originalSize:'原始圖片尺寸',auto:'自動',
    portrait:'直向',landscape:'橫向',margin:'邊界',none:'無',small:'小',large:'大',
    imageFit:'圖片填入方式',fit:'完整顯示',fill:'填滿頁面',continue:'繼續',addPageNumbers:'加入頁碼',
    pageNumberPosition:'頁碼位置',bottomCenter:'下方中央',bottomRight:'右下角',topRight:'右上角',
    startNumber:'起始頁碼',apply:'套用',ready:'準備就緒',loadingFiles:'正在載入檔案…',
    filesAdded:n=>'已加入 '+n+' 個檔案',imagesAdded:n=>'已加入 '+n+' 張圖片',pagesReady:n=>'已載入 '+n+' 頁',
    couldNotOpen:'無法開啟檔案',passwordPdf:'此 PDF 已加密或需要密碼。',
    openError:'無法開啟這個檔案，請使用標準 PDF、JPG 或 PNG 再試一次。',
    largeFileWarning:mb=>'這個檔案約 '+mb+' MB，大型 PDF 可能會佔用較多瀏覽器記憶體。仍要繼續嗎？',
    buildingPdf:'正在建立 PDF…',downloadedPdf:'PDF 已下載',pageDownloaded:'頁面已下載',
    selectedDownloaded:'已選頁面已下載',exportError:'PDF 匯出失敗，請再試一次。',
    deleted:'頁面已刪除',deletedMany:n=>'已刪除 '+n+' 頁',duplicated:'頁面已複製',rotated:'頁面已旋轉',
    rotatedMany:n=>'已旋轉 '+n+' 頁',signatureAdded:'簽名已加入，可直接拖曳調整位置。',
    drawSignatureFirst:'請先畫上簽名。',watermarkAdded:'水印已套用',watermarkEmpty:'請輸入水印文字。',
    removed:'已移除',pageNumbersAdded:'頁碼已加入',splitDownloaded:'分割 PDF 已下載',
    splitInvalid:'請輸入有效的頁碼範圍。',splitOutOfRange:'其中一個頁碼超出文件頁數。',
    selectedCount:n=>'已選 '+n+' 頁',selectedPagesCount:n=>'已選擇 '+n+' 頁',compressing:'正在壓縮 PDF…',
    compressed:'壓縮 PDF 已下載',cancelled:'操作已取消',loadingPage:(a,b)=>'正在載入 '+a+' / '+b,
    renderingPage:(a,b)=>'正在處理 '+a+' / '+b,working:'處理中…',imageSettingsApplied:'圖片版面已套用',
    watermarkLabel:'水印',signatureLabel:'簽名',pageNumberLabel:'頁碼',remove:'移除',
    pageOf:(a,b)=>'第 '+a+' 頁，共 '+b+' 頁'
  }
};

let currentLang='en';
try{currentLang=localStorage.getItem('pdfcraft-lang')||'en';}catch(e){}

let sourceDocs=[];
let imageSources=[];
let pages=[];
let selected=0;
let selectedIds=new Set();
let selectionAnchor=0;
let history=[];
let future=[];
let dirty=false;
let renderToken=0;
let toastTimer=0;
let abortRequested=false;
let pendingImageFiles=[];
let previewWatermark=null;
let previewWatermarkPageId=null;
let pendingHome=false;

const uid=()=>Math.random().toString(36).slice(2)+Date.now().toString(36);
const t=(key,...args)=>{
  const value=translations[currentLang][key]??translations.en[key]??key;
  return typeof value==='function'?value(...args):value;
};
const setStatus=m=>{const n=el('status');if(n)n.textContent=m;};

function cloneSignature(s){
  return {...s,bytes:s.bytes?new Uint8Array(s.bytes):undefined};
}
function clonePage(p){
  return {
    ...p,
    signatures:(p.signatures||[]).map(cloneSignature),
    watermarks:(p.watermarks||[]).map(w=>({...w})),
    pageNumber:p.pageNumber?{...p.pageNumber}:null,
    layout:p.layout?{...p.layout}:undefined
  };
}
function snapshot(){
  return {pages:pages.map(clonePage),selected,selectedIds:[...selectedIds]};
}
function restore(state){
  pages=state.pages.map(clonePage);
  selected=Math.min(state.selected,Math.max(0,pages.length-1));
  selectedIds=new Set(state.selectedIds.filter(id=>pages.some(p=>p.id===id)));
  if(!selectedIds.size&&pages[selected])selectedIds.add(pages[selected].id);
  rebuild();
}
function checkpoint(){
  history.push(snapshot());
  if(history.length>30)history.shift();
  future=[];
  dirty=true;
  updateHistoryControls();
}
function undo(){
  if(!history.length)return;
  future.push(snapshot());
  const state=history.pop();
  restore(state);
  dirty=true;
  updateHistoryControls();
}
function redo(){
  if(!future.length)return;
  history.push(snapshot());
  const state=future.pop();
  restore(state);
  dirty=true;
  updateHistoryControls();
}
function updateHistoryControls(){
  ['undoBtn','mobileUndoBtn'].forEach(id=>{const n=el(id);if(n)n.disabled=!history.length;});
  const redoBtn=el('redoBtn');if(redoBtn)redoBtn.disabled=!future.length;
}

function showToast(message,type='success'){
  setStatus(message);
  const stack=el('toastStack');if(!stack)return;
  const toast=document.createElement('div');
  toast.className='toast '+type;
  toast.innerHTML='<span class="toast-icon">'+(type==='error'?'!':type==='info'?'i':'✓')+'</span><span></span>';
  toast.lastElementChild.textContent=message;
  stack.appendChild(toast);
  requestAnimationFrame(()=>toast.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>{toast.classList.remove('show');setTimeout(()=>toast.remove(),220);},2600);
}

function applyLanguage(){
  document.documentElement.lang=currentLang==='zh'?'zh-Hant':'en';
  qa('[data-i18n]').forEach(node=>{
    const key=node.dataset.i18n;
    if(translations[currentLang][key]!==undefined)node.textContent=t(key);
  });
  const langBtn=el('langBtn');if(langBtn)langBtn.textContent=currentLang==='en'?'中文':'EN';
  updateSelectionUI();
  if(pages.length){
    const label=el('pageLabel');if(label)label.textContent=t('pageOf',selected+1,pages.length);
  }else setStatus(t('ready'));
}

function setDisabled(id,value){const n=el(id);if(n)n.disabled=value;}
function controls(){
  const has=pages.length>0;
  const shell=el('appShell');if(shell)shell.classList.toggle('editor-mode',has);
  ['exportBtn','exportToolbarBtn','mobileDownloadBtn','rotateLeft','rotateRight','duplicatePage','deletePage']
    .forEach(id=>setDisabled(id,!has));
  setDisabled('prevBtn',!has||selected===0);
  setDisabled('nextBtn',!has||selected===pages.length-1);
  const count=el('pageCount');if(count)count.textContent=pages.length;
  const mcount=el('mobilePageCount');if(mcount)mcount.textContent=pages.length;
  const chip=el('pageChip');if(chip)chip.textContent=has?(selected+1)+' / '+pages.length:'—';
  const empty=el('emptyState');if(empty)empty.classList.toggle('hidden',has);
  const viewer=el('viewerWrap');if(viewer)viewer.classList.toggle('hidden',!has);
  updateHistoryControls();
  updateSelectionUI();
}

function updateSelectionUI(){
  const indexes=getSelectedIndices();
  const bar=el('selectionBar');
  if(bar)bar.classList.toggle('hidden',indexes.length<2);
  const count=el('selectionCount');if(count)count.textContent=t('selectedCount',indexes.length);
  const splitCount=el('splitSelectedCount');if(splitCount)splitCount.textContent=indexes.length;
}

function getSelectedIndices(){
  const ids=selectedIds;
  const indexes=[];
  pages.forEach((p,i)=>{if(ids.has(p.id))indexes.push(i);});
  if(!indexes.length&&pages[selected])indexes.push(selected);
  return indexes;
}

function resetDoc(){
  sourceDocs=[];imageSources=[];pages=[];selected=0;selectedIds=new Set();history=[];future=[];dirty=false;
}

function markLoaded(){
  history=[];future=[];dirty=false;updateHistoryControls();
}

function showProgress(title,total){
  abortRequested=false;
  const panel=el('progressPanel');if(panel)panel.hidden=false;
  const titleNode=el('progressTitle');if(titleNode)titleNode.textContent=title;
  updateProgress(0,total);
}
function updateProgress(done,total){
  const text=el('progressText');if(text)text.textContent=done+' / '+total;
  const bar=el('progressBar');if(bar)bar.style.width=(total?Math.round(done/total*100):0)+'%';
}
function hideProgress(){const panel=el('progressPanel');if(panel)panel.hidden=true;}

function isPdf(file){return file.type==='application/pdf'||file.name.toLowerCase().endsWith('.pdf');}
function isImage(file){
  const n=file.name.toLowerCase();
  return file.type==='image/jpeg'||file.type==='image/png'||n.endsWith('.jpg')||n.endsWith('.jpeg')||n.endsWith('.png');
}
function largeFileOkay(file){
  if(file.size<80*1024*1024)return true;
  const mb=Math.round(file.size/1024/1024);
  return window.confirm(t('largeFileWarning',mb));
}

async function loadPdf(bytes){
  const pdfjsBytes=new Uint8Array(bytes).slice();
  const pdfLibBytes=new Uint8Array(bytes).slice();
  const pdfjsDoc=await pdfjsLib.getDocument({data:pdfjsBytes}).promise;
  const libDoc=await PDFDocument.load(pdfLibBytes,{ignoreEncryption:false});
  const docIndex=sourceDocs.length;
  sourceDocs.push({pdfjsDoc,libDoc,bytes:new Uint8Array(bytes).slice()});
  for(let i=0;i<pdfjsDoc.numPages;i++){
    pages.push({type:'pdf',docIndex,pageIndex:i,rotation:0,signatures:[],watermarks:[],pageNumber:null,id:uid()});
  }
}

async function decodeImage(file){
  const bytes=new Uint8Array(await file.arrayBuffer());
  const mime=file.type==='image/png'||file.name.toLowerCase().endsWith('.png')?'image/png':'image/jpeg';
  const blob=new Blob([bytes],{type:mime});
  let bitmap;
  if('createImageBitmap' in window){
    try{bitmap=await createImageBitmap(blob);}catch(e){}
  }
  if(!bitmap){
    bitmap=await new Promise((resolve,reject)=>{
      const url=URL.createObjectURL(blob);const img=new Image();
      img.onload=()=>{URL.revokeObjectURL(url);resolve(img);};
      img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Image decode failed'));};
      img.src=url;
    });
  }
  return {bytes,mime,bitmap,width:bitmap.naturalWidth||bitmap.width,height:bitmap.naturalHeight||bitmap.height,name:file.name};
}

async function loadImageFile(file,layout){
  const src=await decodeImage(file);
  const imageIndex=imageSources.length;
  imageSources.push(src);
  pages.push({type:'image',imageIndex,rotation:0,signatures:[],watermarks:[],pageNumber:null,layout:{...layout},id:uid()});
}

function friendlyOpenError(e){
  const msg=String(e?.message||e||'');
  if(/password|encrypted|PasswordException/i.test(msg))return t('passwordPdf');
  return t('openError');
}

async function openMixed(files,replace=false,layout=null){
  const list=[...files].filter(f=>isPdf(f)||isImage(f));
  if(!list.length)return;
  if(!list.every(largeFileOkay))return;
  const old={src:sourceDocs.length,img:imageSources.length,page:pages.length};
  if(replace)resetDoc();
  showProgress(t('loadingFiles'),list.length);
  try{
    for(let i=0;i<list.length;i++){
      const file=list[i];
      if(isPdf(file))await loadPdf(await file.arrayBuffer());
      else await loadImageFile(file,layout||defaultImageLayout());
      updateProgress(i+1,list.length);
    }
    selected=Math.min(selected,Math.max(0,pages.length-1));
    selectedIds=new Set(pages[selected]?[pages[selected].id]:[]);
    await rebuild();
    if(replace)markLoaded();else{dirty=true;history=[];future=[];}
    showToast(list.every(isImage)?t('imagesAdded',list.length):t('filesAdded',list.length));
  }catch(e){
    console.error('Open error',e);
    if(!replace){
      sourceDocs.splice(old.src);imageSources.splice(old.img);pages.splice(old.page);
    }
    showToast(friendlyOpenError(e),'error');
    if(replace)resetDoc();
    await rebuild();
  }finally{hideProgress();}
}
async function openPdfFiles(files,replace=false){return openMixed([...files].filter(isPdf),replace);}
async function openImageFiles(files,replace=false,layout=defaultImageLayout()){return openMixed([...files].filter(isImage),replace,layout);}

function defaultImageLayout(){return {pageSize:'original',orientation:'auto',margin:24,fit:'fit'};}
function readImageLayout(){
  return {
    pageSize:el('imagePageSize')?.value||'original',
    orientation:el('imageOrientation')?.value||'auto',
    margin:Number(el('imageMargin')?.value||24),
    fit:el('imageFit')?.value||'fit'
  };
}
function getImagePageSize(src,layout){
  let w=src.width,h=src.height;
  if(layout.pageSize==='a4'){w=595;h=842;}
  if(layout.pageSize==='letter'){w=612;h=792;}
  if(layout.orientation==='portrait'&&w>h)[w,h]=[h,w];
  if(layout.orientation==='landscape'&&h>w)[w,h]=[h,w];
  if(layout.orientation==='auto'&&layout.pageSize!=='original'){
    if(src.width>src.height&&h>w)[w,h]=[h,w];
  }
  const max=1440;
  if(layout.pageSize==='original'&&Math.max(w,h)>max){
    const s=max/Math.max(w,h);w*=s;h*=s;
  }
  return {w:Math.max(1,w),h:Math.max(1,h)};
}
function imagePlacement(src,pageW,pageH,layout){
  const m=Math.min(layout.margin||0,Math.min(pageW,pageH)*.2);
  const aw=Math.max(1,pageW-m*2),ah=Math.max(1,pageH-m*2);
  const fitScale=layout.fit==='fill'?Math.max(aw/src.width,ah/src.height):Math.min(aw/src.width,ah/src.height);
  const w=src.width*fitScale,h=src.height*fitScale;
  return {x:(pageW-w)/2,y:(pageH-h)/2,w,h};
}

function hexToRgb(hex){
  const v=(hex||'#555555').replace('#','');
  return {r:parseInt(v.slice(0,2),16)||85,g:parseInt(v.slice(2,4),16)||85,b:parseInt(v.slice(4,6),16)||85};
}
function watermarkMarksFor(item,includePreview=false){
  const arr=[...(item.watermarks||[])];
  if(includePreview&&previewWatermark&&previewWatermarkPageId===item.id)arr.push({...previewWatermark,preview:true});
  return arr;
}
function drawWatermarkMark(ctx,mark,w,h){
  const ratio=w/595;
  const font=Math.max(10,(mark.size||42)*ratio);
  const {r,g,b}=hexToRgb(mark.color);
  ctx.save();
  ctx.globalAlpha=Math.max(.05,Math.min(.95,mark.opacity||.25));
  ctx.fillStyle='rgb('+r+','+g+','+b+')';
  ctx.font='700 '+font+'px sans-serif';
  ctx.textAlign='center';ctx.textBaseline='middle';
  if(mark.tile){
    const stepX=Math.max(font*5,w*.42),stepY=Math.max(font*3,h*.25);
    for(let y=-stepY;y<h+stepY;y+=stepY){
      for(let x=-stepX;x<w+stepX;x+=stepX){
        ctx.save();ctx.translate(x,y);ctx.rotate((mark.angle||-30)*Math.PI/180);ctx.fillText(mark.text,0,0);ctx.restore();
      }
    }
  }else{
    ctx.translate(w/2,h/2);ctx.rotate((mark.angle||0)*Math.PI/180);ctx.fillText(mark.text,0,0);
  }
  ctx.restore();
}
function drawWatermarksOnCanvas(ctx,item,w,h,includePreview=false){
  watermarkMarksFor(item,includePreview).forEach(mark=>drawWatermarkMark(ctx,mark,w,h));
}
function drawPageNumberOnCanvas(ctx,item,w,h){
  const pn=item.pageNumber;if(!pn)return;
  const ratio=w/595;const size=Math.max(9,12*ratio);const margin=Math.max(10,20*ratio);
  let x=w/2,y=h-margin,align='center';
  if(pn.position==='bottom-right'){x=w-margin;align='right';}
  if(pn.position==='top-right'){x=w-margin;y=margin;align='right';}
  ctx.save();ctx.fillStyle='#555';ctx.font='600 '+size+'px sans-serif';ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(String(pn.number),x,y);ctx.restore();
}
async function drawSignaturesOnCanvas(ctx,item,w,h){
  const sigs=item.signatures||[];
  for(const sig of sigs){
    const img=await new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=sig.dataUrl;});
    const sw=w*(sig.widthPct||.28);const sh=sw*(sig.aspect||.34);
    ctx.drawImage(img,w*(sig.xPct||.35),h*(sig.yPct||.68),sw,sh);
  }
}

async function renderPdfItem(item){
  const token=++renderToken;
  const page=await sourceDocs[item.docIndex].pdfjsDoc.getPage(item.pageIndex+1);
  const base=page.getViewport({scale:1,rotation:item.rotation});
  const maxWidth=Math.min(900,Math.max(280,el('dropZone').clientWidth-100));
  const scale=Math.min(1.5,maxWidth/base.width);
  const vp=page.getViewport({scale,rotation:item.rotation});
  const dpr=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.floor(vp.width*dpr);canvas.height=Math.floor(vp.height*dpr);
  canvas.style.width=vp.width+'px';canvas.style.height=vp.height+'px';
  const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);
  if(token!==renderToken)return;
  await page.render({canvasContext:ctx,viewport:vp}).promise;
  drawWatermarksOnCanvas(ctx,item,vp.width,vp.height,true);
  drawPageNumberOnCanvas(ctx,item,vp.width,vp.height);
  sizePaperWrap(vp.width,vp.height);
}
async function renderImageItem(item){
  const src=imageSources[item.imageIndex],layout=item.layout||defaultImageLayout();
  const pg=getImagePageSize(src,layout);
  const rot=((item.rotation%360)+360)%360;
  let pw=pg.w,ph=pg.h;if(rot===90||rot===270)[pw,ph]=[ph,pw];
  const maxWidth=Math.min(900,Math.max(280,el('dropZone').clientWidth-100));
  const scale=Math.min(1,maxWidth/pw);
  const cssW=pw*scale,cssH=ph*scale,dpr=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.floor(cssW*dpr);canvas.height=Math.floor(cssH*dpr);
  canvas.style.width=cssW+'px';canvas.style.height=cssH+'px';
  const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.fillStyle='#fff';ctx.fillRect(0,0,cssW,cssH);
  ctx.save();ctx.translate(cssW/2,cssH/2);ctx.rotate(rot*Math.PI/180);
  const baseW=pg.w*scale,baseH=pg.h*scale;const place=imagePlacement(src,baseW,baseH,{...layout,margin:(layout.margin||0)*scale});
  ctx.beginPath();ctx.rect(-baseW/2,-baseH/2,baseW,baseH);ctx.clip();
  ctx.drawImage(src.bitmap,-baseW/2+place.x,-baseH/2+place.y,place.w,place.h);ctx.restore();
  drawWatermarksOnCanvas(ctx,item,cssW,cssH,true);drawPageNumberOnCanvas(ctx,item,cssW,cssH);
  sizePaperWrap(cssW,cssH);
}
function sizePaperWrap(w,h){
  if(paperWrap){paperWrap.style.width=w+'px';paperWrap.style.height=h+'px';}
  if(overlayLayer){overlayLayer.style.width=w+'px';overlayLayer.style.height=h+'px';}
}

function renderSignatureOverlays(){
  if(!overlayLayer||!pages.length)return;
  overlayLayer.innerHTML='';
  const item=pages[selected];
  (item.signatures||[]).forEach((sig,index)=>{
    const node=document.createElement('div');node.className='signature-overlay';node.dataset.index=index;
    node.style.left=((sig.xPct||.35)*100)+'%';node.style.top=((sig.yPct||.68)*100)+'%';node.style.width=((sig.widthPct||.28)*100)+'%';
    const img=document.createElement('img');img.src=sig.dataUrl;img.draggable=false;
    const grip=document.createElement('span');grip.className='signature-grip';grip.textContent='↘';
    node.append(img,grip);overlayLayer.appendChild(node);
    let dragging=false,resizing=false,startX=0,startY=0,start={};
    const pointerDown=(e,mode)=>{
      e.preventDefault();e.stopPropagation();checkpoint();
      dragging=mode==='drag';resizing=mode==='resize';startX=e.clientX;startY=e.clientY;start={x:sig.xPct||.35,y:sig.yPct||.68,w:sig.widthPct||.28};
      node.setPointerCapture?.(e.pointerId);
    };
    node.addEventListener('pointerdown',e=>{if(e.target===grip)return;pointerDown(e,'drag');});
    grip.addEventListener('pointerdown',e=>pointerDown(e,'resize'));
    node.addEventListener('pointermove',e=>{
      if(!dragging&&!resizing)return;
      const rect=overlayLayer.getBoundingClientRect();
      if(dragging){
        sig.xPct=Math.max(0,Math.min(.95,start.x+(e.clientX-startX)/rect.width));
        sig.yPct=Math.max(0,Math.min(.95,start.y+(e.clientY-startY)/rect.height));
        node.style.left=(sig.xPct*100)+'%';node.style.top=(sig.yPct*100)+'%';
      }else{
        sig.widthPct=Math.max(.08,Math.min(.65,start.w+(e.clientX-startX)/rect.width));
        node.style.width=(sig.widthPct*100)+'%';
      }
    });
    node.addEventListener('pointerup',()=>{dragging=false;resizing=false;updateAppliedPanel();});
  });
}

async function renderPage(){
  if(!pages.length)return;
  const item=pages[selected];
  if(item.type==='image')await renderImageItem(item);else await renderPdfItem(item);
  const label=el('pageLabel');if(label)label.textContent=t('pageOf',selected+1,pages.length);
  const chip=el('pageChip');if(chip)chip.textContent=(selected+1)+' / '+pages.length;
  renderSignatureOverlays();
  await updateProperties();
}

async function getPageDimensions(item){
  if(item.type==='image'){
    const src=imageSources[item.imageIndex],pg=getImagePageSize(src,item.layout||defaultImageLayout());
    const rot=((item.rotation%360)+360)%360;
    return rot===90||rot===270?{width:pg.h,height:pg.w}:{width:pg.w,height:pg.h};
  }
  const p=await sourceDocs[item.docIndex].pdfjsDoc.getPage(item.pageIndex+1);
  const vp=p.getViewport({scale:1,rotation:item.rotation});return {width:vp.width,height:vp.height};
}
async function updateProperties(){
  if(!pages.length)return;
  const item=pages[selected],dims=await getPageDimensions(item);
  if(el('propertyPageNumber'))el('propertyPageNumber').textContent=selected+1;
  if(el('propertyType'))el('propertyType').textContent=item.type==='image'?'IMAGE':'PDF';
  if(el('propertySize'))el('propertySize').textContent=Math.round(dims.width)+' × '+Math.round(dims.height)+(item.type==='image'?' px':' pt');
  if(el('propertyRotation'))el('propertyRotation').textContent=((item.rotation%360)+360)%360+'°';
  if(el('propertyPosition'))el('propertyPosition').textContent=(selected+1)+' / '+pages.length;
  updateAppliedPanel();
}
function updateAppliedPanel(){
  const wrap=el('appliedItems');if(!wrap||!pages.length)return;
  wrap.innerHTML='';const item=pages[selected];let count=0;
  (item.watermarks||[]).forEach((w,i)=>{count++;wrap.appendChild(appliedChip(t('watermarkLabel')+': '+w.text,()=>removeApplied('watermark',i)));});
  (item.signatures||[]).forEach((s,i)=>{count++;wrap.appendChild(appliedChip(t('signatureLabel')+' '+(i+1),()=>removeApplied('signature',i)));});
  if(item.pageNumber){count++;wrap.appendChild(appliedChip(t('pageNumberLabel')+': '+item.pageNumber.number,()=>removeApplied('pageNumber',0)));}
  if(!count){const e=document.createElement('div');e.className='empty-applied';e.textContent=t('nothingApplied');wrap.appendChild(e);}
}
function appliedChip(label,onRemove){
  const row=document.createElement('div');row.className='applied-chip';
  const span=document.createElement('span');span.textContent=label;
  const b=document.createElement('button');b.type='button';b.innerHTML=icon('i-x');b.title=t('remove');b.onclick=onRemove;
  row.append(span,b);return row;
}
function removeApplied(type,index){
  if(!pages.length)return;checkpoint();const item=pages[selected];
  if(type==='watermark')item.watermarks.splice(index,1);
  if(type==='signature')item.signatures.splice(index,1);
  if(type==='pageNumber')item.pageNumber=null;
  rebuild(false);showToast(t('removed'),'info');
}

async function makeThumbCanvas(item){
  const dims=await getPageDimensions(item);const scale=Math.min(150/dims.width,170/dims.height,.28);
  const c=document.createElement('canvas');c.width=Math.max(1,Math.round(dims.width*scale));c.height=Math.max(1,Math.round(dims.height*scale));
  const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);
  if(item.type==='pdf'){
    const p=await sourceDocs[item.docIndex].pdfjsDoc.getPage(item.pageIndex+1);
    const vp=p.getViewport({scale,rotation:item.rotation});c.width=Math.max(1,Math.round(vp.width));c.height=Math.max(1,Math.round(vp.height));
    await p.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;
  }else{
    const src=imageSources[item.imageIndex],layout=item.layout||defaultImageLayout(),pg=getImagePageSize(src,layout);
    const rot=((item.rotation%360)+360)%360;
    let bw=pg.w,bh=pg.h;if(rot===90||rot===270)[bw,bh]=[bh,bw];
    c.width=Math.max(1,Math.round(bw*scale));c.height=Math.max(1,Math.round(bh*scale));
    const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);
    x.save();x.translate(c.width/2,c.height/2);x.rotate(rot*Math.PI/180);
    const baseW=pg.w*scale,baseH=pg.h*scale,place=imagePlacement(src,baseW,baseH,{...layout,margin:(layout.margin||0)*scale});
    x.beginPath();x.rect(-baseW/2,-baseH/2,baseW,baseH);x.clip();x.drawImage(src.bitmap,-baseW/2+place.x,-baseH/2+place.y,place.w,place.h);x.restore();
  }
  const x=c.getContext('2d');drawWatermarksOnCanvas(x,item,c.width,c.height,false);drawPageNumberOnCanvas(x,item,c.width,c.height);await drawSignaturesOnCanvas(x,item,c.width,c.height);
  return c;
}

function handlePageSelection(index,e){
  const id=pages[index].id;
  if(e?.shiftKey){
    const a=Math.min(selectionAnchor,index),b=Math.max(selectionAnchor,index);selectedIds=new Set(pages.slice(a,b+1).map(p=>p.id));
  }else if(e?.metaKey||e?.ctrlKey){
    if(selectedIds.has(id)&&selectedIds.size>1)selectedIds.delete(id);else selectedIds.add(id);
    selectionAnchor=index;
  }else{
    selectedIds=new Set([id]);selectionAnchor=index;
  }
  selected=index;rebuild(false);
}
async function createThumb(item,index,mobile=false){
  const box=document.createElement('div');box.className='thumb'+(selectedIds.has(item.id)?' selected':'')+(index===selected?' active':'')+(mobile?' mobile-thumb':'');
  box.dataset.id=item.id;box.draggable=!mobile;
  const preview=document.createElement('div');preview.className='thumb-preview';preview.appendChild(await makeThumbCanvas(item));
  const check=document.createElement('span');check.className='thumb-check';check.innerHTML=icon('i-check');preview.appendChild(check);
  const more=document.createElement('button');more.type='button';more.className='thumb-more';more.innerHTML=icon('i-more');preview.appendChild(more);
  const menu=document.createElement('div');menu.className='thumb-menu';
  [['rotate','i-rotate-right',t('rotateRight')],['duplicate','i-copy',t('duplicate')],['delete','i-trash',t('delete')]].forEach(([action,ico,label])=>{
    const b=document.createElement('button');b.type='button';if(action==='delete')b.className='danger';
    b.innerHTML=icon(ico)+'<span></span>';b.lastElementChild.textContent=label;
    b.onclick=e=>{e.stopPropagation();closeThumbMenus();selected=index;selectedIds=new Set([item.id]);if(action==='rotate')rotateSelected(90);if(action==='duplicate')duplicateSelected();if(action==='delete')deleteSelected();};
    menu.appendChild(b);
  });
  preview.appendChild(menu);
  more.onclick=e=>{e.stopPropagation();const open=menu.classList.contains('open');closeThumbMenus();menu.classList.toggle('open',!open);};
  const meta=document.createElement('div');meta.className='thumb-meta';meta.innerHTML='<strong>'+(index+1)+'</strong><span>'+(item.type==='image'?'IMG':'PDF')+'</span>';
  box.append(preview,meta);
  box.onclick=e=>{handlePageSelection(index,e);if(mobile)closeMobileDrawer();};
  if(!mobile){
    box.addEventListener('dragstart',e=>{if(selectedIds.size>1){e.preventDefault();return;}e.dataTransfer.setData('text/plain',String(index));});
    box.addEventListener('dragover',e=>e.preventDefault());
    box.addEventListener('drop',e=>{e.preventDefault();const from=Number(e.dataTransfer.getData('text/plain'));if(!Number.isFinite(from)||from===index)return;checkpoint();const[m]=pages.splice(from,1);pages.splice(index,0,m);selected=index;selectedIds=new Set([m.id]);rebuild();});
  }
  return box;
}
function closeThumbMenus(){qa('.thumb-menu.open').forEach(m=>m.classList.remove('open'));}
async function renderThumbLists(){
  if(thumbs)thumbs.innerHTML='';if(mobileThumbs)mobileThumbs.innerHTML='';
  for(let i=0;i<pages.length;i++){
    if(thumbs)thumbs.appendChild(await createThumb(pages[i],i,false));
    if(mobileThumbs)mobileThumbs.appendChild(await createThumb(pages[i],i,true));
  }
}
async function rebuild(rebuildThumbs=true){
  controls();applyLanguage();
  if(!pages.length){if(thumbs)thumbs.innerHTML='';if(mobileThumbs)mobileThumbs.innerHTML='';return;}
  if(rebuildThumbs)await renderThumbLists();
  else qa('.thumb').forEach(n=>{const id=n.dataset.id;n.classList.toggle('active',pages[selected]?.id===id);n.classList.toggle('selected',selectedIds.has(id));});
  await renderPage();
}

function rotateSelected(d){
  if(!pages.length)return;checkpoint();const idxs=getSelectedIndices();idxs.forEach(i=>pages[i].rotation=(pages[i].rotation+d+360)%360);rebuild();showToast(idxs.length>1?t('rotatedMany',idxs.length):t('rotated'),'info');
}
function duplicateSelected(){
  if(!pages.length)return;checkpoint();const p=pages[selected];const copy=clonePage(p);copy.id=uid();pages.splice(selected+1,0,copy);selected++;selectedIds=new Set([copy.id]);rebuild();showToast(t('duplicated'));
}
function deleteSelected(){
  if(!pages.length)return;const idxs=getSelectedIndices();checkpoint();[...idxs].sort((a,b)=>b-a).forEach(i=>pages.splice(i,1));
  if(!pages.length){goHomeForce();return;}
  selected=Math.min(idxs[0]||0,pages.length-1);selectedIds=new Set([pages[selected].id]);rebuild();showToast(idxs.length>1?t('deletedMany',idxs.length):t('deleted'),'info');
}
function goPage(d){const to=selected+d;if(to<0||to>=pages.length)return;selected=to;selectedIds=new Set([pages[selected].id]);selectionAnchor=selected;rebuild(false);}
function bulkExport(){exportIndices(getSelectedIndices(),'pdfcraft-selected-pages.pdf',t('selectedDownloaded'));}

function openTools(){const d=el('toolsDrawer');if(d){d.classList.add('open');d.setAttribute('aria-hidden','false');}}
function closeTools(){const d=el('toolsDrawer');if(d){d.classList.remove('open');d.setAttribute('aria-hidden','true');}}
function openMobileDrawer(){el('mobilePagesDrawer')?.classList.add('open');el('mobileDrawerBackdrop')?.classList.add('open');}
function closeMobileDrawer(){el('mobilePagesDrawer')?.classList.remove('open');el('mobileDrawerBackdrop')?.classList.remove('open');}

function openModal(id){
  closeTools();const back=el('modalBackdrop'),m=el(id);if(back){back.hidden=false;back.classList.add('open');}if(m){m.hidden=false;m.classList.add('open');}
}
function closeModals(){
  qa('.modal-card.open').forEach(n=>{n.classList.remove('open');n.hidden=true;});
  const back=el('modalBackdrop');if(back){back.classList.remove('open');back.hidden=true;}
  if(previewWatermark){previewWatermark=null;previewWatermarkPageId=null;if(pages.length)renderPage();}
}
function requestHome(){
  if(dirty&&pages.length){pendingHome=true;openModal('leaveModal');}else goHomeForce();
}
function goHomeForce(){
  pendingHome=false;closeModals();closeTools();closeMobileDrawer();resetDoc();
  if(canvas){canvas.width=0;canvas.height=0;}if(overlayLayer)overlayLayer.innerHTML='';
  controls();applyLanguage();
}

function dataUrlToBytes(dataUrl){
  const bin=atob(dataUrl.split(',')[1]);const out=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)out[i]=bin.charCodeAt(i);return out;
}
function clearSignaturePad(){
  const pad=el('signaturePad');if(!pad)return;const ctx=pad.getContext('2d');ctx.clearRect(0,0,pad.width,pad.height);ctx.strokeStyle='#111';ctx.lineWidth=3;ctx.lineCap='round';ctx.lineJoin='round';pad.dataset.drawn='0';
}
function setupSignaturePad(){
  const pad=el('signaturePad');if(!pad)return;clearSignaturePad();const ctx=pad.getContext('2d');let drawing=false;
  const pt=e=>{const r=pad.getBoundingClientRect(),s=e.touches?e.touches[0]:e;return{x:(s.clientX-r.left)*(pad.width/r.width),y:(s.clientY-r.top)*(pad.height/r.height)};};
  const start=e=>{e.preventDefault();drawing=true;pad.dataset.drawn='1';const p=pt(e);ctx.beginPath();ctx.moveTo(p.x,p.y);};
  const move=e=>{if(!drawing)return;e.preventDefault();const p=pt(e);ctx.lineTo(p.x,p.y);ctx.stroke();};
  const stop=e=>{if(drawing){e.preventDefault();drawing=false;}};
  pad.addEventListener('mousedown',start);pad.addEventListener('mousemove',move);window.addEventListener('mouseup',stop);
  pad.addEventListener('touchstart',start,{passive:false});pad.addEventListener('touchmove',move,{passive:false});pad.addEventListener('touchend',stop,{passive:false});
}
function openSign(){if(!pages.length){signInput?.click();return;}clearSignaturePad();openModal('signModal');}
async function addSignature(){
  const pad=el('signaturePad');if(!pad||pad.dataset.drawn!=='1'){showToast(t('drawSignatureFirst'),'error');return;}
  checkpoint();const dataUrl=pad.toDataURL('image/png');const sig={dataUrl,bytes:dataUrlToBytes(dataUrl),aspect:pad.height/pad.width,xPct:.36,yPct:.7,widthPct:.28};
  pages[selected].signatures.push(sig);closeModals();await rebuild(false);showToast(t('signatureAdded'));
}

function readWatermark(){
  return {text:(el('watermarkText')?.value||'').trim(),size:Number(el('watermarkSize')?.value||42),opacity:Number(el('watermarkOpacity')?.value||25)/100,angle:Number(el('watermarkAngle')?.value||0),color:el('watermarkColor')?.value||'#555555',tile:!!el('watermarkTile')?.checked};
}
function updateWatermarkPreview(){
  previewWatermark=readWatermark();previewWatermarkPageId=pages[selected]?.id||null;
  const p=el('watermarkLivePreview');if(p){p.textContent=previewWatermark.text||' ';p.style.opacity=previewWatermark.opacity;p.style.color=previewWatermark.color;p.style.transform='rotate('+previewWatermark.angle+'deg)';p.style.fontSize=Math.max(16,Math.min(44,previewWatermark.size/1.6))+'px';}
  if(pages.length)renderPage();
}
function openWatermark(){if(!pages.length){watermarkInput?.click();return;}previewWatermarkPageId=pages[selected].id;updateWatermarkPreview();openModal('watermarkModal');}
async function applyWatermark(){
  const mark=readWatermark();if(!mark.text){showToast(t('watermarkEmpty'),'error');return;}checkpoint();
  const scope=q('input[name="watermarkScope"]:checked')?.value||'current';
  let idxs=scope==='all'?pages.map((_,i)=>i):scope==='selected'?getSelectedIndices():[selected];
  idxs.forEach(i=>pages[i].watermarks.push({...mark}));
  previewWatermark=null;previewWatermarkPageId=null;closeModals();await rebuild();showToast(t('watermarkAdded'));
}

function parsePageRange(value,total){
  const text=(value||'').trim();if(!text)return{error:'invalid'};const result=[],seen=new Set();
  for(const raw of text.split(',')){
    const part=raw.trim();if(!part)return{error:'invalid'};
    if(/^\d+$/.test(part)){const n=Number(part);if(n<1||n>total)return{error:'range'};if(!seen.has(n)){seen.add(n);result.push(n-1);}continue;}
    const m=part.match(/^(\d+)\s*-\s*(\d+)$/);if(!m)return{error:'invalid'};let a=Number(m[1]),b=Number(m[2]);if(a<1||b<1||a>total||b>total)return{error:'range'};
    const step=a<=b?1:-1;for(let n=a;;n+=step){if(!seen.has(n)){seen.add(n);result.push(n-1);}if(n===b)break;}
  }
  return{pages:result};
}
function updateSplitSummary(){
  const node=el('splitSummary');if(!node)return;const src=q('input[name="splitSource"]:checked')?.value||'selected';
  if(src==='selected'){node.textContent=t('selectedPagesCount',getSelectedIndices().length);return;}
  const parsed=parsePageRange(el('splitRange')?.value||'',pages.length);node.textContent=parsed.pages?t('selectedPagesCount',parsed.pages.length):'—';
}
function openSplit(){if(!pages.length){splitInput?.click();return;}const hasMulti=getSelectedIndices().length>1;const selectedRadio=q('input[name="splitSource"][value="selected"]');const rangeRadio=q('input[name="splitSource"][value="range"]');if(selectedRadio)selectedRadio.checked=hasMulti;if(rangeRadio)rangeRadio.checked=!hasMulti;if(!el('splitRange').value)el('splitRange').value=String(selected+1);updateSplitSummary();openModal('splitModal');}
async function runSplit(){
  const src=q('input[name="splitSource"]:checked')?.value||'selected';let idxs;
  if(src==='selected')idxs=getSelectedIndices();else{const parsed=parsePageRange(el('splitRange')?.value||'',pages.length);if(parsed.error==='invalid'){showToast(t('splitInvalid'),'error');return;}if(parsed.error==='range'){showToast(t('splitOutOfRange'),'error');return;}idxs=parsed.pages;}
  closeModals();await exportIndices(idxs,'pdfcraft-extracted-pages.pdf',t('splitDownloaded'));
}

function openCompress(){if(!pages.length){compressInput?.click();return;}openModal('compressModal');}
async function compressPdf(){
  const mode=q('input[name="compressionLevel"]:checked')?.value||'balanced';closeModals();
  if(mode==='preserve'){await exportIndices(pages.map((_,i)=>i),'pdfcraft-compressed-preserve-text.pdf',t('compressed'),true);return;}
  const cfg=mode==='strong'?{scale:.85,quality:.48}:{scale:1.15,quality:.68};
  showProgress(t('compressing'),pages.length);
  try{
    const out=await PDFDocument.create();
    for(let i=0;i<pages.length;i++){
      if(abortRequested)throw new Error('ABORT');
      const c=await renderItemToCanvas(pages[i],cfg.scale);
      const jpg=await out.embedJpg(await canvasToJpegBytes(c,cfg.quality));const page=out.addPage([c.width,c.height]);page.drawImage(jpg,{x:0,y:0,width:c.width,height:c.height});updateProgress(i+1,pages.length);
      await new Promise(r=>setTimeout(r,0));
    }
    downloadBytes(await out.save({useObjectStreams:true}),'pdfcraft-compressed.pdf');dirty=false;showToast(t('compressed'));
  }catch(e){if(String(e.message)==='ABORT')showToast(t('cancelled'),'info');else{console.error(e);showToast(t('exportError'),'error');}}finally{hideProgress();}
}
function canvasToJpegBytes(c,quality){return new Promise((resolve,reject)=>c.toBlob(async b=>b?resolve(new Uint8Array(await b.arrayBuffer())):reject(new Error('JPEG encode failed')),'image/jpeg',quality));}
async function renderItemToCanvas(item,scaleFactor){
  const dims=await getPageDimensions(item);const c=document.createElement('canvas');c.width=Math.max(1,Math.round(dims.width*scaleFactor));c.height=Math.max(1,Math.round(dims.height*scaleFactor));const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);
  if(item.type==='pdf'){
    const p=await sourceDocs[item.docIndex].pdfjsDoc.getPage(item.pageIndex+1);const vp=p.getViewport({scale:scaleFactor,rotation:item.rotation});c.width=Math.round(vp.width);c.height=Math.round(vp.height);const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);await p.render({canvasContext:x,viewport:vp}).promise;
  }else{
    const src=imageSources[item.imageIndex],layout=item.layout||defaultImageLayout(),pg=getImagePageSize(src,layout),rot=((item.rotation%360)+360)%360;
    let baseW=pg.w*scaleFactor,baseH=pg.h*scaleFactor;if(rot===90||rot===270)[c.width,c.height]=[Math.round(baseH),Math.round(baseW)];
    const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.save();x.translate(c.width/2,c.height/2);x.rotate(rot*Math.PI/180);const place=imagePlacement(src,baseW,baseH,{...layout,margin:(layout.margin||0)*scaleFactor});x.beginPath();x.rect(-baseW/2,-baseH/2,baseW,baseH);x.clip();x.drawImage(src.bitmap,-baseW/2+place.x,-baseH/2+place.y,place.w,place.h);x.restore();
  }
  const x=c.getContext('2d');drawWatermarksOnCanvas(x,item,c.width,c.height,false);drawPageNumberOnCanvas(x,item,c.width,c.height);await drawSignaturesOnCanvas(x,item,c.width,c.height);return c;
}

function openPageNumbers(){if(!pages.length){pageNumberInput?.click();return;}openModal('pageNumberModal');}
async function applyPageNumbers(){
  checkpoint();const start=Math.max(1,Number(el('pageNumberStart')?.value||1)),pos=el('pageNumberPosition')?.value||'bottom-center';
  pages.forEach((p,i)=>p.pageNumber={number:start+i,position:pos});closeModals();await rebuild();showToast(t('pageNumbersAdded'));
}

async function addOverlaysToPdfPage(out,page,item){
  const {width,height}=page.getSize();
  for(const mark of item.watermarks||[]){
    const oc=document.createElement('canvas');const scale=1.5;oc.width=Math.max(2,Math.round(width*scale));oc.height=Math.max(2,Math.round(height*scale));const x=oc.getContext('2d');drawWatermarkMark(x,{...mark,size:(mark.size||42)*scale},oc.width,oc.height);
    const png=await out.embedPng(dataUrlToBytes(oc.toDataURL('image/png')));page.drawImage(png,{x:0,y:0,width,height});
  }
  for(const sig of item.signatures||[]){
    const png=await out.embedPng(sig.bytes);const sw=width*(sig.widthPct||.28),sh=sw*(sig.aspect||.34),sx=width*(sig.xPct||.35),top=height*(sig.yPct||.68);page.drawImage(png,{x:sx,y:height-top-sh,width:sw,height:sh});
  }
  if(item.pageNumber){
    const font=await out.embedFont(StandardFonts.Helvetica);const text=String(item.pageNumber.number),size=12,tw=font.widthOfTextAtSize(text,size),margin=20;let x=(width-tw)/2,y=margin;
    if(item.pageNumber.position==='bottom-right')x=width-tw-margin;
    if(item.pageNumber.position==='top-right'){x=width-tw-margin;y=height-size-margin;}
    page.drawText(text,{x,y,size,font,color:rgb(.33,.33,.36)});
  }
}
async function addItemToPdf(out,item){
  if(item.type==='image'){
    const src=imageSources[item.imageIndex],layout=item.layout||defaultImageLayout(),pg=getImagePageSize(src,layout);
    const page=out.addPage([pg.w,pg.h]);const embedded=src.mime==='image/png'?await out.embedPng(src.bytes):await out.embedJpg(src.bytes);const place=imagePlacement(src,pg.w,pg.h,layout);page.drawImage(embedded,{x:place.x,y:pg.h-place.y-place.h,width:place.w,height:place.h});if(item.rotation)page.setRotation(degrees(item.rotation%360));await addOverlaysToPdfPage(out,page,item);
  }else{
    const src=sourceDocs[item.docIndex].libDoc;const[copied]=await out.copyPages(src,[item.pageIndex]);if(item.rotation){const current=copied.getRotation().angle||0;copied.setRotation(degrees((current+item.rotation)%360));}out.addPage(copied);await addOverlaysToPdfPage(out,copied,item);
  }
}
function downloadBytes(bytes,name){const blob=new Blob([bytes],{type:'application/pdf'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1400);}
async function exportIndices(indices,name,success,clearDirty=false){
  if(!indices.length)return;showProgress(t('buildingPdf'),indices.length);
  try{const out=await PDFDocument.create();for(let i=0;i<indices.length;i++){if(abortRequested)throw new Error('ABORT');await addItemToPdf(out,pages[indices[i]]);updateProgress(i+1,indices.length);}downloadBytes(await out.save({useObjectStreams:true}),name);if(clearDirty)dirty=false;showToast(success);}
  catch(e){if(String(e.message)==='ABORT')showToast(t('cancelled'),'info');else{console.error(e);showToast(t('exportError'),'error');}}finally{hideProgress();}
}
async function exportPdf(){await exportIndices(pages.map((_,i)=>i),'pdfcraft-document.pdf',t('downloadedPdf'),true);}
async function exportSelectedPage(){await exportIndices([selected],'pdfcraft-page-'+(selected+1)+'.pdf',t('pageDownloaded'));}

function prepareImages(files){pendingImageFiles=[...files].filter(isImage);if(!pendingImageFiles.length)return;openModal('imageSettingsModal');}
async function applyImageSettings(){const files=pendingImageFiles.splice(0);closeModals();await openImageFiles(files,pages.length===0,readImageLayout());showToast(t('imageSettingsApplied'),'info');}

function setupQuickSelects(){
  qa('[data-range]').forEach(b=>b.onclick=()=>{
    const kind=b.dataset.range;const input=el('splitRange');if(!input)return;
    if(kind==='all')input.value='1-'+pages.length;
    if(kind==='odd')input.value=pages.map((_,i)=>i+1).filter(n=>n%2===1).join(',');
    if(kind==='even')input.value=pages.map((_,i)=>i+1).filter(n=>n%2===0).join(',');
    if(kind==='current')input.value=String(selected+1);
    const rr=q('input[name="splitSource"][value="range"]');if(rr)rr.checked=true;updateSplitSummary();
  });
}
function setupWatermarkControls(){
  ['watermarkText','watermarkSize','watermarkOpacity','watermarkAngle','watermarkColor','watermarkTile'].forEach(id=>el(id)?.addEventListener('input',updateWatermarkPreview));
}
function setupModalClosers(){qa('[data-close-modal]').forEach(n=>n.onclick=closeModals);el('modalBackdrop').onclick=closeModals;}

const on=(id,fn)=>{const n=el(id);if(n)n.onclick=fn;};
on('brandHomeBtn',requestHome);on('homeBtn',requestHome);on('undoBtn',undo);on('redoBtn',redo);on('mobileUndoBtn',undo);
on('prevBtn',()=>goPage(-1));on('nextBtn',()=>goPage(1));on('rotateLeft',()=>rotateSelected(-90));on('rotateRight',()=>rotateSelected(90));
on('duplicatePage',duplicateSelected);on('deletePage',deleteSelected);on('bulkRotateBtn',()=>rotateSelected(90));on('bulkDeleteBtn',deleteSelected);on('bulkExportBtn',bulkExport);
on('openBtn',()=>mixedInput?.click());on('addBtn',()=>mixedInput?.click());on('toolsBtn',openTools);on('mobileToolsBtn',openTools);on('closeToolsBtn',closeTools);
on('exportBtn',exportPdf);on('exportToolbarBtn',exportPdf);on('mobileDownloadBtn',exportPdf);
on('propRotateBtn',()=>rotateSelected(90));on('propDuplicateBtn',duplicateSelected);on('propExportBtn',exportSelectedPage);on('propDeleteBtn',deleteSelected);
on('mobilePagesBtn',openMobileDrawer);on('mobilePagesBarBtn',openMobileDrawer);on('closeDrawerBtn',closeMobileDrawer);on('mobileDrawerBackdrop',closeMobileDrawer);
on('chooseBtn',()=>fileInput?.click());on('toolEditCard',()=>fileInput?.click());on('chooseMultiBtn',()=>multiInput?.click());on('toolMergeCard',()=>multiInput?.click());
on('chooseImagesBtn',()=>imageInput?.click());on('toolImageCard',()=>imageInput?.click());on('imagesBtn',()=>imageInput?.click());
on('mergeBtn',()=>multiInput?.click());on('compressBtn',openCompress);on('homeCompressBtn',openCompress);on('signBtn',openSign);on('homeSignBtn',openSign);
on('watermarkBtn',openWatermark);on('homeWatermarkBtn',openWatermark);on('splitBtn',openSplit);on('toolSplitCard',openSplit);
on('pageNumberBtn',openPageNumbers);on('homePageNumberBtn',openPageNumbers);
on('runCompressBtn',compressPdf);on('clearSignatureBtn',clearSignaturePad);on('addSignatureBtn',addSignature);on('applyWatermarkBtn',applyWatermark);
on('runSplitBtn',runSplit);on('applyImageSettingsBtn',applyImageSettings);on('applyPageNumbersBtn',applyPageNumbers);
on('cancelProgressBtn',()=>{abortRequested=true;});
on('stayBtn',()=>{pendingHome=false;closeModals();});on('leaveBtn',()=>{dirty=false;goHomeForce();});
on('langBtn',async()=>{currentLang=currentLang==='en'?'zh':'en';try{localStorage.setItem('pdfcraft-lang',currentLang);}catch(e){}applyLanguage();if(pages.length)await renderThumbLists();});

if(fileInput)fileInput.onchange=async e=>{await openPdfFiles(e.target.files,true);e.target.value='';};
if(multiInput)multiInput.onchange=async e=>{await openPdfFiles(e.target.files,pages.length===0);e.target.value='';};
if(imageInput)imageInput.onchange=e=>{prepareImages(e.target.files);e.target.value='';};
if(mixedInput)mixedInput.onchange=async e=>{await openMixed(e.target.files,false);e.target.value='';};
if(compressInput)compressInput.onchange=async e=>{await openPdfFiles(e.target.files,true);e.target.value='';if(pages.length)openCompress();};
if(signInput)signInput.onchange=async e=>{await openPdfFiles(e.target.files,true);e.target.value='';if(pages.length)openSign();};
if(watermarkInput)watermarkInput.onchange=async e=>{await openPdfFiles(e.target.files,true);e.target.value='';if(pages.length)openWatermark();};
if(splitInput)splitInput.onchange=async e=>{await openPdfFiles(e.target.files,true);e.target.value='';if(pages.length)openSplit();};
if(pageNumberInput)pageNumberInput.onchange=async e=>{await openPdfFiles(e.target.files,true);e.target.value='';if(pages.length)openPageNumbers();};

el('splitRange')?.addEventListener('input',updateSplitSummary);
qa('input[name="splitSource"]').forEach(n=>n.addEventListener('change',updateSplitSummary));
document.addEventListener('click',e=>{if(!e.target.closest('.thumb-preview'))closeThumbMenus();});

const drop=el('dropZone');
if(drop){
  ['dragenter','dragover'].forEach(name=>drop.addEventListener(name,e=>{e.preventDefault();drop.classList.add('dragover');}));
  ['dragleave','drop'].forEach(name=>drop.addEventListener(name,e=>{e.preventDefault();drop.classList.remove('dragover');}));
  drop.addEventListener('drop',e=>{const fs=[...e.dataTransfer.files];if(fs.length&&fs.every(isImage))prepareImages(fs);else openMixed(fs,pages.length===0);});
}
window.addEventListener('resize',()=>{if(pages.length)renderPage();});
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});

setupSignaturePad();setupQuickSelects();setupWatermarkControls();setupModalClosers();
controls();applyLanguage();
