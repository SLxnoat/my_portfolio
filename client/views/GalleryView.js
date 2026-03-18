/**
 * GalleryView — Renders the gallery grid and lightbox modal.
 */
import { escapeHTML } from '../../core/utils.js';

export class GalleryView {
    /**
     * @param {GalleryItem[]} items
     */
    render(items) {
        const grid = document.getElementById('gallery-grid');
        if (!grid) return;

        grid.innerHTML = items.map(item => `
            <div class="gallery-item reveal" data-id="${escapeHTML(item.id)}" data-src="${escapeHTML(item.imageSrc)}" data-title="${escapeHTML(item.title)}" data-desc="${escapeHTML(item.description)}">
                <div class="gallery-card" style="background-image:url('${escapeHTML(item.imageSrc)}');">
                    <div class="gallery-overlay">
                        <i class="fas fa-expand"></i>
                        <h3>${escapeHTML(item.title)}</h3>
                        <p>${escapeHTML(item.description)}</p>
                    </div>
                </div>
            </div>`).join('');
    }

    openModal(src, title, desc) {
        const modal   = document.getElementById('gallery-modal');
        const img     = document.getElementById('modal-img');
        const caption = document.getElementById('modal-caption');
        if (!modal) return;

        img.src = src;
        caption.innerHTML = `<h3>${escapeHTML(title)}</h3><p>${escapeHTML(desc)}</p>`;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('gallery-modal');
        if (modal) modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}
