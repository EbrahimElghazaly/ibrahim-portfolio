/* ============================================================
   IBRAHIM ELGHAZALY — PORTFOLIO v6.0
   Aurora Glass Developer — Full Script
   ============================================================ */

(function () {
    'use strict';

    /* ============================================================
       1. TRANSLATIONS
       ============================================================ */
    const TRANSLATIONS = {
        en: {
            'nav.about': 'About',
            'nav.services': 'Services',
            'nav.skills': 'Skills',
            'nav.projects': 'Projects',
            'nav.experience': 'Experience',
            'nav.contact': 'Contact',
            'nav.cv': 'CV',
            'nav.role': 'Front-End Dev',

            'hero.badge': 'Available for freelance',
            'hero.hi': "Hi, I'm",
            'hero.role': 'Front-End Developer',
            'hero.lead': 'I build <strong>fast</strong>, <strong>clean</strong>, and <strong>responsive</strong> web interfaces using React, Tailwind CSS, and modern JavaScript.',
            'hero.cta1': 'View My Work',
            'hero.cta2': "Let's Talk",
            'hero.follow': 'Follow',
            'hero.years': 'Years of Experience',
            'hero.projects': 'Projects',
            'hero.techs': 'Technologies',

            'about.label': '01 · About',
            'about.title1': 'Designing with',
            'about.title2': 'purpose.',
            'about.sub': 'A developer who cares about every pixel and every interaction.',
            'about.leadLabel': 'Introduction',
            'about.lead': "I'm a <strong>Front-End Developer</strong> with <strong>2+ years</strong> of hands-on experience building modern, responsive, and user-focused web interfaces. I specialize in <strong>React</strong>, <strong>Tailwind CSS</strong>, and modern JavaScript.",
            'about.photoRole': 'Front-End Developer · Egypt',
            'about.infoTitle': 'Quick Info',
            'about.k.name': 'Name',
            'about.k.location': 'Location',
            'about.k.email': 'Email',
            'about.k.status': 'Status',
            'about.v.location': 'El Santa, EG',
            'about.v.status': 'Available',
            'about.stackTitle': 'Tech Stack',

            'services.label': '02 · Services',
            'services.title1': 'What I',
            'services.title2': 'deliver.',
            'services.sub': 'End-to-end front-end services — from design to deployment.',
            'services.s1.t': 'Responsive Web Design',
            'services.s1.d': 'Pixel-perfect interfaces that look great on every screen size.',
            'services.s1.l1': 'Mobile-First',
            'services.s1.l2': 'Cross-Browser',
            'services.s1.l3': 'Optimized',
            'services.s2.t': 'React Development',
            'services.s2.d': 'Modern SPAs built with React and clean component architecture.',
            'services.s2.l1': 'Components',
            'services.s2.l2': 'State',
            'services.s2.l3': 'API Integration',
            'services.s3.t': 'UI Implementation',
            'services.s3.d': 'Turning Figma designs into clean Tailwind CSS code.',
            'services.s3.l1': 'Design → Code',
            'services.s3.l2': 'Tailwind',
            'services.s3.l3': 'Reusable',
            'services.s4.t': 'Full-Stack Fundamentals',
            'services.s4.d': 'Connecting front-end to back-end services for full apps.',
            'services.s4.l1': 'REST APIs',
            'services.s4.l2': 'Databases',
            'services.s4.l3': 'End-to-End',

            'skills.label': '03 · Skills',
            'skills.title1': 'My technical',
            'skills.title2': 'toolkit.',
            'skills.sub': 'Technologies and tools I work with daily.',
            'skills.p1': 'Languages & Frameworks',
            'skills.p2': 'Styling & Tools',
            'skills.resp': 'Responsive Design',
            'skills.fs': 'Full-Stack',
            'skills.levelExpert': 'Expert',
            'skills.levelAdvanced': 'Advanced',
            'skills.levelProficient': 'Proficient',
            'skills.levelLearning': 'Learning',

            'projects.label': '04 · Projects',
            'projects.title1': 'Selected',
            'projects.title2': 'work.',
            'projects.sub': "A collection of projects I've built recently.",
            'projects.cat.web': 'Website',
            'projects.cat.ui': 'Auth / UI',
            'projects.p1': 'Personal portfolio with a dark modern aesthetic and smooth interactions.',
            'projects.p2.n': 'Login — Modern',
            'projects.p2': 'Split-screen login with welcome message and social login options.',
            'projects.p3.n': 'Private Website',
            'projects.p3': 'RTL Arabic content page with clean layout and elegant typography.',
            'projects.p4.n': 'Sign In Page',
            'projects.p4': 'Illustrated sign-in card with a bold gradient call-to-action.',
            'projects.p5.n': 'Login — Minimal',
            'projects.p5': 'Minimal login form on a vivid gradient background.',
            'projects.p6.n': 'Login — Soft UI',
            'projects.p6': 'Soft pastel login with pin input and social login buttons.',

            'filter.all': 'All',
            'filter.web': 'Websites',
            'filter.ui': 'Auth / UI',

            'testi.label': '05 · Testimonials',
            'testi.title1': 'Words from',
            'testi.title2': 'collaborators.',
            'testi.sub': 'Feedback from teammates, mentors, and clients.',
            'testi.t1': 'Ibrahim has a rare mix of clean code and strong design sense. He delivered our booking platform front-end ahead of schedule with pixel-perfect quality.',
            'testi.t1.role': 'Project Mentor — DEPI',
            'testi.t2': 'Working with Ibrahim on the E-Learning platform was smooth. He turned every Figma frame into production-ready code without losing a single detail.',
            'testi.t2.role': 'UI/UX Designer',
            'testi.t3': 'Very responsive, professional, and always open to feedback. I\'d recommend Ibrahim for any front-end project that needs care and speed.',
            'testi.t3.role': 'Freelance Client',

            'exp.label': '06 · Experience',
            'exp.title1': "Where I've",
            'exp.title2': 'worked.',
            'exp.sub': 'My professional and educational journey.',
            'exp.e1.d': 'Jun — Aug 2025',
            'exp.e1.r': 'Full-Stack Developer',
            'exp.e1.ds': 'Built a full-stack web app covering both front-end and back-end. Implemented the client-side with React.',
            'exp.e2.d': 'Feb — Apr 2025',
            'exp.e2.r': 'Front-End Developer — Booking Platform',
            'exp.e2.c': 'Training Project',
            'exp.e2.ds': 'Owned the front-end of a multi-service booking platform covering halls, sports courts, and hotels.',
            'exp.e3.d': 'Oct — Dec 2024',
            'exp.e3.r': 'Front-End Developer — E-Learning',
            'exp.e3.c': 'Training Project',
            'exp.e3.ds': 'Developed the client-side UI for a programming languages platform focused on usability.',
            'exp.e4.d': '2023 — 2027',
            'exp.e4.r': 'B.Sc. Computer Science',
            'exp.e4.ds': 'Focusing on software engineering, web development, algorithms, and modern front-end tech.',
            'exp.e4.t1': 'Computer Science',
            'exp.e4.t2': 'Software Eng.',

            'cta.title1': 'Have a project',
            'cta.title2': 'in mind?',
            'cta.sub': "Let's build something great together. I'm currently available for freelance work.",
            'cta.btn': 'Start a Project',

            'contact.label': '07 · Contact',
            'contact.title1': "Let's create",
            'contact.title2': 'together.',
            'contact.sub': 'Have a project or just want to say hi? Drop me a message.',
            'contact.h': "Let's talk about your idea",
            'contact.t': "Drop me a message and I'll get back to you as soon as possible.",
            'contact.email': 'Email',
            'contact.phone': 'Phone',

            'form.name': 'Your Name',
            'form.phone': 'Phone Number',
            'form.email': 'Your Email',
            'form.subject': 'Subject',
            'form.message': 'Message',
            'form.send': 'Send Message',

            'footer.desc': 'Front-End Developer building modern, fast, and responsive web experiences.',
            'footer.links': 'Navigate',
            'footer.follow': 'Follow',
            'footer.made': 'Designed & Built with <strong>♥</strong>'
        },

        ar: {
            'nav.about': 'عني',
            'nav.services': 'الخدمات',
            'nav.skills': 'المهارات',
            'nav.projects': 'المشاريع',
            'nav.experience': 'الخبرات',
            'nav.contact': 'تواصل',
            'nav.cv': 'السيرة',
            'nav.role': 'مطور واجهات',

            'hero.badge': 'متاح للعمل الحر',
            'hero.hi': 'مرحباً، أنا',
            'hero.role': 'مطور واجهات أمامية',
            'hero.lead': 'أبني واجهات ويب <strong>سريعة</strong> و<strong>نظيفة</strong> و<strong>متجاوبة</strong> باستخدام React و Tailwind CSS وجافاسكريبت الحديثة.',
            'hero.cta1': 'شاهد أعمالي',
            'hero.cta2': 'لنتحدث',
            'hero.follow': 'تابعني',
            'hero.years': 'سنوات الخبرة',
            'hero.projects': 'مشاريع',
            'hero.techs': 'تقنيات',

            'about.label': '٠١ · عني',
            'about.title1': 'أصمم',
            'about.title2': 'بهدف.',
            'about.sub': 'مطور يهتم بكل بكسل وكل تفاعل.',
            'about.leadLabel': 'مقدمة',
            'about.lead': 'أنا <strong>مطور واجهات أمامية</strong> بخبرة <strong>أكثر من سنتين</strong> في بناء واجهات ويب حديثة ومتجاوبة تركز على المستخدم. متخصص في <strong>React</strong> و <strong>Tailwind CSS</strong> والجافاسكريبت الحديثة.',
            'about.photoRole': 'مطور واجهات · مصر',
            'about.infoTitle': 'معلومات سريعة',
            'about.k.name': 'الاسم',
            'about.k.location': 'الموقع',
            'about.k.email': 'البريد',
            'about.k.status': 'الحالة',
            'about.v.location': 'السانتا، مصر',
            'about.v.status': 'متاح',
            'about.stackTitle': 'التقنيات',

            'services.label': '٠٢ · الخدمات',
            'services.title1': 'ما',
            'services.title2': 'أقدمه.',
            'services.sub': 'خدمات واجهات أمامية متكاملة — من التصميم للنشر.',
            'services.s1.t': 'تصميم ويب متجاوب',
            'services.s1.d': 'واجهات مثالية على كل أحجام الشاشات.',
            'services.s1.l1': 'موبايل أولاً',
            'services.s1.l2': 'متوافق مع المتصفحات',
            'services.s1.l3': 'أداء محسّن',
            'services.s2.t': 'تطوير React',
            'services.s2.d': 'تطبيقات SPA حديثة بمعمارية نظيفة.',
            'services.s2.l1': 'مكونات',
            'services.s2.l2': 'إدارة الحالة',
            'services.s2.l3': 'ربط APIs',
            'services.s3.t': 'تنفيذ واجهات',
            'services.s3.d': 'تحويل تصاميم Figma إلى كود Tailwind نظيف.',
            'services.s3.l1': 'تصميم → كود',
            'services.s3.l2': 'Tailwind',
            'services.s3.l3': 'قابل لإعادة الاستخدام',
            'services.s4.t': 'أساسيات Full-Stack',
            'services.s4.d': 'ربط الواجهات بالـ Back-end لتطبيقات متكاملة.',
            'services.s4.l1': 'REST APIs',
            'services.s4.l2': 'قواعد بيانات',
            'services.s4.l3': 'من البداية للنهاية',

            'skills.label': '٠٣ · المهارات',
            'skills.title1': 'مجموعتي',
            'skills.title2': 'التقنية.',
            'skills.sub': 'التقنيات والأدوات التي أستخدمها يومياً.',
            'skills.p1': 'اللغات والأطر',
            'skills.p2': 'التنسيق والأدوات',
            'skills.resp': 'تصميم متجاوب',
            'skills.fs': 'Full-Stack',
            'skills.levelExpert': 'خبير',
            'skills.levelAdvanced': 'متقدم',
            'skills.levelProficient': 'متمكن',
            'skills.levelLearning': 'متعلم',

            'projects.label': '٠٤ · المشاريع',
            'projects.title1': 'مختارات',
            'projects.title2': 'من أعمالي.',
            'projects.sub': 'مجموعة من المشاريع التي بنيتها مؤخراً.',
            'projects.cat.web': 'موقع',
            'projects.cat.ui': 'تسجيل / واجهة',
            'projects.p1': 'بورتفوليو شخصي بتصميم داكن عصري وتفاعلات سلسة.',
            'projects.p2.n': 'صفحة تسجيل — حديثة',
            'projects.p2': 'صفحة تسجيل مقسمة لشاشين مع رسالة ترحيب.',
            'projects.p3.n': 'موقع خاص',
            'projects.p3': 'صفحة محتوى عربية بتنسيق نظيف وخطوط أنيقة.',
            'projects.p4.n': 'صفحة تسجيل',
            'projects.p4': 'بطاقة تسجيل مزخرفة بزر متدرج بارز.',
            'projects.p5.n': 'تسجيل — بسيط',
            'projects.p5': 'نموذج تسجيل بسيط على خلفية متدرجة.',
            'projects.p6.n': 'تسجيل — Soft UI',
            'projects.p6': 'تسجيل بألوان ناعمة مع إدخال PIN.',

            'filter.all': 'الكل',
            'filter.web': 'مواقع',
            'filter.ui': 'تسجيل / واجهة',

            'testi.label': '٠٥ · آراء العملاء',
            'testi.title1': 'كلمات من',
            'testi.title2': 'المتعاونين.',
            'testi.sub': 'آراء من الزملاء والمرشدين والعملاء.',
            'testi.t1': 'إبراهيم عنده مزيج نادر من الكود النظيف والحس التصميمي القوي. سلّم واجهة منصة الحجز قبل الموعد بجودة مثالية.',
            'testi.t1.role': 'مرشد مشروع — DEPI',
            'testi.t2': 'العمل مع إبراهيم على منصة التعليم كان سلساً. حوّل كل تصميم Figma إلى كود جاهز للإنتاج بدون فقدان أي تفصيلة.',
            'testi.t2.role': 'مصممة UI/UX',
            'testi.t3': 'متجاوب جداً، احترافي، ومنفتح دائماً على الملاحظات. أنصح بإبراهيم لأي مشروع واجهات.',
            'testi.t3.role': 'عميل مستقل',

            'exp.label': '٠٦ · الخبرات',
            'exp.title1': 'أين',
            'exp.title2': 'عملت.',
            'exp.sub': 'رحلتي المهنية والتعليمية.',
            'exp.e1.d': 'يونيو — أغسطس ٢٠٢٥',
            'exp.e1.r': 'مطور Full-Stack',
            'exp.e1.ds': 'بنيت تطبيق ويب متكامل يشمل الواجهة والخلفية مع تنفيذ الواجهة بـ React.',
            'exp.e2.d': 'فبراير — أبريل ٢٠٢٥',
            'exp.e2.r': 'مطور واجهات — منصة حجز',
            'exp.e2.c': 'مشروع تدريبي',
            'exp.e2.ds': 'توليت تطوير الواجهة الأمامية لمنصة حجز متعددة الخدمات.',
            'exp.e3.d': 'أكتوبر — ديسمبر ٢٠٢٤',
            'exp.e3.r': 'مطور واجهات — منصة تعليم',
            'exp.e3.c': 'مشروع تدريبي',
            'exp.e3.ds': 'طورت واجهة منصة تعلم لغات برمجة مع تركيز على سهولة الاستخدام.',
            'exp.e4.d': '٢٠٢٣ — ٢٠٢٧',
            'exp.e4.r': 'بكالوريوس علوم الحاسب',
            'exp.e4.ds': 'التركيز على هندسة البرمجيات، تطوير الويب، الخوارزميات، وتقنيات الواجهات الحديثة.',
            'exp.e4.t1': 'علوم الحاسب',
            'exp.e4.t2': 'هندسة البرمجيات',

            'cta.title1': 'عندك مشروع',
            'cta.title2': 'في بالك؟',
            'cta.sub': 'لنبنِ شيئاً رائعاً معاً. متاح حالياً للعمل الحر.',
            'cta.btn': 'ابدأ مشروعاً',

            'contact.label': '٠٧ · تواصل',
            'contact.title1': 'لنبدع',
            'contact.title2': 'معاً.',
            'contact.sub': 'عندك مشروع أو تحب تسلم؟ أرسل لي رسالة.',
            'contact.h': 'لنتحدث عن فكرتك',
            'contact.t': 'أرسل لي رسالة وسأرد عليك في أقرب وقت.',
            'contact.email': 'البريد',
            'contact.phone': 'الهاتف',

            'form.name': 'اسمك',
            'form.phone': 'رقم الهاتف',
            'form.email': 'بريدك الإلكتروني',
            'form.subject': 'الموضوع',
            'form.message': 'الرسالة',
            'form.send': 'إرسال الرسالة',

            'footer.desc': 'مطور واجهات أمامية يبني تجارب ويب حديثة وسريعة ومتجاوبة.',
            'footer.links': 'تنقل',
            'footer.follow': 'تابعني',
            'footer.made': 'صُمم وبُني بـ <strong>♥</strong>'
        }
    };

    /* ============================================================
       2. STATE
       ============================================================ */
    let currentLang = localStorage.getItem('portfolio-lang') || 'en';
    let currentTheme = localStorage.getItem('portfolio-theme') || 'dark';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ============================================================
       3. UTILS
       ============================================================ */
    function debounce(fn, wait = 100) {
        let t;
        return function (...args) {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), wait);
        };
    }

    function throttle(fn, limit = 100) {
        let inThrottle = false;
        return function (...args) {
            if (inThrottle) return;
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        };
    }

    /* ============================================================
       4. THEME
       ============================================================ */
    function initTheme() {
        const btns = [
            document.getElementById('themeBtn'),
            document.getElementById('themeBtnDesktop')
        ].filter(Boolean);

        if (!btns.length) return;

        document.documentElement.setAttribute('data-theme', currentTheme);

        btns.forEach((btn) => {
            btn.addEventListener('click', () => {
                currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', currentTheme);
                localStorage.setItem('portfolio-theme', currentTheme);

                document.dispatchEvent(new CustomEvent('theme:changed', {
                    detail: { theme: currentTheme }
                }));
            });
        });
    }

    /* ============================================================
       5. LANGUAGE
       ============================================================ */
    function applyLanguage(lang) {
        const t = TRANSLATIONS[lang];
        if (!t) return;

        currentLang = lang;

        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            if (t[key] !== undefined) el.textContent = t[key];
        });

        document.querySelectorAll('[data-i18n-html]').forEach((el) => {
            const key = el.getAttribute('data-i18n-html');
            if (t[key] !== undefined) el.innerHTML = t[key];
        });

        document.title = lang === 'ar'
            ? 'إبراهيم الغزالي — مطور واجهات أمامية'
            : 'Ibrahim Elghazaly — Front-End Developer';

        localStorage.setItem('portfolio-lang', lang);
    }

    function initLanguage() {
        const btns = [
            document.getElementById('langBtn'),
            document.getElementById('langBtnDesktop')
        ].filter(Boolean);

        if (!btns.length) return;

        applyLanguage(currentLang);

        btns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const newLang = currentLang === 'en' ? 'ar' : 'en';
                applyLanguage(newLang);

                document.dispatchEvent(new CustomEvent('lang:changed', {
                    detail: { lang: newLang }
                }));
            });
        });
    }

    /* ============================================================
       6. NAVBAR
       ============================================================ */
    function initNavbar() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        const onScroll = () => {
            if (window.pageYOffset > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', throttle(onScroll, 80), { passive: true });
        onScroll();
    }

    /* ============================================================
       7. MOBILE MENU
       ============================================================ */
    function initMobileMenu() {
        const burger = document.getElementById('burger');
        const nav = document.getElementById('nav');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!burger || !nav) return;

        const closeMenu = () => {
            burger.classList.remove('is-open');
            nav.classList.remove('is-open');
            document.body.style.overflow = '';
            burger.setAttribute('aria-expanded', 'false');
        };

        burger.addEventListener('click', () => {
            const isOpen = !nav.classList.contains('is-open');
            burger.classList.toggle('is-open', isOpen);
            nav.classList.toggle('is-open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
            burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        navLinks.forEach((link) => link.addEventListener('click', closeMenu));

        document.addEventListener('click', (e) => {
            if (
                nav.classList.contains('is-open') &&
                !nav.contains(e.target) &&
                !burger.contains(e.target)
            ) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) closeMenu();
        });

        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth > 1024) closeMenu();
        }, 150));
    }

    /* ============================================================
       8. SMOOTH SCROLL
       ============================================================ */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (!href || href === '#') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                const navbar = document.getElementById('navbar');
                const offset = navbar ? navbar.offsetHeight + 40 : 100;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({ top, behavior: 'smooth' });

                if (history.pushState) history.pushState(null, '', href);
            });
        });
    }

    /* ============================================================
       9. ACTIVE NAV
       ============================================================ */
    function initActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!sections.length || !navLinks.length) return;

        const onScroll = () => {
            const pos = window.pageYOffset + 200;
            let current = '';

            sections.forEach((sec) => {
                const top = sec.offsetTop;
                const height = sec.offsetHeight;
                if (pos >= top && pos < top + height) current = sec.getAttribute('id');
            });

            navLinks.forEach((link) => {
                link.classList.remove('is-active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('is-active');
                }
            });
        };

        window.addEventListener('scroll', throttle(onScroll, 120), { passive: true });
        onScroll();
    }

    /* ============================================================
       10. SCROLL REVEAL
       ============================================================ */
    function initScrollReveal() {
        const elements = document.querySelectorAll('.reveal');
        if (!elements.length) return;

        if (!('IntersectionObserver' in window)) {
            elements.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
        );

        elements.forEach((el) => observer.observe(el));
    }

    /* ============================================================
       11. COUNTERS
       ============================================================ */
    function initCounters() {
        const counters = document.querySelectorAll('.counter');
        if (!counters.length) return;

        if (!('IntersectionObserver' in window)) {
            counters.forEach((c) => c.textContent = (c.dataset.target || 0) + '+');
            return;
        }

        const animate = (el) => {
            const target = parseInt(el.dataset.target, 10) || 0;
            const duration = 1600;
            const start = performance.now();

            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target) + '+';
                if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };

        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animate(entry.target);
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach((c) => io.observe(c));
    }

    /* ============================================================
       12. PROJECTS FILTER
       ============================================================ */
    function initProjectFilter() {
        const buttons = document.querySelectorAll('.filter-btn');
        const projects = document.querySelectorAll('.project');
        if (!buttons.length || !projects.length) return;

        buttons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                buttons.forEach((b) => b.classList.remove('is-active'));
                btn.classList.add('is-active');

                projects.forEach((p) => {
                    const match = filter === 'all' || p.dataset.category === filter;
                    if (match) {
                        p.classList.remove('is-filtered-out');
                        p.style.animation = 'none';
                        void p.offsetWidth;
                        p.style.animation = 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both';
                    } else {
                        p.classList.add('is-filtered-out');
                    }
                });
            });
        });

        if (!document.getElementById('filterKeyframes')) {
            const style = document.createElement('style');
            style.id = 'filterKeyframes';
            style.textContent = `
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(24px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /* ============================================================
       13. TYPEWRITER
       ============================================================ */
    function initTypewriter() {
        const el = document.querySelector('.typewriter');
        if (!el || prefersReduced) return;

        const roles = {
            en: ['Front-End Developer', 'React Specialist', 'UI Craftsman', 'Tailwind Expert'],
            ar: ['مطور واجهات أمامية', 'متخصص React', 'صانع واجهات', 'خبير Tailwind']
        };

        let lang = document.documentElement.getAttribute('lang') || 'en';
        let idx = 0;
        let charIdx = 0;
        let deleting = false;

        const tick = () => {
            const list = roles[lang];
            const target = list[idx % list.length];

            if (!deleting) {
                charIdx++;
                el.textContent = target.slice(0, charIdx);
                if (charIdx >= target.length) {
                    deleting = true;
                    setTimeout(tick, 1800);
                    return;
                }
            } else {
                charIdx--;
                el.textContent = target.slice(0, charIdx);
                if (charIdx <= 0) {
                    deleting = false;
                    idx++;
                    el.textContent = '';
                    setTimeout(tick, 300);
                    return;
                }
            }

            setTimeout(tick, deleting ? 40 : 90);
        };

        setTimeout(tick, 1200);

        document.addEventListener('lang:changed', (e) => {
            lang = e.detail.lang;
            idx = 0;
            charIdx = 0;
            deleting = false;
        });
    }

    /* ============================================================
       14. CONTACT FORM
       ============================================================ */
    function initContactForm() {
        const form = document.getElementById('contactForm');
        const statusEl = document.getElementById('formStatus');
        if (!form) return;

        const ENDPOINT = 'https://formspree.io/f/xjyvlrkb';

        const showStatus = (msg, isError = false) => {
            if (!statusEl) return;
            statusEl.textContent = msg;
            statusEl.className = 'form-status' + (isError ? ' error' : '');
        };

        const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const data = Object.fromEntries(new FormData(form).entries());

            if (!data.name || data.name.trim().length < 2) {
                showStatus(currentLang === 'ar' ? 'الرجاء إدخال اسمك.' : 'Please enter your name.', true);
                return;
            }
            if (!data.phone || data.phone.trim().length < 7) {
                showStatus(currentLang === 'ar' ? 'الرجاء إدخال رقم هاتف صحيح.' : 'Please enter a valid phone number.', true);
                return;
            }
            if (!data.email || !validateEmail(data.email)) {
                showStatus(currentLang === 'ar' ? 'الرجاء إدخال بريد صحيح.' : 'Please enter a valid email.', true);
                return;
            }
            if (!data.subject || data.subject.trim().length < 3) {
                showStatus(currentLang === 'ar' ? 'الرجاء إدخال الموضوع.' : 'Please enter a subject.', true);
                return;
            }
            if (!data.message || data.message.trim().length < 10) {
                showStatus(currentLang === 'ar' ? 'الرسالة قصيرة جداً.' : 'Message is too short.', true);
                return;
            }

            const btn = form.querySelector('button[type="submit"]');
            const original = btn ? btn.innerHTML : '';

            if (btn) {
                btn.disabled = true;
                btn.innerHTML = currentLang === 'ar' ? 'جارٍ الإرسال...' : 'Sending...';
            }

            showStatus(currentLang === 'ar' ? 'جارٍ إرسال رسالتك...' : 'Sending your message...');

            try {
                const res = await fetch(ENDPOINT, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (!res.ok) throw new Error('Failed to send');

                showStatus(
                    currentLang === 'ar'
                        ? '✓ تم إرسال رسالتك بنجاح! سأرد عليك قريباً.'
                        : '✓ Message sent successfully! I will get back to you soon.'
                );

                form.reset();
                setTimeout(() => showStatus(''), 6000);
            } catch (err) {
                console.error('[Form Error]', err);
                showStatus(
                    currentLang === 'ar'
                        ? '✗ حدث خطأ. حاول مرة أخرى أو راسلني على البريد مباشرة.'
                        : '✗ Something went wrong. Please try again or email me directly.',
                    true
                );
            } finally {
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = original;
                }
            }
        });
    }

    /* ============================================================
       15. BACK TO TOP
       ============================================================ */
    function initBackToTop() {
        const btn = document.getElementById('toTop');
        if (!btn) return;

        const toggle = () => {
            if (window.pageYOffset > 500) {
                btn.classList.add('is-visible');
            } else {
                btn.classList.remove('is-visible');
            }
        };

        window.addEventListener('scroll', throttle(toggle, 120), { passive: true });
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        toggle();
    }

    /* ============================================================
       16. CURRENT YEAR
       ============================================================ */
    function initYear() {
        const el = document.getElementById('year');
        if (el) el.textContent = new Date().getFullYear();
    }

    /* ============================================================
       17. IMAGE FALLBACK
       ============================================================ */
    function initImageFallback() {
        document.querySelectorAll('img').forEach((img) => {
            img.addEventListener('error', () => {
                if (img.dataset.fallback) return;
                img.dataset.fallback = '1';

                const alt = img.alt || 'Image';
                const svg = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
                        <defs>
                            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#a855f7"/>
                                <stop offset="100%" stop-color="#22d3ee"/>
                            </linearGradient>
                        </defs>
                        <rect width="600" height="400" fill="url(#g)"/>
                        <text x="50%" y="50%" font-family="Inter, sans-serif" font-size="18" font-weight="600" fill="#fff" text-anchor="middle" dominant-baseline="middle">${alt}</text>
                    </svg>
                `;
                img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
            });
        });
    }

    /* ============================================================
       18. BOOT
       ============================================================ */
    function boot() {
        initTheme();
        initLanguage();
        initNavbar();
        initMobileMenu();
        initSmoothScroll();
        initActiveNav();
        initScrollReveal();
        initCounters();
        initProjectFilter();
        initTypewriter();
        initContactForm();
        initBackToTop();
        initYear();
        initImageFallback();

        console.log(
            '%c🚀 Aurora Portfolio Ready — v6.0',
            'color: #a855f7; font-weight: bold; font-size: 14px;'
        );
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})();