/* ============================================================
   IBRAHIM ELGHAZALY — PORTFOLIO
   script.js — Theme, Language, Interactions
   ============================================================ */

(function () {
    'use strict';

    /* ============================================================
       1. TRANSLATIONS (EN + AR)
       ============================================================ */
    const TRANSLATIONS = {
        en: {
            'nav.home':        'Home',
            'nav.about':       'About',
            'nav.services':    'Services',
            'nav.skills':      'Skills',
            'nav.projects':    'Projects',
            'nav.experience':  'Experience',
            'nav.contact':     'Contact',
            'nav.cv':          'Download CV',
            'nav.role':        'Front-End Dev',

            'hero.badge':      'Available for freelance',
            'hero.hi':         "Hi, I'm",
            'hero.role':       'Front-End Developer',
            'hero.lead':       'I build <strong>fast</strong>, <strong>clean</strong>, and <strong>responsive</strong> web interfaces using React, Tailwind CSS, and modern JavaScript.',
            'hero.cta1':       'View My Work',
            'hero.cta2':       "Let's Talk",
            'hero.years':      'Years Exp.',
            'hero.projects':   'Projects',
            'hero.techs':      'Techs',

            'about.label':     '01 · About',
            'about.title1':    'About',
            'about.title2':    'Me',
            'about.sub':       'Get to know me and what I do.',
            'about.lead':      '<strong>Front-End Developer</strong> with <strong>2+ years</strong> of hands-on experience building modern, responsive, and user-focused web interfaces. Skilled in <strong>React</strong>, <strong>Tailwind CSS</strong>, and modern JavaScript — with a strong eye for <strong>UI/UX detail</strong>.',
            'about.bioTitle':  'My Story',
            'about.p2':        'Currently in my final year at <strong>Tanta University</strong>, Faculty of Computers and Information Sciences. Completed the <strong>DEPI</strong> Full-Stack training program where I built production-ready web applications.',
            'about.p3':        'I focus on turning <strong>complex ideas into simple, elegant interfaces</strong> — whether it\'s a landing page, a dashboard, or a full SPA. My daily stack: <strong>React, JavaScript, Tailwind CSS, Git</strong>.',
            'about.infoTitle': 'Quick Info',
            'about.k.name':    'Name',
            'about.k.location':'Location',
            'about.k.email':   'Email',
            'about.k.phone':   'Phone',
            'about.v.location':'El Santa, Gharbia, Egypt',
            'about.featured.tag':   'Featured',
            'about.featured.title': 'DEPI Full-Stack Program — 2025',
            'about.featured.desc':  'Ranked among top performers in the front-end track. Built production-ready web applications as part of the Digital Egypt Pioneers Initiative.',
            'about.ctaTitle':  "Let's work together",
            'about.ctaDesc':   'Have a project in mind? Let\'s build something great.',
            'about.cv':        'Download CV',
            'about.ctaBtn':    "Let's Talk",

            'services.label':  '02 · Services',
            'services.title1': 'What I',
            'services.title2': 'Offer',
            'services.sub':    'What I can do for your business.',
            'services.s1.t':   'Responsive Web Design',
            'services.s1.d':   'Pixel-perfect interfaces that look great on every screen size.',
            'services.s1.l1':  'Mobile-First',
            'services.s1.l2':  'Cross-Browser',
            'services.s1.l3':  'Optimized',
            'services.s2.t':   'React Development',
            'services.s2.d':   'Modern SPAs built with React and clean component architecture.',
            'services.s2.l1':  'Components',
            'services.s2.l2':  'State',
            'services.s2.l3':  'API Integration',
            'services.s3.t':   'UI Implementation',
            'services.s3.d':   'Turning Figma designs into clean Tailwind CSS code.',
            'services.s3.l1':  'Design → Code',
            'services.s3.l2':  'Tailwind',
            'services.s3.l3':  'Reusable',
            'services.s4.t':   'Full-Stack Fundamentals',
            'services.s4.d':   'Connecting front-end to back-end services for full apps.',
            'services.s4.l1':  'REST APIs',
            'services.s4.l2':  'Databases',
            'services.s4.l3':  'End-to-End',

            'skills.label':    '03 · Skills',
            'skills.title1':   'My',
            'skills.title2':   'Skills',
            'skills.sub':      'Technologies and tools I use daily.',
            'skills.p1':       'Languages & Frameworks',
            'skills.p2':       'Styling & Tools',
            'skills.resp':     'Responsive Design',
            'skills.fs':       'Full-Stack',

            'projects.label':  '04 · Projects',
            'projects.title1': 'Selected',
            'projects.title2': 'Work',
            'projects.sub':    "Some of the projects I've built recently.",
            'projects.cat.web':'Website',
            'projects.cat.ui': 'Auth / UI',
            'projects.p1':     'Personal portfolio with a dark modern aesthetic.',
            'projects.p2.n':   'Login — Modern',
            'projects.p2':     'Split-screen login with welcome message and social login.',
            'projects.p3.n':   'Private Website',
            'projects.p3':     'RTL Arabic content page with clean layout.',
            'projects.p4.n':   'Sign In Page',
            'projects.p4':     'Illustrated sign-in card with a bold gradient CTA.',
            'projects.p5.n':   'Login — Minimal',
            'projects.p5':     'Minimal login on a vivid gradient background.',
            'projects.p6.n':   'Login — Soft UI',
            'projects.p6':     'Soft pastel login with pin input and social login.',

            'exp.label':       '05 · Experience',
            'exp.title1':      'Work &',
            'exp.title2':      'Education',
            'exp.sub':         'My journey so far.',
            'exp.e1.d':        'Jun 2025 — Aug 2025',
            'exp.e1.r':        'Full-Stack Developer',
            'exp.e1.ds':       'Built a full-stack web app covering both front-end and back-end. Implemented the client-side with React.',
            'exp.e2.d':        'Feb 2025 — Apr 2025',
            'exp.e2.r':        'Front-End Developer — Booking Platform',
            'exp.e2.c':        'Training Project',
            'exp.e2.ds':       'Owned the front-end of a multi-service booking platform covering halls, sports courts, and hotels.',
            'exp.e3.d':        'Oct 2024 — Dec 2024',
            'exp.e3.r':        'Front-End Developer — E-Learning Platform',
            'exp.e3.c':        'Training Project',
            'exp.e3.ds':       'Developed the client-side UI for a programming languages platform focused on usability.',
            'exp.e4.d':        '2023 — 2027 (Expected)',
            'exp.e4.r':        'B.Sc. in Computers and Information Sciences',
            'exp.e4.ds':       'Focusing on software engineering, web development, algorithms, and modern front-end tech.',
            'exp.e4.t1':       'Computer Science',
            'exp.e4.t2':       'Software Engineering',

            'cta.title':       'Ready to start your project?',
            'cta.sub':         "Let's build something great together.",
            'cta.btn':         "Let's Talk",

            'contact.label':   '06 · Contact',
            'contact.title1':  'Get In',
            'contact.title2':  'Touch',
            'contact.sub':     "Have a project? Let's discuss it.",
            'contact.h':       "Let's talk about your idea",
            'contact.t':       "Drop me a message and I'll get back to you as soon as possible.",
            'contact.email':   'Email',
            'contact.phone':   'Phone',

            'form.name':       'Your Name',
            'form.phone':      'Phone Number',
            'form.email':      'Your Email',
            'form.subject':    'Subject',
            'form.message':    'Message',
            'form.send':       'Send Message',

            'footer.desc':     'Front-End Developer building modern, fast, and responsive web experiences.',
            'footer.links':    'Quick Links',
            'footer.follow':   'Follow Me',
            'footer.rights':   'All rights reserved.',
            'footer.made':     'Designed & Built with ❤️'
        },

        ar: {
            'nav.home':        'الرئيسية',
            'nav.about':       'عني',
            'nav.services':    'الخدمات',
            'nav.skills':      'المهارات',
            'nav.projects':    'المشاريع',
            'nav.experience':  'الخبرات',
            'nav.contact':     'تواصل',
            'nav.cv':          'تحميل السيرة',
            'nav.role':        'مطور واجهات',

            'hero.badge':      'متاح للعمل الحر',
            'hero.hi':         'مرحباً، أنا',
            'hero.role':       'مطور واجهات أمامية',
            'hero.lead':       'أبني واجهات ويب <strong>سريعة</strong> و<strong>نظيفة</strong> و<strong>متجاوبة</strong> باستخدام React و Tailwind CSS وجافاسكريبت الحديثة.',
            'hero.cta1':       'شاهد أعمالي',
            'hero.cta2':       'لنتحدث',
            'hero.years':      'سنوات خبرة',
            'hero.projects':   'مشاريع',
            'hero.techs':      'تقنيات',

            'about.label':     '٠١ · عني',
            'about.title1':    'عني',
            'about.title2':    '',
            'about.sub':       'تعرف عليّ وعلى ما أقدمه.',
            'about.lead':      '<strong>مطور واجهات أمامية</strong> بخبرة <strong>أكثر من سنتين</strong> في بناء واجهات ويب حديثة ومتجاوبة تركز على تجربة المستخدم. متمكن من <strong>React</strong> و <strong>Tailwind CSS</strong> وجافاسكريبت الحديثة — مع اهتمام قوي بـ <strong>تفاصيل UI/UX</strong>.',
            'about.bioTitle':  'قصتي',
            'about.p2':        'حالياً في السنة النهائية بجامعة <strong>طنطا</strong>، كلية الحاسبات والمعلومات. أكملت برنامج <strong>DEPI</strong> للتطوير المتكامل حيث بنيت تطبيقات ويب جاهزة للإنتاج.',
            'about.p3':        'أركز على تحويل <strong>الأفكار المعقدة إلى واجهات بسيطة وأنيقة</strong> — سواء كانت صفحة هبوط أو لوحة تحكم أو تطبيق SPA متكامل. التقنيات اليومية: <strong>React, JavaScript, Tailwind CSS, Git</strong>.',
            'about.infoTitle': 'معلومات سريعة',
            'about.k.name':    'الاسم',
            'about.k.location':'الموقع',
            'about.k.email':   'البريد',
            'about.k.phone':   'الهاتف',
            'about.v.location':'السانتا، الغربية، مصر',
            'about.featured.tag':   'مميز',
            'about.featured.title': 'برنامج DEPI للتطوير المتكامل — ٢٠٢٥',
            'about.featured.desc':  'من المتفوقين في مسار الواجهات الأمامية. بنيت تطبيقات ويب جاهزة للإنتاج ضمن مبادرة رواد مصر الرقمية.',
            'about.ctaTitle':  'لنعمل معاً',
            'about.ctaDesc':   'عندك فكرة مشروع؟ لنبنِ شيئاً رائعاً معاً.',
            'about.cv':        'تحميل السيرة',
            'about.ctaBtn':    'لنتحدث',

            'services.label':  '٠٢ · الخدمات',
            'services.title1': 'ما',
            'services.title2': 'أقدمه',
            'services.sub':    'ما يمكنني تقديمه لعملك.',
            'services.s1.t':   'تصميم ويب متجاوب',
            'services.s1.d':   'واجهات مثالية تظهر بشكل رائع على كل أحجام الشاشات.',
            'services.s1.l1':  'موبايل أولاً',
            'services.s1.l2':  'متوافق مع المتصفحات',
            'services.s1.l3':  'أداء محسّن',
            'services.s2.t':   'تطوير React',
            'services.s2.d':   'تطبيقات SPA حديثة مبنية بـ React وبمعمارية نظيفة.',
            'services.s2.l1':  'مكونات',
            'services.s2.l2':  'إدارة الحالة',
            'services.s2.l3':  'ربط APIs',
            'services.s3.t':   'تنفيذ واجهات المستخدم',
            'services.s3.d':   'تحويل تصاميم Figma إلى كود Tailwind CSS نظيف.',
            'services.s3.l1':  'من تصميم إلى كود',
            'services.s3.l2':  'Tailwind',
            'services.s3.l3':  'قابل لإعادة الاستخدام',
            'services.s4.t':   'أساسيات Full-Stack',
            'services.s4.d':   'ربط الواجهات بالـ Back-end لتطبيقات ويب متكاملة.',
            'services.s4.l1':  'REST APIs',
            'services.s4.l2':  'قواعد البيانات',
            'services.s4.l3':  'من البداية للنهاية',

            'skills.label':    '٠٣ · المهارات',
            'skills.title1':   '',
            'skills.title2':   'مهاراتي',
            'skills.sub':      'التقنيات والأدوات التي أستخدمها يومياً.',
            'skills.p1':       'اللغات والأطر',
            'skills.p2':       'التنسيق والأدوات',
            'skills.resp':     'تصميم متجاوب',
            'skills.fs':       'Full-Stack',

            'projects.label':  '٠٤ · المشاريع',
            'projects.title1': 'مختارات',
            'projects.title2': 'أعمالي',
            'projects.sub':    'بعض المشاريع التي بنيتها مؤخراً.',
            'projects.cat.web':'موقع',
            'projects.cat.ui': 'تسجيل / واجهة',
            'projects.p1':     'بورتفوليو شخصي بتصميم داكن عصري.',
            'projects.p2.n':   'صفحة تسجيل — حديثة',
            'projects.p2':     'صفحة تسجيل مقسمة لشاشين مع رسالة ترحيب.',
            'projects.p3.n':   'موقع خاص',
            'projects.p3':     'صفحة محتوى عربية بتنسيق نظيف.',
            'projects.p4.n':   'صفحة تسجيل الدخول',
            'projects.p4':     'بطاقة تسجيل مزخرفة بزر متدرج بارز.',
            'projects.p5.n':   'تسجيل — بسيط',
            'projects.p5':     'تسجيل بسيط على خلفية متدرجة جذابة.',
            'projects.p6.n':   'تسجيل — Soft UI',
            'projects.p6':     'تسجيل بألوان ناعمة مع إدخال PIN.',

            'exp.label':       '٠٥ · الخبرات',
            'exp.title1':      'العمل و',
            'exp.title2':      'التعليم',
            'exp.sub':         'رحلتي حتى الآن.',
            'exp.e1.d':        'يونيو ٢٠٢٥ — أغسطس ٢٠٢٥',
            'exp.e1.r':        'مطور Full-Stack',
            'exp.e1.ds':       'بنيت تطبيق ويب متكامل يشمل الواجهة والخلفية مع تنفيذ الواجهة بـ React.',
            'exp.e2.d':        'فبراير ٢٠٢٥ — أبريل ٢٠٢٥',
            'exp.e2.r':        'مطور واجهات — منصة حجز',
            'exp.e2.c':        'مشروع تدريبي',
            'exp.e2.ds':       'توليت تطوير الواجهة الأمامية لمنصة حجز متعددة الخدمات (قاعات، ملاعب، فنادق).',
            'exp.e3.d':        'أكتوبر ٢٠٢٤ — ديسمبر ٢٠٢٤',
            'exp.e3.r':        'مطور واجهات — منصة تعليم',
            'exp.e3.c':        'مشروع تدريبي',
            'exp.e3.ds':       'طورت واجهة منصة تعلم لغات برمجة مع تركيز على سهولة الاستخدام.',
            'exp.e4.d':        '٢٠٢٣ — ٢٠٢٧ (متوقع)',
            'exp.e4.r':        'بكالوريوس حاسبات ومعلومات',
            'exp.e4.ds':       'التركيز على هندسة البرمجيات، تطوير الويب، الخوارزميات، وتقنيات الواجهات الحديثة.',
            'exp.e4.t1':       'علوم الحاسب',
            'exp.e4.t2':       'هندسة البرمجيات',

            'cta.title':       'جاهز لبدء مشروعك؟',
            'cta.sub':         'لنبنِ شيئاً رائعاً معاً.',
            'cta.btn':         'لنتحدث',

            'contact.label':   '٠٦ · تواصل',
            'contact.title1':  'تواصل',
            'contact.title2':  'معي',
            'contact.sub':     'عندك مشروع؟ لنتناقش فيه.',
            'contact.h':       'لنتحدث عن فكرتك',
            'contact.t':       'أرسل لي رسالة وسأرد عليك في أقرب وقت.',
            'contact.email':   'البريد',
            'contact.phone':   'الهاتف',

            'form.name':       'اسمك',
            'form.phone':      'رقم الهاتف',
            'form.email':      'بريدك الإلكتروني',
            'form.subject':    'الموضوع',
            'form.message':    'الرسالة',
            'form.send':       'إرسال الرسالة',

            'footer.desc':     'مطور واجهات أمامية يبني تجارب ويب حديثة وسريعة ومتجاوبة.',
            'footer.links':    'روابط سريعة',
            'footer.follow':   'تابعني',
            'footer.rights':   'جميع الحقوق محفوظة.',
            'footer.made':     'صُمم وبُني بـ ❤️'
        }
    };

    /* ============================================================
       2. STATE
       ============================================================ */
    let currentLang  = localStorage.getItem('portfolio-lang')  || 'en';
    let currentTheme = localStorage.getItem('portfolio-theme') || 'dark';

    /* ============================================================
       3. THEME MANAGEMENT
       ============================================================ */
    function initTheme() {
        const btn = document.getElementById('themeBtn');
        if (!btn) return;

        document.documentElement.setAttribute('data-theme', currentTheme);

        btn.addEventListener('click', () => {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', currentTheme);
            localStorage.setItem('portfolio-theme', currentTheme);

            document.dispatchEvent(new CustomEvent('theme:changed', {
                detail: { theme: currentTheme }
            }));
        });
    }

    /* ============================================================
       4. LANGUAGE MANAGEMENT
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
        const btn = document.getElementById('langBtn');
        if (!btn) return;

        applyLanguage(currentLang);

        btn.addEventListener('click', () => {
            const newLang = currentLang === 'en' ? 'ar' : 'en';
            applyLanguage(newLang);

            document.dispatchEvent(new CustomEvent('lang:changed', {
                detail: { lang: newLang }
            }));
        });
    }

    /* ============================================================
       5. NAVBAR — Sticky on Scroll
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

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ============================================================
       6. MOBILE MENU
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
        };

        burger.addEventListener('click', () => {
            burger.classList.toggle('is-open');
            nav.classList.toggle('is-open');
            document.body.style.overflow = nav.classList.contains('is-open') ? 'hidden' : '';
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
            if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                closeMenu();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) closeMenu();
        });
    }

    /* ============================================================
       7. SMOOTH SCROLL
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
                const offset = navbar ? navbar.offsetHeight : 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset + 1;

                window.scrollTo({ top, behavior: 'smooth' });

                if (history.pushState) {
                    history.pushState(null, '', href);
                }
            });
        });
    }

    /* ============================================================
       8. ACTIVE NAV LINK
       ============================================================ */
    function initActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!sections.length || !navLinks.length) return;

        const onScroll = () => {
            const pos = window.pageYOffset + 140;
            let current = '';

            sections.forEach((sec) => {
                const top = sec.offsetTop;
                const height = sec.offsetHeight;
                if (pos >= top && pos < top + height) {
                    current = sec.getAttribute('id');
                }
            });

            navLinks.forEach((link) => {
                link.classList.remove('is-active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('is-active');
                }
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ============================================================
       9. SCROLL REVEAL
       ============================================================ */
    function initScrollReveal() {
        const selectors = [
            '.sec-head',
            '.bento-card',
            '.hero-photo-card',
            '.hero-stat-card',
            '.service-card',
            '.skill-panel',
            '.tech-strip',
            '.project',
            '.exp-item',
            '.contact-side',
            '.contact-form',
            '.cta-text',
            '.footer-wrap'
        ];

        const elements = document.querySelectorAll(selectors.join(', '));

        if (!('IntersectionObserver' in window)) {
            elements.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        elements.forEach((el) => el.classList.add('reveal'));

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('is-visible');
                        }, Math.min(index * 40, 300));
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
        );

        elements.forEach((el) => observer.observe(el));
    }

    /* ============================================================
       10. SKILL BARS ANIMATION
       ============================================================ */
    function initSkillBars() {
        const fills = document.querySelectorAll('.skill-fill');
        if (!fills.length) return;

        if (!('IntersectionObserver' in window)) {
            fills.forEach((f) => f.style.width = (f.dataset.w || 0) + '%');
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const fill = entry.target;
                        setTimeout(() => {
                            fill.style.width = (fill.dataset.w || 0) + '%';
                        }, 200);
                        observer.unobserve(fill);
                    }
                });
            },
            { threshold: 0.3 }
        );

        fills.forEach((f) => observer.observe(f));
    }

    /* ============================================================
       11. CONTACT FORM — Formspree AJAX
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
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
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
       12. BACK TO TOP
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

        window.addEventListener('scroll', toggle, { passive: true });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        toggle();
    }

    /* ============================================================
       13. CURRENT YEAR
       ============================================================ */
    function initYear() {
        const el = document.getElementById('year');
        if (el) el.textContent = new Date().getFullYear();
    }

    /* ============================================================
       14. IMAGE FALLBACK
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
                                <stop offset="0%" stop-color="#7c3aed"/>
                                <stop offset="100%" stop-color="#06b6d4"/>
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
       15. BOOT
       ============================================================ */
    function boot() {
        initTheme();
        initLanguage();
        initNavbar();
        initMobileMenu();
        initSmoothScroll();
        initActiveNav();
        initScrollReveal();
        initSkillBars();
        initContactForm();
        initBackToTop();
        initYear();
        initImageFallback();

        console.log(
            '%c🚀 Portfolio Ready — Premium Bento Build',
            'color: #7c3aed; font-weight: bold; font-size: 14px;'
        );
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})();