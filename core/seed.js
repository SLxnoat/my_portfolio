/**
 * Seed — Populates IndexedDB with portfolio data.
 * v2: Updated with full AI/ML Engineer CV data.
 */
import { Database } from './db.js';
import { Profile } from './models/Profile.js';
import { Project } from './models/Project.js';
import { GalleryItem } from './models/GalleryItem.js';
import { Skill } from './models/Skill.js';

export async function seedDatabase() {
    const SEED_FLAG = 'portfolio_db_seeded_v2';
    const db = Database.getInstance();

    // ── Auth is ALWAYS written (never skip) so login can never be broken ──
    await db.put('auth', { id: 'admin', username: 'admin', password: 'admin123' });

    // ── Everything else only seeds once ───────────────────────────────────
    if (localStorage.getItem(SEED_FLAG)) return;

    // ─── Profile ───────────────────────────────────────────────────────────
    await db.put('profile', new Profile({
        id: 'main',
        name: 'Charuka Mayura Bandara',
        title: 'Aspiring AI / Machine Learning Engineer',
        bio: 'IT undergraduate and aspiring AI/ML Engineer with proven experience building and deploying machine learning, deep learning, NLP, and LLM-powered systems. Grounded in linear algebra, probability, statistics, and calculus. Delivered quantified results: 90%+ accuracy on a hybrid BERT + TF-IDF NLP classifier, 95% accuracy on a CNN image recognition model, and a production-deployed LLM assistant using LLaMA 3.2, LangChain, and prompt engineering. Applies MLOps best practices — Docker, CI setup, experiment tracking, and model versioning — across 17+ open-source GitHub projects.',
        email: 'charuka03bc@gmail.com',
        phone: '+94 767 836 944',
        location: 'Gampaha, Sri Lanka',
        avatarSrc: '../profile.jpg',
        degree: 'BSc Hons in Information Technology',
        university: 'Horizon Campus',
        freelance: 'ArtXpert-Code (Open Source) & ArtXpert Design',
        gamingAlias: 'Xnoat',
        socials: {
            github: 'https://github.com/SLxnoat',
            youtube: 'https://youtube.com/@xnoatslgaming?si=R0OG5vF--1-0ZWul',
            facebook: 'https://www.facebook.com/people/Mayura-Bandara/100078259339614/',
            linkedin: 'https://www.linkedin.com/in/charuka-mayura',
        },
        cvUrl: '../cv/resume.pdf',
        tagline: '"Building intelligent systems that solve real-world problems."',
    }).toPlainObject());

    // ─── Skills ────────────────────────────────────────────────────────────
    const skills = [
        new Skill({ name: 'Python',                         percentage: 92, icon: 'fab fa-python' }),
        new Skill({ name: 'TensorFlow / Keras / PyTorch',  percentage: 85, icon: 'fas fa-brain' }),
        new Skill({ name: 'Scikit-learn & ML Pipelines',   percentage: 88, icon: 'fas fa-chart-line' }),
        new Skill({ name: 'NLP · BERT · HuggingFace',      percentage: 83, icon: 'fas fa-language' }),
        new Skill({ name: 'LLMs · LangChain · Ollama',     percentage: 80, icon: 'fas fa-robot' }),
        new Skill({ name: 'Data Science (Pandas, NumPy)',   percentage: 87, icon: 'fas fa-table' }),
        new Skill({ name: 'Flask REST APIs',                percentage: 82, icon: 'fas fa-server' }),
        new Skill({ name: 'MLOps · Docker · Git',          percentage: 75, icon: 'fas fa-gears' }),
        new Skill({ name: 'HTML5, CSS3 & JavaScript',       percentage: 90, icon: 'fab fa-html5' }),
        new Skill({ name: 'Java & C# (OOP)',                percentage: 75, icon: 'fas fa-code' }),
        new Skill({ name: 'Graphic Design (Ps, Ai, Canva)', percentage: 85, icon: 'fas fa-palette' }),
        new Skill({ name: 'React & Streamlit',              percentage: 72, icon: 'fab fa-react' }),
        new Skill({ name: 'MySQL & Firebase',               percentage: 75, icon: 'fas fa-database' }),
    ];
    // Clear old skills then insert
    await db.clear('skills');
    for (const s of skills) await db.put('skills', s.toPlainObject());

    // ─── Projects ──────────────────────────────────────────────────────────
    await db.clear('projects');
    const projects = [
        // AI/ML Projects
        new Project({
            title: 'Lanka Microfinance AI',
            description: 'Alternative credit scoring for Sri Lankan micro-entrepreneurs using behavioral signals — utility bill payment, mobile reload patterns, community group membership — instead of CRIB records.',
            category: 'ai-ml',
            tech: ['Python', 'XGBoost', 'Scikit-learn', 'Streamlit'],
            icon: 'fas fa-brain',
            imageSrc: '',
            highlights: [
                '96% accuracy on V1 prototype; 87% on realistic V2 noisy-label dataset',
                'Cost-sensitive XGBoost with scale_pos_weight handles 75/25 class imbalance',
                'Full EDA, threshold optimization (0.3–0.5), and fairness analysis',
            ],
            links: { github: 'https://github.com/SLxnoat/Lanka-Microfinance-AI' },
        }),
        new Project({
            title: 'Project ARIA — LLM Assistant',
            description: 'Local LLM-powered AI assistant conducting onboarding dialogue to profile skill level, goals, and availability — then dynamically generating personalised learning roadmaps.',
            category: 'ai-ml',
            tech: ['Python', 'Ollama', 'LLaMA 3.2', 'LangChain', 'Streamlit'],
            icon: 'fas fa-robot',
            imageSrc: '',
            highlights: [
                'Advanced prompt engineering for structured, context-aware responses',
                'User profiles persisted as JSON across sessions',
                '5-tab Streamlit interface: Chat · Profile · Roadmap · Project Ideas · Planner',
            ],
            links: { github: 'https://github.com/SLxnoat/Project--ARIA' },
        }),
        new Project({
            title: 'Digit Identifier — CNN Classifier',
            description: 'Convolutional Neural Network trained on MNIST with an interactive Streamlit canvas for real-time handwritten digit prediction with confidence scores.',
            category: 'ai-ml',
            tech: ['Python', 'TensorFlow', 'Keras', 'CNN', 'Streamlit'],
            icon: 'fas fa-hashtag',
            imageSrc: '',
            highlights: [
                '95% Test Accuracy on MNIST',
                'Real-time canvas-based digit prediction',
                'Confidence score display per class',
            ],
            links: { github: 'https://github.com/SLxnoat/digit_identifier' },
        }),
        new Project({
            title: 'Lanka Auto Advisor — Price Predictor',
            description: 'ML-based vehicle price prediction for the Sri Lankan used-car market, incorporating USD/LKR exchange rates and inflation data as economic context features.',
            category: 'ai-ml',
            tech: ['Python', 'XGBoost', 'Scikit-learn', 'Streamlit'],
            icon: 'fas fa-car',
            imageSrc: '',
            highlights: [
                'R² 0.9422 · MAE Rs. 349,447 on ~4,000 records',
                'Covers 2019–2026 economic cycles (pre-crisis, 2022 hyperinflation, recovery)',
                'Deployed with deal-assessment scoring; EDA with economic regime clustering',
            ],
            links: { github: 'https://github.com/SLxnoat/Lanka-Auto-Advisor' },
        }),
        // Web Dev Projects
        new Project({
            title: 'WhaleLink — AI Marine Platform',
            description: 'AI-powered marine monitoring dashboard predicting whale behaviour patterns using Python ML models integrated via real-time Flask API pipelines.',
            category: 'web',
            tech: ['React', 'Flask', 'Python ML', 'REST API'],
            icon: 'fas fa-water',
            imageSrc: '',
            highlights: [
                'Real-time whale behaviour pattern prediction',
                'Flask API pipeline integration with React dashboard',
                'Ongoing development — open source',
            ],
            links: { github: '' },
        }),
        new Project({
            title: 'Rice Mill Management System',
            description: 'Full-stack business management system covering inventory, orders, and reporting; plus a responsive PHP-MySQL e-commerce platform with secure payments and mobile-first UX.',
            category: 'web',
            tech: ['JavaScript', 'PHP', 'MySQL', 'Responsive UI'],
            icon: 'fas fa-store',
            imageSrc: '',
            highlights: [
                'Inventory, order management, and business reporting',
                'DotCom Mobile E-Shop with secure payment flow',
                'Mobile-first responsive design',
            ],
            links: { github: '' },
        }),
        new Project({
            title: '🎁 GiftHeaven',
            description: 'Responsive gift shop website with gift builder functionality and category filters.',
            category: 'web',
            tech: ['HTML', 'CSS', 'JavaScript'],
            icon: 'fas fa-gift',
            imageSrc: '',
            highlights: [],
            links: { github: 'https://github.com/SLxnoat/GiftHeaven' },
        }),
        new Project({
            title: '📱 Share2Care App',
            description: 'Food donation app concept aligning with UN SDGs — built with Java, Firebase, and SQLite.',
            category: 'app',
            tech: ['Java', 'Firebase', 'SQLite'],
            icon: 'fas fa-mobile-alt',
            imageSrc: '',
            highlights: [],
            links: { github: 'https://github.com/SLxnoat/Share2Care' },
        }),
        new Project({
            title: '🏫 CampusHub',
            description: 'University Management System with student and course management features.',
            category: 'app',
            tech: ['C#', 'SQL', 'Windows Forms'],
            icon: 'fas fa-university',
            imageSrc: '',
            highlights: [],
            links: { github: 'https://github.com/SLxnoat/CampusHub' },
        }),
        new Project({
            title: '🖼️ ArtXpert Design',
            description: 'Gallery of digital poster work for pizza shops, anime lovers, seasonal events, and brand identities.',
            category: 'design',
            tech: ['Photoshop', 'Illustrator', 'Canva'],
            icon: 'fas fa-palette',
            imageSrc: '',
            highlights: [],
            links: { gallery: 'https://www.facebook.com/people/ArtXpert/100092553982104/' },
        }),
        new Project({
            title: '🎮 XnoatSL Gaming',
            description: 'Branding and UI for game repack store and streaming content.',
            category: 'gaming',
            tech: ['Streaming', 'UI Design', 'Branding'],
            icon: 'fas fa-gamepad',
            imageSrc: '',
            highlights: [],
            links: { youtube: 'https://youtube.com/@xnoatslgaming?si=R0OG5vF--1-0ZWul' },
        }),
    ];
    for (const p of projects) await db.put('projects', p.toPlainObject());

    // ─── Gallery ───────────────────────────────────────────────────────────
    await db.clear('gallery');
    const galleryItems = [
        new GalleryItem({ title: 'Pizza Shop Branding',   description: 'Complete branding package including logo, menu design, and promotional materials.',      imageSrc: '../img/pizzashop.jpg',            category: 'branding' }),
        new GalleryItem({ title: 'Anime Art Collection',  description: 'Anime-inspired digital artwork with vibrant colors for desktop wallpapers.',              imageSrc: '../img/animewallpaper.jpg',       category: 'digital-art' }),
        new GalleryItem({ title: 'Poya Day Celebration',  description: 'Traditional Buddhist festival poster combining cultural elements and modern design.',      imageSrc: '../img/poyaflyer.jpg',            category: 'poster' }),
        new GalleryItem({ title: 'Book Cover Series',     description: 'Collection of book cover designs showcasing typography and visual storytelling.',          imageSrc: '../img/bookcoverdesign.jpg',      category: 'design' }),
        new GalleryItem({ title: 'Windows 11 Theme',      description: 'Custom Windows 11 desktop theme with minimalist, gaming-inspired elements.',              imageSrc: '../img/windows11wallpaper.jpg',   category: 'digital-art' }),
        new GalleryItem({ title: 'Buddhist Art Series',   description: 'Symmetrical Buddhist art combining traditional motifs with digital techniques.',          imageSrc: '../img/symetricbuddhadesign.jpg', category: 'digital-art' }),
        new GalleryItem({ title: 'T-Shirt Collection',    description: 'Custom t-shirt designs with unique artwork, typography, and cultural elements.',          imageSrc: '../img/customtshirtdesing.jpg',   category: 'design' }),
        new GalleryItem({ title: 'Event Posters',         description: 'Dynamic poster designs with bold typography and eye-catching visuals.',                   imageSrc: '../img/posterdesign.jpg',         category: 'poster' }),
        new GalleryItem({ title: 'PC Gaming Art',         description: 'High-resolution gaming wallpapers and custom digital illustrations for PC enthusiasts.',  imageSrc: '../img/pcwallpaper.jpg',          category: 'digital-art' }),
        new GalleryItem({ title: 'Photo Frame Designs',   description: 'Custom photo frame designs combining digital art with traditional framing techniques.',   imageSrc: '../img/customframedphoto.jpg',    category: 'design' }),
        new GalleryItem({ title: 'Digital Oil Paintings', description: 'Digital recreations of traditional oil paintings showcasing advanced digital painting.',  imageSrc: '../img/oilpainting.jpg',          category: 'digital-art' }),
        new GalleryItem({ title: 'Textile Patterns',      description: 'Fabric pattern designs with geometric shapes and cultural motifs for textile use.',       imageSrc: '../img/fabricpattern.jpg',        category: 'design' }),
    ];
    for (const item of galleryItems) await db.put('gallery', item.toPlainObject());

    localStorage.setItem(SEED_FLAG, '1');
    console.info('[Portfolio DB] v2 Seeded successfully.');
}
