/**
 * ==========================================================================
 * NAIJATRANSFERSTATUS.COM — PRODUCTION BACKEND SERVER ENGINE
 * Core: Node.js + Express (High-Speed In-Memory Telemetry Architecture)
 * File: backend/server.js
 * ==========================================================================
 */

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path'); // Core module injected to resolve folder paths safely on Render

const app = express();
// Server runs on Port 5000 by default or uses cloud environment settings
const PORT = process.env.PORT || 5000;

// Apply Global Security Interceptors & Body Parsing Modules
app.use(cors());
app.use(express.json());

/* --- 🌐 STATIC FILE ROUTING ENGINE MIDDLEWARE --- */
// ✅ POINTS UP ONE DIRECTORY LEVEL: Serves files from your root frontend directory layout
app.use(express.static(path.join(__dirname, '..')));

/* --- 🗄️ LIVE IN-MEMORY TELEMETRY DATA MATRIX --- */
const bankNodes = {
    "044": { name: "Access Bank", baseFail: 5, reports: 0 },
    "014": { name: "Afribank", baseFail: 2, reports: 0 },
    "063": { name: "Diamond Bank", baseFail: 1, reports: 0 },
    "050": { name: "Ecobank Nigeria", baseFail: 8, reports: 0 },
    "084": { name: "Enterprise Bank", baseFail: 0, reports: 0 },
    "070": { name: "Fidelity Bank", baseFail: 4, reports: 0 },
    "011": { name: "First Bank of Nigeria (FBN)", baseFail: 12, reports: 0 },
    "214": { name: "First City Monument Bank (FCMB)", baseFail: 6, reports: 0 },
    "058": { name: "Guaranty Trust Bank (GTBank)", baseFail: 15, reports: 0 },
    "030": { name: "Heritage Bank", baseFail: 4, reports: 0 },
    "082": { name: "Keystone Bank", baseFail: 3, reports: 0 },
    "085": { name: "Mainstreet Bank", baseFail: 0, reports: 0 },
    "076": { name: "Skye Bank", baseFail: 1, reports: 0 },
    "221": { name: "Stanbic IBTC Bank", baseFail: 3, reports: 0 },
    "068": { name: "Standard Chartered Bank", baseFail: 2, reports: 0 },
    "232": { name: "Sterling Bank", baseFail: 7, reports: 0 },
    "032": { name: "Union Bank of Nigeria", baseFail: 5, reports: 0 },
    "033": { name: "United Bank for Africa (UBA)", baseFail: 10, reports: 0 },
    "215": { name: "Unity Bank", baseFail: 4, reports: 0 },
    "035": { name: "Wema Bank", baseFail: 9, reports: 0 },
    "057": { name: "Zenith Bank", baseFail: 14, reports: 0 },
    // Neo-Banks & Fintech Channels
    "999992": { name: "OPay", baseFail: 3, reports: 0 },
    "999991": { name: "PalmPay", baseFail: 2, reports: 0 },
    "50457": { name: "Moniepoint Microfinance Bank", baseFail: 2, reports: 0 },
    "100004": { name: "Kuda Bank", baseFail: 5, reports: 0 },
    "50211": { name: "VFD Microfinance Bank (Vbank)", baseFail: 4, reports: 0 },
    "100010": { name: "Carbon", baseFail: 6, reports: 0 },
    "50514": { name: "FairMoney Microfinance Bank", baseFail: 4, reports: 0 }
};

// Security Tracking Tables & Premium Merchant Registration Records
const IP_RATE_LIMITER = {};
const PREMIUM_MERCHANTS = {}; 

/* --- 🔄 NIBSS NETWORK SWEEP DEVIATION SIMULATOR --- */
// Simulates fluctuations in the base NIBSS switch stability matrix every 3 minutes
setInterval(() => {
    Object.keys(bankNodes).forEach(code => {
        // Shift base variance randomly between -3% and +3%
        const change = Math.floor(Math.random() * 7) - 3; 
        bankNodes[code].baseFail = Math.max(1, Math.min(95, bankNodes[code].baseFail + change));
        
        // Clean up old crowd reports slowly over time cycles to recover stability baseline
        if (bankNodes[code].reports > 0) {
            bankNodes[code].reports = Math.max(0, bankNodes[code].reports - 1);
        }
    });
    console.log("Telemetry System: Baseline network synchronization loop executed.");
}, 180000);

/* --- 📡 API ROUTE 1: FETCH DYNAMIC GRID REAL-TIME DATA --- */
app.get('/api/matrix/status', (req, res) => {
    const sortedBanks = Object.keys(bankNodes).map(code => {
        // Every crowdsourced verified incident report inflates failure rate calculation by 8%
        const computedFailure = Math.min(100, bankNodes[code].baseFail + (bankNodes[code].reports * 8));
        return {
            code,
            name: bankNodes[code].name,
            failureRate: computedFailure
        };
    }).sort((a, b) => b.failureRate - a.failureRate); // Broken networks flow to the top instantly

    // ✅ FIXED: worstChannel now properly passes a single object element to prevent crashing your frontend
    res.json({
        banks: sortedBanks,
        worstChannel: sortedBanks[0]
    });
});

