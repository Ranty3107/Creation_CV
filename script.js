let photoBase64='';
let currentTemplate='modern';
let formations=[];
let experiences=[];
let languages=[];

const GOOGLE_SCRIPT_URL="https://script.google.com/macros/s/AKfycbwSVrWGRzoXjU5OmAS1iHpE2L_d9moFI9WMKRUtgYhkXjNOjlkfhdUefXaa2Meym31/exec";

document.addEventListener('DOMContentLoaded',()=>{
    const photoInput=document.getElementById('inputPhotoFile');

    if(photoInput){
        photoInput.addEventListener('change',handlePhotoUpload);
    }

    const inputIds=[
        'inputName',
        'inputEmail',
        'inputPhone',
        'inputAddress',
        'inputBirthdate',
        'inputSummary',
        'inputSkills'
    ];

    inputIds.forEach(id=>{
        const element=document.getElementById(id);

        if(element){
            element.addEventListener('input',renderCV);
        }
    });

    renderFormationsInputs();
    renderExperiencesInputs();
    renderLanguagesInputs();
    updateTemplateButtons();
    renderCV();
});

function handlePhotoUpload(event){
    const file=event.target.files&&event.target.files[0];

    if(!file)return;

    if(!file.type.startsWith('image/')){
        alert('Veuillez sélectionner une image valide.');
        event.target.value='';
        return;
    }

    const reader=new FileReader();

    reader.onload=function(e){
        photoBase64=e.target.result||'';
        renderCV();
    };

    reader.onerror=function(){
        alert('Impossible de lire cette image.');
    };

    reader.readAsDataURL(file);
}

function escapeHTML(value){
    if(value===null||value===undefined)return '';

    return String(value)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#039;');
}

function getInputValue(id){
    const element=document.getElementById(id);
    return element?element.value.trim():'';
}

function selectTemplate(templateId){
    const validTemplates=[
        'modern',
        'banner',
        'minimalist',
        'headerCenter',
        'darkSidebar',
        'modernBlue',
        'bannerBlue',
        'sidebarBlue',
        'waveRed'
    ];

    if(!validTemplates.includes(templateId)){
        templateId='modern';
    }

    currentTemplate=templateId;

    updateTemplateButtons();
    renderCV();
}

function updateTemplateButtons(){
    document.querySelectorAll('.template-card').forEach(card=>{
        card.classList.remove(
            'ring-4',
            'ring-indigo-600',
            'border-indigo-600',
            'shadow-lg',
            'bg-indigo-50'
        );

        card.classList.add(
            'border-slate-200',
            'bg-white'
        );
    });

    const activeCard=document.getElementById(
        'btn-tpl-'+currentTemplate
    );

    if(activeCard){
        activeCard.classList.remove(
            'border-slate-200',
            'bg-white'
        );

        activeCard.classList.add(
            'ring-4',
            'ring-indigo-600',
            'border-indigo-600',
            'shadow-lg',
            'bg-indigo-50'
        );
    }
}

function collectCandidateData(){
    const rawName=getInputValue('inputName');
    const parts=rawName.split(/\s+/).filter(Boolean);

    const firstName=parts.length>0?parts[0]:'';
    const lastName=parts.length>1?parts.slice(1).join(' '):'';

    const skillsRaw=getInputValue('inputSkills');

    const skillsList=skillsRaw
        ?skillsRaw
            .split(',')
            .map(s=>s.trim())
            .filter(Boolean)
        :[];

    return{
        name:escapeHTML(rawName),
        firstName:escapeHTML(firstName),
        lastName:escapeHTML(lastName),
        email:escapeHTML(getInputValue('inputEmail')),
        phone:escapeHTML(getInputValue('inputPhone')),
        address:escapeHTML(getInputValue('inputAddress')).replace(/\n/g,'<br>'),
        birthdate:escapeHTML(getInputValue('inputBirthdate')),
        summary:escapeHTML(getInputValue('inputSummary')).replace(/\n/g,'<br>'),
        skillsRaw:skillsRaw,
        skillsList:skillsList,
        photoDataUrl:photoBase64
    };
}

function renderCV(){
    const cvPreview=document.getElementById('cvPreview');

    if(!cvPreview)return;

    const d=collectCandidateData();

    let html='';

    switch(currentTemplate){

        case 'modern':
            html=buildModernTemplate(d);
            break;

        case 'banner':
            html=buildBannerTemplate(d);
            break;

        case 'minimalist':
            html=buildMinimalistTemplate(d);
            break;

        case 'headerCenter':
            html=buildHeaderCenterTemplate(d);
            break;

        case 'darkSidebar':
            html=buildDarkSidebarTemplate(d);
            break;

        case 'modernBlue':
            html=buildModernBlueTemplate(d);
            break;

        case 'bannerBlue':
            html=buildBannerBlueTemplate(d);
            break;

        case 'sidebarBlue':
            html=buildSidebarBlueTemplate(d);
            break;

        case 'waveRed':
            html=buildWaveRedTemplate(d);
            break;

        default:
            currentTemplate='modern';
            updateTemplateButtons();
            html=buildModernTemplate(d);
    }

    cvPreview.innerHTML=html;
}

function renderSelectedCVTemplate(templateId,candidateData){
    const d=candidateData||collectCandidateData();

    switch(templateId){
        case 'modern':
            return buildModernTemplate(d);

        case 'banner':
            return buildBannerTemplate(d);

        case 'minimalist':
            return buildMinimalistTemplate(d);

        case 'headerCenter':
            return buildHeaderCenterTemplate(d);

        case 'darkSidebar':
            return buildDarkSidebarTemplate(d);

        case 'modernBlue':
            return buildModernBlueTemplate(d);

        case 'bannerBlue':
            return buildBannerBlueTemplate(d);

        case 'sidebarBlue':
            return buildSidebarBlueTemplate(d);

        case 'waveRed':
            return buildWaveRedTemplate(d);

        default:
            return buildModernTemplate(d);
    }
}

function renderFormationsInputs(){
    const container=document.getElementById('formationsContainer');

    if(!container)return;

    container.innerHTML='';

    formations.forEach((form,index)=>{
        const block=document.createElement('div');

        block.className='p-2 border rounded bg-gray-50 space-y-1 relative text-xs';

        block.innerHTML=`
            <button
                type="button"
                onclick="removeFormation(${index})"
                class="absolute top-1 right-1 text-red-500 font-bold text-xs hover:text-red-700 cursor-pointer"
                title="Supprimer">
                ✕
            </button>

            <input
                type="text"
                placeholder="Diplôme"
                value="${escapeHTML(form.title)}"
                oninput="updateFormation(${index},'title',this.value)"
                class="w-full border rounded p-1">

            <input
                type="text"
                placeholder="École / Université"
                value="${escapeHTML(form.school)}"
                oninput="updateFormation(${index},'school',this.value)"
                class="w-full border rounded p-1">

            <input
                type="text"
                placeholder="Période"
                value="${escapeHTML(form.year)}"
                oninput="updateFormation(${index},'year',this.value)"
                class="w-full border rounded p-1">
        `;

        container.appendChild(block);
    });
}

function addFormationField(){
    formations.push({
        title:'',
        school:'',
        year:''
    });

    renderFormationsInputs();
    renderCV();
}

function updateFormation(index,field,value){
    if(!formations[index])return;

    formations[index][field]=value;
    renderCV();
}

function removeFormation(index){
    if(index<0||index>=formations.length)return;

    formations.splice(index,1);

    renderFormationsInputs();
    renderCV();
}

function renderExperiencesInputs(){
    const container=document.getElementById('experiencesContainer');

    if(!container)return;

    container.innerHTML='';

    experiences.forEach((exp,index)=>{
        if(!Array.isArray(exp.tasks)){
            exp.tasks=[];
        }

        const block=document.createElement('div');

        block.className='p-2 border rounded bg-gray-50 space-y-2 relative text-xs';

        let tasksHTML='';

        exp.tasks.forEach((task,taskIndex)=>{
            tasksHTML+=`
                <div class="flex gap-1 mb-1">

                    <textarea
                        placeholder="Description de la tâche..."
                        oninput="updateTask(${index},${taskIndex},this.value)"
                        class="w-full border rounded p-1 text-xs"
                        rows="2">${escapeHTML(task)}</textarea>

                    <button
                        type="button"
                        onclick="removeTask(${index},${taskIndex})"
                        class="bg-red-100 text-red-600 px-2 rounded text-xs hover:bg-red-200 cursor-pointer"
                        title="Supprimer">
                        ✕
                    </button>

                </div>
            `;
        });

        block.innerHTML=`
            <button
                type="button"
                onclick="removeExperience(${index})"
                class="absolute top-1 right-1 text-red-500 font-bold text-xs hover:text-red-700 cursor-pointer"
                title="Supprimer l'expérience">
                ✕
            </button>

            <div class="pr-6 space-y-1">

                <input
                    type="text"
                    placeholder="Poste"
                    value="${escapeHTML(exp.job)}"
                    oninput="updateExperience(${index},'job',this.value)"
                    class="w-full border rounded p-1">

                <input
                    type="text"
                    placeholder="Entreprise"
                    value="${escapeHTML(exp.company)}"
                    oninput="updateExperience(${index},'company',this.value)"
                    class="w-full border rounded p-1">

                <input
                    type="text"
                    placeholder="Période"
                    value="${escapeHTML(exp.year)}"
                    oninput="updateExperience(${index},'year',this.value)"
                    class="w-full border rounded p-1">

            </div>

            <div class="mt-2 pt-2 border-t border-gray-200">

                <div class="flex justify-between items-center mb-1">

                    <span class="text-[11px] font-semibold text-gray-600">
                        Détails du poste :
                    </span>

                    <button
                        type="button"
                        onclick="addTask(${index})"
                        class="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded hover:bg-indigo-200 font-medium cursor-pointer">
                        + Ligne
                    </button>

                </div>

                <div class="space-y-1">
                    ${tasksHTML}
                </div>

            </div>
        `;

        container.appendChild(block);
    });
}

