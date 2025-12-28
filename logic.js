// ROSANATECH SOLAR QUOTE GENERATOR - FINAL VERSION
// ============================================

// 1. APPLIANCE DATABASE WITH ENGINEERING VALUES
const applianceData = [
    // REFRIGERATION (Cycling appliances - REALISTIC VALUES)
    { 
        name: "Normal Fridge 150L", 
        watts: 120, 
        category: "refrigeration",
        defaultDayHours: 4,
        defaultNightHours: 4,
        usageHint: "Runs 4h day + 4h night, cycles on/off"
    },
    { 
        name: "Large Fridge 250L", 
        watts: 150, 
        category: "refrigeration",
        defaultDayHours: 5,
        defaultNightHours: 5
    },
    { 
        name: "Deep Freezer", 
        watts: 150, 
        category: "refrigeration",
        defaultDayHours: 6,
        defaultNightHours: 6
    },

    
        
    // LIGHTING
    { name: "LED Light Bulb", watts: 9, category: "lighting", defaultDayHours: 2, defaultNightHours: 6 },
    { name: "CFL Bulb", watts: 15, category: "lighting", defaultDayHours: 2, defaultNightHours: 6 },
    { name: "Tube Light", watts: 20, category: "lighting", defaultDayHours: 2, defaultNightHours: 6 },
    
    // ELECTRONICS
    { name: "Television 32\" LED", watts: 50, category: "electronics", defaultDayHours: 3, defaultNightHours: 3 },
    { name: "Television 42\" LED", watts: 80, category: "electronics", defaultDayHours: 3, defaultNightHours: 3 },
    { name: "Home theatre", watts: 60, category: "electronics", defaultDayHours: 4, defaultNightHours: 2 },
    { name: "Desktop Computer", watts: 150, category: "electronics", defaultDayHours: 6, defaultNightHours: 2 },
    { name: "Router/Modem", watts: 10, category: "electronics", defaultDayHours: 12, defaultNightHours: 12 },
    
    // COOLING
    { name: "Ceiling Fan", watts: 75, category: "cooling", defaultDayHours: 6, defaultNightHours: 6 },
    { name: "Standing Fan", watts: 50, category: "cooling", defaultDayHours: 6, defaultNightHours: 6 },
    
    // KITCHEN
    { name: "Electric Kettle", watts: 1500, category: "kitchen", defaultDayHours: 0.5, defaultNightHours: 0.5 },
    { name: "Microwave Oven", watts: 1000, category: "kitchen", defaultDayHours: 0.5, defaultNightHours: 0.5 },
    { name: "Electric Iron", watts: 1000, category: "kitchen", defaultDayHours: 1, defaultNightHours: 0 },
    
    // WATER SYSTEMS
    { 
        name: "Water Pump 0.5HP", 
        watts: 400, 
        category: "water",
        defaultDayHours: 1,
        defaultNightHours: 1,
        usageHint: "Runs 1-2 hours daily"
    },
    
    // SECURITY
    { name: "Security Camera", watts: 10, category: "security", defaultDayHours: 12, defaultNightHours: 12 },
    { name: "Security Lights", watts: 20, category: "security", defaultDayHours: 0, defaultNightHours: 12 }
];

// 2. ROSANATECH COMPONENT DATABASE (TECHNICALLY CORRECT)
const rosaComponents = {
    panels: [
        { brand: "LONGi", model: "Hi MO X6", watts: 585, price: 11115, warranty: "25 years" }
    ],
    
    // INVERTERS - ALL REALISTIC SIZES
    inverters: [
        { brand: "SRNE", model: "1KVA Hybrid", kva: 1, price: 25000, voltage: "48V" },
        { brand: "SRNE", model: "1.5KVA Hybrid", kva: 1.5, price: 32000, voltage: "48V" },
        { brand: "SRNE", model: "3KVA Hybrid", kva: 3, price: 45000, voltage: "48V" },
        { brand: "SRNE", model: "3.3KVA Hybrid", kva: 3.3, price: 49000, voltage: "48V" },
        { brand: "SRNE", model: "5KVA Hybrid", kva: 5, price: 66500, voltage: "48V" },
        { brand: "SRNE", model: "6KVA Hybrid", kva: 6, price: 80550, voltage: "48V" },
        { brand: "SRNE", model: "8KVA Hybrid", kva: 8, price: 99000, voltage: "48V" },
        { brand: "SRNE", model: "10KVA Hybrid", kva: 10, price: 127000, voltage: "48V" },
        { brand: "SRNE", model: "12KVA Hybrid", kva: 12, price: 188500, voltage: "48V" }
    ],
    
    // BATTERIES - STANDARD SIZES
    batteries: [
        { brand: "Ipower", model: "Series Battery", type: "Lithium", voltage: 48, capacityKwh: 2.56, price: 49999, warranty: "5 years" },
        { brand: "Ipower", model: "Series Battery", type: "Lithium", voltage: 48, capacityKwh: 5.12, price: 119000, warranty: "5 years" },
        { brand: "Ipower", model: "Series Battery", type: "Lithium", voltage: 48, capacityKwh: 10.24, price: 229000, warranty: "5 years" },
        { brand: "Ipower", model: "Series Battery", type: "Lithium", voltage: 48, capacityKwh: 14.24, price: 335000, warranty: "5 years" }
    ],
    
    // Fixed cost items
    protection: {
        changeoverSwitch: { price: 11039, description: "Automatic Changeover switch 63A" },
        voltageSwitcher: { price: 8040, description: "Automatic Voltage Switcher 30" },
        combinerBox: { price: 11500, description: "DC & AC Combiner Boxes with Protection devices (SPDs, MCBs, Isolator Switch)" },
        lightningArrestor: { price: 9975, description: "Copper Lightning Arrestor 13.5 MM X 5/8\" 600MM" },
        earthingRod: { price: 800, description: "Earthing Rod Length: 4 feet Diameter: 8.5mm" }
    },
    
    // Cable costs per meter
    cableCosts: {
        pv6mm: { price: 200, description: "Solar cables 6mm² PV cables" },
        ac4mm: { price: 150, description: "4.0mm² AC cables" },
        battery35mm: { price: 870, description: "Battery cable 35mm²" },
        earth6mm: { price: 210, description: "Earth Cable 6mm²" }
    }
};

// 3. GLOBAL VARIABLES
let currentStep = 1;
let quoteCounter = localStorage.getItem('rosa_quote_counter') ? parseInt(localStorage.getItem('rosa_quote_counter')) : 0;
let currentQuoteId = '';
let loadProfileData = {};
let systemSpecs = {};

