// --- VARIABLES GLOBALES DE DONNÉES ET DE CONFIGURATION ---
let photoBase64 = '';
let currentTemplate = 'modern'; // 'modern' | 'banner' | 'minimalist'

let formations = [
    { title: "DUESII", school: "Polytechnique Vontovorona", year: "de 1988 à 1988" },
    { title: "Baccalauréat technique hydraulique", school: "Lycée Technique du Génie Civil – Ampefiloha", year: "de 1985 à 1985" }
];

let experiences = [
    { 
        job: "Superviseur en saisie de données / Instructeur / Contrôleur de qualité", 
        company: "Groupe OUTSOURCIA", 
        year: "de 2006 à ce jour", 
        tasks: [
            "Formation sur les procédures de saisie de données.",
            "Supervision des sessions de saisie.",
            "Identification et résolution des problèmes liés à la saisie de données.",
            "Assurer la qualité et l'exactitude des données saisies par chaque collaborateur."
        ] 
    }
];

let languages = [
    { language: "Anglais", level: "Moyenne" },
    { language: "Français", level: "Moyenne" }
];

// --- INITIALISATION DES ÉCOUTEURS D'ÉVÉNEMENTS ---
document.addEventListener('DOMContentLoaded', () => {
    const inputPhotoFile = document.getElementById('inputPhotoFile');
    
    if (inputPhotoFile) {
        inputPhotoFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    photoBase64 = event.target.result;
                    renderCV();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const inputs = ['inputName', 'inputEmail', 'inputPhone', 'inputAddress', 'inputBirthdate', 'inputSummary', 'inputSkills'];
    inputs.forEach(id => {
        const elem = document.getElementById(id);
        if (elem) {
            elem.addEventListener('input', renderCV);
        }
    });

    renderFormationsInputs();
    renderExperiencesInputs();
    renderLanguagesInputs();
    renderCV();
});

// --- CHOIX ET SÉLECTION DU MODÈLE ---
function selectTemplate(templateId) {
    currentTemplate = templateId;
    
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('ring-4', 'ring-indigo-600', 'border-indigo-600', 'shadow-lg');
        card.classList.add('border-gray-200');
    });
    
    const activeCard = document.getElementById(`btn-tpl-${templateId}`);
    if (activeCard) {
        activeCard.classList.remove('border-gray-200');
        activeCard.classList.add('ring-4', 'ring-indigo-600', 'border-indigo-600', 'shadow-lg');
    }

    renderCV();
}

// --- GESTION DES FORMATIONS ---
function renderFormationsInputs() {
    const container = document.getElementById('formationsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    formations.forEach((form, index) => {
        container.innerHTML += `
            <div class="p-2 border rounded bg-gray-50 space-y-1 relative text-xs">
                <button type="button" onclick="removeFormation(${index})" class="absolute top-1 right-1 text-red-500 font-bold text-xs hover:text-red-700 cursor-pointer" title="Supprimer">✕</button>
                <input type="text" placeholder="Diplôme" value="${form.title}" oninput="updateFormation(${index}, 'title', this.value)" class="w-full border rounded p-1">
                <input type="text" placeholder="École" value="${form.school}" oninput="updateFormation(${index}, 'school', this.value)" class="w-full border rounded p-1">
                <input type="text" placeholder="Période (ex: de 1988 à 1988)" value="${form.year}" oninput="updateFormation(${index}, 'year', this.value)" class="w-full border rounded p-1">
            </div>
        `;
    });
}

function addFormationField() {
    formations.push({ title: "", school: "", year: "" });
    renderFormationsInputs();
    renderCV();
}

function updateFormation(index, field, value) {
    formations[index][field] = value;
    renderCV();
}

function removeFormation(index) {
    formations.splice(index, 1);
    renderFormationsInputs();
    renderCV();
}