function addExperienceField(){
    experiences.push({
        job:'',
        company:'',
        year:'',
        tasks:['']
    });

    renderExperiencesInputs();
    renderCV();
}

function updateExperience(index,field,value){
    if(!experiences[index])return;

    experiences[index][field]=value;
    renderCV();
}

function removeExperience(index){
    if(index<0||index>=experiences.length)return;

    experiences.splice(index,1);

    renderExperiencesInputs();
    renderCV();
}

function addTask(expIndex){
    if(!experiences[expIndex])return;

    if(!Array.isArray(experiences[expIndex].tasks)){
        experiences[expIndex].tasks=[];
    }

    experiences[expIndex].tasks.push('');

    renderExperiencesInputs();
    renderCV();
}

function updateTask(expIndex,taskIndex,value){
    if(!experiences[expIndex])return;

    if(!Array.isArray(experiences[expIndex].tasks)){
        experiences[expIndex].tasks=[];
    }

    experiences[expIndex].tasks[taskIndex]=value;

    renderCV();
}

function removeTask(expIndex,taskIndex){
    if(!experiences[expIndex])return;

    if(!Array.isArray(experiences[expIndex].tasks))return;

    experiences[expIndex].tasks.splice(taskIndex,1);

    if(experiences[expIndex].tasks.length===0){
        experiences[expIndex].tasks.push('');
    }

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

        block.innerHTML=`
            <input
                type="text"
                placeholder="Langue"
                value="${escapeHTML(lang.language)}"
                oninput="updateLanguage(${index},'language',this.value)"
                class="w-1/2 border rounded p-1">

            <input
                type="text"
                placeholder="Niveau"
                value="${escapeHTML(lang.level)}"
                oninput="updateLanguage(${index},'level',this.value)"
                class="w-1/2 border rounded p-1">

            <button
                type="button"
                onclick="removeLanguage(${index})"
                class="text-red-500 font-bold text-xs hover:text-red-700 px-1 cursor-pointer"
                title="Supprimer">
                ✕
            </button>
        `;

        container.appendChild(block);
    });
}

function addLanguageField(){
    languages.push({
        language:'',
        level:''
    });

    renderLanguagesInputs();
    renderCV();
}

function updateLanguage(index,field,value){
    if(!languages[index])return;

    languages[index][field]=value;
    renderCV();
}

function removeLanguage(index){
    if(index<0||index>=languages.length)return;

    languages.splice(index,1);

    renderLanguagesInputs();
    renderCV();
}

function getValidFormations(){
    return formations.filter(f=>
        (f.title||'').trim()||
        (f.school||'').trim()||
        (f.year||'').trim()
    );
}

function getValidExperiences(){
    return experiences.filter(e=>
        (e.job||'').trim()||
        (e.company||'').trim()||
        (e.year||'').trim()
    );
}

function getValidLanguages(){
    return languages.filter(l=>
        (l.language||'').trim()
    );
}

function buildProfileSection(summary,color){
    if(!summary)return '';

    return `
        <div style="margin-bottom:20px;break-inside:avoid;page-break-inside:avoid;">

            <h3 style="
                font-size:13px;
                color:${color};
                text-transform:uppercase;
                border-bottom:1px solid #e5e7eb;
                padding-bottom:3px;
                margin-bottom:8px;
                font-weight:bold;">
                Profil
            </h3>

            <p style="
                font-size:11px;
                color:#333;
                line-height:1.5;
                margin:0;
                text-align:justify;">
                ${summary}
            </p>

        </div>
    `;
}

function buildFormationsSection(color){
    const valid=getValidFormations();

    if(!valid.length)return '';

    let html=`
        <div style="margin-bottom:20px;">

            <h3 style="
                font-size:13px;
                color:${color};
                text-transform:uppercase;
                border-bottom:1px solid #e5e7eb;
                padding-bottom:3px;
                margin-bottom:10px;
                font-weight:bold;">
                Formation
            </h3>
    `;

    valid.forEach(f=>{
        html+=`
            <div style="
                margin-bottom:10px;
                break-inside:avoid;
                page-break-inside:avoid;">

                <table style="
                    width:100%;
                    border-collapse:collapse;
                    font-size:11px;">

                    <tr>

                        <td style="
                            font-weight:bold;
                            color:#333;
                            width:65%;">
                            ${escapeHTML(f.title)}
                        </td>

                        <td style="
                            text-align:right;
                            font-weight:bold;
                            color:#555;
                            width:35%;">
                            ${escapeHTML(f.year)}
                        </td>

                    </tr>

                    <tr>

                        <td colspan="2" style="
                            color:${color};
                            font-size:10.5px;">
                            ${escapeHTML(f.school)}
                        </td>

                    </tr>

                </table>

            </div>
        `;
    });

    return html+'</div>';
}

function buildExperiencesSection(color){
    const valid=getValidExperiences();

    if(!valid.length)return '';

    let html=`
        <div style="margin-bottom:20px;">

            <h3 style="
                font-size:13px;
                color:${color};
                text-transform:uppercase;
                border-bottom:1px solid #e5e7eb;
                padding-bottom:3px;
                margin-bottom:10px;
                font-weight:bold;">
                Expérience professionnelle
            </h3>
    `;

    valid.forEach(e=>{
        const validTasks=(e.tasks||[])
            .filter(t=>(t||'').trim());

        let tasks='';

        if(validTasks.length){
            tasks=`
                <ul style="
                    margin:4px 0 0;
                    padding-left:16px;">

                    ${validTasks.map(t=>`
                        <li style="
                            font-size:11px;
                            color:#333;
                            margin-bottom:2px;
                            line-height:1.4;">
                            ${escapeHTML(t)}
                        </li>
                    `).join('')}

                </ul>
            `;
        }

        html+=`
            <div style="
                margin-bottom:14px;
                break-inside:avoid;
                page-break-inside:avoid;">

                <table style="
                    width:100%;
                    border-collapse:collapse;
                    font-size:11px;">

                    <tr>

                        <td style="
                            font-weight:bold;
                            color:#333;">
                            ${escapeHTML(e.job)}
                        </td>

                        <td style="
                            text-align:right;
                            font-weight:bold;
                            color:#555;
                            white-space:nowrap;
                            vertical-align:top;">
                            ${escapeHTML(e.year)}
                        </td>

                    </tr>

                    <tr>

                        <td colspan="2" style="
                            color:${color};
                            font-weight:500;">
                            ${escapeHTML(e.company)}
                        </td>

                    </tr>

                </table>

                ${tasks}

            </div>
        `;
    });

    return html+'</div>';
}

function buildSkillsSection(skillsRaw,color,textColor='#333'){
    if(!skillsRaw)return '';

    const skills=skillsRaw
        .split(',')
        .map(s=>s.trim())
        .filter(Boolean);

    if(!skills.length)return '';

    return `
        <div style="
            margin-bottom:20px;
            break-inside:avoid;
            page-break-inside:avoid;">

            <h3 style="
                font-size:12px;
                color:${color};
                text-transform:uppercase;
                border-bottom:1px solid rgba(255,255,255,.2);
                padding-bottom:3px;
                margin-bottom:8px;
                font-weight:bold;">
                Compétences
            </h3>

            ${skills.map(skill=>`
                <p style="
                    margin:3px 0;
                    font-size:11px;
                    color:${textColor};">
                    • ${escapeHTML(skill)}
                </p>
            `).join('')}

        </div>
    `;
}

function buildLanguagesSection(color,textColor='#333'){
    const valid=getValidLanguages();

    if(!valid.length)return '';

    return `
        <div style="
            margin-bottom:20px;
            break-inside:avoid;
            page-break-inside:avoid;">

            <h3 style="
                font-size:12px;
                color:${color};
                text-transform:uppercase;
                border-bottom:1px solid rgba(255,255,255,.2);
                padding-bottom:3px;
                margin-bottom:8px;
                font-weight:bold;">
                Langues
            </h3>

            ${valid.map(lang=>`
                <div style="
                    font-size:11px;
                    margin-bottom:4px;
                    color:${textColor};">

                    •
                    <strong>
                        ${escapeHTML(lang.language)}
                    </strong>

                    ${lang.level.trim()
                        ?`: ${escapeHTML(lang.level)}`
                        :''
                    }

                </div>
            `).join('')}

        </div>
    `;
}

function formatHeaderName(name){
    if(!name)return '';

    const parts=String(name)
        .replace(/<[^>]*>/g,'')
        .split(/\s+/)
        .filter(Boolean);

    if(!parts.length)return '';

    const firstNames=[];
    const lastNames=[];

    parts.forEach(part=>{
        if(
            part.length>1 &&
            part===part.toUpperCase() &&
            /[A-ZÀ-ÖØ-Ý]/.test(part)
        ){
            lastNames.push(part);
        }else{
            firstNames.push(part);
        }
    });

    if(firstNames.length&&lastNames.length){
        return `
            ${escapeHTML(firstNames.join(' '))}<br>
            <span style="text-transform:uppercase;">
                ${escapeHTML(lastNames.join(' '))}
            </span>
        `;
    }

    return escapeHTML(parts.join(' '));
}