// 4. TOOLTIP DATA
const tooltipData = {
    watts: {
        title: "Watts (Power Rating)",
        description: "The power consumption when the appliance is running. Check the appliance label or manual."
    },
    "day-hours": {
        title: "Day Hours (9 AM - 4 PM)",
        description: "Hours the appliance runs during daytime when solar panels are producing power."
    },
    "night-hours": {
        title: "Night Hours (4 PM - 9 AM)",
        description: "Hours the appliance runs at night. This energy must come from batteries."
    }
};

// 5. INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    addApplianceRow();
});

function initializeApp() {
    // Setup event listeners
    document.getElementById('add-row').addEventListener('click', () => addApplianceRow());
    document.getElementById('clear-all').addEventListener('click', clearAllRows);
    document.getElementById('load-sample').addEventListener('click', loadSampleData);
    
    // Step navigation
    document.getElementById('next-to-step2').addEventListener('click', goToStep2);
    document.getElementById('back-to-step1').addEventListener('click', goToStep1);
    document.getElementById('back-to-audit').addEventListener('click', () => changeStep(1));
    
    // Form submission
    document.getElementById('client-form').addEventListener('submit', handleFormSubmit);
    
    // Quick add buttons
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const appliance = JSON.parse(this.getAttribute('data-appliance'));
            addApplianceRow(appliance);
        });
    });
    
    // Tooltips
    setupTooltips();
    
    // Autocomplete
    setupAutocomplete();
    
    // Quote actions
    document.getElementById('download-pdf').addEventListener('click', generatePDF);
    document.getElementById('whatsapp-contact').addEventListener('click', openWhatsApp);
}

// 6. STEP MANAGEMENT
function goToStep2() {
    updateCalculations();
    
    // Validate at least one appliance with non-zero watts
    const rows = document.querySelectorAll('#table-body tr');
    let hasValidAppliance = false;
    
    rows.forEach(row => {
        const watts = parseFloat(row.querySelector('.watts').value) || 0;
        if (watts > 0) {
            hasValidAppliance = true;
        }
    });
    
    if (!hasValidAppliance) {
        showError('Please add at least one appliance with wattage greater than 0.');
        return;
    }
    
    changeStep(2);
}

function goToStep1() {
    changeStep(1);
}

function changeStep(step) {
    // Hide all steps
    document.querySelectorAll('.step').forEach(s => {
        s.classList.remove('active');
    });
    
    // Update progress bar
    document.querySelectorAll('.progress-step').forEach(ps => {
        ps.classList.remove('active');
    });
    
    // Show target step
    document.getElementById(`step-${step}`).classList.add('active');
    document.querySelector(`.progress-step[data-step="${step}"]`).classList.add('active');
    
    currentStep = step;
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// 7. LOAD AUDIT FUNCTIONS
function addApplianceRow(applianceData = null) {
    const tableBody = document.getElementById('table-body');
    const rowId = Date.now();
    
    const row = document.createElement('tr');
    row.id = `row-${rowId}`;
    
    // Appliance Name
    const nameCell = document.createElement('td');
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'appliance-name';
    nameInput.setAttribute('list', 'appliance-list');
    nameInput.placeholder = 'Type appliance name';
    
    if (applianceData && applianceData.name) {
        nameInput.value = applianceData.name;
    }
    
    nameCell.appendChild(nameInput);
    
    // Quantity
    const qtyCell = document.createElement('td');
    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.min = '1';
    qtyInput.value = applianceData && applianceData.quantity ? applianceData.quantity : '1';
    qtyInput.className = 'quantity';
    qtyCell.appendChild(qtyInput);
    
    // Watts
    const wattsCell = document.createElement('td');
    const wattsInput = document.createElement('input');
    wattsInput.type = 'number';
    wattsInput.min = '1';
    wattsInput.value = applianceData && applianceData.watts ? applianceData.watts : '';
    wattsInput.className = 'watts';
    wattsInput.placeholder = 'Watts';
    wattsCell.appendChild(wattsInput);
    
    // Day Hours
    const dayCell = document.createElement('td');
    const dayInput = document.createElement('input');
    dayInput.type = 'number';
    dayInput.min = '0';
    dayInput.max = '24';
    dayInput.step = '0.5';
    dayInput.value = applianceData && applianceData.dayHours ? applianceData.dayHours : '0';
    dayInput.className = 'day-hours';
    dayCell.appendChild(dayInput);
    
    // Night Hours
    const nightCell = document.createElement('td');
    const nightInput = document.createElement('input');
    nightInput.type = 'number';
    nightInput.min = '0';
    nightInput.max = '24';
    nightInput.step = '0.5';
    nightInput.value = applianceData && applianceData.nightHours ? applianceData.nightHours : '0';
    nightInput.className = 'night-hours';
    nightCell.appendChild(nightInput);
    
    // Daily kWh Cell (readonly)
    const kwhCell = document.createElement('td');
    kwhCell.className = 'daily-kwh';
    kwhCell.textContent = '0 kWh';
    
    // Actions
    const actionCell = document.createElement('td');
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener('click', function() {
        row.remove();
        updateCalculations();
    });
    actionCell.appendChild(deleteBtn);
    
    // Assemble row
    row.appendChild(nameCell);
    row.appendChild(qtyCell);
    row.appendChild(wattsCell);
    row.appendChild(dayCell);
    row.appendChild(nightCell);
    row.appendChild(kwhCell);
    row.appendChild(actionCell);
    
    tableBody.appendChild(row);
    
    // Setup autocomplete
    setupAutocompleteForInput(nameInput);
    
    // Add input listeners
    const inputs = row.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', updateCalculations);
        input.addEventListener('change', updateCalculations);
    });
    
    updateCalculations();
    
    return rowId;
}

function clearAllRows() {
    if (confirm('Clear all appliances? This cannot be undone.')) {
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';
        addApplianceRow();
    }
}

function loadSampleData() {
    clearAllRows();
    
    const sampleData = [
        { name: "Normal Fridge 150L", quantity: 1, watts: 120, dayHours: 4, nightHours: 4 },
        { name: "LED Light Bulb", quantity: 6, watts: 9, dayHours: 2, nightHours: 6 },
        { name: "Television 32\" LED", quantity: 1, watts: 50, dayHours: 3, nightHours: 5 },
        { name: "Home theatre", quantity: 1, watts: 60, dayHours: 4, nightHours: 5 },
        { name: "Ceiling Fan", quantity: 2, watts: 75, dayHours: 6, nightHours: 6 }
    ];
    
    sampleData.forEach(appliance => {
        addApplianceRow(appliance);
    });
    
    alert('Sample household data loaded. Modify as needed for your actual usage.');
}