// --- GESTION DES EXPÉRIENCES ---
function renderExperiencesInputs() {
    const container = document.getElementById('experiencesContainer');
    if (!container) return;

    container.innerHTML = '';
    experiences.forEach((exp, index) => {
        let tasksHTML = '';
        exp.tasks.forEach((task, taskIndex) => {
            tasksHTML += `
                <div class="flex gap-1 mb-1">
                    <textarea placeholder="Description de la tâche..." oninput="updateTask(${index}, ${taskIndex}, this.value)" class="w-full border rounded p-1 text-xs" rows="1">${task}</textarea>
                    <button type="button" onclick="removeTask(${index}, ${taskIndex})" class="bg-red-100 text-red-600 px-2 rounded text-xs hover:bg-red-200 cursor-pointer" title="Supprimer">✕</button>
                </div>
            `;
        });

        container.innerHTML += `
            <div class="p-2 border rounded bg-gray-50 space-y-2 relative text-xs">
                <button type="button" onclick="removeExperience(${index})" class="absolute top-1 right-1 text-red-500 font-bold text-xs hover:text-red-700 cursor-pointer" title="Supprimer l'expérience">✕</button>
                
                <div class="pr-6 space-y-1">
                    <input type="text" placeholder="Poste" value="${exp.job}" oninput="updateExperience(${index}, 'job', this.value)" class="w-full border rounded p-1">
                    <input type="text" placeholder="Entreprise" value="${exp.company}" oninput="updateExperience(${index}, 'company', this.value)" class="w-full border rounded p-1">
                    <input type="text" placeholder="Période (ex: de 2006 à ce jour)" value="${exp.year}" oninput="updateExperience(${index}, 'year', this.value)" class="w-full border rounded p-1">
                </div>
                
                <div class="mt-2 pt-2 border-t border-gray-200">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-[11px] font-semibold text-gray-600">Détails du poste :</span>
                        <button type="button" onclick="addTask(${index})" class="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded hover:bg-indigo-200 font-medium cursor-pointer">+ Ligne</button>
                    </div>
                    <div class="space-y-1">
                        ${tasksHTML}
                    </div>
                </div>
            </div>
        `;
    });
}

function addExperienceField() {
    experiences.push({ job: "", company: "", year: "", tasks: [""] });
    renderExperiencesInputs();
    renderCV();
}

function updateExperience(index, field, value) {
    experiences[index][field] = value;
    renderCV();
}

function removeExperience(index) {
    experiences.splice(index, 1);
    renderExperiencesInputs();
    renderCV();
}

function addTask(expIndex) {
    experiences[expIndex].tasks.push("");
    renderExperiencesInputs();
    renderCV();
}

function updateTask(expIndex, taskIndex, value) {
    experiences[expIndex].tasks[taskIndex] = value;
    renderCV();
}

function removeTask(expIndex, taskIndex) {
    experiences[expIndex].tasks.splice(taskIndex, 1);
    renderExperiencesInputs();
    renderCV();
}

// --- GESTION DES LANGUES ---
function renderLanguagesInputs() {
    const container = document.getElementById('languagesContainer');
    if (!container) return;
    
    container.innerHTML = '';
    languages.forEach((lang, index) => {
        container.innerHTML += `
            <div class="p-2 border rounded bg-gray-50 space-y-1 relative text-xs flex gap-1 items-center">
                <input type="text" placeholder="Langue (ex: Anglais)" value="${lang.language}" oninput="updateLanguage(${index}, 'language', this.value)" class="w-1/2 border rounded p-1">
                <input type="text" placeholder="Niveau (ex: Moyenne)" value="${lang.level}" oninput="updateLanguage(${index}, 'level', this.value)" class="w-1/2 border rounded p-1">
                <button type="button" onclick="removeLanguage(${index})" class="text-red-500 font-bold text-xs hover:text-red-700 px-1 cursor-pointer" title="Supprimer">✕</button>
            </div>
        `;
    });
}

function addLanguageField() {
    languages.push({ language: "", level: "" });
    renderLanguagesInputs();
    renderCV();
}