/* --- 📥 API ROUTE 2: INCOMING TRANSACTION FAILURE REGISTRY INTERCEPTOR --- */
app.post('/api/incidents/report', (req, res) => {
    const { bankCode, channelType, accountNumber } = req.body;
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Strict Request Boundary Checks
    if (!bankNodes[bankCode] || !channelType || !/^\d{10}$/.test(accountNumber)) {
        return res.status(400).json({ success: false, message: "DATA INTRUSION: Malformed transmission envelope received." });
    }

    // IP Fingerprint Anti-Bot Spam Interceptor Gate
    const now = Date.now();
    if (IP_RATE_LIMITER[clientIp] && (now - IP_RATE_LIMITER[clientIp] < 60000)) { // 1 report maximum per 60 seconds per IP address
        return res.status(429).json({ success: false, message: "RATE LIMIT REACHED: Security firewalls active." });
    }
    
    // Log entry timestamp windows
    IP_RATE_LIMITER[clientIp] = now;

    // Record verified database entry
    bankNodes[bankCode].reports += 1;
    
    // Evaluate if network surge breaches Tier 2 merchant alarm thresholds
    checkAndTriggerPremiumAlerts(bankCode, channelType);

    res.json({ success: true, message: "Incident logged into telemetry grid metrics successfully." });
});

/* --- 💳 PAYSTACK SECURE WEBHOOK HARVESTER (TIER 2 PROVISIONING ENGINE) --- */
app.post('/api/billing/paystack-webhook', (req, res) => {
    const paystackSignature = req.headers['x-paystack-signature'];
    // In production, keep your Paystack Secret Key inside your server environment settings
    const secret = process.env.PAYSTACK_SECRET_KEY || 'YOUR_PAYSTACK_SECRET_KEY';
    
    // Compute safe HMAC SHA512 signature validation hash string
    const hash = crypto.createHmac('sha512', secret)
                       .update(JSON.stringify(req.body))
                       .digest('hex');

    if (hash !== paystackSignature) {
        return res.status(401).send('SECURITY EXCEPTION: UNAUTHORIZED HEADER SIGNATURE');
    }

    const event = req.body;
    
    // Catch active successful subscription processing events
    if (event.event === 'subscription.create' || event.event === 'charge.success') {
        const customerEmail = event.data.customer.email;
        // Collect custom properties sent over during checkout payment registration loops
        const metadata = event.data.metadata || {};
        const merchantWhatsApp = metadata.whatsapp_phone || "08000000000";

        // Provision premium storage access for 30 calendar days down to the millisecond
        PREMIUM_MERCHANTS[customerEmail] = {
            whatsapp: merchantWhatsApp,
            expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // Adds exactly 30 days time values
        };
        
        console.log(`PREMIUM ENGINE: Successfully provisioned 30 days of WhatsApp routing alerts for account: ${customerEmail}`);
    }

    res.status(200).send('EVENT_SUCCESSFULLY_PROCESSED');
});

/* --- 📞 TIER 2 AUTOMATED TELEPHONY WEBHOOK DISTRIBUTOR --- */
function checkAndTriggerPremiumAlerts(bankCode, channelType) {
    const bank = bankNodes[bankCode];
    const computedFailure = Math.min(100, bank.baseFail + (bank.reports * 8));

    // Alert fires if network stability drops below 30% (Failure rate reaches or exceeds 70%)
    if (computedFailure >= 70) {
        Object.keys(PREMIUM_MERCHANTS).forEach(email => {
            const merchant = PREMIUM_MERCHANTS[email];
            
            // Check if user calendar window is active or expired
            if (Date.now() > merchant.expiresAt) {
                delete PREMIUM_MERCHANTS[email]; // Clear expired entries automatically from RAM tables
                return;
            }

            // In production, connect this to a WhatsApp Business API Gateway (like Twilio, Vonage, or Chat-API)
            console.log(`[⚡ TIER 2 WHATSAPP ALARM OUTBOUND]`);
            console.log(`PUSH DESTINATION: ${merchant.whatsapp}`);
            console.log(`MESSAGE PACKET: Warning! The network stability of ${bank.name.toUpperCase()} has dropped below 30% on the ${channelType.toUpperCase()} layer. Inform your cashiers to avoid this channel immediately.`);
            console.log(`ALTERNATIVE CHANNEL ROUTING ADVISED: Direct checkouts to safe alternative channels.`);
            console.log(`----------------------------------------------------------------------`);
        });
    }
}

/* --- 🌐 FALLBACK WILDCARD PAGE ROUTER --- */
// Catches all other requests and maps them straight back to your base layout page
app.get('*', (req, res) => {
    // Points up one directory level to locate your index.html file safely
    res.sendFile(path.join(__dirname, '../index.html'));
});

/* --- 🚀 BOOT PRODUCTION INTERNET ENGINE --- */
app.listen(PORT, () => {
    console.log(`====================================================================`);
    console.log(`  NAIJA TRANSFER STATUS — SERVER RUNTIME NETWORK STABILITY STANDBY`);
    console.log(`  CORE NODE LIVE, INTERCEPT FIREWALLS ACTIVE ON LOGICAL PORT: ${PORT}`);
    console.log(`====================================================================`);
});