// 8. TECHNICALLY CORRECT CALCULATIONS
function updateCalculations() {
    const rows = document.querySelectorAll('#table-body tr');
    let totalWatts = 0;
    let totalDaytimeWh = 0;
    let totalNighttimeWh = 0;
    let applianceList = [];
    let dailyTotal = 0;
    
    rows.forEach(row => {
        const name = row.querySelector('.appliance-name').value || '';
        const qty = parseFloat(row.querySelector('.quantity').value) || 0;
        const watts = parseFloat(row.querySelector('.watts').value) || 0;
        const dayHours = parseFloat(row.querySelector('.day-hours').value) || 0;
        const nightHours = parseFloat(row.querySelector('.night-hours').value) || 0;
        
        // Calculate for this appliance
        const applianceWatts = qty * watts;
        const daytimeWh = applianceWatts * dayHours;
        const nighttimeWh = applianceWatts * nightHours;
        const dailyWh = daytimeWh + nighttimeWh;
        const dailyKwh = dailyWh / 1000;
        
        totalWatts += applianceWatts;
        totalDaytimeWh += daytimeWh;
        totalNighttimeWh += nighttimeWh;
        dailyTotal += dailyKwh;
        
        // Update row display
        const kwhCell = row.querySelector('.daily-kwh');
        if (kwhCell) {
            kwhCell.textContent = `${dailyKwh.toFixed(2)} kWh`;
        }
        
        // Store for load profile
        if (name && watts > 0) {
            applianceList.push({
                name: name,
                quantity: qty,
                watts: watts,
                dayHours: dayHours,
                nightHours: nightHours,
                dailyWh: dailyWh,
                dailyKwh: dailyKwh
            });
        }
    });
    
    // Convert Wh to kWh
    const totalDaytimeKwh = totalDaytimeWh / 1000;
    const totalNighttimeKwh = totalNighttimeWh / 1000;
    const totalConsumptionKwh = (totalDaytimeWh + totalNighttimeWh) / 1000;
    
    // Update displays
    document.getElementById('total-consumption').textContent = `${totalConsumptionKwh.toFixed(2)} kWh`;
    document.getElementById('peak-power').textContent = `${totalWatts.toFixed(0)} W`;
    document.getElementById('day-usage').textContent = `${totalDaytimeKwh.toFixed(2)} kWh`;
    document.getElementById('night-usage').textContent = `${totalNighttimeKwh.toFixed(2)} kWh`;
    document.getElementById('daily-total').textContent = `${dailyTotal.toFixed(2)} kWh`;
    
    // Calculate system specifications
    calculateSystemSpecs(totalWatts, totalDaytimeKwh, totalNighttimeKwh, applianceList);
    
    // Save load profile
    loadProfileData = {
        appliances: applianceList,
        totals: {
            totalConsumptionKwh: totalConsumptionKwh,
            peakPowerW: totalWatts,
            daytimeKwh: totalDaytimeKwh,
            nighttimeKwh: totalNighttimeKwh,
            dailyTotalKwh: dailyTotal
        },
        timestamp: new Date().toISOString()
    };
}

function calculateSystemSpecs(totalWatts, daytimeKwh, nighttimeKwh, applianceList) {
    // TECHNICALLY CORRECT ENGINEERING CALCULATIONS
    
    // 1. Battery Sizing (2.5× multiplier for autonomy + growth + losses)
    const batteryKwhNeeded = nighttimeKwh * 1.67; // 1.2 ÷ 0.8 ÷ 0.9 = 1.666... ≈ 1.67 (system efficiency)
    const batteryConfig = selectBatterySize(batteryKwhNeeded);
    
    // 2. Panel Sizing (Must satisfy both: daytime loads AND battery charging)
    const panelConfig = calculatePanels(daytimeKwh, batteryConfig.capacityKwh);
    
    // 3. Inverter Sizing (With diversity and safety factors)
    const inverterKva = calculateInverterSize(totalWatts);
    
    // 4. Check compatibility: Can panels charge the battery?
    const maxChargeableBattery = calculateMaxChargeableBattery(panelConfig.totalWatts);
    const compatible = batteryConfig.capacityKwh <= maxChargeableBattery;
    
    // Store system specs
    systemSpecs = {
        inverterKva: inverterKva,
        panelQuantity: panelConfig.quantity,
        panelWatts: panelConfig.watts,
        panelTotalWatts: panelConfig.totalWatts,
        batteryKwh: batteryConfig.capacityKwh,
        batteryPrice: batteryConfig.price,
        batteryBrand: batteryConfig.brand,
        maxChargeableBattery: maxChargeableBattery,
        isCompatible: compatible,
        totalDailyKwh: daytimeKwh + nighttimeKwh,
        totalDaytimeKwh: daytimeKwh,
        totalNighttimeKwh: nighttimeKwh,
        peakPower: totalWatts,
        applianceCount: applianceList.length
    };
    
    return systemSpecs;
}

function selectBatterySize(neededKwh) {
    // Available battery sizes
    const availableBatteries = rosaComponents.batteries.sort((a, b) => a.capacityKwh - b.capacityKwh);
    
    // Find the smallest battery that meets or exceeds the need
    let selectedBattery = availableBatteries.find(b => b.capacityKwh >= neededKwh);
    
    // If no battery is large enough, use the largest available
    if (!selectedBattery) {
        selectedBattery = availableBatteries[availableBatteries.length - 1];
    }
    
    return {
        capacityKwh: selectedBattery.capacityKwh,
        price: selectedBattery.price,
        brand: selectedBattery.brand,
        type: selectedBattery.type
    };
}

function calculatePanels(daytimeKwh, batteryKwh) {
    const sunHours = 5.5; // Kenya average
    const systemEfficiency = 0.79; // Total system losses (21%)
    const chargingEfficiency = 0.9; // Battery charging efficiency
    const panelWatts = 585; // LONGi 585W panels
    
    // Power needed for daytime loads
    const powerForDay = daytimeKwh / sunHours / systemEfficiency;
    
    // Power needed to charge battery (CRITICAL - often overlooked)
    const powerForBattery = (batteryKwh / sunHours) / (chargingEfficiency * systemEfficiency);
    
    // Total power needed (worst case)
    const totalPowerNeeded = Math.max(powerForDay, powerForBattery);
    
    // Calculate panel quantity
    let panelQty = Math.ceil(totalPowerNeeded * 1000 / panelWatts);
    
    // Minimum 2 panels for 48V system
    panelQty = Math.max(2, panelQty);
    
    // Round to even number for string balancing
    if (panelQty % 2 !== 0) {
        panelQty += 1;
    }
    
    return {
        quantity: panelQty,
        watts: panelWatts,
        totalWatts: panelQty * panelWatts / 1000 // in kW
    };
}