function updateLanguage(index, field, value) {
    languages[index][field] = value;
    renderCV();
}

function removeLanguage(index) {
    languages.splice(index, 1);
    renderLanguagesInputs();
    renderCV();
}

// --- FONCTION PRINCIPALE DE RENDU DU CV ---
function renderCV() {
    const cvPreview = document.getElementById('cvPreview');
    if (!cvPreview) return;

    const name = document.getElementById('inputName')?.value || '';
    const email = document.getElementById('inputEmail')?.value || '';
    const phone = document.getElementById('inputPhone')?.value || '';
    const address = (document.getElementById('inputAddress')?.value || '').replace(/\n/g, '<br>');
    const birthdate = document.getElementById('inputBirthdate')?.value || '';
    const summary = document.getElementById('inputSummary')?.value || '';
    const skillsRaw = document.getElementById('inputSkills')?.value || '';

    const data = { name, email, phone, address, birthdate, summary, skillsRaw };

    if (currentTemplate === 'banner') {
        cvPreview.innerHTML = buildBannerTemplate(data);
    } else if (currentTemplate === 'minimalist') {
        cvPreview.innerHTML = buildMinimalistTemplate(data);
    } else {
        cvPreview.innerHTML = buildModernTemplate(data);
    }
}

// --- GÉNÉRATEURS DE STRUCTURES DES MODÈLES ---
function buildModernTemplate(d) {
    const iconStyle = 'width: 14px; height: 14px; color: #3A5A78; margin-top: 2px; flex-shrink: 0;';
    const icons = getIcons(iconStyle);
    
    const photoHTML = photoBase64 
        ? `<img src="${photoBase64}" style="width: 110px; height: 110px; object-fit: cover; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">`
        : `<div style="width: 110px; height: 110px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; color: #a0aec0; font-size: 28px; border: 4px solid white;">📷</div>`;

    return `
        <table style="width: 210mm !important; min-width: 210mm !important; max-width: 210mm !important; border-collapse: collapse; table-layout: fixed; margin: 0; padding: 0; background: white;">
            <tr>
                <td style="width: 75mm !important; min-width: 75mm !important; max-width: 75mm !important; background-color: #f3f4f6; vertical-align: top; padding: 0;">
                    <div style="background-color: #3b5998; color: white; padding: 25px 15px 35px 15px; text-align: center; border-bottom-left-radius: 50% 20px; border-bottom-right-radius: 50% 20px;">
                        <h2 style="font-size: 15px; font-weight: bold; line-height: 1.3; margin: 0; color: white;">${formatHeaderName(d.name)}</h2>
                    </div>
                    <div style="display: flex; justify-content: center; margin-top: -45px; margin-bottom: 20px;">${photoHTML}</div>
                    <div style="padding: 0 20px 20px 20px;">
                        <h3 style="font-size: 12px; color: #3b5998; text-transform: uppercase; border-bottom: 1px solid #d1d5db; padding-bottom: 4px; margin-bottom: 12px; font-weight: bold;">Informations</h3>
                        <div style="font-size: 11px; color: #333;">
                            ${d.name ? `<div style="display: flex; gap: 8px; margin-bottom: 8px;">${icons.user}<span>${d.name}</span></div>` : ''}
                            ${d.email ? `<div style="display: flex; gap: 8px; margin-bottom: 8px;">${icons.email}<span style="word-break: break-all;">${d.email}</span></div>` : ''}
                            ${d.phone ? `<div style="display: flex; gap: 8px; margin-bottom: 8px;">${icons.phone}<span>${d.phone}</span></div>` : ''}
                            ${d.address ? `<div style="display: flex; gap: 8px; margin-bottom: 8px;">${icons.home}<span>${d.address}</span></div>` : ''}
                            ${d.birthdate ? `<div style="display: flex; gap: 8px; margin-bottom: 8px;">${icons.date}<span>${d.birthdate}</span></div>` : ''}
                        </div>
                        ${buildSkillsSection(d.skillsRaw, '#3b5998')}
                        ${buildLanguagesSection('#3b5998')}
                    </div>
                </td>
                <td style="width: 135mm !important; min-width: 135mm !important; max-width: 135mm !important; vertical-align: top; padding: 35px 30px; background-color: white;">
                    ${buildProfileSection(d.summary, '#3b5998')}
                    ${buildFormationsSection('#3b5998')}
                    ${buildExperiencesSection('#3b5998')}
                </td>
            </tr>
        </table>
    `;
}

