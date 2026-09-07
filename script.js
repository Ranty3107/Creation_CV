let photoBase64='';
let currentTemplate='modern';
let formations=[];
let experiences=[];
let languages=[];
const GOOGLE_SCRIPT_URL="https://script.google.com/macros/s/AKfycbwSVrWGRzoXjU5OmAS1iHpE2L_d9moFI9WMKRUtgYhkXnJOjlkfhdUefXaa2Meym31/exec";

document.addEventListener('DOMContentLoaded',()=>{
const inputPhotoFile=document.getElementById('inputPhotoFile');
if(inputPhotoFile)inputPhotoFile.addEventListener('change',handlePhotoUpload);
const inputs=['inputName','inputEmail','inputPhone','inputAddress','inputBirthdate','inputSummary','inputSkills'];
inputs.forEach(id=>{
const input=document.getElementById(id);
if(input)input.addEventListener('input',renderCV);
});
renderFormationsInputs();
renderExperiencesInputs();
renderLanguagesInputs();
renderCV();
});

function handlePhotoUpload(event){
const file=event.target.files[0];
if(!file)return;
if(!file.type.startsWith('image/')){
alert("Veuillez sélectionner une image valide.");
return;
}
const reader=new FileReader();
reader.onload=e=>{
photoBase64=e.target.result;
renderCV();
};
reader.onerror=()=>{
alert("Impossible de lire cette image.");
};
reader.readAsDataURL(file);
}