function calculateInverterSize(totalWatts) {
    const diversityFactor = 0.7; // Residential diversity
    const safetyFactor = 1.25; // For motor startups
    const powerFactor = 0.8;
    
    const inverterKva = (totalWatts * diversityFactor * safetyFactor) / 1000 / powerFactor;
    
    // Available inverter sizes
    const availableSizes = [1, 1.5, 3, 3.3, 5, 6, 8, 10, 12];
    
    // Find the smallest inverter that can handle the load
    for (let size of availableSizes) {
        if (size >= inverterKva) {
            return size;
        }
    }
    
    // If larger than available, return max
    return availableSizes[availableSizes.length - 1];
}

function calculateMaxChargeableBattery(panelPowerKw) {
    const sunHours = 5.5;
    const chargingEfficiency = 0.9;
    const systemEfficiency = 0.79;
    
    return panelPowerKw * sunHours * chargingEfficiency * systemEfficiency;
}

// 9. AUTOFILL & TOOLTIPS
function setupAutocomplete() {
    const datalist = document.createElement('datalist');
    datalist.id = 'appliance-list';
    
    applianceData.forEach(appliance => {
        const option = document.createElement('option');
        option.value = appliance.name;
        option.textContent = `${appliance.name} (${appliance.watts}W)`;
        datalist.appendChild(option);
    });
    
    document.body.appendChild(datalist);
}

function setupAutocompleteForInput(inputElement) {
    inputElement.setAttribute('list', 'appliance-list');
    
    inputElement.addEventListener('input', function() {
        const selectedAppliance = applianceData.find(app => app.name === this.value);
        if (selectedAppliance) {
            const row = this.closest('tr');
            const wattsInput = row.querySelector('.watts');
            const dayInput = row.querySelector('.day-hours');
            const nightInput = row.querySelector('.night-hours');
            
            if (wattsInput && !wattsInput.value) {
                wattsInput.value = selectedAppliance.watts;
            }
            
            if (dayInput && dayInput.value === '0' && selectedAppliance.defaultDayHours) {
                dayInput.value = selectedAppliance.defaultDayHours;
            }
            
            if (nightInput && nightInput.value === '0' && selectedAppliance.defaultNightHours) {
                nightInput.value = selectedAppliance.defaultNightHours;
            }
            
            updateCalculations();
        }
    });
}

function setupTooltips() {
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('tooltip-icon') || 
            event.target.parentElement.classList.contains('tooltip-icon')) {
            
            const tooltipIcon = event.target.classList.contains('tooltip-icon') 
                ? event.target 
                : event.target.parentElement;
            
            const term = tooltipIcon.getAttribute('data-term');
            
            if (term && tooltipData[term]) {
                showTooltip(term);
            }
        }
    });
    
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.getElementById('tooltip-modal').style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('tooltip-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function showTooltip(term) {
    const tooltip = tooltipData[term];
    if (!tooltip) return;
    
    document.getElementById('tooltip-title').textContent = tooltip.title;
    document.getElementById('tooltip-description').textContent = tooltip.description;
    document.getElementById('tooltip-modal').style.display = 'flex';
}

// 10. FORM HANDLING WITH ENHANCED DATA CAPTURE
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Validate form
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
     const location = document.getElementById('location').value.trim();
    
    if (!name || !phone || !email || !location) {
        showError('Please fill in all required fields (Name, Phone, Email, Location).');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address.');
        return;
    }
    
    // Set reply-to email
    document.getElementById('reply-to-email').value = email;
    
    // Generate quote number
    const quoteId = generateQuoteNumber();
    document.getElementById('quote-number').value = quoteId;
    currentQuoteId = quoteId;
    
    // Create enhanced data for Formspree
    createEnhancedFormData();
    
    // Show loading state
    document.getElementById('quote-success').style.display = 'none';
    document.getElementById('quote-loading').style.display = 'block';
    
    // Disable submit button
    const submitBtn = document.getElementById('submit-form');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    
    // Submit to Formspree
    const form = event.target;
    const formData = new FormData(form);
    
    // Add enhanced data
    formData.append('_email_body', generateEmailBody(name, phone, email, location, quoteId));
    
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Success - show quote
            setTimeout(() => {
                document.getElementById('quote-loading').style.display = 'none';
                document.getElementById('quote-success').style.display = 'block';
                generateQuote(quoteId, { name, phone, email, location });
                changeStep(3);
                
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit & Generate Quote';
            }, 1500);
        } else {
            handleFormspreeError(response);
        }
    })
    .catch(error => {
        handleNetworkError(error);
    });
    
    // Store locally for backup
    storeQuoteLocally(quoteId, { name, phone, email, location });
}

function createEnhancedFormData() {
    // Enhanced load profile data for easy verification
    const applianceTable = generateApplianceTable();
    const loadSummary = generateLoadSummary();
    const verificationQuestions = generateVerificationQuestions();
    
    // Set hidden field values
    document.getElementById('load-profile-data').value = JSON.stringify(loadProfileData, null, 2);
    document.getElementById('system-specs').value = JSON.stringify(systemSpecs, null, 2);
    document.getElementById('load-summary').value = JSON.stringify(loadSummary, null, 2);
    document.getElementById('appliance-table-data').value = applianceTable;
}

function generateApplianceTable() {
    if (!loadProfileData.appliances || loadProfileData.appliances.length === 0) {
        return "No appliances entered";
    }
    
    let table = "APPLIANCE LIST:\n";
    table += "┌────────────────────┬──────┬──────┬──────────┬───────────┬──────────┐\n";
    table += "│ Appliance         │ Qty  │ Watts│ Day Hrs  │ Night Hrs │ Daily kWh│\n";
    table += "├────────────────────┼──────┼──────┼──────────┼───────────┼──────────┤\n";
    
    loadProfileData.appliances.forEach(appliance => {
        const name = appliance.name.substring(0, 18).padEnd(18);
        const qty = appliance.quantity.toString().padStart(4);
        const watts = appliance.watts.toString().padStart(6);
        const dayHours = appliance.dayHours.toFixed(1).padStart(8);
        const nightHours = appliance.nightHours.toFixed(1).padStart(9);
        const dailyKwh = appliance.dailyKwh.toFixed(2).padStart(10);
        
        table += `│ ${name} │ ${qty} │ ${watts}W │ ${dayHours}h │ ${nightHours}h │ ${dailyKwh} │\n`;
    });
    
    table += "└────────────────────┴──────┴──────┴──────────┴───────────┴──────────┘\n";
    
    return table;
}

