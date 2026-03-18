/**
 * AuthController — Handles admin login form and session guard.
 * Used on login.html page.
 */
import { Database } from '../../core/db.js';
import { seedDatabase } from '../../core/seed.js';
import { hashPassword } from '../../core/utils.js';

class AuthController {
    #db;

    constructor() {
        this.#db = Database.getInstance();
    }

    async init() {
        // If already logged in, redirect to dashboard
        if (sessionStorage.getItem('admin_auth')) {
            window.location.replace('index.html');
            return;
        }

        await this.#db.open();
        await seedDatabase();

        // Safety net: always guarantee an auth record exists
        const existing = await this.#db.get('auth', 'admin');
        if (!existing) {
            const defaultHash = await hashPassword('admin123');
            await this.#db.put('auth', { id: 'admin', username: 'admin', password: defaultHash });
        }

        this.#bindForm();
        this.#bindPasswordToggle();
    }

    #bindForm() {
        const form     = document.getElementById('login-form');
        const errorBox = document.getElementById('login-error');
        const errorTxt = document.getElementById('login-error-text');
        const submitBtn = document.getElementById('login-submit');

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorBox.style.display = 'none';
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Signing in…</span> <i class="fas fa-spinner fa-spin"></i>';

            const username = document.getElementById('login-user').value.trim();
            const password = document.getElementById('login-pass').value.trim();

            try {
                const record = await this.#db.get('auth', 'admin');
                const hashedPassword = await hashPassword(password);
                if (record && record.username === username && record.password === hashedPassword) {
                    sessionStorage.setItem('admin_auth', '1');
                    sessionStorage.setItem('admin_user', username);
                    window.location.replace('index.html');
                } else {
                    errorTxt.textContent = 'Invalid username or password.';
                    errorBox.style.display = 'flex';
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>Sign In</span> <i class="fas fa-arrow-right"></i>';
                }
            } catch (err) {
                console.error(err);
                errorTxt.textContent = 'An error occurred. Please try again.';
                errorBox.style.display = 'flex';
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Sign In</span> <i class="fas fa-arrow-right"></i>';
            }
        });
    }

    #bindPasswordToggle() {
        const toggleBtn = document.getElementById('toggle-pass');
        const passInput = document.getElementById('login-pass');
        toggleBtn?.addEventListener('click', () => {
            const isVisible = passInput.type === 'text';
            passInput.type = isVisible ? 'password' : 'text';
            toggleBtn.querySelector('i').className = `fas fa-eye${isVisible ? '' : '-slash'}`;
        });
    }
}

// Boot
const auth = new AuthController();
window.addEventListener('DOMContentLoaded', () => auth.init().catch(console.error));
