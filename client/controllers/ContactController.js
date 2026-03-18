/**
 * ContactController — Handles contact form submission and saves messages to DB.
 */
import { Database } from '../../core/db.js';
import { Message } from '../../core/models/Message.js';
import { Profile } from '../../core/models/Profile.js';
import { ContactView } from '../views/ContactView.js';

export class ContactController {
    #db;
    #view;

    constructor() {
        this.#db = Database.getInstance();
        this.#view = new ContactView();
    }

    async init() {
        const raw = await this.#db.get('profile', 'main');
        if (raw) {
            const profile = Profile.fromPlainObject(raw);
            this.#view.renderContactInfo(profile);
        }
        this.#bindForm();
    }

    #bindForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.textContent = 'Sending…';

            const msg = new Message({
                name:    form.querySelector('#msg-name').value.trim(),
                email:   form.querySelector('#msg-email').value.trim(),
                subject: form.querySelector('#msg-subject').value.trim(),
                body:    form.querySelector('#msg-body').value.trim(),
            });

            try {
                await this.#db.put('messages', msg.toPlainObject());
                form.reset();
                this.#view.showToast('✅ Message sent! I will get back to you soon.', 'success');
            } catch (err) {
                console.error(err);
                this.#view.showToast('❌ Failed to send message. Please try again.', 'error');
            } finally {
                btn.disabled = false;
                btn.textContent = 'Send Message';
            }
        });
    }
}
