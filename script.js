window.onload = function() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    document.getElementById('inputDate').value = `${yyyy}-${mm}-${dd}`;
    
    renderHistoryDropdown();
    updateLabel();
};

function updateLabel() {
    // Update Title
    const title = document.getElementById('inputTitle').value;
    document.getElementById('lblTitle').innerText = title ? title : " ";

    // Update Origin & Altitude
    const origin = document.getElementById('inputOrigin').value;
    const altitude = document.getElementById('inputAltitude').value;
    const originEl = document.getElementById('lblOrigin');
    
    let originText = "";
    if (origin && origin.trim() !== "") {
        originText += origin;
    }
    if (altitude && altitude.trim() !== "") {
        if (originText.length > 0) originText += ", ";
        originText += `${altitude} m`;
    }

    if (originText.length > 0) {
        originEl.style.display = "block";
        originEl.innerText = originText;
    } else {
        originEl.style.display = "none";
    }

    // Update Roast
    const roasts = ['Cinnamon', 'City', 'New England', 'FullCity', 'American', 'Vienna'];
    roasts.forEach(r => {
        document.getElementById('box' + r.replace(/\s/g, '')).innerHTML = '&#9744;'; 
    });
    const selectedRoast = document.querySelector('input[name="roast"]:checked');
    if (selectedRoast) {
        const val = selectedRoast.value.replace(/\s/g, ''); 
        document.getElementById('box' + val).innerHTML = '&#9745;'; 
    }

    // Update Type Checkboxes
    toggleBox('chkEstate', 'boxEstate');
    toggleBox('chkOrigin', 'boxOrigin');
    toggleBox('chkBlend', 'boxBlend');

    // Logic for Blend vs SCA & Layout
    const isBlend = document.getElementById('chkBlend').checked;
    const inputSCA = document.getElementById('inputSCA');
    const scaWrapper = document.getElementById('wrapSCA');
    const detailsSection = document.getElementById('detailsSection');

    if (isBlend) {
        inputSCA.disabled = true;
        inputSCA.value = ""; 
        scaWrapper.style.display = "none";
        detailsSection.classList.remove('single-line-section');
    } else {
        inputSCA.disabled = false;
        let sca = inputSCA.value;
        if (sca && sca.trim() !== "") {
            if(!sca.includes('.')) sca += ".0";
            document.getElementById('lblSCA').innerText = sca;
            scaWrapper.style.display = "flex"; 
        } else {
            scaWrapper.style.display = "none";
        }
        detailsSection.classList.add('single-line-section');
    }

    // Update Processing
    const checkboxes = document.querySelectorAll('.proc-chk:checked');
    const selectedProcs = Array.from(checkboxes).map(cb => cb.value);
    const procWrapper = document.getElementById('wrapProcessing');
    
    if (selectedProcs.length > 0) {
        procWrapper.style.display = "block";
        document.getElementById('lblProcessing').innerText = selectedProcs.join(' / ');
    } else {
        procWrapper.style.display = "none";
    }

    // Update Composition
    validateAndUpdateComposition();

    // --- Profile, Body, Acidity Logic ---
    const profileVal = document.getElementById('inputProfile') ? document.getElementById('inputProfile').value : "";
    const bodyVal = document.getElementById('inputBody') ? document.getElementById('inputBody').value : "";
    const acidityVal = document.getElementById('inputAcidity') ? document.getElementById('inputAcidity').value : "";
    
    const descContainer = document.getElementById('lblDescriptors');
    if (descContainer) {
        let descParts = [];
        if(profileVal) descParts.push(`<strong>Profile:</strong> ${profileVal}`);
        if(bodyVal) descParts.push(`<strong>Body:</strong> ${bodyVal}`);
        if(acidityVal) descParts.push(`<strong>Acidity:</strong> ${acidityVal}`);

        if (descParts.length > 0) {
            descContainer.style.display = "flex";
            descContainer.innerHTML = descParts.map(p => `<span>${p}</span>`).join(""); 
        } else {
            descContainer.style.display = "none";
        }
    }

    // Update Flavors
    const flavors = document.getElementById('inputFlavors').value;
    const flavorEl = document.getElementById('lblFlavors');
    if (flavors && flavors.trim() !== "") {
        flavorEl.style.display = "block";
        flavorEl.innerHTML = `<strong>Tasting notes:</strong> ${flavors}`;
    } else {
        flavorEl.style.display = "none";
    }

    // Update Date
    const dateVal = document.getElementById('inputDate').value;
    if (dateVal) {
        const parts = dateVal.split("-");
        const year = parts[0];
        const monthIndex = parseInt(parts[1]) - 1;
        const day = parts[2];
        
        const months = [
            "January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December"
        ];
        document.getElementById('lblFullDate').innerText = `${day} ${months[monthIndex]} ${year}`;
    } else {
        document.getElementById('lblFullDate').innerText = "____ __________ ____";
    }

    // Generate QR Code
    const qrInput = document.getElementById('inputQR').value;
    const qrContainer = document.getElementById('lblQRCode');
    
    qrContainer.innerHTML = "";

    if (qrInput && qrInput.trim() !== "") {
        new QRCode(qrContainer, {
            text: qrInput,
            width: 110,
            height: 110,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    }
}

function toggleBox(inputId, boxId) {
    const isChecked = document.getElementById(inputId).checked;
    document.getElementById(boxId).innerHTML = isChecked ? '&#9745;' : '&#9744;';
}

function validateAndUpdateComposition() {
    const isBlend = document.getElementById('chkBlend').checked;
    const isEstate = document.getElementById('chkEstate').checked;
    const isOrigin = document.getElementById('chkOrigin').checked;

    const arabicaInput = document.getElementById('inputArabica');
    const canephoraInput = document.getElementById('inputCanephora');
    const libericaInput = document.getElementById('inputLiberica');
    const errorMsg = document.getElementById('sumError');

    const valA = parseFloat(arabicaInput.value) || 0;
    const valC = parseFloat(canephoraInput.value) || 0;
    const valL = parseFloat(libericaInput.value) || 0;
    const sum = valA + valC + valL;

    const inputs = [arabicaInput, canephoraInput, libericaInput];
    
    let isValid = true;
    let message = "";

    if (sum !== 100) {
        isValid = false;
        message = `Current sum: ${sum}% (Must be 100%)`;
    } 
    else if (isBlend) {
        if (valA === 100 || valC === 100 || valL === 100) {
            isValid = false;
            message = "Blend cannot be 100% single type!";
        }
    }
    else if (isEstate || isOrigin) {
        if (valA !== 100 && valC !== 100 && valL !== 100) {
            isValid = false;
            message = "Single Origin/Estate must be 100% of one type!";
        }
    }

    if (isValid) {
        inputs.forEach(inp => inp.classList.remove('input-error'));
        errorMsg.style.display = 'none';
    } else {
        inputs.forEach(inp => inp.classList.add('input-error'));
        errorMsg.style.display = 'block';
        errorMsg.innerText = message;
    }

    updateSingleComp(arabicaInput.value, 'wrapArabica', 'lblArabica');
    updateSingleComp(canephoraInput.value, 'wrapCanephora', 'lblCanephora');
    updateSingleComp(libericaInput.value, 'wrapLiberica', 'lblLiberica');
}

function updateSingleComp(val, wrapperId, lblId) {
    const wrapper = document.getElementById(wrapperId);
    if (val && val.trim() !== "" && parseFloat(val) > 0) {
        wrapper.style.display = "inline";
        document.getElementById(lblId).innerText = val;
    } else {
        wrapper.style.display = "none";
    }
}

function checkExclusive(el) {
    if (el.checked) {
        const exclusives = ['Natural', 'Honey', 'Washed'];
        const checkboxes = document.querySelectorAll('.proc-chk');
        
        checkboxes.forEach(cb => {
            if (exclusives.includes(cb.value) && cb !== el) {
                cb.checked = false;
            }
        });
    }
    updateLabel();
}

function handlePrint() {
    saveToHistory(); 
    window.print();
}

function saveToHistory() {
    const title = document.getElementById('inputTitle').value;
    if (!title) return; 

    const currentState = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        title: title,
        origin: document.getElementById('inputOrigin').value,
        altitude: document.getElementById('inputAltitude').value,
        qr: document.getElementById('inputQR').value,
        
        isEstate: document.getElementById('chkEstate').checked,
        isOrigin: document.getElementById('chkOrigin').checked,
        isBlend: document.getElementById('chkBlend').checked,
        
        sca: document.getElementById('inputSCA').value,
        roast: document.querySelector('input[name="roast"]:checked')?.value,
        processing: Array.from(document.querySelectorAll('.proc-chk:checked')).map(cb => cb.value),
        
        arabica: document.getElementById('inputArabica').value,
        canephora: document.getElementById('inputCanephora').value,
        liberica: document.getElementById('inputLiberica').value,
        
        profile: document.getElementById('inputProfile').value,
        body: document.getElementById('inputBody').value,
        acidity: document.getElementById('inputAcidity').value,
        
        flavors: document.getElementById('inputFlavors').value,
        date: document.getElementById('inputDate').value
    };

    let history = JSON.parse(localStorage.getItem('coffeeLabelHistory') || '[]');
    history.unshift(currentState);

    if (history.length > 10) {
        history = history.slice(0, 10);
    }

    localStorage.setItem('coffeeLabelHistory', JSON.stringify(history));
    renderHistoryDropdown();
}

function renderHistoryDropdown() {
    const history = JSON.parse(localStorage.getItem('coffeeLabelHistory') || '[]');
    const select = document.getElementById('historySelect');
    
    select.innerHTML = '<option value="">-- Select a previous label --</option>';

    history.forEach((item, index) => {
        const opt = document.createElement('option');
        opt.value = index; 
        opt.innerText = `${item.title} (${item.timestamp})`;
        select.appendChild(opt);
    });
}

function loadFromHistory(index) {
    if (index === "") return;

    const history = JSON.parse(localStorage.getItem('coffeeLabelHistory') || '[]');
    const state = history[index];

    if (!state) return;

    document.getElementById('inputTitle').value = state.title;
    document.getElementById('inputOrigin').value = state.origin;
    document.getElementById('inputAltitude').value = state.altitude;
    document.getElementById('inputQR').value = state.qr;

    document.getElementById('chkEstate').checked = state.isEstate;
    document.getElementById('chkOrigin').checked = state.isOrigin;
    document.getElementById('chkBlend').checked = state.isBlend;

    document.getElementById('inputSCA').value = state.sca;

    if (state.roast) {
        const roastRadio = document.querySelector(`input[name="roast"][value="${state.roast}"]`);
        if (roastRadio) roastRadio.checked = true;
    }

    document.querySelectorAll('.proc-chk').forEach(cb => cb.checked = false);
    if (state.processing && state.processing.length > 0) {
        state.processing.forEach(val => {
            const cb = document.querySelector(`.proc-chk[value="${val}"]`);
            if (cb) cb.checked = true;
        });
    }

    document.getElementById('inputArabica').value = state.arabica;
    document.getElementById('inputCanephora').value = state.canephora;
    document.getElementById('inputLiberica').value = state.liberica;

    if (state.profile) document.getElementById('inputProfile').value = state.profile;
    else document.getElementById('inputProfile').value = "";

    if (state.body) document.getElementById('inputBody').value = state.body;
    else document.getElementById('inputBody').value = "";

    if (state.acidity) document.getElementById('inputAcidity').value = state.acidity;
    else document.getElementById('inputAcidity').value = "";

    document.getElementById('inputFlavors').value = state.flavors;
    document.getElementById('inputDate').value = state.date;

    updateLabel();
}