function getIcons(iconStyle){
    return{
        user:`
            <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                style="${iconStyle}">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>`,

        email:`
            <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                style="${iconStyle}">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>`,

        phone:`
            <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                style="${iconStyle}">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>`,

        home:`
            <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                style="${iconStyle}">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>`,

        date:`
            <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                style="${iconStyle}">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
            </svg>`
    };
}

function buildModernTemplate(d){
    const iconStyle='width:14px;height:14px;min-width:14px;min-height:14px;color:#3A5A78;fill:currentColor;margin-top:2px;flex-shrink:0;display:inline-block;vertical-align:middle;';
    const icons=getIcons(iconStyle);

    const photoHTML=d.photoDataUrl
        ?`
            <img
                src="${d.photoDataUrl}"
                alt="Photo du candidat"
                style="
                    width:110px;
                    height:110px;
                    object-fit:cover;
                    border-radius:50%;
                    border:4px solid white;
                    box-shadow:0 4px 6px rgba(0,0,0,.15);">
        `
        :`
            <div style="
                width:110px;
                height:110px;
                border-radius:50%;
                background:#e2e8f0;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:28px;
                border:4px solid white;">
                📷
            </div>
        `;

    return `
        <table class="cv-full-height-table">

            <tr>

                <td
                    class="cv-sidebar-full"
                    style="
                        width:75mm;
                        background:#f3f4f6;
                        vertical-align:top;
                        padding:0;">

                    <div style="
                        background:#3b5998;
                        color:white;
                        padding:25px 15px 35px;
                        text-align:center;">

                        <h2 style="
                            font-size:15px;
                            font-weight:bold;
                            line-height:1.3;
                            margin:0;">
                            ${formatHeaderName(d.name)}
                        </h2>

                    </div>

                    <div style="
                        display:flex;
                        justify-content:center;
                        margin-top:-45px;
                        margin-bottom:20px;">
                        ${photoHTML}
                    </div>

                    <div style="padding:0 20px 20px;">

                        <h3 style="
                            font-size:12px;
                            color:#3b5998;
                            text-transform:uppercase;
                            border-bottom:1px solid #d1d5db;
                            padding-bottom:4px;
                            margin-bottom:12px;">
                            Informations
                        </h3>

                        <div style="
                            font-size:11px;
                            color:#333;">

                            ${d.name?`
                                <div style="
                                    display:flex;
                                    gap:8px;
                                    margin-bottom:8px;">
                                    ${icons.user}
                                    <span>${d.name}</span>
                                </div>
                            `:''}

                            ${d.email?`
                                <div style="
                                    display:flex;
                                    gap:8px;
                                    margin-bottom:8px;">
                                    ${icons.email}
                                    <span style="word-break:break-all;">
                                        ${d.email}
                                    </span>
                                </div>
                            `:''}

                            ${d.phone?`
                                <div style="
                                    display:flex;
                                    gap:8px;
                                    margin-bottom:8px;">
                                    ${icons.phone}
                                    <span>${d.phone}</span>
                                </div>
                            `:''}

                            ${d.address?`
                                <div style="
                                    display:flex;
                                    gap:8px;
                                    margin-bottom:8px;">
                                    ${icons.home}
                                    <span>${d.address}</span>
                                </div>
                            `:''}

                            ${d.birthdate?`
                                <div style="
                                    display:flex;
                                    gap:8px;
                                    margin-bottom:8px;">
                                    ${icons.date}
                                    <span>${d.birthdate}</span>
                                </div>
                            `:''}

                        </div>

                        ${buildSkillsSection(d.skillsRaw,'#3b5998')}
                        ${buildLanguagesSection('#3b5998')}

                    </div>

                </td>

                <td
                    class="cv-main-full"
                    style="
                        width:135mm;
                        vertical-align:top;
                        padding:35px 30px;
                        background:white;">

                    ${buildProfileSection(d.summary,'#3b5998')}
                    ${buildFormationsSection('#3b5998')}
                    ${buildExperiencesSection('#3b5998')}

                </td>

            </tr>

        </table>
    `;
}

function buildModernBlueTemplate(d){
    const primary='#263F5B';
    const accent='#3B82A0';

    const photoHTML=d.photoDataUrl
        ?`
            <img
                src="${d.photoDataUrl}"
                style="
                    width:112px;
                    height:112px;
                    object-fit:cover;
                    border-radius:50%;
                    border:5px solid white;
                    box-shadow:0 3px 8px rgba(0,0,0,.18);">
        `
        :`
            <div style="
                width:112px;
                height:112px;
                border-radius:50%;
                background:#D9E2E8;
                border:5px solid white;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:30px;">
                📷
            </div>
        `;

    const validF=getValidFormations();
    const validE=getValidExperiences();
    const validL=getValidLanguages();

    return `
        <table
            class="cv-full-height-table"
            style="
                width:210mm;
                height:297mm;
                background:white;">

            <tr style="height:297mm;">

                <td style="
                    width:72mm;
                    height:297mm;
                    padding:0;
                    vertical-align:top;
                    background:${primary};
                    color:white;">

                    <div style="
                        padding:28px 20px 24px;
                        text-align:center;">

                        <div style="
                            display:flex;
                            justify-content:center;
                            margin-bottom:15px;">
                            ${photoHTML}
                        </div>

                        <div style="
                            font-size:17px;
                            font-weight:700;
                            text-transform:uppercase;
                            letter-spacing:.7px;">
                            ${d.firstName}
                        </div>

                        <div style="
                            font-size:15px;
                            text-transform:uppercase;
                            letter-spacing:1px;
                            color:#D9E8EF;
                            margin-top:3px;">
                            ${d.lastName}
                        </div>

                        <div style="
                            height:2px;
                            width:42px;
                            background:${accent};
                            margin:14px auto 0;">
                        </div>

                    </div>

                    <div style="padding:0 20px 30px;">

                        <h3 style="
                            font-size:11px;
                            text-transform:uppercase;
                            letter-spacing:1px;
                            border-bottom:1px solid rgba(255,255,255,.3);
                            padding-bottom:6px;
                            margin-bottom:12px;">
                            Contact
                        </h3>

                        ${d.email?`
                            <div style="
                                font-size:10.5px;
                                margin-bottom:9px;
                                word-break:break-word;">
                                <span style="color:#8FC4D7;">✉</span>
                                ${d.email}
                            </div>
                        `:''}

                        ${d.phone?`
                            <div style="
                                font-size:10.5px;
                                margin-bottom:9px;">
                                <span style="color:#8FC4D7;">☎</span>
                                ${d.phone}
                            </div>
                        `:''}

                        ${d.address?`
                            <div style="
                                font-size:10.5px;
                                margin-bottom:9px;">
                                <span style="color:#8FC4D7;">⌂</span>
                                ${d.address}
                            </div>
                        `:''}

                        ${d.birthdate?`
                            <div style="
                                font-size:10.5px;
                                margin-bottom:9px;">
                                <span style="color:#8FC4D7;">●</span>
                                ${d.birthdate}
                            </div>
                        `:''}

                        ${d.skillsList.length?`
                            <div style="margin-top:22px;">

                                <h3 style="
                                    font-size:11px;
                                    text-transform:uppercase;
                                    letter-spacing:1px;
                                    border-bottom:1px solid rgba(255,255,255,.3);
                                    padding-bottom:6px;
                                    margin-bottom:10px;">
                                    Compétences
                                </h3>

                                ${d.skillsList.map(skill=>`
                                    <div style="
                                        font-size:10.5px;
                                        margin-bottom:6px;">
                                        <span style="color:#8FC4D7;">•</span>
                                        ${escapeHTML(skill)}
                                    </div>
                                `).join('')}

                            </div>
                        `:''}

                        ${validL.length?`
                            <div style="margin-top:22px;">

                                <h3 style="
                                    font-size:11px;
                                    text-transform:uppercase;
                                    letter-spacing:1px;
                                    border-bottom:1px solid rgba(255,255,255,.3);
                                    padding-bottom:6px;
                                    margin-bottom:10px;">
                                    Langues
                                </h3>

                                ${validL.map(lang=>`
                                    <div style="
                                        font-size:10.5px;
                                        margin-bottom:7px;">
                                        <strong>
                                            ${escapeHTML(lang.language)}
                                        </strong>
                                        ${lang.level?`
                                            <span style="color:#BBD3DC;">
                                                — ${escapeHTML(lang.level)}
                                            </span>
                                        `:''}
                                    </div>
                                `).join('')}

                            </div>
                        `:''}

                    </div>

                </td>

                <td style="
                    width:138mm;
                    height:297mm;
                    padding:34px 30px;
                    vertical-align:top;
                    background:white;">

                    ${d.summary?`
                        <div style="margin-bottom:21px;">

                            <div style="
                                display:flex;
                                align-items:center;
                                gap:9px;
                                margin-bottom:9px;">

                                <span style="
                                    width:5px;
                                    height:20px;
                                    background:${accent};
                                    display:block;">
                                </span>

                                <h2 style="
                                    font-size:13px;
                                    color:${primary};
                                    text-transform:uppercase;
                                    letter-spacing:.7px;
                                    margin:0;">
                                    Profil
                                </h2>

                            </div>

                            <p style="
                                font-size:10.8px;
                                line-height:1.55;
                                color:#374151;
                                margin:0;
                                text-align:justify;">
                                ${d.summary}
                            </p>

                        </div>
                    `:''}

                    ${validE.length?`
                        <div style="margin-bottom:21px;">

                            <div style="
                                display:flex;
                                align-items:center;
                                gap:9px;
                                margin-bottom:10px;">

                                <span style="
                                    width:5px;
                                    height:20px;
                                    background:${accent};
                                    display:block;">
                                </span>

                                <h2 style="
                                    font-size:13px;
                                    color:${primary};
                                    text-transform:uppercase;
                                    letter-spacing:.7px;
                                    margin:0;">
                                    Expérience professionnelle
                                </h2>

                            </div>

                            ${validE.map(e=>`
                                <div style="
                                    margin-bottom:14px;
                                    break-inside:avoid;
                                    page-break-inside:avoid;">

                                    <div style="
                                        display:flex;
                                        justify-content:space-between;
                                        gap:10px;">

                                        <strong style="
                                            font-size:11.5px;
                                            color:${primary};">
                                            ${escapeHTML(e.job)}
                                        </strong>

                                        <span style="
                                            font-size:10px;
                                            color:${accent};
                                            white-space:nowrap;">
                                            ${escapeHTML(e.year)}
                                        </span>

                                    </div>

                                    <div style="
                                        font-size:10.5px;
                                        color:${accent};
                                        margin-top:2px;">
                                        ${escapeHTML(e.company)}
                                    </div>

                                    ${(e.tasks||[]).filter(t=>t.trim()).length?`
                                        <ul style="
                                            margin:5px 0 0;
                                            padding-left:16px;">

                                            ${(e.tasks||[])
                                                .filter(t=>t.trim())
                                                .map(t=>`
                                                    <li style="
                                                        font-size:10.2px;
                                                        line-height:1.4;
                                                        margin-bottom:2px;">
                                                        ${escapeHTML(t)}
                                                    </li>
                                                `).join('')}

                                        </ul>
                                    `:''}

                                </div>
                            `).join('')}

                        </div>
                    `:''}

                    ${validF.length?`
                        <div style="margin-bottom:21px;">

                            <div style="
                                display:flex;
                                align-items:center;
                                gap:9px;
                                margin-bottom:10px;">

                                <span style="
                                    width:5px;
                                    height:20px;
                                    background:${accent};
                                    display:block;">
                                </span>

                                <h2 style="
                                    font-size:13px;
                                    color:${primary};
                                    text-transform:uppercase;
                                    letter-spacing:.7px;
                                    margin:0;">
                                    Formation
                                </h2>

                            </div>

                            ${validF.map(f=>`
                                <div style="
                                    margin-bottom:10px;
                                    break-inside:avoid;
                                    page-break-inside:avoid;">

                                    <div style="
                                        display:flex;
                                        justify-content:space-between;
                                        gap:10px;">

                                        <strong style="
                                            font-size:11px;
                                            color:${primary};">
                                            ${escapeHTML(f.title)}
                                        </strong>

                                        <span style="
                                            font-size:10px;
                                            color:${accent};
                                            white-space:nowrap;">
                                            ${escapeHTML(f.year)}
                                        </span>

                                    </div>

                                    <div style="
                                        font-size:10.3px;
                                        color:#555;
                                        margin-top:2px;">
                                        ${escapeHTML(f.school)}
                                    </div>

                                </div>
                            `).join('')}

                        </div>
                    `:''}

                </td>

            </tr>

        </table>
    `;
}