function generateLoadSummary() {
    return {
        totalDaily: loadProfileData.totals.totalConsumptionKwh.toFixed(2) + " kWh",
        daytime: loadProfileData.totals.daytimeKwh.toFixed(2) + " kWh",
        nighttime: loadProfileData.totals.nighttimeKwh.toFixed(2) + " kWh",
        peakPower: loadProfileData.totals.peakPowerW.toFixed(0) + " W",
        daytimePercent: ((loadProfileData.totals.daytimeKwh / loadProfileData.totals.totalConsumptionKwh) * 100).toFixed(0) + "%",
        nighttimePercent: ((loadProfileData.totals.nighttimeKwh / loadProfileData.totals.totalConsumptionKwh) * 100).toFixed(0) + "%"
    };
}

function generateVerificationQuestions() {
    const daytimePercent = (loadProfileData.totals.daytimeKwh / loadProfileData.totals.totalConsumptionKwh) * 100;
    const nighttimePercent = (loadProfileData.totals.nighttimeKwh / loadProfileData.totals.totalConsumptionKwh) * 100;
    
    return {
        totalLoad: loadProfileData.totals.totalConsumptionKwh > 10 ? "High (>10 kWh)" : 
                  loadProfileData.totals.totalConsumptionKwh > 5 ? "Normal (5-10 kWh)" : "Low (<5 kWh)",
        nighttimeRatio: nighttimePercent > 60 ? "High (>60%)" :
                       nighttimePercent > 40 ? "Normal (40-60%)" : "Low (<40%)",
        peakPower: loadProfileData.totals.peakPowerW > 3000 ? "High (>3kW)" :
                  loadProfileData.totals.peakPowerW > 1000 ? "Normal (1-3kW)" : "Low (<1kW)",
        recommendation: loadProfileData.totals.totalConsumptionKwh > 15 ? "Site survey required" :
                       loadProfileData.totals.totalConsumptionKwh > 5 ? "Phone verification needed" : "Email confirmation OK"
    };
}