function buildBannerTemplate(d) {
    const photoHTML = photoBase64 
        ? `<img src="${photoBase64}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; border: 3px solid white;">`
        : `<div style="width: 100px; height: 100px; border-radius: 8px; background: #e2e8f0; display: flex; align-items: center; justify-content: center; color: #a0aec0; font-size: 24px; border: 3px solid white;">📷</div>`;

    return `
        <div style="width: 210mm !important; background: white;">
            <div style="background-color: #2b5b6c; color: white; padding: 25px 30px; display: flex; align-items: center; gap: 20px;">
                <div>${photoHTML}</div>
                <div style="flex-grow: 1;">
                    <h1 style="font-size: 22px; font-weight: bold; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 1px; color: white;">${d.name}</h1>
                    <div style="font-size: 11px; color: #e2e8f0; display: flex; flex-wrap: wrap; gap: 15px;">
                        ${d.email ? `<span>✉ ${d.email}</span>` : ''}
                        ${d.phone ? `<span>📞 ${d.phone}</span>` : ''}
                        ${d.birthdate ? `<span>📅 ${d.birthdate}</span>` : ''}
                        ${d.address ? `<span>📍 ${d.address.replace(/<br>/g, ', ')}</span>` : ''}
                    </div>
                </div>
            </div>
            <table style="width: 210mm !important; border-collapse: collapse; table-layout: fixed;">
                <tr>
                    <td style="width: 70mm !important; vertical-align: top; padding: 25px 20px; background-color: #f8fafc; border-right: 1px solid #e2e8f0;">
                        ${buildSkillsSection(d.skillsRaw, '#2b5b6c')}
                        ${buildLanguagesSection('#2b5b6c')}
                    </td>
                    <td style="width: 140mm !important; vertical-align: top; padding: 25px 25px;">
                        ${buildProfileSection(d.summary, '#2b5b6c')}
                        ${buildFormationsSection('#2b5b6c')}
                        ${buildExperiencesSection('#2b5b6c')}
                    </td>
                </tr>
            </table>
        </div>
    `;
}

function buildMinimalistTemplate(d) {
    const primaryColor = '#856404';
    const photoHTML = photoBase64 
        ? `<img src="${photoBase64}" style="width: 90px; height: 90px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd;">`
        : '';

    return `
        <div style="width: 210mm !important; max-width: 100%; padding: 25px 30px; background: white; box-sizing: border-box; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid ${primaryColor}; padding-bottom: 15px; margin-bottom: 20px;">
                <div>
                    <h1 style="font-size: 24px; font-weight: bold; color: #222; margin: 0 0 5px 0; text-transform: uppercase;">${d.name}</h1>
                    <div style="font-size: 11px; color: #555; display: flex; flex-wrap: wrap; gap: 12px;">
                        ${d.email ? `<span>${d.email}</span>` : ''}
                        ${d.phone ? `<span>| ${d.phone}</span>` : ''}
                        ${d.birthdate ? `<span>| ${d.birthdate}</span>` : ''}
                        ${d.address ? `<span>| ${d.address.replace(/<br>/g, ', ')}</span>` : ''}
                    </div>
                </div>
                ${photoHTML ? `<div>${photoHTML}</div>` : ''}
            </div>
            ${buildProfileSection(d.summary, primaryColor)}
            <table style="width: 100%; border-collapse: collapse; table-layout: fixed; margin-top: 15px;">
                <tr>
                    <td style="width: 122mm; vertical-align: top; padding-right: 15px;">
                        ${buildExperiencesSection(primaryColor)}
                    </td>
                    <td style="width: 68mm; vertical-align: top; border-left: 1px solid #eee; padding-left: 15px;">
                        ${buildFormationsSection(primaryColor)}
                        ${buildSkillsSection(d.skillsRaw, primaryColor)}
                        ${buildLanguagesSection(primaryColor)}
                    </td>
                </tr>
            </table>
        </div>
    `;
}