function buildBannerTemplate(d){
    const photoHTML=d.photoDataUrl
        ?`
            <img
                src="${d.photoDataUrl}"
                style="
                    width:100px;
                    height:100px;
                    object-fit:cover;
                    border-radius:8px;
                    border:3px solid white;">
        `
        :`
            <div style="
                width:100px;
                height:100px;
                background:#e2e8f0;
                border-radius:8px;
                display:flex;
                align-items:center;
                justify-content:center;
                border:3px solid white;">
                📷
            </div>
        `;

    return `
        <div style="
            width:210mm;
            min-height:297mm;
            background:white;
            box-sizing:border-box;">

            <div style="
                background:#2b5b6c;
                color:white;
                padding:25px 30px;
                display:flex;
                align-items:center;
                gap:20px;">

                ${photoHTML}

                <div style="flex-grow:1;">

                    <h1 style="
                        font-size:22px;
                        font-weight:bold;
                        margin:0 0 6px;
                        text-transform:uppercase;
                        letter-spacing:1px;">
                        ${d.name}
                    </h1>

                    <div style="
                        font-size:11px;
                        color:#e2e8f0;
                        display:flex;
                        flex-wrap:wrap;
                        gap:12px;">

                        ${d.email?`<span>✉ ${d.email}</span>`:''}
                        ${d.phone?`<span>📞 ${d.phone}</span>`:''}
                        ${d.birthdate?`<span>📅 ${d.birthdate}</span>`:''}
                        ${d.address?`<span>📍 ${d.address.replace(/<br>/g,', ')}</span>`:''}

                    </div>

                </div>

            </div>

            <table style="
                width:210mm;
                min-height:250mm;
                border-collapse:collapse;
                table-layout:fixed;">

                <tr>

                    <td style="
                        width:70mm;
                        vertical-align:top;
                        padding:25px 20px;
                        background:#f8fafc;
                        border-right:1px solid #e2e8f0;">

                        ${buildSkillsSection(d.skillsRaw,'#2b5b6c')}
                        ${buildLanguagesSection('#2b5b6c')}

                    </td>

                    <td style="
                        width:140mm;
                        vertical-align:top;
                        padding:25px;">

                        ${buildProfileSection(d.summary,'#2b5b6c')}
                        ${buildFormationsSection('#2b5b6c')}
                        ${buildExperiencesSection('#2b5b6c')}

                    </td>

                </tr>

            </table>

        </div>
    `;
}

function buildMinimalistTemplate(d){
    const primary='#856404';

    const photoHTML=d.photoDataUrl
        ?`
            <img
                src="${d.photoDataUrl}"
                style="
                    width:90px;
                    height:90px;
                    object-fit:cover;
                    border-radius:4px;
                    border:1px solid #ddd;">
        `
        :'';

    return `
        <div style="
            width:210mm;
            min-height:297mm;
            padding:25px 30px;
            background:white;
            box-sizing:border-box;">

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                border-bottom:2px solid ${primary};
                padding-bottom:15px;
                margin-bottom:20px;">

                <div>

                    <h1 style="
                        font-size:24px;
                        font-weight:bold;
                        color:#222;
                        margin:0 0 5px;
                        text-transform:uppercase;">
                        ${d.name}
                    </h1>

                    <div style="
                        font-size:11px;
                        color:#555;
                        display:flex;
                        flex-wrap:wrap;
                        gap:10px;">

                        ${d.email?`<span>${d.email}</span>`:''}
                        ${d.phone?`<span>| ${d.phone}</span>`:''}
                        ${d.birthdate?`<span>| ${d.birthdate}</span>`:''}
                        ${d.address?`<span>| ${d.address.replace(/<br>/g,', ')}</span>`:''}

                    </div>

                </div>

                ${photoHTML}

            </div>

            ${buildProfileSection(d.summary,primary)}

            <table style="
                width:100%;
                border-collapse:collapse;
                table-layout:fixed;">

                <tr>

                    <td style="
                        width:65%;
                        vertical-align:top;
                        padding-right:15px;">

                        ${buildExperiencesSection(primary)}

                    </td>

                    <td style="
                        width:35%;
                        vertical-align:top;
                        border-left:1px solid #eee;
                        padding-left:15px;">

                        ${buildFormationsSection(primary)}
                        ${buildSkillsSection(d.skillsRaw,primary)}
                        ${buildLanguagesSection(primary)}

                    </td>

                </tr>

            </table>

        </div>
    `;
}

function buildHeaderCenterTemplate(d){
    const color='#2c3e50';

    const photoHTML=d.photoDataUrl
        ?`
            <img
                src="${d.photoDataUrl}"
                style="
                    width:100px;
                    height:100px;
                    object-fit:cover;
                    border-radius:50%;
                    border:3px solid #fff;
                    box-shadow:0 2px 5px rgba(0,0,0,.1);
                    margin:0 auto 12px;
                    display:block;">
        `
        :'';

    return `
        <div style="
            width:210mm;
            min-height:297mm;
            padding:30px;
            background:white;
            box-sizing:border-box;
            font-family:Arial,Helvetica,sans-serif;">

            ${photoHTML}

            <div style="
                text-align:center;
                border-bottom:1px solid #e2e8f0;
                padding-bottom:15px;
                margin-bottom:20px;">

                <h1 style="
                    font-size:22px;
                    font-weight:bold;
                    color:${color};
                    margin:0 0 6px;
                    text-transform:uppercase;
                    letter-spacing:1px;">
                    ${d.name}
                </h1>

                <div style="
                    font-size:11px;
                    color:#666;
                    display:flex;
                    justify-content:center;
                    flex-wrap:wrap;
                    gap:15px;">

                    ${d.email?`<span>✉ ${d.email}</span>`:''}
                    ${d.phone?`<span>📞 ${d.phone}</span>`:''}
                    ${d.birthdate?`<span>📅 ${d.birthdate}</span>`:''}
                    ${d.address?`<span>📍 ${d.address.replace(/<br>/g,', ')}</span>`:''}

                </div>

            </div>

            ${buildProfileSection(d.summary,color)}
            ${buildFormationsSection(color)}
            ${buildExperiencesSection(color)}
            ${buildSkillsSection(d.skillsRaw,color)}
            ${buildLanguagesSection(color)}

        </div>
    `;
}

