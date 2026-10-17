/* ==========================================================================
   MAGHALE NEGAR — Interactive JavaScript
   Includes:
   - Navbar scroll & backdrop blur
   - Mobile menu toggle & outside-click close
   - High-Precision Panel Tour Tab Switcher
   - Interactive 6-Agent Pipeline Simulator
   - Dynamic ROI & Profit Savings Calculator
   - Animated Stats Counters
   - Sticky Conversion Bar on Scroll
   - Accessible FAQ Accordion
   ========================================================================== */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initCounters();
  initPanelTourTabs();
  initAgentSimulator();
  initRoiCalculator();
  initStickyBar();
  initFAQ();
});

/* --------------------------------------------------------------------------
   1. Navbar Scroll Effect
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   2. Mobile Menu Toggle
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = !menu.hidden;
    menu.hidden = isOpen;
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!menu.hidden && !menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* --------------------------------------------------------------------------
   3. Animated Counters
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const toPersianDigits = (num) => {
    const persian = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return String(num).replace(/\d/g, d => persian[d]);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        let current = 0;
        const step = Math.ceil(target / 40) || 1;
        const duration = 1200;
        const intervalTime = Math.max(16, Math.floor(duration / (target / step)));

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = toPersianDigits(current);
        }, intervalTime);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(counter => observer.observe(counter));
}

/* --------------------------------------------------------------------------
   4. Interactive Panel Tour Tabs Switcher
   -------------------------------------------------------------------------- */
