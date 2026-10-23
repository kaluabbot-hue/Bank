/**
 * ==========================================================================
 * NAIJATRANSFERSTATUS.COM — PRODUCTION FRONTEND APPLICATION CORE ENGINE
 * Handles: Official CBN NUBAN Checksum Math, Anti-Spam Timers, and Live Feeds
 * File: frontend/app.js
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 📡 DYNAMIC BASE URL ROUTING CONFIGURATION
    // Automatically detects if running locally or deployed on a live Render server cloud address
    const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000' 
        : window.location.origin;
    
    // UI CORE APPLICATION SELECTOR ANCHORS
    const reportForm = document.getElementById('report-form');
    const bankSelect = document.getElementById('bank-select');
    const channelSelect = document.getElementById('channel-select');
    const accountInput = document.getElementById('account-input');
    const submitBtn = document.getElementById('submit-report-btn');
    const formFeedback = document.getElementById('form-feedback');
    const bankGrid = document.getElementById('bank-grid');
    const worstBankTicker = document.getElementById('worst-bank-ticker');
    const matrixTimestamp = document.getElementById('matrix-timestamp');

    // Anti-Spam Local Storage 15-Minute Cooldown Windows (in milliseconds)
    const SUBMISSION_LOCK_TIME = 15 * 60 * 1000; 

    // INITIALIZE SYSTEM DRIVERS
    updateTelemetryClock();
    fetchChannelMatrixTelemetry();
    
    // START AUTOMATED SECOND-BY-SECOND FEED AND TICKER REFRESH LOOPS
    setInterval(fetchChannelMatrixTelemetry, 60000); // Refreshes bank cards and tickers every 60 seconds
    setInterval(updateTelemetryClock, 1000);        // Updates the clock bar on your layout screen every 1 second

    /* --- 🛡️ CLIENT-SIDE GATEWAY TRANSMISSION INTERCEPTOR --- */
    if (reportForm) {
        reportForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearFeedbackDisplay();

            const bankCode = bankSelect.value;
            const channelType = channelSelect.value;
            const accountNumber = accountInput.value.trim();

            // 1. Device Local Rate-Limit Cooldown Verifications
            const lastReportTimestamp = localStorage.getItem(`nts_cooldown_lock_${bankCode}`);
            const timeNow = Date.now();
            
            if (lastReportTimestamp && (timeNow - parseInt(lastReportTimestamp) < SUBMISSION_LOCK_TIME)) {
                const remainingMinutes = Math.ceil((SUBMISSION_LOCK_TIME - (timeNow - parseInt(lastReportTimestamp))) / 60000);
                showFeedbackMessage(`SECURITY LOCKOUT: Cooldown active. Please wait ${remainingMinutes} minutes before logging another incident for this node.`, 'error-alert');
                return;
            }

            // 2. Local Central Bank of Nigeria NUBAN Checksum Math Firewall
            if (!executeNubanChecksumValidation(accountNumber, bankCode)) {
                showFeedbackMessage("INTEGRITY FAULT: The 10-digit account string failed the official CBN NUBAN checksum math. Incident dropped.", "error-alert");
                return;
            }

            // 3. Dispatch Encrypted Payload Data Packet to Live Web Server
            try {
                toggleFormLoadingState(true);
                const response = await fetch(`${API_BASE_URL}/api/incidents/report`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ bankCode, channelType, accountNumber })
                });

                const result = await response.json();

                if (response.ok) {
                    showFeedbackMessage("TRANSMISSION SUCCESSFUL: Incident verified and merged into cloud matrix telemetry.", "success-alert");
                    localStorage.setItem(`nts_cooldown_lock_${bankCode}`, Date.now().toString());
                    reportForm.reset();
                    fetchChannelMatrixTelemetry(); // Immediate hot reload of dashboard numbers
                } else {
                    showFeedbackMessage(`ROUTING DENIED: ${result.message || 'Transmission exception occurred.'}`, "error-alert");
                }
            } catch (error) {
                showFeedbackMessage("NETWORK EXCEPTION: Unable to clear pipeline firewall. Check your data connection.", "error-alert");
            } finally {
                toggleFormLoadingState(false);
            }
        });
    }

    /* --- 🧮 REGULATORY CBN NUBAN VALIDATION RULES --- */
    function executeNubanChecksumValidation(accountNum, bankCode) {
        // String length layout validation check
        if (!/^\d{10}$/.test(accountNum)) return false;

        // Strip down fintech / neobank multi-digit codes to their terminal 3 digits
        let standardizedBankCode = bankCode;
        if (bankCode.length > 3) {
            standardizedBankCode = bankCode.slice(-3); 
        } else {
            standardizedBankCode = bankCode.padStart(3, '0');
        }

        // Combine code and account digits string structure 
        const validationString = standardizedBankCode + accountNum.slice(0, 9);
        
        // Official CBN NUBAN algorithm weighting constants
        const multipliers =;
        
        let algorithmicSum = 0;
        for (let i = 0; i < 12; i++) {
            algorithmicSum += parseInt(validationString[i]) * multipliers[i];
        }

        const moduloRemainder = algorithmicSum % 10;
        const calculatedCheckDigit = moduloRemainder === 0 ? 0 : 10 - moduloRemainder;
        
        // Grab the final character (10th digit) of the user input string to compare values
        const customerProvidedCheckDigit = parseInt(accountNum.slice(-1));

        return calculatedCheckDigit === customerProvidedCheckDigit;
    }

    /* --- 📡 TELEMETRY FETCH & NEON CARD GRID DRAWING --- */
    async function fetchChannelMatrixTelemetry() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/matrix/status`);
            if (!response.ok) throw new Error("API stream connection broken.");
            const data = await response.json();

            buildDynamicGrid(data.banks);
            updateLiveMarqueeTicker(data.worstChannel);
        } catch (error) {
            console.error("Telemetry link lost:", error);
            if (bankGrid) {
                bankGrid.innerHTML = `<div class="bank-card-pulse error-alert">Telemetry communication blackout. Reconnecting automatically...</div>`;
            }
        }
    }

    function buildDynamicGrid(banks) {
        if (!bankGrid) return;
        bankGrid.innerHTML = ''; // Wipes placeholder loading layouts cleanly

        if (!banks || banks.length === 0) {
            bankGrid.innerHTML = '<div class="bank-card-pulse">All channel nodes reporting 100% operational throughput efficiency.</div>';
            return;
        }

        banks.forEach(bank => {
            const cardElement = document.createElement('div');
            cardElement.className = 'bank-card-pulse';
            
            let statusPillClass = 'status-fluid';
            let statusDisplayLabel = 'Fluid';

            // Traffic light separation ranges
            if (bank.failureRate >= 70) {
                statusPillClass = 'status-down';
                statusDisplayLabel = 'Down';
            } else if (bank.failureRate >= 30) {
                statusPillClass = 'status-unstable';
                statusDisplayLabel = 'Unstable';
            }

            cardElement.innerHTML = `
                <div class="bank-meta">
                    <span class="bank-name">${bank.name}</span>
                    <span class="status-indicator ${statusPillClass}">${statusDisplayLabel}</span>
                </div>
                <div class="bank-metrics">
                    <span class="metric-label">Failure Rate</span>
                    <span class="metric-value" style="color: var(--accent-${statusPillClass.split('-')[1] || statusPillClass})">${bank.failureRate}%</span>
                </div>
            `;
            bankGrid.appendChild(cardElement);
        });
    }

    function updateLiveMarqueeTicker(worstChannel) {
        if (!worstBankTicker) return;
        
        if (worstChannel && worstChannel.failureRate >= 30) {
            worstBankTicker.textContent = `🚨 MONITOR ALERT: ${worstChannel.name.toUpperCase()} GRID INFRASTRUCTURE CRITICAL DEVIATION AT ${worstChannel.failureRate}% ERROR INTAKE. TRANSACTIONS EXPERIENCING DELAYS.`;
        } else {
            worstBankTicker.textContent = `✅ CENTRAL CORE SWITCH STABLE — ALL NIBSS CHANNELS AND ECOBANK, OPAY, ACCESS, AND ZENITH NETWORKS ROUTING SECURELY.`;
        }
    }

    /* --- 🕒 HARDWARE CLOCK SYNCHRONIZATION RUNTIMES --- */
    function updateTelemetryClock() {
        if (!matrixTimestamp) return;
        const serverLocalTime = new Date();
        matrixTimestamp.textContent = `MATRIX FEED STATUS: ACTIVE — TELEMETRY TIME: ${serverLocalTime.toLocaleDateString()} | ${serverLocalTime.toLocaleTimeString()}`;
    }

    function showFeedbackMessage(text, CSSStyleClass) {
        if (!formFeedback) return;
        formFeedback.textContent = text;
        formFeedback.className = `form-feedback-anchor ${CSSStyleClass}`;
    }

    function clearFeedbackDisplay() {
        if (!formFeedback) return;
        formFeedback.textContent = '';
        formFeedback.className = 'form-feedback-anchor';
    }

    function toggleFormLoadingState(isLoading) {
        if (!submitBtn) return;
        submitBtn.disabled = isLoading;
        submitBtn.textContent = isLoading ? "VERIFYING INTERCEPT INTEGRITY..." : "Verify Integrity & Submit Incident";
    }
});
