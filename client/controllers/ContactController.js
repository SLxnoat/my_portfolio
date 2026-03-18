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
    #adminEmail = '';

    constructor() {
        this.#db   = Database.getInstance();
        this.#view = new ContactView();
    }

    async init() {
        const raw = await this.#db.get('profile', 'main');
        if (raw) {
            const profile = Profile.fromPlainObject(raw);
            this.#view.renderContactInfo(profile);
            this.#adminEmail = profile.notificationEmail || profile.email;
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
                // Save locally to IndexedDB Admin Panel
                await this.#db.put('messages', msg.toPlainObject());

                // Dispatch via FormSubmit if admin email is configured
                if (this.#adminEmail) {
                    try {
                        await fetch(`https://formsubmit.co/ajax/${this.#adminEmail}`, {
                            method: "POST",
                            headers: { 
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify({
                                name: msg.name,
                                email: msg.email,
                                subject: msg.subject,
                                message: msg.body,
                                _template: "box",
                                _subject: `New Portfolio Message from ${msg.name}`
                            })
                        });
                    } catch (fetchErr) {
                        console.warn("FormSubmit fetch failed, but saved locally:", fetchErr);
                    }
                }

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
