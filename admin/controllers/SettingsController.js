/**
 * SettingsController — Manage admin authentication credentials.
 */
import { Database } from '../../core/db.js';
import { hashPassword } from '../../core/utils.js';

export class SettingsController {
    #db;

    constructor() {
        this.#db = Database.getInstance();
    }

    async render(container) {
        // Fetch current auth config to prefill username
        const auth = await this.#db.get('auth', 'admin');
        const currentUsername = auth ? auth.username : 'admin';

        container.innerHTML = `
        <div class="data-grid" style="grid-template-columns: 1fr; max-width: 600px;">
            <div class="data-card" style="flex-direction: column; align-items: stretch; padding: 28px;">
                <div class="avatar-info" style="margin-bottom: 24px;">
                    <h3 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; margin-bottom: 6px;">Authentication Settings</h3>
                    <p style="font-size: .85rem; color: var(--text-muted); line-height: 1.5;">Change your dashboard login credentials. You must provide your current password to save changes.</p>
                </div>
                
                <form id="settings-form" class="admin-form">
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label>Admin Username</label>
                        <input type="text" name="username" value="${currentUsername}" required>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label>Current Password <span style="color: var(--danger)">*</span></label>
                        <input type="password" name="currentPassword" placeholder="Enter current password to authorize changes" required>
                    </div>

                    <div class="section-divider"><span>Change Password (Optional)</span></div>

                    <div class="form-group" style="margin-bottom: 16px;">
                        <label>New Password</label>
                        <input type="password" name="newPassword" placeholder="Leave blank to keep current password">
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 24px;">
                        <label>Confirm New Password</label>
                        <input type="password" name="confirmPassword" placeholder="Confirm new password">
                    </div>

                    <div id="settings-error" class="error-msg" style="display: none; margin-bottom: 20px;"></div>

                    <div class="form-actions" style="margin-top: 0;">
                        <button type="submit" class="btn primary-btn"><i class="fas fa-lock"></i> Update Credentials</button>
                    </div>
                </form>
            </div>
        </div>
        `;

        this.#bindSubmit(container, auth);
    }

    #bindSubmit(container, authRecord) {
        const form = container.querySelector('#settings-form');
        const errorBox = container.querySelector('#settings-error');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorBox.style.display = 'none';

            const fd = new FormData(form);
            const data = Object.fromEntries(fd.entries());

            // Verify current password
            const hashedCurrentPassword = await hashPassword(data.currentPassword);
            if (hashedCurrentPassword !== authRecord.password) {
                this.#showError(errorBox, 'Incorrect current password!');
                return;
            }

            // Check new password match if they are trying to change it
            let finalPassword = authRecord.password;
            if (data.newPassword) {
                if (data.newPassword !== data.confirmPassword) {
                    this.#showError(errorBox, 'New passwords do not match!');
                    return;
                }
                if (data.newPassword.length < 5) {
                    this.#showError(errorBox, 'New password must be at least 5 characters long.');
                    return;
                }
                finalPassword = await hashPassword(data.newPassword);
            }

            if (!data.username || data.username.trim() === '') {
                this.#showError(errorBox, 'Username cannot be empty.');
                return;
            }

            // Update auth record
            authRecord.username = data.username.trim();
            authRecord.password = finalPassword;

            await this.#db.put('auth', authRecord);
            
            // Clear passwords fields
            form.querySelector('input[name="currentPassword"]').value = '';
            form.querySelector('input[name="newPassword"]').value = '';
            form.querySelector('input[name="confirmPassword"]').value = '';

            this.#showSaveToast('Authentication settings updated!');
        });
    }

    #showError(box, msg) {
        box.textContent = msg;
        box.style.display = 'block';
        // Shake animation could go here, for now just show text
    }

    #showSaveToast(msg) {
        const t = document.createElement('div');
        t.className = 'save-toast';
        t.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
        document.body.appendChild(t);
        requestAnimationFrame(() => t.classList.add('show'));
        setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3000);
    }
}