function generateEmailBody(name, phone, email, location, quoteId) {
    const loadSummary = generateLoadSummary();
    const verification = generateVerificationQuestions();
    const applianceTable = generateApplianceTable();
    
    return `
CLIENT LOAD PROFILE VERIFICATION
────────────────────────────────

CLIENT DETAILS:
• Name: ${name}
• Phone: ${phone}
• Email: ${email}
• Location: ${location}
• Quote ID: ${quoteId}
• Submission Time: ${new Date().toLocaleString()}

LOAD SUMMARY:
• Total Daily Energy: ${loadSummary.totalDaily}
• Daytime Usage: ${loadSummary.daytime} (${loadSummary.daytimePercent})
• Nighttime Usage: ${loadSummary.nighttime} (${loadSummary.nighttimePercent})
• Peak Power Demand: ${loadSummary.peakPower}

${applianceTable}

SYSTEM CALCULATED:
• Solar Panels: ${systemSpecs.panelQuantity} × ${systemSpecs.panelWatts}W = ${(systemSpecs.panelTotalWatts).toFixed(2)} kW
• Inverter: ${systemSpecs.inverterKva} kVA
• Battery: ${systemSpecs.batteryKwh.toFixed(2)} kWh (${systemSpecs.batteryBrand})
• Compatibility Check: ${systemSpecs.isCompatible ? 'PASS ✓' : 'FAIL ✗ (Panels undersized for battery)'}

VERIFICATION ASSESSMENT:
1. Total Load: ${verification.totalLoad}
2. Nighttime Ratio: ${verification.nighttimeRatio}
3. Peak Power: ${verification.peakPower}
4. Recommendation: ${verification.recommendation}

ACTION REQUIRED:
1. Review load profile for accuracy
2. Contact client within 24 hours
3. Schedule site survey if needed

────────────────────────────────
This profile was generated by Rosanatech Solar Audit Tool
`;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(message) {
    // Remove existing error
    const existingError = document.getElementById('form-error');
    if (existingError) existingError.remove();
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.id = 'form-error';
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="close-error">&times;</button>
    `;
    
    // Insert at top of form
    const form = document.getElementById('client-form');
    form.insertBefore(errorDiv, form.firstChild);
    
    // Scroll to error
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function handleFormspreeError(response) {
    const submitBtn = document.getElementById('submit-form');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit & Generate Quote';
    
    document.getElementById('quote-loading').style.display = 'none';
    
    if (response.status === 429) {
        showError('Too many submissions. Please try again in a few minutes.');
    } else if (response.status === 404) {
        showError('Form submission error. Please contact Rosanatech directly.');
    } else {
        showError('Submission failed. Please try again or contact us directly.');
    }
}

function handleNetworkError(error) {
    const submitBtn = document.getElementById('submit-form');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit & Generate Quote';
    
    document.getElementById('quote-loading').style.display = 'none';
    showError('Network error. Please check your internet connection.');
}

// 11. QUOTE GENERATION
function generateQuoteNumber() {
    const now = new Date();
    const year = now.getFullYear().toString().substr(-2);
    
    quoteCounter++;
    localStorage.setItem('rosa_quote_counter', quoteCounter);
    
    const serial = quoteCounter.toString().padStart(4, '0');
    return `RT-${year}-SOLE-${serial}`;
}

function generateQuote(quoteId, clientInfo) {
    // Update quote header
    document.getElementById('display-quote-id').textContent = quoteId;
    document.getElementById('quote-date').textContent = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    // Update system specs display
    document.getElementById('spec-panels').textContent = systemSpecs.panelQuantity;
    document.getElementById('spec-inverter').textContent = `${systemSpecs.inverterKva} kVA`;
    document.getElementById('spec-battery').textContent = `${systemSpecs.batteryKwh.toFixed(2)} kWh`;
    
    // Calculate bill of quantities
    const quoteItems = calculateBillOfQuantities();
    displayQuotePreview(quoteItems);
    
    // Calculate summary
    const summary = calculateQuoteSummary(quoteItems);
    
    // Generate PDF content
    generatePDFContent(quoteId, clientInfo, quoteItems, summary);
    
    // Show compatibility warning if needed
    if (!systemSpecs.isCompatible) {
        showCompatibilityWarning();
    }
}

function showCompatibilityWarning() {
    const warningDiv = document.createElement('div');
    warningDiv.className = 'error-message';
    warningDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <div>
            <strong>Compatibility Alert:</strong> The calculated panels (${systemSpecs.panelQuantity} × ${systemSpecs.panelWatts}W) 
            may not fully charge the ${systemSpecs.batteryKwh.toFixed(2)} kWh battery in 5.5 sun hours.
            <br><small>Recommendation: Consider ${systemSpecs.panelQuantity + 2} panels or a smaller battery.</small>
        </div>
    `;
    
    const quotePreview = document.querySelector('.quote-preview');
    quotePreview.insertBefore(warningDiv, quotePreview.firstChild);
}

function calculateBillOfQuantities() {
    const panelQty = systemSpecs.panelQuantity;
    const inverterKva = systemSpecs.inverterKva;
    const batteryKwh = systemSpecs.batteryKwh;
    
    // Select appropriate inverter
    const selectedInverter = rosaComponents.inverters.find(inv => inv.kva === inverterKva) || rosaComponents.inverters[0];
    
    // Select appropriate battery
    const selectedBattery = rosaComponents.batteries.find(bat => bat.capacityKwh === batteryKwh) || 
                           rosaComponents.batteries.find(bat => bat.capacityKwh >= batteryKwh) || 
                           rosaComponents.batteries[rosaComponents.batteries.length - 1];
    
    // Calculate cable lengths (engineering estimates)
    const cableLengths = calculateCableLengths(panelQty, inverterKva);
    
    // Calculate sundries based on inverter size
    const sundries = calculateSundries(inverterKva);
    
    // Calculate mounting structure (scales with panels)
    const mountingCost = calculateMountingCost(panelQty);
    
    // Build items array (14 items as per Rosanatech format)
    const items = [
        {
            itemNo: 1,
            description: `LONGi ${rosaComponents.panels[0].watts}W Solar Panel (Model Hi MO X6)`,
            unit: "piece",
            quantity: panelQty,
            unitPrice: rosaComponents.panels[0].price,
            total: panelQty * rosaComponents.panels[0].price
        },
        {
            itemNo: 2,
            description: `${selectedInverter.kva}KVA ${selectedInverter.brand} Hybrid Inverter`,
            unit: "piece",
            quantity: 1,
            unitPrice: selectedInverter.price,
            total: selectedInverter.price
        },
        {
            itemNo: 3,
            description: `${selectedBattery.capacityKwh}KWh ${selectedBattery.voltage}V ${selectedBattery.brand} battery`,
            unit: "piece",
            quantity: 1,
            unitPrice: selectedBattery.price,
            total: selectedBattery.price
        },
        {
            itemNo: 4,
            description: rosaComponents.cableCosts.pv6mm.description,
            unit: "meter",
            quantity: cableLengths.pvCable,
            unitPrice: rosaComponents.cableCosts.pv6mm.price,
            total: cableLengths.pvCable * rosaComponents.cableCosts.pv6mm.price
        },
        {
            itemNo: 5,
            description: rosaComponents.cableCosts.ac4mm.description,
            unit: "meter",
            quantity: cableLengths.acCable,
            unitPrice: rosaComponents.cableCosts.ac4mm.price,
            total: cableLengths.acCable * rosaComponents.cableCosts.ac4mm.price
        },
        {
            itemNo: 6,
            description: rosaComponents.protection.changeoverSwitch.description,
            unit: "piece",
            quantity: 1,
            unitPrice: rosaComponents.protection.changeoverSwitch.price,
            total: rosaComponents.protection.changeoverSwitch.price
        },
        {
            itemNo: 7,
            description: rosaComponents.protection.voltageSwitcher.description,
            unit: "piece",
            quantity: 1,
            unitPrice: rosaComponents.protection.voltageSwitcher.price,
            total: rosaComponents.protection.voltageSwitcher.price
        },
        {
            itemNo: 8,
            description: rosaComponents.cableCosts.battery35mm.description,
            unit: "meter",
            quantity: cableLengths.batteryCable,
            unitPrice: rosaComponents.cableCosts.battery35mm.price,
            total: cableLengths.batteryCable * rosaComponents.cableCosts.battery35mm.price
        },
        {
            itemNo: 9,
            description: "Solar mounting structure",
            unit: "lm",
            quantity: 1,
            unitPrice: mountingCost,
            total: mountingCost
        },
        {
            itemNo: 10,
            description: "Installation sundries",
            unit: "lm",
            quantity: 1,
            unitPrice: sundries,
            total: sundries
        },
        {
            itemNo: 11,
            description: rosaComponents.protection.combinerBox.description,
            unit: "lm",
            quantity: 1,
            unitPrice: rosaComponents.protection.combinerBox.price,
            total: rosaComponents.protection.combinerBox.price
        },
        {
            itemNo: 12,
            description: rosaComponents.protection.earthingRod.description,
            unit: "piece",
            quantity: 1,
            unitPrice: rosaComponents.protection.earthingRod.price,
            total: rosaComponents.protection.earthingRod.price
        },
        {
            itemNo: 13,
            description: rosaComponents.cableCosts.earth6mm.description,
            unit: "meter",
            quantity: cableLengths.earthCable,
            unitPrice: rosaComponents.cableCosts.earth6mm.price,
            total: cableLengths.earthCable * rosaComponents.cableCosts.earth6mm.price
        },
        {
            itemNo: 14,
            description: rosaComponents.protection.lightningArrestor.description,
            unit: "piece",
            quantity: 1,
            unitPrice: rosaComponents.protection.lightningArrestor.price,
            total: rosaComponents.protection.lightningArrestor.price
        }
    ];
    
    return items;
}

function calculateCableLengths(panelQty, inverterKva) {
    // Engineering estimates based on typical Kenyan installations
    const pvCable = Math.max(40, Math.min(panelQty * 9, 100));
    const acCable = Math.max(20, Math.min(inverterKva * 7, 60));
    const batteryCable = 3;
    const earthCable = 30;
    
    return { pvCable, acCable, batteryCable, earthCable };
}

function calculateSundries(inverterKva) {
    // Base: 7,000 for 3kVA, scaling to 15,000 for 10kVA+
    const base = 7000;
    const perKva = 900;
    
    let sundries = base + ((inverterKva - 3) * perKva);
    sundries = Math.min(sundries, 15000);
    
    // Round to nearest 500
    return Math.ceil(sundries / 500) * 500;
}

function calculateMountingCost(panelQty) {
    // If 23,700 is for 8 panels, cost scales with panel count
    const costPer8Panels = 23700;
    const costPerPanel = costPer8Panels / 8;
    
    // Calculate cost for given panel quantity
    let cost = panelQty * costPerPanel;
    
    // Round up to nearest 100
    return Math.ceil(cost / 100) * 100;
}

function displayQuotePreview(items) {
    const tbody = document.getElementById('quote-preview-items');
    tbody.innerHTML = '';
    
    // Show main items in preview
    const mainItems = items.filter(item => item.itemNo <= 8);
    
    mainItems.forEach(item => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.itemNo}</td>
            <td>${item.description.substring(0, 30)}${item.description.length > 30 ? '...' : ''}</td>
            <td>${item.quantity}</td>
            <td>KES ${item.total.toLocaleString()}</td>
        `;
        
        tbody.appendChild(row);
    });
}

function calculateQuoteSummary(items) {
    // Calculate Subtotal 1 (excluding battery - item 3)
    const subtotal1 = items.reduce((sum, item) => {
        return item.itemNo !== 3 ? sum + item.total : sum;
    }, 0);
    
    // Find battery cost (item 3)
    const batteryCost = items.find(item => item.itemNo === 3).total;
    
    // Calculate totals
    const totalMaterialCost = subtotal1 + batteryCost;
    const installation = subtotal1 * 0.33;
    const miscellaneous = subtotal1 * 0.05;
    const subtotal = totalMaterialCost + installation + miscellaneous;
    
    // Apply discount (check for promotion)
    const discountRate = checkForPromotion() ? 0.10 : 0;
    const discount = subtotal * discountRate;
    const totalPayable = subtotal - discount;
    
    // Update preview
    document.getElementById('preview-materials').textContent = `KES ${Math.round(totalMaterialCost).toLocaleString()}`;
    document.getElementById('preview-installation').textContent = `KES ${Math.round(installation).toLocaleString()}`;
    document.getElementById('preview-miscellaneous').textContent = `KES ${Math.round(miscellaneous).toLocaleString()}`;
    document.getElementById('preview-total').textContent = `KES ${Math.round(totalPayable).toLocaleString()}`;
    
    return {
        subtotal1: Math.round(subtotal1),
        totalMaterialCost: Math.round(totalMaterialCost),
        installation: Math.round(installation),
        miscellaneous: Math.round(miscellaneous),
        subtotal: Math.round(subtotal),
        discount: Math.round(discount),
        totalPayable: Math.round(totalPayable)
    };
}

function checkForPromotion() {
    // Check if promotion is active
    // For demo, always return false
    return false;
}

// 12. PDF GENERATION
function generatePDFContent(quoteId, clientInfo, items, summary) {
    const today = new Date();
    const validUntil = new Date();
    validUntil.setDate(today.getDate() + 30);
    
    const pdfHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 1000px; margin: 0 auto;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1B5E20; padding-bottom: 20px;">
                <h1 style="color: #1B5E20; margin: 0;">ROSANATECH SOLUTIONS LTD</h1>
                <p style="margin: 5px 0;">P O BOX 48 – 00100, Nairobi, Kenya</p>
                <p style="margin: 5px 0;">+254 114060735 / 705059964 | info@rosanatechsolutions.co.ke</p>
                <p style="margin: 10px 0 0; font-weight: bold; color: #4CAF50;">Electrical | Solar | Smart Systems</p>
            </div>
            
            <!-- Client Details Table -->
            <table style="width: 100%; margin-bottom: 30px; border-collapse: collapse;">
                <tr>
                    <td style="width: 50%; vertical-align: top; padding-right: 20px;">
                        <h3 style="color: #1B5E20; margin-bottom: 10px;">ROSANATECH DETAILS</h3>
                        <p style="margin: 5px 0;"><strong>Registration No:</strong> PVT-RQ132AMY</p>
                        <p style="margin: 5px 0;"><strong>VAT No:</strong> N/A</p>
                        <p style="margin: 5px 0;"><strong>Contact:</strong> 0114060735/705059964</p>
                    </td>
                    <td style="width: 50%; vertical-align: top; padding-left: 20px; border-left: 1px solid #ddd;">
                        <h3 style="color: #1B5E20; margin-bottom: 10px;">CLIENT DETAILS</h3>
                        <p style="margin: 5px 0;"><strong>Client:</strong> ${clientInfo.name}</p>
                        <p style="margin: 5px 0;"><strong>Project Site:</strong> ${clientInfo.location}</p>
                        <p style="margin: 5px 0;"><strong>Contact:</strong> ${clientInfo.phone}</p>
                        <p style="margin: 5px 0;"><strong>Email:</strong> ${clientInfo.email}</p>
                    </td>
                </tr>
            </table>
            
            <!-- Document Control -->
            <div style="margin-bottom: 30px;">
                <h3 style="color: #1B5E20; margin-bottom: 10px;">1. Document Control</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Quotation Serial ID:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${quoteId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date of Issue:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Validity Period:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">This quote is valid for 30 days from the date of issue.</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Prepared by:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">Rosanatech Solutions Ltd</td>
                    </tr>
                </table>
            </div>
            
            <!-- Project Scope -->
            <div style="margin-bottom: 30px;">
                <h3 style="color: #1B5E20; margin-bottom: 10px;">2. Project Scope</h3>
                <p style="line-height: 1.6;">
                    This quotation covers the supply, delivery, and installation of a complete ${systemSpecs.inverterKva} kW Solar Photovoltaic (PV) Hybrid System, 
                    designed to provide reliable, backup power for the client's premises based on their load audit requirements.
                    <br><br>
                    <strong>System Specifications:</strong>
                    • Solar Panels: ${systemSpecs.panelQuantity} × ${systemSpecs.panelWatts}W = ${systemSpecs.panelTotalWatts.toFixed(2)} kW<br>
                    • Inverter: ${systemSpecs.inverterKva} kVA Hybrid<br>
                    • Battery: ${systemSpecs.batteryKwh.toFixed(2)} kWh Lithium (${systemSpecs.batteryBrand})<br>
                    • Estimated Daily Production: ${(systemSpecs.panelTotalWatts * 5.5 * 0.79).toFixed(2)} kWh
                </p>
            </div>
            
            <!-- Bill of Quantities -->
            <div style="margin-bottom: 30px;">
                <h3 style="color: #1B5E20; margin-bottom: 10px;">3. Bill of Quantities</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                    <thead>
                        <tr style="background-color: #1B5E20; color: white;">
                            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Item No.</th>
                            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Description of Material</th>
                            <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Unit</th>
                            <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Quantity</th>
                            <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Unit Price</th>
                            <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map(item => `
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.itemNo}</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${item.description}</td>
                                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.unit}</td>
                                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.unitPrice.toLocaleString()}</td>
                                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.total.toLocaleString()}</td>
                            </tr>
                        `).join('')}
                        
                        <!-- Summary Rows -->
                        <tr style="background-color: #f8f9fa;">
                            <td colspan="5" style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">SUB-TOTAL 1 (Excluding Battery Cost)</td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">${summary.subtotal1.toLocaleString()}</td>
                        </tr>
                        <tr style="background-color: #f8f9fa;">
                            <td colspan="5" style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">TOTAL Material Cost</td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">${summary.totalMaterialCost.toLocaleString()}</td>
                        </tr>
                        <tr style="background-color: #f8f9fa;">
                            <td colspan="5" style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">System Engineering, Installation & Commissioning (33% of SUB-TOTAL 1)</td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">${summary.installation.toLocaleString()}</td>
                        </tr>
                        <tr style="background-color: #f8f9fa;">
                            <td colspan="5" style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">Miscellaneous (5% of SUB-TOTAL 1)</td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">${summary.miscellaneous.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- Total Summary -->
            <div style="margin-bottom: 30px;">
                <h3 style="color: #1B5E20; margin-bottom: 10px;">Total Summary</h3>
                <table style="width: 300px; margin-left: auto; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Item</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>Amount (KES)</strong></td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">Subtotal</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${summary.subtotal.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">Special Offer (10%)</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${summary.discount.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">VAT (16%)</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">0.00</td>
                    </tr>
                    <tr style="background-color: #1B5E20; color: white;">
                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Total Payable</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-weight: bold;">${summary.totalPayable.toLocaleString()}</td>
                    </tr>
                </table>
            </div>
            
            <!-- Legal Terms -->
            <div style="margin-bottom: 30px; page-break-inside: avoid;">
                <h3 style="color: #1B5E20; margin-bottom: 10px;">Legal & Transactional Terms Summary</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 30%; padding: 10px; border: 1px solid #ddd; vertical-align: top; background-color: #f8f9fa;">
                            <strong>Payment Terms</strong>
                        </td>
                        <td style="padding: 10px; border: 1px solid #ddd;">
                            Full payment for all materials required upfront. The outstanding balance is due upon commissioning and testing of the work.
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; vertical-align: top; background-color: #f8f9fa;">
                            <strong>Warranty</strong>
                        </td>
                        <td style="padding: 10px; border: 1px solid #ddd;">
                            12-month Workmanship Warranty. Product is covered by the manufacturer's warranty only.
                        </td>
                    </tr>
                </table>
            </div>
            
            <!-- Client Acceptance -->
            <div style="margin-top: 50px; page-break-inside: avoid;">
                <p style="margin-bottom: 20px;">
                    <strong>Client Acceptance:</strong><br>
                    A signed copy of this document is mandatory and must be sent back to Rosanatech Solutions Ltd to confirm acceptance, 
                    commence work, and trigger the first invoice. The client should retain one fully signed copy of this document for their records.
                </p>
                
                <table style="width: 100%; margin-top: 50px;">
                    <tr>
                        <td style="width: 50%; padding-right: 40px;">
                            <h4 style="color: #1B5E20; margin-bottom: 20px;">Client Acceptance</h4>
                            <p style="border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 30px;">Client Name: ${clientInfo.name}</p>
                            <p style="border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 30px;">Date: ____________________</p>
                            <p style="border-bottom: 1px solid #000; padding-bottom: 5px;">Authorized Signature: ____________________</p>
                        </td>
                        <td style="width: 50%; padding-left: 40px;">
                            <h4 style="color: #1B5E20; margin-bottom: 20px;">Rosanatech Solutions Ltd Authorization</h4>
                            <p style="border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 30px;">Name: ____________________</p>
                            <p style="border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 30px;">Date: ____________________</p>
                            <p style="border-bottom: 1px solid #000; padding-bottom: 5px;">Authorized Signature: ____________________</p>
                        </td>
                    </tr>
                </table>
            </div>
            
            <!-- Footer -->
            <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #666; font-size: 10px;">
                <p>Electrical | Solar | Smart Systems – info@rosanatechsolutions.co.ke</p>
                <p>This estimate generated by Rosanatech Smart-Sizer on ${today.toLocaleString()}</p>
                <p>Quote ID: ${quoteId} | Reference: ${clientInfo.phone}</p>
                <p><strong>DISCLAIMER:</strong> This is a SYSTEM-GENERATED PRELIMINARY ESTIMATE. For accurate proposal, contact Rosanatech for site survey.</p>
            </div>
        </div>
    `;
    
    document.getElementById('pdf-content').innerHTML = pdfHTML;
}

