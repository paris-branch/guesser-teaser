const BIN_ID = '6a5f6653f5f4af5e29ac3b5c';
const API_KEY = '$2a$10$NktZXzV0wwiuFSZIaFhGnOJJZ2YCL1iv.w/fb28.PNaP4HA/iUfYy';
const BASE_URL = 'https://api.jsonbin.io/v3/b';

function setCookie(name, value, expires) {
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

function todayStr() {
    return new Date().toISOString().split('T')[0];
}

function midnight() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d;
}

class Tracker {
    constructor() {
        this.ip = null;
    }

    async getIp() {
        const resp = await fetch('https://api.ipify.org?format=json');
        const data = await resp.json();
        this.ip = data.ip;
    }

    async getRecord() {
        const resp = await fetch(`${BASE_URL}/${BIN_ID}`, {
            headers: { 'X-Access-Key': API_KEY }
        });
        const data = await resp.json();
        return data.record;
    }

    async saveRecord(record) {
        await fetch(`${BASE_URL}/${BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Key': API_KEY
            },
            body: JSON.stringify(record)
        });
    }

    async init() {
        try {
            const today = todayStr();
            if (getCookie('guesser_visited') === today) return;

            await this.getIp();
            const record = await this.getRecord();

            if (!record.visits) record.visits = {};
            if (!record.visits[this.ip]) record.visits[this.ip] = [];
            if (!record.visits[this.ip].includes(today)) {
                record.visits[this.ip].push(today);
            }

            await this.saveRecord(record);
            setCookie('guesser_visited', today, midnight());
        } catch (e) {
            console.warn('Visit tracking failed:', e);
        }
    }

    async trackSubmission(riddleNumber) {
        try {
            const key = `riddle-${riddleNumber}`;
            if (getCookie(`guesser_solved_${riddleNumber}`)) return;

            if (!this.ip) await this.getIp();
            const record = await this.getRecord();

            if (!record.submissions) record.submissions = {};
            if (!record.submissions[key]) record.submissions[key] = [];
            if (!record.submissions[key].includes(this.ip)) {
                record.submissions[key].push(this.ip);
            }

            await this.saveRecord(record);
            setCookie(`guesser_solved_${riddleNumber}`, '1', new Date('2030-01-01'));
        } catch (e) {
            console.warn('Submission tracking failed:', e);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.tracker = new Tracker();
    window.tracker.init();
});