function buildDarkSidebarTemplate(d){
    const primary='#1abc9c';
    const dark='#2c3e50';

    const photoHTML=d.photoDataUrl
        ?`
            <img
                src="${d.photoDataUrl}"
                style="
                    width:100px;
                    height:100px;
                    object-fit:cover;
                    border-radius:50%;
                    border:3px solid ${primary};
                    margin:0 auto 15px;
                    display:block;">
        `
        :'';

    return `
        <table
            class="cv-full-height-table"
            style="
                width:210mm;
                height:297mm;
                background:white;">

            <tr style="height:297mm;">

                <td style="
                    width:70mm;
                    height:297mm;
                    background:${dark};
                    color:white;
                    vertical-align:top;
                    padding:25px 20px;">

                    ${photoHTML}

                    <h2 style="
                        font-size:16px;
                        font-weight:bold;
                        text-align:center;
                        margin-bottom:15px;
                        color:white;">
                        ${d.name}
                    </h2>

                    <div style="
                        font-size:11px;
                        margin-bottom:20px;
                        color:#ecf0f1;">

                        ${d.email?`<div style="margin-bottom:6px;">✉ ${d.email}</div>`:''}
                        ${d.phone?`<div style="margin-bottom:6px;">📞 ${d.phone}</div>`:''}
                        ${d.birthdate?`<div style="margin-bottom:6px;">📅 ${d.birthdate}</div>`:''}
                        ${d.address?`<div style="margin-bottom:6px;">📍 ${d.address}</div>`:''}

                    </div>

                    ${buildSkillsSection(d.skillsRaw,primary,'#ecf0f1')}
                    ${buildLanguagesSection(primary,'#ecf0f1')}

                </td>

                <td style="
                    width:140mm;
                    height:297mm;
                    vertical-align:top;
                    padding:30px;
                    background:white;">

                    ${buildProfileSection(d.summary,dark)}
                    ${buildFormationsSection(dark)}
                    ${buildExperiencesSection(dark)}

                </td>

            </tr>

        </table>
    `;
}

function buildSoftStageTemplate(d){
    const validF=getValidFormations();
    const validL=getValidLanguages();

    return `
        <div style="
            width:210mm;
            min-height:297mm;
            box-sizing:border-box;
            background:#FDFBF7;
            padding:32px;
            font-family:Arial,Helvetica,sans-serif;
            color:#334155;">

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:flex-start;
                gap:25px;
                margin-bottom:22px;">

                <div style="flex:1;">

                    <div style="
                        font-size:28px;
                        font-weight:900;
                        text-transform:uppercase;
                        letter-spacing:1px;
                        color:#0f172a;">
                        ${d.firstName}
                    </div>

                    <div style="
                        font-size:25px;
                        font-weight:bold;
                        text-transform:uppercase;
                        letter-spacing:1px;
                        color:#0f172a;
                        margin-bottom:15px;">
                        ${d.lastName}
                    </div>

                    ${d.summary?`
                        <div style="
                            background:white;
                            border:1px solid #c7d2fe;
                            border-radius:12px;
                            padding:13px;
                            line-height:1.5;
                            font-size:11px;
                            margin-bottom:12px;">
                            ${d.summary}
                        </div>
                    `:''}

                    <div style="
                        display:flex;
                        flex-wrap:wrap;
                        gap:8px;">

                        ${d.email?`
                            <span style="
                                background:#eff6ff;
                                color:#1e3a8a;
                                padding:6px 10px;
                                border-radius:20px;
                                font-size:10px;">
                                📧 ${d.email}
                            </span>
                        `:''}

                        ${d.phone?`
                            <span style="
                                background:#eff6ff;
                                color:#1e3a8a;
                                padding:6px 10px;
                                border-radius:20px;
                                font-size:10px;">
                                📞 ${d.phone}
                            </span>
                        `:''}

                    </div>

                </div>

                ${d.photoDataUrl?`
                    <img
                        src="${d.photoDataUrl}"
                        style="
                            width:110px;
                            height:150px;
                            object-fit:cover;
                            border-radius:15px;
                            border:3px solid white;
                            box-shadow:0 3px 8px rgba(0,0,0,.12);">
                `:''}

            </div>

            <table style="
                width:100%;
                border-collapse:separate;
                border-spacing:8px;">

                <tr>

                    <td style="
                        width:50%;
                        vertical-align:top;
                        background:white;
                        padding:15px;
                        border-radius:15px;
                        border:1px solid #e2e8f0;">

                        <h3 style="
                            font-size:11px;
                            text-transform:uppercase;
                            border-bottom:1px solid #ddd;
                            padding-bottom:5px;
                            margin-bottom:9px;">
                            Compétences
                        </h3>

                        ${d.skillsList.length
                            ?d.skillsList.map(s=>`
                                <div style="
                                    font-size:10.5px;
                                    margin-bottom:5px;">
                                    • ${escapeHTML(s)}
                                </div>
                            `).join('')
                            :'<div style="font-size:10px;color:#94a3b8;">Aucune compétence</div>'
                        }

                    </td>

                    <td style="
                        width:50%;
                        vertical-align:top;
                        background:white;
                        padding:15px;
                        border-radius:15px;
                        border:1px solid #e2e8f0;">

                        <h3 style="
                            font-size:11px;
                            text-transform:uppercase;
                            border-bottom:1px solid #ddd;
                            padding-bottom:5px;
                            margin-bottom:9px;">
                            Formation
                        </h3>

                        ${validF.length
                            ?validF.map(f=>`
                                <div style="margin-bottom:8px;">
                                    <strong style="font-size:10.5px;">
                                        ${escapeHTML(f.title)}
                                    </strong>

                                    <div style="
                                        font-size:10px;
                                        color:#64748b;">
                                        ${escapeHTML(f.school)}
                                    </div>

                                    <div style="
                                        font-size:9px;
                                        color:#94a3b8;">
                                        ${escapeHTML(f.year)}
                                    </div>
                                </div>
                            `).join('')
                            :'<div style="font-size:10px;color:#94a3b8;">Aucune formation</div>'
                        }

                    </td>

                </tr>

            </table>

            ${validL.length?`
                <div style="
                    background:white;
                    padding:15px;
                    border-radius:15px;
                    border:1px solid #e2e8f0;
                    margin-top:8px;">

                    <h3 style="
                        font-size:11px;
                        text-transform:uppercase;
                        border-bottom:1px solid #ddd;
                        padding-bottom:5px;
                        margin-bottom:9px;">
                        Langues
                    </h3>

                    ${validL.map(l=>`
                        <span style="
                            display:inline-block;
                            width:48%;
                            font-size:10px;
                            margin-bottom:5px;">
                            • <strong>${escapeHTML(l.language)}</strong>
                            ${l.level?` (${escapeHTML(l.level)})`:''}
                        </span>
                    `).join('')}

                </div>
            `:''}

        </div>
    `;
}

function buildCreativeTaupeTemplate(d){
    const validE=getValidExperiences();

    return `
        <div style="
            width:210mm;
            min-height:297mm;
            box-sizing:border-box;
            background:#F7F5F0;
            padding:32px;
            font-family:Arial,Helvetica,sans-serif;
            color:#334155;">

            <div style="
                background:#6B5B52;
                color:white;
                padding:24px;
                border-radius:22px;
                margin-bottom:18px;">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;">

                    <div>

                        <div style="
                            display:inline-block;
                            background:#A39185;
                            padding:5px 10px;
                            border-radius:20px;
                            font-size:9px;
                            text-transform:uppercase;
                            margin-bottom:7px;">
                            Profil professionnel
                        </div>

                        <h1 style="
                            font-size:27px;
                            font-weight:300;
                            margin:0;">
                            ${d.firstName}
                        </h1>

                        <h2 style="
                            font-size:26px;
                            font-weight:bold;
                            margin:0;
                            text-transform:uppercase;">
                            ${d.lastName}
                        </h2>

                    </div>

                    ${d.photoDataUrl?`
                        <img
                            src="${d.photoDataUrl}"
                            style="
                                width:90px;
                                height:90px;
                                object-fit:cover;
                                border-radius:50%;
                                border:4px solid rgba(255,255,255,.4);">
                    `:''}

                </div>

            </div>

            <table style="
                width:100%;
                border-collapse:separate;
                border-spacing:8px;
                margin-bottom:10px;">

                <tr>

                    <td style="
                        width:35%;
                        vertical-align:top;
                        background:white;
                        padding:15px;
                        border-radius:15px;
                        border:1px solid #EBE5DE;">

                        <h3 style="
                            color:#6B5B52;
                            font-size:11px;
                            text-transform:uppercase;
                            border-bottom:1px solid #ddd;
                            padding-bottom:5px;">
                            Contact
                        </h3>

                        ${d.phone?`<p style="font-size:10px;">📞 ${d.phone}</p>`:''}
                        ${d.email?`<p style="font-size:10px;">✉ ${d.email}</p>`:''}
                        ${d.address?`<p style="font-size:10px;">📍 ${d.address}</p>`:''}
                        ${d.birthdate?`<p style="font-size:10px;">📅 ${d.birthdate}</p>`:''}

                    </td>

                    <td style="
                        width:65%;
                        vertical-align:top;
                        background:white;
                        padding:15px;
                        border-radius:15px;
                        border:1px solid #EBE5DE;">

                        <h3 style="
                            color:#6B5B52;
                            font-size:11px;
                            text-transform:uppercase;
                            border-bottom:1px solid #ddd;
                            padding-bottom:5px;">
                            Profil
                        </h3>

                        <p style="
                            font-size:10.5px;
                            line-height:1.5;
                            margin:0;">
                            ${d.summary||'Ajoutez votre résumé professionnel.'}
                        </p>

                    </td>

                </tr>

            </table>

            ${validE.length?`
                <div style="
                    background:white;
                    padding:18px;
                    border-radius:15px;
                    border:1px solid #EBE5DE;">

                    <h3 style="
                        color:#6B5B52;
                        font-size:13px;
                        text-transform:uppercase;
                        border-bottom:1px solid #ddd;
                        padding-bottom:5px;
                        margin-bottom:12px;">
                        Expérience professionnelle
                    </h3>

                    ${validE.map(e=>`
                        <div style="
                            margin-bottom:12px;
                            break-inside:avoid;
                            page-break-inside:avoid;">

                            <div style="
                                color:#A39185;
                                font-size:9px;
                                font-weight:bold;">
                                ${escapeHTML(e.year)}
                            </div>

                            <div style="
                                font-size:11px;
                                font-weight:bold;
                                color:#111827;">
                                ${escapeHTML(e.job)}
                            </div>

                            <div style="
                                font-size:10px;
                                color:#6B5B52;
                                font-weight:bold;">
                                ${escapeHTML(e.company)}
                            </div>

                            ${(e.tasks||[]).filter(t=>t.trim()).length?`
                                <ul style="
                                    margin:4px 0;
                                    padding-left:15px;">

                                    ${(e.tasks||[])
                                        .filter(t=>t.trim())
                                        .map(t=>`
                                            <li style="
                                                font-size:9.8px;
                                                margin-bottom:2px;">
                                                ${escapeHTML(t)}
                                            </li>
                                        `).join('')}

                                </ul>
                            `:''}

                        </div>
                    `).join('')}

                </div>
            `:''}

        </div>
    `;
}

