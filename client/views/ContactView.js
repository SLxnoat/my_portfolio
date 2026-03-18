/**
 * ContactView — Renders contact info and provides toast notification.
 */
export class ContactView {
    /**
     * @param {Profile} profile
     */
    renderContactInfo(profile) {
        const emailEl = document.getElementById('contact-email');
        const phoneEl = document.getElementById('contact-phone');
        const locEl   = document.getElementById('contact-location');
        const socials = document.querySelectorAll('[data-social]');

        if (emailEl) emailEl.textContent = profile.email;
        if (phoneEl) phoneEl.textContent = profile.phone;
        if (locEl) locEl.textContent = profile.location;

        socials.forEach(el => {
            const key = el.dataset.social;
            if (profile.socials[key]) el.href = profile.socials[key];
        });
    }

    showToast(message, type = 'success') {
        const existing = document.getElementById('toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }
}