function initPanelTourTabs() {
  const buttons = document.querySelectorAll('.tour-tab-btn');
  const panels  = document.querySelectorAll('.tour-panel-block');
  if (!buttons.length || !panels.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      if (!targetId) return;

      buttons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active-panel'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active-panel');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Interactive 6-Agent Pipeline Simulator
   -------------------------------------------------------------------------- */
const agentData = {
  1: {
    name: 'استراتژیست محتوا (Planner Agent)',
    role: 'طراح ساختار، معماری H2/H3 و کلمات کلیدی LSI',
    specs: {
      input: 'کلمه کلیدی کانونی + لحن برند + طول مقاله',
      model: 'GPT-4o / Claude 3.5 Sonnet',
      output: 'درخت کامل محتوایی، پرسش‌های متداول و زاویه دید اختصاصی',
      time: '۱۲ ثانیه'
    },
    outputContent: `// خروجی ساختاریافته عامل برنامه‌ریز (JSON Blueprint)
{
  "target_keyword": "خرید افزونه وردپرس هوش مصنوعی",
  "search_intent": "Commercial / Transactional",
  "outline": [
    { "h2": "تحول تولید محتوا در وردپرس با هوش مصنوعی", "keywords": ["تولید خودکار", "وردپرس"] },
    { "h2": "معرفی ۶ عامل مستقل تحریریه مقاله‌نگار", "subsections": ["پژوهشگر", "نویسنده", "منتقد"] },
    { "h2": "بررسی تست‌های گذر از ردیاب‌های AI (Humanizer)", "table": "مقایسه قبل و بعد" },
    { "h2": "راهنمای اتصال مستقیم به ووکامرس و سئو" }
  ],
  "faq_schema_topics": ["آیا گوگل متوجه هوش مصنوعی می‌شود؟", "نحوه تنظیم کلید API"]
}`
  },
  2: {
    name: 'پژوهشگر عمیق وب (Researcher Agent)',
    role: 'استخراج داده‌های آماری، فکت‌های معتبر و مستندات موثق',
    specs: {
      input: 'طرح سرفصل‌ها + موتور جستجوی گوگل و منابع علمی',
      model: 'Tavily Search API + Gemini 1.5 Pro',
      output: 'آمار مستند، شواهد علمی و پیوندهای منبع برای ارجاع',
      time: '۱۸ ثانیه'
    },
    outputContent: `// داده‌های مستند استخراج‌شده توسط عامل پژوهشگر
[
  {
    "fact": "طبق آمار وبسایت Search Engine Journal در سال ۲۰۲۵، مقالات جامع بالای ۲۵۰۰ کلمه ۳.۲ برابر بیشتر از مقالات کوتاه بک‌لینک طبیعی دریافت می‌کنند.",
    "source_reliability": "High",
    "verified": true
  },
  {
    "fact": "نرخ پرش (Bounce Rate) در وب‌سایت‌هایی که از لینک‌سازی خودکار داخلی در ۳ پاراگراف اول استفاده کرده‌اند تا ۲۸٪ کاهش یافته است.",
    "applied_context": "پیشنهاد لینک به صفحه دسته‌بندی پلاگین‌ها"
  }
]`
  },
  3: {
    name: 'نویسنده تخصصی (Writer Agent)',
    role: 'نگارش تفصیلی پاراگراف به پاراگراف با روانشناسی فروش و تعامل',
    specs: {
      input: 'درخت سرفصل + تحقیقات مستند + تنظیمات لحن اختصاصی',
      model: 'Claude 3.5 Sonnet / GPT-4o',
      output: 'متن پیش‌نویس جامع، تیتربندی استاندارد، جداول مقایسه',
      time: '۴۵ ثانیه'
    },
    outputContent: `## تحول در فرآیند تولید محتوای وردپرس؛ از نگارش دستی تا تحریریه هوشمند

در سال‌های اخیر، مدیریت یک وب‌سایت پربازدید بدون تولید مستمر مقالات سئوشده امری غیرممکن به نظر می‌رسد. اما دغدغه اصلی مدیران همواره یکسان بوده است: صرف هزینه‌های سرسام‌آور برای برون‌سپاری محتوا یا ساعت‌ها ویرایش متون خشک و رباتیک.

افزونه مقاله‌نگار با پیاده‌سازی نخستین سیستم ۶ عاملی مستقل در محیط وردپرس، این چالش را به یک فرصت طلایی تبدیل کرده است. در این فرآیند، هر مقاله دقیقاً مانند خروجی یک تحریریه حرفه‌ای، از فیلترهای برنامه‌ریزی، پژوهش و نقد عبور می‌کند...`
  },
  4: {
    name: 'منتقد و ارزیاب کیفیت (Critic Agent)',
    role: 'راستی‌آزمایی، سنجش انسجام، نمره‌دهی منطقی و رفع تناقضات',
    specs: {
      input: 'متن پیش‌نویس نویسنده + استانداردهای نگارشی وب',
      model: 'GPT-4o (Critic Mode)',
      output: 'گزارش ارزیابی کیفی، نمره از ۱۰، دستور اصلاحات به نویسنده',
      time: '۱۵ ثانیه'
    },
    outputContent: `// چک‌لیست ارزیابی کیفی منتقد (Editorial Audit)
{
  "quality_score": 9.4,
  "readability_index": "عالی (روان و بدون سکته کلامی)",
  "keyword_density": "1.8% (کاملاً بهینه و طبیعی)",
  "internal_links_count": 4,
  "verdict": "تأیید شد - آماده برای مرحله انسانی‌سازی",
  "corrections_applied": [
    "حذف ۲ واژه حشو در پاراگراف سوم",
    "تبدیل پاراگراف طولانی بخش دوم به فهرست نشانه‌دار جهت اسکن چشمی بهتر"
  ]
}`
  },
  5: {
    name: 'طبیعی‌ساز لحن و ادبیات (Humanizer Agent)',
    role: 'حذف کامل ادبیات مصنوعی هوش مصنوعی و عبور از ردیاب‌های AI',
    specs: {
      input: 'متن بازبینی‌شده + سبک بومی زبان فارسی',
      model: 'Custom Humanizer Fine-tuned Pipeline',
      output: 'متن کاملاً انسانی، دارای تنوع طولی جملات و اصطلاحات اصیل',
      time: '۲۰ ثانیه'
    },
    outputContent: `// متن پس از فیلتر انسانی‌ساز (Humanizer)
- حذف عبارات کلیشه‌ای مانند: "در این مقاله قصد داریم به بررسی..." یا "در دنیای امروز..."
- جایگزینی با شروع‌های درگیرکننده و داستان‌محور
- تنوع در طول جملات (جملات ضربه‌ای کوتاه در کنار توضیحات تفصیلی)
- نتیجه آزمایش در ابزارهای GPTZero و Copyleaks:
  ► امتیاز انسانی: ۹۸.۷٪ (100% Human Score)
  ► ریسک پنالتی هوش مصنوعی گوگل: صفر درصد (Clean)`
  },
  6: {
    name: 'ناشر خودکار و معماری سئو (SEO Publisher Agent)',
    role: 'تزریق Schema، هماهنگی با Rank Math و Yoast و انتشار در دیتابیس',
    specs: {
      input: 'متن نهایی انسانی‌شده + کلمه کلیدی + ساختار دسته‌بندی',
      model: 'SEO Schema Automation Engine',
      output: 'پست کامل وردپرس همراه با متاتگ‌ها، تصویر شاخص و اسکیما',
      time: '۸ ثانیه'
    },
    outputContent: `// متادیتاهای آماده انتشار مستقیم در دیتابیس وردپرس
{
  "post_title": "راهنمای جامع خرید افزونه وردپرس هوش مصنوعی [تحریریه ۶ عاملی]",
  "post_status": "publish",
  "rank_math_focus_keyword": "خرید افزونه وردپرس هوش مصنوعی",
  "rank_math_description": "بررسی تخصصی افزونه مقاله‌نگار، نخستین تحریریه ۶ عاملی هوش مصنوعی وردپرس برای نگارش مقالات سئوشده، ووکامرس و لینک‌سازی خودکار.",
  "schema_type": "Article & FAQPage",
  "featured_image": "generated_ai_editorial_4k.webp",
  "wp_categories": ["آموزش سئو", "افزونه‌های وردپرس"]
}`
  }
};

function initAgentSimulator() {
  const stepCards = document.querySelectorAll('.pipeline-step-card');
  const simName   = document.getElementById('sim-agent-name');
  const simRole   = document.getElementById('sim-agent-role');
  const simInput  = document.getElementById('sim-spec-input');
  const simModel  = document.getElementById('sim-spec-model');
  const simOutput = document.getElementById('sim-spec-output');
  const simTime   = document.getElementById('sim-spec-time');
  const simCode   = document.getElementById('sim-output-code');

  if (!stepCards.length || !simName) return;

  stepCards.forEach(card => {
    card.addEventListener('click', () => {
      const stepIndex = card.getAttribute('data-step');
      const data = agentData[stepIndex];
      if (!data) return;

      stepCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      simName.textContent = data.name;
      simRole.textContent = data.role;
      simInput.textContent = data.specs.input;
      simModel.textContent = data.specs.model;
      simOutput.textContent = data.specs.output;
      simTime.textContent = data.specs.time;
      simCode.textContent = data.outputContent;
    });
  });
}

/* --------------------------------------------------------------------------
   6. Dynamic ROI & Savings Calculator
   -------------------------------------------------------------------------- */
function initRoiCalculator() {
  const slider      = document.getElementById('roi-slider');
  const countDisp   = document.getElementById('roi-count-disp');
  const humanCostEl = document.getElementById('roi-human-cost');
  const mnCostEl    = document.getElementById('roi-mn-cost');
  const profitEl    = document.getElementById('roi-profit');

  if (!slider || !countDisp) return;

  const toPersianDigits = (num) => {
    const persian = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return String(num).replace(/\d/g, d => persian[d]);
  };

  const formatToman = (amount) => {
    return toPersianDigits(amount.toLocaleString('en-US')) + ' تومان';
  };

  const update = () => {
    const count = parseInt(slider.value, 10);
    countDisp.textContent = toPersianDigits(count) + ' مقاله یا محصول';

    // Average cost per article:
    // Human freelance writer: ~450,000 Tomans
    // MaghaleNegar API token cost: ~15,000 Tomans
    const humanTotal = count * 450000;
    const mnTotal    = count * 15000;
    const savings    = humanTotal - mnTotal;

    humanCostEl.textContent = formatToman(humanTotal);
    mnCostEl.textContent    = formatToman(mnTotal);
    profitEl.textContent    = formatToman(savings);
  };

  slider.addEventListener('input', update);
  update();
}

/* --------------------------------------------------------------------------
   7. Sticky Conversion Bar on Scroll
   -------------------------------------------------------------------------- */
function initStickyBar() {
  const bar = document.getElementById('sticky-bar');
  if (!bar) return;

  const onScroll = () => {
    if (window.scrollY > 650) {
      bar.classList.add('visible');
    } else {
      bar.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* --------------------------------------------------------------------------
   8. FAQ Accordion Keyboard & Accessibility
   -------------------------------------------------------------------------- */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const summary = item.querySelector('.faq-question');
    if (!summary) return;

    summary.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        item.open = !item.open;
      }
    });
  });
}