/* =========================================================
   MODÈLE 7 — BANNIÈRE PRO
   ========================================================= */

function buildBannerBlueTemplate(d){
    const primary='#5B6C9B';
    const light='#EEF1F8';

    return `
        <div style="
            width:210mm;
            min-height:297mm;
            background:white;
            box-sizing:border-box;
            font-family:Arial,Helvetica,sans-serif;">

            <div style="
                background:${primary};
                color:white;
                padding:25px 30px;">

                <div style="
                    display:flex;
                    align-items:center;
                    gap:20px;">

                    ${d.photoDataUrl?`
                        <img
                            src="${d.photoDataUrl}"
                            style="
                                width:90px;
                                height:90px;
                                object-fit:cover;
                                border-radius:50%;
                                border:4px solid rgba(255,255,255,.8);">
                    `:`
                        <div style="
                            width:90px;
                            height:90px;
                            border-radius:50%;
                            background:rgba(255,255,255,.2);
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            font-size:28px;">
                            📷
                        </div>
                    `}

                    <div style="flex:1;">

                        <h1 style="
                            font-size:23px;
                            margin:0;
                            text-transform:uppercase;
                            letter-spacing:1px;">
                            ${d.name}
                        </h1>

                        <div style="
                            height:2px;
                            width:50px;
                            background:white;
                            margin:10px 0;">
                        </div>

                        <div style="
                            font-size:10.5px;
                            display:flex;
                            flex-wrap:wrap;
                            gap:10px;
                            color:#F4F6FB;">

                            ${d.email?`<span>✉ ${d.email}</span>`:''}
                            ${d.phone?`<span>📞 ${d.phone}</span>`:''}
                            ${d.birthdate?`<span>📅 ${d.birthdate}</span>`:''}

                        </div>

                    </div>

                </div>

            </div>

            <div style="
                display:flex;
                min-height:245mm;">

                <div style="
                    width:65mm;
                    background:${light};
                    padding:25px 18px;
                    box-sizing:border-box;">

                    ${buildSkillsSection(d.skillsRaw,primary)}
                    ${buildLanguagesSection(primary)}

                    ${d.address?`
                        <div style="
                            font-size:10px;
                            color:#475569;
                            margin-top:15px;">
                            <strong style="color:${primary};">
                                Adresse
                            </strong>

                            <div style="margin-top:5px;">
                                ${d.address}
                            </div>
                        </div>
                    `:''}

                </div>

                <div style="
                    width:145mm;
                    padding:25px 28px;
                    box-sizing:border-box;">

                    ${buildProfileSection(d.summary,primary)}
                    ${buildExperiencesSection(primary)}
                    ${buildFormationsSection(primary)}

                </div>

            </div>

        </div>
    `;
}

/* =========================================================
   MODÈLE 8 — SIDEBAR BLEUE
   ========================================================= */

