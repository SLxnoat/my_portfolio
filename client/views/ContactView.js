/**
 * ContactView — Renders contact info and provides toast notification.
 * Reuses the static #toast element from index.html (no duplicate creation).
 */
export class ContactView {
    /**
     * @param {Profile} profile
     */
    renderContactInfo(profile) {
        const emailEl = document.getElementById('contact-email');
        const phoneEl = document.getElementById('contact-phone');
        const locEl   = document.getElementById('contact-location');

        if (emailEl) emailEl.textContent = profile.email;
        if (phoneEl) phoneEl.textContent = profile.phone;
        if (locEl)   locEl.textContent   = profile.location;

        // Wire all [data-social] anchors from profile socials
        document.querySelectorAll('[data-social]').forEach(el => {
            const key = el.dataset.social;
            if (profile.socials[key]) {
                el.href = profile.socials[key];
            }
        });
    }

    /**
     * Show a toast notification using the existing #toast element.
     * @param {string} message
     * @param {'success'|'error'} type
     */
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;

        toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
        toast.className = `toast-${type} show`;

        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => { toast.className = ''; toast.innerHTML = ''; }, 450);
        }, 3800);
    }
}
