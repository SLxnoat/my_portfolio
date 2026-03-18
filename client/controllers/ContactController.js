/**
 * ContactController — Handles contact form submission and saves messages to DB.
 */
import { Database }     from '../../core/db.js';
import { Message }      from '../../core/models/Message.js';
import { Profile }      from '../../core/models/Profile.js';
import { ContactView }  from '../views/ContactView.js';

export class ContactController {
    #db;
    #view;

    constructor() {
        this.#db   = Database.getInstance();
        this.#view = new ContactView();
    }

    async init() {
        const raw = await this.#db.get('profile', 'main');
        if (raw) {
            this.#view.renderContactInfo(Profile.fromPlainObject(raw));
        }
        this.#bindForm();
    }

    #bindForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');

            // Validate required fields
            const nameVal    = form.querySelector('#msg-name')?.value.trim();
            const emailVal   = form.querySelector('#msg-email')?.value.trim();
            const bodyVal    = form.querySelector('#msg-body')?.value.trim();

            if (!nameVal || !emailVal || !bodyVal) {
                this.#view.showToast('Please fill in all required fields.', 'error');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
                this.#view.showToast('Please enter a valid email address.', 'error');
                return;
            }

            // Loading state
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

            const msg = new Message({
                name:    nameVal,
                email:   emailVal,
                subject: form.querySelector('#msg-subject')?.value.trim() || '(No subject)',
                body:    bodyVal,
            });

            try {
                await this.#db.put('messages', msg.toPlainObject());
                form.reset();
                this.#view.showToast('✅ Message sent! I\'ll get back to you soon.', 'success');
            } catch (err) {
                console.error('Message save error:', err);
                this.#view.showToast('❌ Something went wrong. Please try again.', 'error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
            }
        });
    }
}