function buildSidebarBlueTemplate(d){
    const primary='#4F65F1';
    const dark='#172554';

    return `
        <table
            class="cv-full-height-table"
            style="
                width:210mm;
                height:297mm;
                background:white;
                font-family:Arial,Helvetica,sans-serif;
                border-collapse:collapse;
                table-layout:fixed;">

            <tr style="height:297mm;">

                <td style="
                    width:65mm;
                    height:297mm;
                    vertical-align:top;
                    background:${primary};
                    color:white;
                    padding:28px 18px;
                    box-sizing:border-box;">

                    <div style="
                        width:100%;
                        text-align:center;
                        margin:0 0 25px 0;
                        padding:0;">

                        ${d.photoDataUrl?`
                            <img
                                src="${d.photoDataUrl}"
                                style="
                                    display:block;
                                    width:95px;
                                    height:95px;
                                    min-width:95px;
                                    max-width:95px;
                                    object-fit:cover;
                                    border-radius:50%;
                                    border:4px solid white;
                                    box-sizing:border-box;
                                    margin:0 auto 12px auto;
                                    padding:0;">
                        `:`
                            <div style="
                                width:95px;
                                height:95px;
                                border-radius:50%;
                                background:rgba(255,255,255,.2);
                                display:flex;
                                align-items:center;
                                justify-content:center;
                                margin:0 auto 12px auto;
                                padding:0;
                                box-sizing:border-box;
                                font-size:28px;">
                                📷
                            </div>
                        `}

                        <h1 style="
                            font-size:16px;
                            line-height:1.3;
                            text-transform:uppercase;
                            margin:0;
                            padding:0;
                            font-weight:bold;
                            text-align:center;">
                            ${escapeHTML(d.name)}
                        </h1>

                    </div>

                    <h3 style="
                        font-size:10px;
                        text-transform:uppercase;
                        letter-spacing:1px;
                        border-bottom:1px solid rgba(255,255,255,.4);
                        padding:0 0 5px 0;
                        margin:0 0 10px 0;">
                        Contact
                    </h3>

                    ${d.email?`
                        <div style="
                            font-size:9.8px;
                            margin-bottom:8px;
                            word-break:break-word;">
                            ✉ ${escapeHTML(d.email)}
                        </div>
                    `:''}

                    ${d.phone?`
                        <div style="
                            font-size:9.8px;
                            margin-bottom:8px;">
                            ☎ ${escapeHTML(d.phone)}
                        </div>
                    `:''}

                    ${d.address?`
                        <div style="
                            font-size:9.8px;
                            margin-bottom:8px;
                            word-break:break-word;">
                            ⌂ ${escapeHTML(d.address)}
                        </div>
                    `:''}

                    ${d.birthdate?`
                        <div style="
                            font-size:9.8px;
                            margin-bottom:8px;">
                            ● ${escapeHTML(d.birthdate)}
                        </div>
                    `:''}

                    <div style="margin-top:22px;">

                        <h3 style="
                            font-size:10px;
                            text-transform:uppercase;
                            letter-spacing:1px;
                            border-bottom:1px solid rgba(255,255,255,.4);
                            padding:0 0 5px 0;
                            margin:0 0 10px 0;">
                            Compétences
                        </h3>

                        ${d.skillsList.length
                            ?d.skillsList.map(s=>`
                                <div style="
                                    font-size:9.8px;
                                    margin-bottom:6px;">
                                    • ${escapeHTML(s)}
                                </div>
                            `).join('')
                            :'<div style="font-size:9px;">Aucune</div>'
                        }

                    </div>

                    ${getValidLanguages().length?`
                        <div style="margin-top:22px;">

                            <h3 style="
                                font-size:10px;
                                text-transform:uppercase;
                                letter-spacing:1px;
                                border-bottom:1px solid rgba(255,255,255,.4);
                                padding:0 0 5px 0;
                                margin:0 0 10px 0;">
                                Langues
                            </h3>

                            ${getValidLanguages().map(l=>`
                                <div style="
                                    font-size:9.8px;
                                    margin-bottom:6px;">
                                    <strong>
                                        ${escapeHTML(l.language)}
                                    </strong>
                                    ${l.level
                                        ?` — ${escapeHTML(l.level)}`
                                        :''
                                    }
                                </div>
                            `).join('')}

                        </div>
                    `:''}

                </td>

                <td style="
                    width:145mm;
                    height:297mm;
                    vertical-align:top;
                    padding:30px;
                    background:white;
                    box-sizing:border-box;">

                    ${d.summary?`
                        <div style="
                            border-left:5px solid ${primary};
                            padding-left:12px;
                            margin-bottom:22px;">

                            <h2 style="
                                font-size:14px;
                                color:${dark};
                                text-transform:uppercase;
                                margin:0 0 8px 0;">
                                Profil
                            </h2>

                            <p style="
                                font-size:10.5px;
                                line-height:1.55;
                                margin:0;
                                color:#475569;">
                               ${escapeHTML(d.summary || '')
    .replace(/&amp;#39;/gi,"'")
    .replace(/&#39;/gi,"'")
    .replace(/&apos;/gi,"'")
    .replace(/&amp;apos;/gi,"'")
    .replace(/&lt;br\s*\/?&gt;/gi,"<br>")}
                            </p>

                        </div>
                    `:''}

                    <div style="
                        border-left:5px solid ${primary};
                        padding-left:12px;
                        margin-bottom:22px;">

                        ${buildExperiencesSection(dark)}

                    </div>

                    <div style="
                        border-left:5px solid ${primary};
                        padding-left:12px;">

                        ${buildFormationsSection(dark)}

                    </div>

                </td>

            </tr>

        </table>
    `;
}

/* =========================================================
   MODÈLE 9 — ÉLÉGANT ROUGE
   ========================================================= */

function buildWaveRedTemplate(d){
    const primary='#8A233A';
    const cream='#F7F5F0';

    return `
        <div style="
            width:210mm;
            min-height:297mm;
            background:${cream};
            box-sizing:border-box;
            font-family:Arial,Helvetica,sans-serif;
            position:relative;">

            <div style="
                height:95px;
                background:${primary};
                border-bottom-left-radius:90px;
                padding:28px 30px;
                box-sizing:border-box;
                color:white;">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;">

                    <div>

                        <h1 style="
                            font-size:23px;
                            text-transform:uppercase;
                            letter-spacing:1px;
                            margin:0;">
                            ${d.name}
                        </h1>

                        <div style="
                            font-size:10px;
                            margin-top:6px;
                            color:#F8E8EC;">

                            ${d.email?`✉ ${d.email}`:''}
                            ${d.phone?` &nbsp; • &nbsp; 📞 ${d.phone}`:''}

                        </div>

                    </div>

                    ${d.photoDataUrl?`
                        <img
                            src="${d.photoDataUrl}"
                            style="
                                width:88px;
                                height:88px;
                                object-fit:cover;
                                border-radius:50%;
                                border:5px solid ${cream};
                                position:relative;
                                top:20px;">
                    `:''}

                </div>

            </div>

            <div style="
                padding:45px 30px 30px;
                box-sizing:border-box;">

                <table style="
                    width:100%;
                    border-collapse:collapse;">

                    <tr>

                        <td style="
                            width:62mm;
                            vertical-align:top;
                            padding-right:20px;
                            border-right:1px solid #D9D1C9;">

                            <h3 style="
                                font-size:11px;
                                color:${primary};
                                text-transform:uppercase;
                                letter-spacing:1px;
                                border-bottom:2px solid ${primary};
                                padding-bottom:5px;
                                margin-bottom:10px;">
                                Contact
                            </h3>

                            ${d.email?`
                                <div style="
                                    font-size:10px;
                                    margin-bottom:7px;">
                                    ${d.email}
                                </div>
                            `:''}

                            ${d.phone?`
                                <div style="
                                    font-size:10px;
                                    margin-bottom:7px;">
                                    ${d.phone}
                                </div>
                            `:''}

                            ${d.address?`
                                <div style="
                                    font-size:10px;
                                    margin-bottom:7px;">
                                    ${d.address}
                                </div>
                            `:''}

                            ${d.birthdate?`
                                <div style="
                                    font-size:10px;
                                    margin-bottom:7px;">
                                    ${d.birthdate}
                                </div>
                            `:''}

                            ${d.skillsList.length?`
                                <div style="margin-top:22px;">

                                    <h3 style="
                                        font-size:11px;
                                        color:${primary};
                                        text-transform:uppercase;
                                        letter-spacing:1px;
                                        border-bottom:2px solid ${primary};
                                        padding-bottom:5px;
                                        margin-bottom:10px;">
                                        Compétences
                                    </h3>

                                    ${d.skillsList.map(s=>`
                                        <div style="
                                            font-size:10px;
                                            margin-bottom:6px;">
                                            • ${escapeHTML(s)}
                                        </div>
                                    `).join('')}

                                </div>
                            `:''}

                            ${getValidLanguages().length?`
                                <div style="margin-top:22px;">

                                    <h3 style="
                                        font-size:11px;
                                        color:${primary};
                                        text-transform:uppercase;
                                        letter-spacing:1px;
                                        border-bottom:2px solid ${primary};
                                        padding-bottom:5px;
                                        margin-bottom:10px;">
                                        Langues
                                    </h3>

                                    ${getValidLanguages().map(l=>`
                                        <div style="
                                            font-size:10px;
                                            margin-bottom:6px;">
                                            <strong>
                                                ${escapeHTML(l.language)}
                                            </strong>

                                            ${l.level
                                                ?`<br><span style="color:#64748b;">
                                                    ${escapeHTML(l.level)}
                                                </span>`
                                                :''
                                            }
                                        </div>
                                    `).join('')}

                                </div>
                            `:''}

                        </td>

                        <td style="
                            width:148mm;
                            vertical-align:top;
                            padding-left:25px;">

                            ${d.summary?`
                                <div style="margin-bottom:22px;">

                                    <h2 style="
                                        color:${primary};
                                        font-size:14px;
                                        text-transform:uppercase;
                                        letter-spacing:.7px;
                                        margin:0 0 8px;">
                                        Profil professionnel
                                    </h2>

                                    <p style="
                                        font-size:10.5px;
                                        line-height:1.55;
                                        color:#374151;
                                        margin:0;
                                        text-align:justify;">
                                        ${d.summary}
                                    </p>

                                </div>
                            `:''}

                            ${buildExperiencesSection(primary)}
                            ${buildFormationsSection(primary)}

                        </td>

                    </tr>

                </table>

            </div>

        </div>
    `;
}

/* =========================================================
   FONCTIONS PDF / IMPRESSION
   ========================================================= */

function waitForImages(element){
    if(!element)return Promise.resolve();

    const images=Array.from(element.querySelectorAll('img'));

    if(!images.length){
        return Promise.resolve();
    }

    return Promise.all(
        images.map(img=>{
            if(img.complete){
                return Promise.resolve();
            }

            return new Promise(resolve=>{
                img.onload=resolve;
                img.onerror=resolve;
            });
        })
    );
}

function setPDFButtonsLoading(loading){
    const buttons=[
        document.getElementById('downloadPdfBtn'),
        document.getElementById('modalDownloadPdfBtn')
    ].filter(Boolean);

    buttons.forEach(button=>{
        if(loading){

            if(!button.dataset.originalHtml){
                button.dataset.originalHtml=button.innerHTML;
            }

            button.innerHTML='⏳ Génération en cours...';
            button.disabled=true;

            button.classList.add(
                'opacity-70',
                'cursor-not-allowed'
            );

        }else{

            if(button.dataset.originalHtml){
                button.innerHTML=button.dataset.originalHtml;
            }

            button.disabled=false;

            button.classList.remove(
                'opacity-70',
                'cursor-not-allowed'
            );
        }
    });
}

let pendingDownloadType='cv';

function openMvolaModal(type='cv'){
    const modal=document.getElementById('mvolaModal');

    if(!modal)return;

    pendingDownloadType=type;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}


function closeMvolaModal(){
    const modal=document.getElementById('mvolaModal');

    if(!modal)return;

    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

async function downloadPDF(){

    closeMvolaModal();

    if(pendingDownloadType==='letter'){
        printMotivationLetter();
        return;
    }

    const cv=document.getElementById('cvPreview');

    if(!cv){
        alert('Impossible de trouver le CV à imprimer.');
        return;
    }

    const name=getInputValue('inputName');

    let safeName=name
        .replace(/[\\/:*?"<>|]+/g,'')
        .replace(/\s+/g,'_')
        .trim();

    if(!safeName){
        safeName='Mon_CV';
    }

    const originalTitle=document.title;

    document.title=`CV_${safeName}`;

    setPDFButtonsLoading(true);

    try{

        await waitForImages(cv);

        setTimeout(()=>{

            window.print();

            setTimeout(()=>{

                document.title=originalTitle;
                setPDFButtonsLoading(false);

            },1000);

        },300);

    }catch(error){

        console.error('Erreur impression PDF:',error);

        document.title=originalTitle;
        setPDFButtonsLoading(false);

        alert(
            'Impossible de préparer le CV pour l’impression.'
        );
    }
}

/* =========================================================
   COMPATIBILITÉ AVEC D'ANCIEN CODE
   ========================================================= */

function updateCVPreview(){
    renderCV();
}

function collectCandidateDataFromForm(){
    return collectCandidateData();
}
function formatCVText(text){
    if(!text)return '';

    return String(text)
        .replace(/&#039;/gi,"'")
        .replace(/&#39;/gi,"'")
        .replace(/&apos;/gi,"'")
        .replace(/&quot;/gi,'"')
        .replace(/&amp;/gi,'&')
        .replace(/&lt;br\s*\/?&gt;/gi,'<br>')
        .replace(/\r?\n/g,'<br>');
}
/* =========================================================
   ONGLET LETTRE DE MOTIVATION
   ========================================================= */

function switchMainTab(tab){

    const cvTab=document.getElementById('cvTabContent');
    const letterTab=document.getElementById('letterTabContent');

    const cvBtn=document.getElementById('tabCvBtn');
    const letterBtn=document.getElementById('tabLetterBtn');

    if(!cvTab||!letterTab)return;

    if(tab==='letter'){

        cvTab.classList.add('hidden');
        letterTab.classList.remove('hidden');

        if(cvBtn){
            cvBtn.className=
                'px-5 py-2.5 rounded-xl bg-white text-slate-600 border border-slate-200 font-bold text-sm hover:border-indigo-400 transition-all';
        }

        if(letterBtn){
            letterBtn.className=
                'px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md transition-all';
        }

        updateMotivationLetterPreview();

    }else{

        letterTab.classList.add('hidden');
        cvTab.classList.remove('hidden');

        if(cvBtn){
            cvBtn.className=
                'px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md transition-all';
        }

        if(letterBtn){
            letterBtn.className=
                'px-5 py-2.5 rounded-xl bg-white text-slate-600 border border-slate-200 font-bold text-sm hover:border-indigo-400 transition-all';
        }

        renderCV();
    }
}


/* =========================================================
   DONNÉES DU CV POUR LA LETTRE
   ========================================================= */

function getMotivationCandidateData(){

    const rawName=getInputValue('inputName');

    const email=getInputValue('inputEmail');
    const phone=getInputValue('inputPhone');
    const address=getInputValue('inputAddress');
    const summary=getInputValue('inputSummary');
    const skills=getInputValue('inputSkills');

    const validExperiences=getValidExperiences();
    const validFormations=getValidFormations();

    return{
        name:rawName,
        email:email,
        phone:phone,
        address:address,
        summary:summary,
        skills:skills,
        experiences:validExperiences,
        formations:validFormations
    };
}


/* =========================================================
   APERÇU DE LA LETTRE
   ========================================================= */

function updateMotivationLetterPreview(){

    const d=getMotivationCandidateData();

    const nameElement=document.getElementById(
        'letterPreviewName'
    );

    const contactElement=document.getElementById(
        'letterPreviewContact'
    );

    const signatureElement=document.getElementById(
        'letterPreviewSignature'
    );

    const recipientElement=document.getElementById(
        'letterPreviewRecipient'
    );

    const companyElement=document.getElementById(
        'letterPreviewCompany'
    );

    const cityDateElement=document.getElementById(
        'letterPreviewCityDate'
    );

    const city=getInputValue('letterCity');
    const recipient=getInputValue('letterRecipient');
    const company=getInputValue('letterCompany');

    if(nameElement){
        nameElement.textContent=d.name||'Votre Nom';
    }

    if(signatureElement){
        signatureElement.textContent=d.name||'Votre Nom';
    }

    if(contactElement){

        const contactParts=[];

        if(d.email)contactParts.push(d.email);
        if(d.phone)contactParts.push(d.phone);
        if(d.address)contactParts.push(d.address);

        contactElement.textContent=
            contactParts.join(' • ')||
            'Email • Téléphone';
    }

    if(recipientElement){

        recipientElement.textContent=
            recipient||
            'À l’attention du responsable du recrutement';
    }

    if(companyElement){

        companyElement.textContent=
            company||'';
    }

    if(cityDateElement){

        const date=new Date();

        const dateText=date.toLocaleDateString(
            'fr-FR',
            {
                day:'numeric',
                month:'long',
                year:'numeric'
            }
        );

        cityDateElement.textContent=
            city
            ?`${city}, le ${dateText}`
            :dateText;
    }
}


/* =========================================================
   GÉNÉRATION DE LA LETTRE
   ========================================================= */

function createMotivationLetter(){

    const d=getMotivationCandidateData();

    const job=getInputValue('letterJob');
    const company=getInputValue('letterCompany');
    const recipient=getInputValue('letterRecipient');
    const tone=getInputValue('letterTone');

    if(!d.name){

        alert(
            'Veuillez d’abord renseigner votre nom dans la section CV.'
        );

        switchMainTab('cv');

        return;
    }

    if(!job){

        alert(
            'Veuillez renseigner le poste recherché.'
        );

        const field=document.getElementById('letterJob');

        if(field)field.focus();

        return;
    }

    const letterHTML=
        buildMotivationLetterHTML(
            d,
            job,
            company,
            recipient,
            tone
        );

    const editor=document.getElementById(
        'motivationLetterEditable'
    );

    if(editor){

        editor.innerHTML=letterHTML;
    }

    updateMotivationLetterPreview();
}


/* =========================================================
   CONSTRUCTION DE LA LETTRE
   ========================================================= */

function buildMotivationLetterHTML(
    d,
    job,
    company,
    recipient,
    tone
){

    const safeJob=escapeLetterText(job);
    const safeCompany=escapeLetterText(company);

    let experienceText='';

    if(d.experiences.length){

        const bestExperience=d.experiences[0];

        const jobTitle=
            escapeLetterText(bestExperience.job||'');

        const companyName=
            escapeLetterText(bestExperience.company||'');

        if(jobTitle&&companyName){

            experienceText=
                `Mon parcours professionnel m’a permis de développer une expérience concrète en tant que ${jobTitle} au sein de ${companyName}.`;

        }else if(jobTitle){

            experienceText=
                `Mon parcours professionnel m’a permis de développer une expérience concrète en tant que ${jobTitle}.`;

        }else{

            experienceText=
                `Mon parcours professionnel m’a permis de développer des compétences directement mobilisables pour ce poste.`;
        }

    }else{

        experienceText=
            `Mon parcours m’a permis de développer des compétences et une capacité d’adaptation que je souhaite aujourd’hui mettre au service de votre organisation.`;
    }


    let formationText='';

    if(d.formations.length){

        const formation=d.formations[0];

        const title=
            escapeLetterText(formation.title||'');

        const school=
            escapeLetterText(formation.school||'');

        if(title&&school){

            formationText=
                `Ma formation en ${title} à ${school} m’a également permis d’acquérir des connaissances solides et une bonne capacité d’adaptation.`;

        }else if(title){

            formationText=
                `Ma formation en ${title} m’a permis d’acquérir des connaissances solides et une bonne capacité d’adaptation.`;

        }
    }


    let skillsText='';

    if(d.skills){

        const skills=d.skills
            .split(',')
            .map(s=>s.trim())
            .filter(Boolean)
            .slice(0,6);

        if(skills.length){

            skillsText=
                `Je peux notamment m’appuyer sur mes compétences en ${escapeLetterText(skills.join(', '))}.`;
        }
    }


    const summaryText=
        d.summary
        ?escapeLetterText(
            d.summary
        )
        :'';


    let opening='';

    if(company){

        opening=
            `Je souhaite vous soumettre ma candidature au poste de <strong>${safeJob}</strong> au sein de <strong>${safeCompany}</strong>.`;

    }else{

        opening=
            `Je souhaite vous soumettre ma candidature au poste de <strong>${safeJob}</strong>.`;
    }


    let motivation='';

    if(tone==='dynamique'){

        motivation=
            `Dynamique, motivé(e) et pleinement engagé(e) dans mon évolution professionnelle, je suis particulièrement intéressé(e) par cette opportunité. Je souhaite mettre mon expérience, mes compétences et ma capacité d’adaptation au service de vos objectifs.`;

    }else if(tone==='classique'){

        motivation=
            `Intéressé(e) par cette opportunité, je souhaite mettre à profit mon parcours, mes compétences et ma motivation afin de contribuer efficacement aux activités de votre organisation.`;

    }else if(tone==='sobre'){

        motivation=
            `Je souhaite aujourd’hui mettre mon expérience et mes compétences au service de votre organisation et contribuer de manière concrète à la réussite des missions qui me seront confiées.`;

    }else{

        motivation=
            `Votre offre représente pour moi une opportunité de mettre à profit mon parcours et mes compétences dans un environnement professionnel stimulant. Sérieux(se), motivé(e) et capable de m’adapter rapidement, je suis prêt(e) à m’investir pleinement dans les missions qui me seront confiées.`;
    }


    let html='';

    html+=`<p>${opening}</p>`;

    if(summaryText){

        html+=`
            <p>
                ${summaryText}
            </p>
        `;
    }

    html+=`
        <p>
            ${experienceText}
            ${formationText?' '+formationText:''}
        </p>
    `;

    if(skillsText){

        html+=`
            <p>
                ${skillsText}
            </p>
        `;
    }

    html+=`
        <p>
            ${motivation}
        </p>
    `;

    html+=`
        <p>
            Je serais heureux(se) de pouvoir échanger avec vous
            afin de vous présenter plus en détail ma motivation et
            la manière dont je pourrais contribuer à votre équipe.
        </p>
    `;

    html+=`
        <p>
            Je vous remercie par avance de l’attention portée à ma
            candidature et vous prie d’agréer, ${recipient
                ?escapeLetterText(recipient)+', '
                :'Madame, Monsieur, '
            }l’expression de mes salutations distinguées.
        </p>
    `;

    return html;
}


/* =========================================================
   SÉCURISATION DU TEXTE LETTRE
   ========================================================= */

function escapeLetterText(value){

    if(value===null||value===undefined)return '';

    return String(value)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,"&#39;");
}


/* =========================================================
   RÉINITIALISATION
   ========================================================= */

function resetMotivationLetter(){

    const fields=[
        'letterJob',
        'letterCompany',
        'letterRecipient',
        'letterCity'
    ];

    fields.forEach(id=>{

        const element=document.getElementById(id);

        if(element){
            element.value='';
        }
    });

    const editor=document.getElementById(
        'motivationLetterEditable'
    );

    if(editor){

        editor.innerHTML=`
            <p>
                Votre lettre de motivation apparaîtra ici.
            </p>
        `;
    }

    updateMotivationLetterPreview();
}


/* =========================================================
   IMPRESSION / PDF
   ========================================================= */

function printMotivationLetter(){

    const name=getInputValue('inputName');

    let safeName=name
        .replace(/[\\/:*?"<>|]+/g,'')
        .replace(/\s+/g,'_')
        .trim();

    if(!safeName){
        safeName='Mon_Nom';
    }

    const originalTitle=document.title;

    document.title=
        `Lettre_Motivation_${safeName}`;

    setTimeout(()=>{

        window.print();

        setTimeout(()=>{

            document.title=originalTitle;

        },1000);

    },300);
}

/* =========================================================
   MISE À JOUR AUTOMATIQUE
   ========================================================= */

document.addEventListener(
    'DOMContentLoaded',
    ()=>{

        [
            'letterJob',
            'letterCompany',
            'letterRecipient',
            'letterCity',
            'letterTone'
        ].forEach(id=>{

            const element=document.getElementById(id);

            if(element){

                element.addEventListener(
                    'input',
                    updateMotivationLetterPreview
                );

                element.addEventListener(
                    'change',
                    updateMotivationLetterPreview
                );
            }
        });

        updateMotivationLetterPreview();
    }
);