function escapeHTML(value){
if(value===null||value===undefined)return '';
return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

function getInputValue(id){
const element=document.getElementById(id);
return element?element.value.trim():'';
}

function selectTemplate(templateId){
currentTemplate=templateId;
document.querySelectorAll('.template-card').forEach(card=>{
card.classList.remove('ring-4','ring-indigo-600','border-indigo-600','shadow-lg','bg-indigo-50');
card.classList.add('border-slate-200','bg-white');
});
const activeCard=document.getElementById(`btn-tpl-${templateId}`);
if(activeCard){
activeCard.classList.remove('border-slate-200','bg-white');
activeCard.classList.add('ring-4','ring-indigo-600','border-indigo-600','shadow-lg','bg-indigo-50');
}
renderCV();
}

function renderFormationsInputs(){
const container=document.getElementById('formationsContainer');
if(!container)return;
container.innerHTML='';
formations.forEach((form,index)=>{
const block=document.createElement('div');
block.className='p-2 border rounded bg-gray-50 space-y-1 relative text-xs';
block.innerHTML=`<button type="button" onclick="removeFormation(${index})" class="absolute top-1 right-1 text-red-500 font-bold text-xs hover:text-red-700 cursor-pointer" title="Supprimer">✕</button><input type="text" placeholder="Diplôme" value="${escapeHTML(form.title)}" oninput="updateFormation(${index},'title',this.value)" class="w-full border rounded p-1"><input type="text" placeholder="École / Université" value="${escapeHTML(form.school)}" oninput="updateFormation(${index},'school',this.value)" class="w-full border rounded p-1"><input type="text" placeholder="Période" value="${escapeHTML(form.year)}" oninput="updateFormation(${index},'year',this.value)" class="w-full border rounded p-1">`;
container.appendChild(block);
});
}

function addFormationField(){
formations.push({title:'',school:'',year:''});
renderFormationsInputs();
renderCV();
}

function updateFormation(index,field,value){
if(!formations[index])return;
formations[index][field]=value;
renderCV();
}

function removeFormation(index){
formations.splice(index,1);
renderFormationsInputs();
renderCV();
}

function renderExperiencesInputs(){
const container=document.getElementById('experiencesContainer');
if(!container)return;
container.innerHTML='';
experiences.forEach((exp,index)=>{
const block=document.createElement('div');
block.className='p-2 border rounded bg-gray-50 space-y-2 relative text-xs';
let tasksHTML='';
exp.tasks.forEach((task,taskIndex)=>{
tasksHTML+=`<div class="flex gap-1 mb-1"><textarea placeholder="Description de la tâche..." oninput="updateTask(${index},${taskIndex},this.value)" class="w-full border rounded p-1 text-xs" rows="2">${escapeHTML(task)}</textarea><button type="button" onclick="removeTask(${index},${taskIndex})" class="bg-red-100 text-red-600 px-2 rounded text-xs hover:bg-red-200 cursor-pointer" title="Supprimer">✕</button></div>`;
});
block.innerHTML=`<button type="button" onclick="removeExperience(${index})" class="absolute top-1 right-1 text-red-500 font-bold text-xs hover:text-red-700 cursor-pointer" title="Supprimer l'expérience">✕</button><div class="pr-6 space-y-1"><input type="text" placeholder="Poste" value="${escapeHTML(exp.job)}" oninput="updateExperience(${index},'job',this.value)" class="w-full border rounded p-1"><input type="text" placeholder="Entreprise" value="${escapeHTML(exp.company)}" oninput="updateExperience(${index},'company',this.value)" class="w-full border rounded p-1"><input type="text" placeholder="Période" value="${escapeHTML(exp.year)}" oninput="updateExperience(${index},'year',this.value)" class="w-full border rounded p-1"></div><div class="mt-2 pt-2 border-t border-gray-200"><div class="flex justify-between items-center mb-1"><span class="text-[11px] font-semibold text-gray-600">Détails du poste :</span><button type="button" onclick="addTask(${index})" class="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded hover:bg-indigo-200 font-medium cursor-pointer">+ Ligne</button></div><div class="space-y-1">${tasksHTML}</div></div>`;
container.appendChild(block);
});
}

function addExperienceField(){
experiences.push({job:'',company:'',year:'',tasks:['']});
renderExperiencesInputs();
renderCV();
}

function updateExperience(index,field,value){
if(!experiences[index])return;
experiences[index][field]=value;
renderCV();
}

function removeExperience(index){
experiences.splice(index,1);
renderExperiencesInputs();
renderCV();
}

function addTask(expIndex){
if(!experiences[expIndex])return;
experiences[expIndex].tasks.push('');
renderExperiencesInputs();
renderCV();
}

function updateTask(expIndex,taskIndex,value){
if(!experiences[expIndex])return;
experiences[expIndex].tasks[taskIndex]=value;
renderCV();
}

function removeTask(expIndex,taskIndex){
if(!experiences[expIndex])return;
experiences[expIndex].tasks.splice(taskIndex,1);
if(experiences[expIndex].tasks.length===0)experiences[expIndex].tasks.push('');
renderExperiencesInputs();
renderCV();
}

function renderLanguagesInputs(){
const container=document.getElementById('languagesContainer');
if(!container)return;
container.innerHTML='';
languages.forEach((lang,index)=>{
const block=document.createElement('div');
block.className='p-2 border rounded bg-gray-50 space-y-1 relative text-xs flex gap-1 items-center';
block.innerHTML=`<input type="text" placeholder="Langue" value="${escapeHTML(lang.language)}" oninput="updateLanguage(${index},'language',this.value)" class="w-1/2 border rounded p-1"><input type="text" placeholder="Niveau" value="${escapeHTML(lang.level)}" oninput="updateLanguage(${index},'level',this.value)" class="w-1/2 border rounded p-1"><button type="button" onclick="removeLanguage(${index})" class="text-red-500 font-bold text-xs hover:text-red-700 px-1 cursor-pointer" title="Supprimer">✕</button>`;
container.appendChild(block);
});
}

function addLanguageField(){
languages.push({language:'',level:''});
renderLanguagesInputs();
renderCV();
}

function updateLanguage(index,field,value){
if(!languages[index])return;
languages[index][field]=value;
renderCV();
}

function removeLanguage(index){
languages.splice(index,1);
renderLanguagesInputs();
renderCV();
}

function renderCV(){
const cvPreview=document.getElementById('cvPreview');
if(!cvPreview)return;
const rawName=getInputValue('inputName');
const nameParts=rawName.split(/\s+/);
const firstName=escapeHTML(nameParts[0]||'');
const lastName=escapeHTML(nameParts.slice(1).join(' ')||'');
const email=escapeHTML(getInputValue('inputEmail'));
const phone=escapeHTML(getInputValue('inputPhone'));
const address=escapeHTML(getInputValue('inputAddress')).replace(/\n/g,'<br>');
const birthdate=escapeHTML(getInputValue('inputBirthdate'));
const summary=escapeHTML(getInputValue('inputSummary')).replace(/\n/g,'<br>');
const skillsRaw=getInputValue('inputSkills');
const skillsList=skillsRaw?skillsRaw.split(',').map(s=>s.trim()).filter(Boolean):['Communication','Travail en équipe','Curiosité'];
const data={name:escapeHTML(rawName),email,phone,address,birthdate,summary,skillsRaw};
switch(currentTemplate){
case 'softStage':
cvPreview.innerHTML=buildSoftStageTemplate({firstName,lastName,email,phone,address,summary,skillsList,photoDataUrl:photoBase64});
break;
case 'creativeTaupe':
cvPreview.innerHTML=buildCreativeTaupeTemplate({firstName,lastName,email,phone,address,birthdate,summary,skillsList,photoDataUrl:photoBase64});
break;
case 'hexagonsBlue':
if(typeof buildHexagonsBlueTemplate==='function'){
cvPreview.innerHTML=buildHexagonsBlueTemplate({firstName,lastName,email,phone,address,birthdate,summary,skillsList,photoDataUrl:photoBase64});
}else{
cvPreview.innerHTML=buildModernTemplate(data);
}
break;
case 'banner':
cvPreview.innerHTML=buildBannerTemplate(data);
break;
case 'minimalist':
cvPreview.innerHTML=buildMinimalistTemplate(data);
break;
case 'headerCenter':
cvPreview.innerHTML=buildHeaderCenterTemplate(data);
break;
case 'darkSidebar':
cvPreview.innerHTML=buildDarkSidebarTemplate(data);
break;
case 'modern':
default:
cvPreview.innerHTML=buildModernTemplate(data);
break;
}
}

function buildSoftStageTemplate(d){
const validLanguages=languages.filter(lang=>lang.language.trim());
return `<div style="width:210mm;min-height:297mm;box-sizing:border-box;" class="bg-[#FDFBF7] p-8 flex flex-col justify-between font-sans text-slate-800 text-xs relative"><div><div class="flex justify-between items-start gap-4 mb-6"><div class="flex-1"><div class="flex items-center gap-3 flex-wrap mb-1"><h1 class="text-3xl font-black uppercase tracking-wider text-slate-900">${d.firstName}</h1><span class="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">Stage de 3ème</span></div><h2 class="text-2xl font-bold uppercase tracking-wider text-slate-900 mb-4">${d.lastName}</h2>${d.summary?`<div class="p-3.5 bg-white/80 border border-indigo-200/60 rounded-xl text-slate-700 leading-relaxed shadow-sm mb-4">${d.summary}</div>`:''}<div class="flex flex-wrap gap-3">${d.email?`<div class="bg-blue-50/80 text-blue-900 px-3 py-1 rounded-full text-[11px] font-medium border border-blue-100">📧 ${d.email}</div>`:''}${d.phone?`<div class="bg-blue-50/80 text-blue-900 px-3 py-1 rounded-full text-[11px] font-medium border border-blue-100">📞 ${d.phone}</div>`:''}</div></div>${d.photoDataUrl?`<div class="w-32 h-44 shrink-0 rounded-2xl overflow-hidden shadow-md border-2 border-white"><img src="${d.photoDataUrl}" class="w-full h-full object-cover"></div>`:''}</div><div class="grid grid-cols-2 gap-4 mb-4"><div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100"><h3 class="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3 border-b pb-1">Compétences</h3><ul class="space-y-1.5 text-slate-700">${d.skillsList.map(s=>`<li class="flex items-center gap-1.5">• ${escapeHTML(s)}</li>`).join('')}</ul></div><div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100"><h3 class="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3 border-b pb-1">Formation</h3>${formations.length>0?formations.map(f=>`<div class="mb-2"><p class="font-bold text-slate-900">${escapeHTML(f.title)||'Classe de 3e'}</p><p class="text-slate-600 text-[11px]">${escapeHTML(f.school)||''}</p><p class="text-slate-400 text-[10px]">${escapeHTML(f.year)||''}</p></div>`).join(''):'<p class="text-slate-400 italic">Classe de 3e</p>'}</div></div>${validLanguages.length>0?`<div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4"><h3 class="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3 border-b pb-1">Langues</h3><div class="grid grid-cols-2 gap-2 text-slate-700">${validLanguages.map(l=>`<div>• <strong class="text-slate-900">${escapeHTML(l.language)}</strong> ${l.level.trim()?`(${escapeHTML(l.level)})`:''}</div>`).join('')}</div></div>`:''}<div class="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/60"><h3 class="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">Centres d'intérêt</h3><div class="grid grid-cols-2 gap-2 text-slate-700"><div>• Communication</div><div>• Découverte du monde professionnel</div><div>• Design & Créativité</div><div>• Outils numériques</div></div></div></div><div class="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-200">${d.address?d.address:''}</div></div>`;
}

function buildModernTemplate(d){
const iconStyle='width:14px;height:14px;min-width:14px;min-height:14px;color:#3A5A78;fill:currentColor;margin-top:2px;flex-shrink:0;display:inline-block;vertical-align:middle;';
const icons=getIcons(iconStyle);
const photoHTML=photoBase64?`<img src="${photoBase64}" alt="Photo du candidat" style="width:110px;height:110px;object-fit:cover;border-radius:50%;border:4px solid white;box-shadow:0 4px 6px rgba(0,0,0,0.15);">`:`<div style="width:110px;height:110px;border-radius:50%;background:#e2e8f0;display:flex;align-items:center;justify-content:center;font-size:28px;border:4px solid white;">📷</div>`;
return `<table style="width:210mm;min-width:210mm;border-collapse:collapse;table-layout:fixed;background:white;"><tr><td style="width:75mm;background:#f3f4f6;vertical-align:top;padding:0;"><div style="background:#3b5998;color:white;padding:25px 15px 35px;text-align:center;"><h2 style="font-size:15px;font-weight:bold;line-height:1.3;margin:0;">${formatHeaderName(d.name)}</h2></div><div style="display:flex;justify-content:center;margin-top:-45px;margin-bottom:20px;">${photoHTML}</div><div style="padding:0 20px 20px;"><h3 style="font-size:12px;color:#3b5998;text-transform:uppercase;border-bottom:1px solid #d1d5db;padding-bottom:4px;margin-bottom:12px;">Informations</h3><div style="font-size:11px;color:#333;">${d.name?`<div style="display:flex;gap:8px;margin-bottom:8px;">${icons.user}<span>${d.name}</span></div>`:''}${d.email?`<div style="display:flex;gap:8px;margin-bottom:8px;">${icons.email}<span style="word-break:break-all;">${d.email}</span></div>`:''}${d.phone?`<div style="display:flex;gap:8px;margin-bottom:8px;">${icons.phone}<span>${d.phone}</span></div>`:''}${d.address?`<div style="display:flex;gap:8px;margin-bottom:8px;">${icons.home}<span>${d.address}</span></div>`:''}${d.birthdate?`<div style="display:flex;gap:8px;margin-bottom:8px;">${icons.date}<span>${d.birthdate}</span></div>`:''}</div>${buildSkillsSection(d.skillsRaw,'#3b5998')}${buildLanguagesSection('#3b5998')}</div></td><td style="width:135mm;vertical-align:top;padding:35px 30px;background:white;">${buildProfileSection(d.summary,'#3b5998')}${buildFormationsSection('#3b5998')}${buildExperiencesSection('#3b5998')}</td></tr></table>`;
}

function buildBannerTemplate(d){
const photoHTML=photoBase64?`<img src="${photoBase64}" alt="Photo du candidat" style="width:100px;height:100px;object-fit:cover;border-radius:8px;border:3px solid white;">`:`<div style="width:100px;height:100px;background:#e2e8f0;border-radius:8px;display:flex;align-items:center;justify-content:center;border:3px solid white;">📷</div>`;
return `<div style="width:210mm;background:white;"><div style="background:#2b5b6c;color:white;padding:25px 30px;display:flex;align-items:center;gap:20px;"><div>${photoHTML}</div><div style="flex-grow:1;"><h1 style="font-size:22px;font-weight:bold;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px;">${d.name}</h1><div style="font-size:11px;color:#e2e8f0;display:flex;flex-wrap:wrap;gap:12px;">${d.email?`<span>✉ ${d.email}</span>`:''}${d.phone?`<span>📞 ${d.phone}</span>`:''}${d.birthdate?`<span>📅 ${d.birthdate}</span>`:''}${d.address?`<span>📍 ${d.address.replace(/<br>/g,', ')}</span>`:''}</div></div></div><table style="width:210mm;border-collapse:collapse;table-layout:fixed;"><tr><td style="width:70mm;vertical-align:top;padding:25px 20px;background:#f8fafc;border-right:1px solid #e2e8f0;">${buildSkillsSection(d.skillsRaw,'#2b5b6c')}${buildLanguagesSection('#2b5b6c')}</td><td style="width:140mm;vertical-align:top;padding:25px;">${buildProfileSection(d.summary,'#2b5b6c')}${buildFormationsSection('#2b5b6c')}${buildExperiencesSection('#2b5b6c')}</td></tr></table></div>`;
}

function buildMinimalistTemplate(d){
const primaryColor='#856404';
const photoHTML=photoBase64?`<img src="${photoBase64}" alt="Photo du candidat" style="width:90px;height:90px;object-fit:cover;border-radius:4px;border:1px solid #ddd;">`:'';
return `<div style="width:210mm;padding:25px 30px;background:white;box-sizing:border-box;"><div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid ${primaryColor};padding-bottom:15px;margin-bottom:20px;"><div><h1 style="font-size:24px;font-weight:bold;color:#222;margin:0 0 5px;text-transform:uppercase;">${d.name}</h1><div style="font-size:11px;color:#555;display:flex;flex-wrap:wrap;gap:10px;">${d.email?`<span>${d.email}</span>`:''}${d.phone?`<span>| ${d.phone}</span>`:''}${d.birthdate?`<span>| ${d.birthdate}</span>`:''}${d.address?`<span>| ${d.address.replace(/<br>/g,', ')}</span>`:''}</div></div>${photoHTML}</div>${buildProfileSection(d.summary,primaryColor)}<table style="width:100%;border-collapse:collapse;table-layout:fixed;"><tr><td style="width:65%;vertical-align:top;padding-right:15px;">${buildExperiencesSection(primaryColor)}</td><td style="width:35%;vertical-align:top;border-left:1px solid #eee;padding-left:15px;">${buildFormationsSection(primaryColor)}${buildSkillsSection(d.skillsRaw,primaryColor)}${buildLanguagesSection(primaryColor)}</td></tr></table></div>`;
}

function buildHeaderCenterTemplate(d){
const primaryColor='#2c3e50';
const photoHTML=photoBase64?`<img src="${photoBase64}" alt="Photo du candidat" style="width:100px;height:100px;object-fit:cover;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 5px rgba(0,0,0,0.1);margin:0 auto 12px;display:block;">`:'';
return `<div style="width:210mm;padding:30px;background:white;box-sizing:border-box;font-family:Helvetica,Arial,sans-serif;">${photoHTML}<div style="text-align:center;border-bottom:1px solid #e2e8f0;padding-bottom:15px;margin-bottom:20px;"><h1 style="font-size:22px;font-weight:bold;color:${primaryColor};margin:0 0 6px;text-transform:uppercase;letter-spacing:1px;">${d.name}</h1><div style="font-size:11px;color:#666;display:flex;justify-content:center;flex-wrap:wrap;gap:15px;">${d.email?`<span>✉ ${d.email}</span>`:''}${d.phone?`<span>📞 ${d.phone}</span>`:''}${d.birthdate?`<span>📅 ${d.birthdate}</span>`:''}${d.address?`<span>📍 ${d.address.replace(/<br>/g,', ')}</span>`:''}</div></div>${buildProfileSection(d.summary,primaryColor)}${buildFormationsSection(primaryColor)}${buildExperiencesSection(primaryColor)}${buildSkillsSection(d.skillsRaw,primaryColor)}${buildLanguagesSection(primaryColor)}</div>`;
}

function buildDarkSidebarTemplate(d){
    const primaryColor='#1abc9c';
    const photoHTML=photoBase64?`<img src="${photoBase64}" alt="Photo du candidat" style="width:100px;height:100px;object-fit:cover;border-radius:50%;border:3px solid #1abc9c;margin:0 auto 15px;display:block;">`:'';
    
    // On passe '#ecf0f1' comme couleur de texte pour qu'il soit bien visible sur le fond sombre (#2c3e50)
    return `<table style="width:210mm;min-width:210mm;border-collapse:collapse;table-layout:fixed;background:white;">
    <tr>
        <td style="width:70mm;background:#2c3e50;color:white;vertical-align:top;padding:25px 20px;">
            ${photoHTML}
            <h2 style="font-size:16px;font-weight:bold;text-align:center;margin-bottom:15px;color:#fff;">${d.name}</h2>
            <div style="font-size:11px;margin-bottom:20px;color:#ecf0f1;">
                ${d.email?`<div style="margin-bottom:6px;">✉ ${d.email}</div>`:''}
                ${d.phone?`<div style="margin-bottom:6px;">📞 ${d.phone}</div>`:''}
                ${d.birthdate?`<div style="margin-bottom:6px;">📅 ${d.birthdate}</div>`:''}
                ${d.address?`<div style="margin-bottom:6px;">📍 ${d.address}</div>`:''}
            </div>
            ${buildSkillsSection(d.skillsRaw, primaryColor, '#ecf0f1')}
            ${buildLanguagesSection(primaryColor, '#ecf0f1')}
        </td>
        <td style="width:140mm;vertical-align:top;padding:30px;background:white;">
            ${buildProfileSection(d.summary,'#2c3e50')}
            ${buildFormationsSection('#2c3e50')}
            ${buildExperiencesSection('#2c3e50')}
        </td>
    </tr>
    </table>`;
}

function buildProfileSection(summary,color){
if(!summary)return '';
return `<div style="margin-bottom:20px;"><h3 style="font-size:13px;color:${color};text-transform:uppercase;border-bottom:1px solid #e5e7eb;padding-bottom:3px;margin-bottom:8px;font-weight:bold;">Profil</h3><p style="font-size:11px;color:#333;line-height:1.5;margin:0;text-align:justify;">${summary}</p></div>`;
}

function buildFormationsSection(color){
const validFormations=formations.filter(f=>f.title.trim()||f.school.trim()||f.year.trim());
if(validFormations.length===0)return '';
let html=`<div style="margin-bottom:20px;"><h3 style="font-size:13px;color:${color};text-transform:uppercase;border-bottom:1px solid #e5e7eb;padding-bottom:3px;margin-bottom:10px;font-weight:bold;">Formation</h3>`;
validFormations.forEach(f=>{
html+=`<table style="width:100%;border-collapse:collapse;margin-bottom:10px;font-size:11px;"><tr><td style="font-weight:bold;color:#333;width:65%;">${escapeHTML(f.title)}</td><td style="text-align:right;font-weight:bold;color:#555;width:35%;">${escapeHTML(f.year)}</td></tr><tr><td colspan="2" style="color:${color};font-size:10.5px;">${escapeHTML(f.school)}</td></tr></table>`;
});
return html+'</div>';
}

function buildExperiencesSection(color){
const validExperiences=experiences.filter(e=>e.job.trim()||e.company.trim()||e.year.trim());
if(validExperiences.length===0)return '';
let html=`<div style="margin-bottom:20px;"><h3 style="font-size:13px;color:${color};text-transform:uppercase;border-bottom:1px solid #e5e7eb;padding-bottom:3px;margin-bottom:10px;font-weight:bold;">Expérience professionnelle</h3>`;
validExperiences.forEach(e=>{
let tasksListHTML='<ul style="margin:4px 0 0;padding-left:16px;">';
e.tasks.forEach(t=>{
if(t.trim())tasksListHTML+=`<li style="font-size:11px;color:#333;margin-bottom:2px;line-height:1.4;">${escapeHTML(t)}</li>`;
});
tasksListHTML+='</ul>';
html+=`<div style="margin-bottom:14px;"><table style="width:100%;border-collapse:collapse;font-size:11px;"><tr><td style="font-weight:bold;color:#333;">${escapeHTML(e.job)}</td><td style="text-align:right;font-weight:bold;color:#555;white-space:nowrap;vertical-align:top;">${escapeHTML(e.year)}</td></tr><tr><td colspan="2" style="color:${color};font-weight:500;">${escapeHTML(e.company)}</td></tr></table>${tasksListHTML}</div>`;
});
return html+'</div>';
}

function buildSkillsSection(skillsRaw, color, textColor = '#333'){
    if(!skillsRaw) return '';
    const skillsArray = skillsRaw.split(',').map(skill => skill.trim()).filter(skill => skill);
    if(skillsArray.length === 0) return '';
    
    let html = `<div style="margin-bottom:20px;">
        <h3 style="font-size:12px;color:${color};text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.2);padding-bottom:3px;margin-bottom:8px;font-weight:bold;">Compétences</h3>`;
    
    skillsArray.forEach(skill => {
        html += `<p style="margin:3px 0;font-size:11px;color:${textColor};">• ${escapeHTML(skill)}</p>`;
    });
    
    return html + '</div>';
}

function buildLanguagesSection(color, textColor = '#333'){
    const validLanguages = languages.filter(lang => lang.language.trim());
    if(validLanguages.length === 0) return '';
    
    let html = `<div style="margin-bottom:20px;">
        <h3 style="font-size:12px;color:${color};text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.2);padding-bottom:3px;margin-bottom:8px;font-weight:bold;">Langues</h3>`;
    
    validLanguages.forEach(lang => {
        html += `<div style="font-size:11px;margin-bottom:4px;color:${textColor};">• <strong style="color:${textColor};">${escapeHTML(lang.language)}</strong>${lang.level.trim() ? `: ${escapeHTML(lang.level)}` : ''}</div>`;
    });
    
    return html + '</div>';
}

function formatHeaderName(name){
if(!name)return '';
const parts=name.split(/\s+/);
const firstNames=[];
const lastNames=[];
parts.forEach(part=>{
if(part.length>1&&part===part.toUpperCase())lastNames.push(part);
else firstNames.push(part);
});
if(firstNames.length>0&&lastNames.length>0)return `${firstNames.join(' ')}<br><span style="text-transform:uppercase;">${lastNames.join(' ')}</span>`;
return name;
}

function getIcons(iconStyle){
return{
user:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="${iconStyle}"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`,
email:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="${iconStyle}"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
phone:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="${iconStyle}"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`,
home:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="${iconStyle}"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`,
date:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="${iconStyle}"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg>`
};
}

function buildCreativeTaupeTemplate(d){
const validExperiences=experiences.filter(e=>e.job.trim()||e.company.trim()||e.year.trim());
const validLanguages=languages.filter(l=>l.language.trim());
return `<div style="width:210mm;min-height:297mm;box-sizing:border-box;" class="bg-[#F7F5F0] p-8 flex flex-col justify-between font-sans text-slate-800 text-xs relative"><div><div class="relative bg-[#6B5B52] text-white p-6 rounded-3xl mb-6 overflow-hidden shadow-sm"><div class="flex justify-between items-start"><div><span class="bg-[#A39185] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">Chargée de projet</span><h1 class="text-3xl font-light tracking-wide">${d.firstName}</h1><h2 class="text-3xl font-bold uppercase tracking-wider">${d.lastName}</h2></div>${d.photoDataUrl?`<div class="w-28 h-28 rounded-full overflow-hidden border-4 border-white/30 shrink-0 shadow-md"><img src="${d.photoDataUrl}" class="w-full h-full object-cover"></div>`:''}</div></div><div class="grid grid-cols-3 gap-6 mb-6"><div class="col-span-1 space-y-2 bg-white/60 p-4 rounded-2xl border border-[#EBE5DE]"><h3 class="font-bold text-[#6B5B52] uppercase tracking-wider text-[11px] border-b pb-1">Contact</h3>${d.phone?`<p class="truncate">📞 ${d.phone}</p>`:''}${d.email?`<p class="truncate">✉️ ${d.email}</p>`:''}${d.address?`<p class="text-[10px]">📍 ${d.address}</p>`:''}${d.birthdate?`<p class="text-[10px]">📅 ${d.birthdate}</p>`:''}</div><div class="col-span-2 bg-white p-4 rounded-2xl border border-[#EBE5DE] shadow-sm"><h3 class="font-bold text-[#6B5B52] uppercase tracking-wider text-[11px] mb-2 border-b pb-1">Profil</h3><p class="text-slate-700 leading-relaxed">${d.summary||'Ajoutez votre résumé ici...'}</p><div class="flex gap-4 mt-3 text-[11px] font-semibold text-[#6B5B52]"><span>• Organisée(e)</span><span>• Polyvalent(e)</span><span>• Esprit d'équipe</span></div></div></div>${validExperiences.length>0?`<div class="bg-white p-5 rounded-2xl border border-[#EBE5DE] shadow-sm mb-4"><h3 class="font-bold text-[#6B5B52] uppercase tracking-wider text-sm mb-3 border-b pb-1">Expérience professionnelle</h3><div class="space-y-4">${validExperiences.map(e=>`<div><div class="flex justify-between items-center text-[10px] font-bold text-[#A39185]"><span>${escapeHTML(e.year)}</span></div><p class="font-bold text-slate-900">${escapeHTML(e.job)}</p><p class="text-[#6B5B52] font-medium text-[11px] mb-1">${escapeHTML(e.company)}</p>${e.tasks&&e.tasks.length>0?`<ul class="space-y-1 text-slate-700 pl-3">${e.tasks.filter(t=>t.trim()).map(t=>`<li class="list-disc">${escapeHTML(t)}</li>`).join('')}</ul>`:''}</div>`).join('')}</div></div>`:''}<div class="grid grid-cols-2 gap-4 mb-4"><div class="bg-white p-4 rounded-2xl border border-[#EBE5DE]"><h3 class="font-bold text-[#6B5B52] uppercase tracking-wider text-[11px] mb-3 border-b pb-1">Formation</h3>${formations.length>0?formations.map(f=>`<div class="mb-2"><p class="font-bold text-slate-900">${escapeHTML(f.title)}</p><p class="text-slate-600 text-[11px]">${escapeHTML(f.school)}</p><p class="text-[#A39185] text-[10px]">${escapeHTML(f.year)}</p></div>`).join(''):'<p class="text-slate-400 italic">Aucune formation</p>'}</div><div class="bg-white p-4 rounded-2xl border border-[#EBE5DE]"><h3 class="font-bold text-[#6B5B52] uppercase tracking-wider text-[11px] mb-3 border-b pb-1">Langues</h3><ul class="space-y-1.5 text-slate-700">${validLanguages.length>0?validLanguages.map(l=>`<li>• <strong>${escapeHTML(l.language)}</strong>${l.level?`(${escapeHTML(l.level)})`:''}</li>`).join(''):'<li>• Français (Natif)</li>'}</ul></div></div><div class="bg-white p-4 rounded-2xl border border-[#EBE5DE]"><h3 class="font-bold text-[#6B5B52] uppercase tracking-wider text-[11px] mb-2 border-b pb-1">Compétences</h3><div class="flex flex-wrap gap-2">${d.skillsList.map(s=>`<span class="bg-[#F7F5F0] text-[#6B5B52] px-3 py-1 rounded-full text-[11px] font-semibold border border-[#EBE5DE]">${escapeHTML(s)}</span>`).join('')}</div></div></div><div class="text-center text-[10px] text-[#A39185] pt-3">${d.address?d.address:''}</div></div>`;
}

async function waitForImages(element){
const images=Array.from(element.querySelectorAll('img'));
if(images.length===0)return;
await Promise.all(images.map(img=>{
if(img.complete)return Promise.resolve();
return new Promise(resolve=>{
img.onload=resolve;
img.onerror=resolve;
});
}));
}

function setPDFButtonsLoading(loading){
const buttons=[document.getElementById('downloadPdfBtn'),document.getElementById('modalDownloadPdfBtn')].filter(Boolean);
buttons.forEach(button=>{
if(loading){
if(!button.dataset.originalHtml)button.dataset.originalHtml=button.innerHTML;
button.innerHTML='⏳ Génération en cours...';
button.disabled=true;
button.classList.add('opacity-70','cursor-not-allowed');
}else{
if(button.dataset.originalHtml)button.innerHTML=button.dataset.originalHtml;
button.disabled=false;
button.classList.remove('opacity-70','cursor-not-allowed');
}
});
}

// 1. Ouvre la modale MVola lorsque l'utilisateur clique sur le bouton principal du formulaire
function openMvolaModal() {
    const modal = document.getElementById('mvolaModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// 2. Ferme la modale (votre fonction)
function closeMvolaModal() {
    const modal = document.getElementById('mvolaModal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// 3. Lance l'impression/téléchargement (appelé depuis le bouton de la modale)
function downloadPDF() {
    // Fermer la modale automatiquement au lancement
    closeMvolaModal();

    // Récupération du nom pour nommer le fichier PDF
    const inputNameElement = document.getElementById('inputName');
    const name = inputNameElement ? inputNameElement.value : '';
    let safeName = name.replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, '_').trim();
    if (!safeName) safeName = 'Mon_CV';
    
    // Modification temporaire du titre de la page
    const originalTitle = document.title;
    document.title = `CV_Mvola_0349798195_${safeName}`;
    
    // Lancement de l'impression native du navigateur
    window.print();
    
    // Restauration du titre original après coup
    setTimeout(() => {
        document.title = originalTitle;
    }, 1000);
}
