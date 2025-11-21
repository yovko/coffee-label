window.onload = function() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    document.getElementById('inputDate').value = `${yyyy}-${mm}-${dd}`;
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
        // Ако нито едно от трите не е равно на 100 (т.е. имаме смес) -> грешка
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