// --- SOUS-COMPOSANTS ---
function buildProfileSection(summary, color) {
    if (!summary) return '';
    return `
        <div style="margin-bottom: 20px;">
            <h3 style="font-size: 13px; color: ${color}; text-transform: uppercase; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px; margin-bottom: 8px; font-weight: bold;">Profil</h3>
            <p style="font-size: 11px; color: #333; line-height: 1.5; margin: 0; text-align: justify;">${summary}</p>
        </div>
    `;
}

function buildFormationsSection(color) {
    if (formations.length === 0) return '';
    let html = `<div style="margin-bottom: 20px;"><h3 style="font-size: 13px; color: ${color}; text-transform: uppercase; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px; margin-bottom: 10px; font-weight: bold;">Formation</h3>`;
    formations.forEach(f => {
        html += `
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 11px;">
                <tr>
                    <td style="font-weight: bold; color: #333; width: 65%;">${f.title}</td>
                    <td style="text-align: right; font-weight: bold; color: #555; width: 35%;">${f.year}</td>
                </tr>
                <tr><td colspan="2" style="color: ${color}; font-size: 10.5px;">${f.school}</td></tr>
            </table>
        `;
    });
    html += `</div>`;
    return html;
}

function buildExperiencesSection(color) {
    if (experiences.length === 0) return '';
    let html = `<div style="margin-bottom: 20px;"><h3 style="font-size: 13px; color: ${color}; text-transform: uppercase; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px; margin-bottom: 10px; font-weight: bold;">Expérience professionnelle</h3>`;
    experiences.forEach(e => {
        let tasksListHTML = '<ul style="margin: 4px 0 0 0; padding-left: 16px; list-style-type: disc;">';
        e.tasks.forEach(t => {
            if(t.trim() !== '') tasksListHTML += `<li style="font-size: 11px; color: #333; margin-bottom: 2px; line-height: 1.4;">${t}</li>`;
        });
        tasksListHTML += '</ul>';

        html += `
            <div style="margin-bottom: 14px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                    <tr>
                        <td style="font-weight: bold; color: #333;">${e.job}</td>
                        <td style="text-align: right; font-weight: bold; color: #555; white-space: nowrap; vertical-align: top;">${e.year}</td>
                    </tr>
                    <tr><td colspan="2" style="color: ${color}; font-weight: 500;">${e.company}</td></tr>
                </table>
                ${tasksListHTML}
            </div>
        `;
    });
    html += `</div>`;
    return html;
}

function buildSkillsSection(skillsRaw, color) {
    const skillsArray = skillsRaw.split(',').map(s => s.trim()).filter(s => s);
    if (skillsArray.length === 0) return '';
    let html = `<div style="margin-bottom: 20px;"><h3 style="font-size: 12px; color: ${color}; text-transform: uppercase; border-bottom: 1px solid #d1d5db; padding-bottom: 3px; margin-bottom: 8px; font-weight: bold;">Compétences</h3>`;
    skillsArray.forEach(skill => {
        html += `<p style="margin: 3px 0; font-size: 11px; color: #333;">• ${skill}</p>`;
    });
    html += `</div>`;
    return html;
}

function buildLanguagesSection(color) {
    if (languages.length === 0) return '';
    let html = `<div style="margin-bottom: 20px;"><h3 style="font-size: 12px; color: ${color}; text-transform: uppercase; border-bottom: 1px solid #d1d5db; padding-bottom: 3px; margin-bottom: 8px; font-weight: bold;">Langues</h3>`;
    languages.forEach(l => {
        if(l.language.trim() !== '') {
            html += `<div style="font-size: 11px; margin-bottom: 4px; color: #333;">• <strong>${l.language}</strong> : ${l.level}</div>`;
        }
    });
    html += `</div>`;
    return html;
}

