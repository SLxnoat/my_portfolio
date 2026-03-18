/**
 * Utility functions for security and formatting
 */

/**
 * Escapes a string to prevent XSS attacks when using innerHTML
 * @param {string} str - The string to escape
 * @returns {string} The escaped string safe for HTML rendering
 */
export function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Hashes a plaintext password using native Web Crypto API (SHA-256)
 * @param {string} password - The plaintext password
 * @returns {Promise<string>} Hex representation of the hashed password
 */
export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // Convert bytes to hex string
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
