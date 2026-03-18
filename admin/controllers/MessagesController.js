/**
 * MessagesController — View, mark-read, and delete contact messages.
 */
import { Database } from '../../core/db.js';
import { Message } from '../../core/models/Message.js';

export class MessagesController {
    #db;

    constructor() {
        this.#db = Database.getInstance();
    }

    async render(container) {
        const raw = await this.#db.getAll('messages');
        const messages = raw.map(r => Message.fromPlainObject(r)).reverse(); // newest first

        this.#updateUnreadBadge(messages);

        if (!messages.length) {
            container.innerHTML = '<p class="empty-state"><i class="fas fa-inbox"></i> No messages yet.</p>';
            return;
        }

        container.innerHTML = `
        <div class="message-list">
            ${messages.map(m => `
            <div class="message-card ${m.read ? 'read' : 'unread'}" data-id="${m.id}">
                <div class="message-avatar"><i class="fas fa-user"></i></div>
                <div class="message-body">
                    <div class="message-meta">
                        <strong>${m.name}</strong>
                        <span class="msg-email">${m.email}</span>
                        <span class="msg-time">${this.#formatDate(m.timestamp)}</span>
                        ${!m.read ? '<span class="unread-dot"></span>' : ''}
                    </div>
                    <div class="message-subject">${m.subject || '(No subject)'}</div>
                    <div class="message-text">${m.body}</div>
                </div>
                <div class="data-card-actions">
                    ${!m.read ? `<button class="icon-btn read-btn" data-id="${m.id}" title="Mark as read"><i class="fas fa-envelope-open"></i></button>` : ''}
                    <button class="icon-btn delete-btn danger" data-id="${m.id}" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </div>`).join('')}
        </div>`;

        container.querySelectorAll('.read-btn').forEach(btn =>
            btn.addEventListener('click', async () => {
                const raw = await this.#db.get('messages', Number(btn.dataset.id));
                if (raw) { raw.read = true; await this.#db.put('messages', raw); }
                await this.render(container);
            })
        );
        container.querySelectorAll('.delete-btn').forEach(btn =>
            btn.addEventListener('click', async () => {
                if (!confirm('Delete this message?')) return;
                await this.#db.delete('messages', Number(btn.dataset.id));
                await this.render(container);
            })
        );
    }

    #updateUnreadBadge(messages) {
        const unread = messages.filter(m => !m.read).length;
        const badge = document.getElementById('unread-badge');
        if (badge) {
            badge.textContent = unread;
            badge.style.display = unread > 0 ? 'inline-flex' : 'none';
        }
        const statUnread = document.getElementById('stat-unread');
        if (statUnread) statUnread.textContent = unread;
    }

    #formatDate(iso) {
        if (!iso) return '';
        const d = new Date(iso);
        return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
}
