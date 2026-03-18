/**
 * Profile Model
 * Represents the portfolio owner's personal/professional information.
 */
export class Profile {
    /**
     * @param {Object} data
     * @param {string} [data.id='main'] - Fixed key for the single profile record
     * @param {string} data.name
     * @param {string} data.title
     * @param {string} data.bio
     * @param {string} data.email
     * @param {string} data.phone
     * @param {string} data.location
     * @param {string} data.avatarSrc
     * @param {string} data.degree
     * @param {string} data.university
     * @param {string} data.freelance
     * @param {string} data.gamingAlias
     * @param {Object} data.socials - { github, youtube, facebook, linkedin }
     * @param {string} data.cvFile - Base64 encoded PDF string
     * @param {string} data.cvFileName - Original filename of the uploaded CV
     * @param {string} data.tagline
     */
    constructor({
        id = 'main',
        name = '',
        title = '',
        bio = '',
        email = '',
        phone = '',
        location = '',
        avatarSrc = 'profile.jpg',
        degree = '',
        university = '',
        freelance = '',
        gamingAlias = '',
        socials = {},
        cvFile = '',
        cvFileName = '',
        tagline = '',
    } = {}) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.bio = bio;
        this.email = email;
        this.phone = phone;
        this.location = location;
        this.avatarSrc = avatarSrc;
        this.degree = degree;
        this.university = university;
        this.freelance = freelance;
        this.gamingAlias = gamingAlias;
        this.socials = {
            github: socials.github || '',
            youtube: socials.youtube || '',
            facebook: socials.facebook || '',
            linkedin: socials.linkedin || '',
        };
        this.cvFile = cvFile;
        this.cvFileName = cvFileName;
        this.tagline = tagline;
    }

    toPlainObject() {
        return { ...this };
    }

    static fromPlainObject(obj) {
        return new Profile(obj);
    }
}