// --- UTILITAIRES ---
function formatHeaderName(name) {
    if (!name) return '';
    const nameParts = name.split(' ');
    let firstNames = [], lastNames = [];
    nameParts.forEach(part => {
        if (part && part === part.toUpperCase() && part.length > 1) {
            lastNames.push(part);
        } else {
            firstNames.push(part);
        }
    });
    return firstNames.length > 0 && lastNames.length > 0
        ? `${firstNames.join(' ')}<br><span style="text-transform: uppercase;">${lastNames.join(' ')}</span>`
        : name;
}

function getIcons(iconStyle) {
    return {
        user: `<svg viewBox="0 0 24 24" fill="currentColor" style="${iconStyle}"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`,
        email: `<svg viewBox="0 0 24 24" fill="currentColor" style="${iconStyle}"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
        phone: `<svg viewBox="0 0 24 24" fill="currentColor" style="${iconStyle}"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`,
        home: `<svg viewBox="0 0 24 24" fill="currentColor" style="${iconStyle}"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`,
        date: `<svg viewBox="0 0 24 24" fill="currentColor" style="${iconStyle}"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg>`
    };
}

// --- INTÉGRATION GOOGLE APPS SCRIPT ET ENVOI PAR E-MAIL SANS TÉLÉCHARGEMENT ---
function downloadPDF() {
    processAndSendPDF('PDF');
}

function downloadWord() {
    processAndSendPDF('Word (.doc)');
}

function processAndSendPDF(formatType) {
    const userEmailInput = document.getElementById('inputEmail');
    const userEmail = userEmailInput ? userEmailInput.value.trim() : '';

    if (!userEmail) {
        alert("Veuillez renseigner votre adresse e-mail dans le formulaire avant d'exporter.");
        if (userEmailInput) userEmailInput.focus();
        return;
    }

    const name = document.getElementById('inputName')?.value || 'Candidat';
    const phone = document.getElementById('inputPhone')?.value || 'Non renseigné';
    const element = document.getElementById('cvPreview');

    if (!element) {
        console.error("Élément cvPreview introuvable !");
        return;
    }

    if (typeof html2pdf === 'undefined') {
        alert("La bibliothèque html2pdf n'est pas chargée dans la page HTML. Veuillez inclure le script CDN.");
        console.error("html2pdf is not defined");
        return;
    }

    const opt = {
        margin:      0,
        filename:    `CV_${name.replace(/\s+/g, '_')}.pdf`,
        image:       { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    console.log("Génération et envoi du PDF vers votre boîte e-mail...");

    // Génération du PDF sous forme de chaîne DataURL (sans déclencher .save())
    html2pdf().from(element).set(opt).outputPdf('datauristring').then(function(pdfBase64) {
        const scriptURL = "https://script.google.com/macros/s/AKfycbwSVrWGRzoXjU5OmAS1iHpE2L_d9moFI9WMKRtUGtYhkXnJOjlkfhdUefXaa2Meym31/exec";

        const payload = {
            user_name: name,
            user_email: userEmail,
            user_phone: phone,
            cv_format: formatType,
            pdf_base64: pdfBase64
        };

        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(payload)
        })
        .then(() => {
            console.log("PDF envoyé avec succès vers Google Apps Script !");
        })
        .catch(error => {
            console.error("Erreur réseau/envoi vers Google Apps Script :", error);
        });

        // Affichage de la modale de confirmation / MVola
        openMvolaModal();
    });
}

// --- GESTION DES MODALES ---
function openMvolaModal() {
    const modal = document.getElementById('mvolaModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        modal.style.display = 'flex';
    }
}

function closeMvolaModal() {
    const modal = document.getElementById('mvolaModal');
    if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
}