function generatePDF() {
    // Create a print-friendly version
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <html>
        <head>
            <title>Rosanatech Quote ${currentQuoteId}</title>
            <style>
                @media print {
                    @page {
                        size: A4;
                        margin: 15mm;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 12px;
                        line-height: 1.4;
                    }
                    table {
                        width: 100%;
                        font-size: 10px;
                        border-collapse: collapse;
                    }
                    th, td {
                        padding: 5px;
                        border: 1px solid #ddd;
                    }
                    .page-break {
                        page-break-before: always;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
                @media screen {
                    body {
                        padding: 20px;
                        font-family: Arial, sans-serif;
                    }
                }
            </style>
        </head>
        <body>
            ${document.getElementById('pdf-content').innerHTML}
            <script>
                window.onload = function() {
                    window.print();
                }
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// 13. CONTACT FUNCTIONS
function openWhatsApp() {
    const phone = document.getElementById('phone').value || '';
    const name = document.getElementById('name').value || '';
    
    const message = `Hello Rosanatech! I received quote ${currentQuoteId} and would like to discuss it.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "254114060735";
    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
}

// 14. STORAGE FUNCTIONS
function storeQuoteLocally(quoteId, clientInfo) {
    const quoteData = {
        quoteId: quoteId,
        clientInfo: clientInfo,
        loadProfile: loadProfileData,
        systemSpecs: systemSpecs,
        timestamp: new Date().toISOString()
    };
    
    // Get existing quotes
    const existingQuotes = JSON.parse(localStorage.getItem('rosa_quotes') || '[]');
    existingQuotes.push(quoteData);
    
    // Keep only last 100 quotes
    if (existingQuotes.length > 100) {
        existingQuotes.splice(0, existingQuotes.length - 100);
    }
    
    localStorage.setItem('rosa_quotes', JSON.stringify(existingQuotes));
    
    console.log('Quote stored locally:', quoteId);
    console.log('Total quotes in storage:', existingQuotes.length);
}

// Initialize
window.onload = initializeApp;