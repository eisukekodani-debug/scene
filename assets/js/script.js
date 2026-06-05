document.addEventListener('DOMContentLoaded', () => {
    setupScroll();
    setupMobileMenu();
    setupModal();
    setupNewsButtons();
    setupFormLang();
});

/* ページ言語の判定（ja / en / zh） */
function pageLang() {
    return (document.documentElement.lang || 'ja').toLowerCase().slice(0, 2);
}

/* 1. スクロールアニメーション & ヘッダー制御 */
function setupScroll() {
    const reveals = document.querySelectorAll('.reveal');

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (reveals.length > 0) {
        reveals.forEach(el => revealObserver.observe(el));
    }

    // ヘッダー背景変更（scroll イベント最適化）
    const header = document.querySelector('.site-header');
    if (header) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    if (window.scrollY > 50) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
}

/* 2. スマホメニュー */
function setupMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const toggle = document.querySelector('.nav-toggle');

    window.toggleMenu = function() {
        if (mobileMenu && toggle) {
            const isActive = mobileMenu.classList.toggle('active');
            toggle.classList.toggle('active');
            toggle.setAttribute('aria-expanded', isActive);
            const menuLabels = {
                ja: ['メニューを開く', 'メニューを閉じる'],
                en: ['Open menu', 'Close menu'],
                zh: ['開啟選單', '關閉選單']
            };
            const L = menuLabels[pageLang()] || menuLabels.ja;
            toggle.setAttribute('aria-label', isActive ? L[1] : L[0]);
        }
    };

    // Escapeキーでメニューを閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
            window.toggleMenu();
        }
    });

    // nav-toggleのクリックイベント（onclick属性の代わり）
    if (toggle) {
        toggle.addEventListener('click', window.toggleMenu);
    }
}

/* 3. ニュース詳細モーダル（XSS対策 + a11y強化） */
function setupModal() {
    const modal = document.getElementById('newsModal');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = modal ? modal.querySelector('.modal-close') : null;
    let previousFocus = null;

    window.openModal = function(title, date, content) {
        if (!modalBody || !modal) return;

        previousFocus = document.activeElement;

        // DOM操作でXSS対策（信頼できるHTMLのみ挿入）
        modalBody.innerHTML = '';

        const dateEl = document.createElement('p');
        dateEl.className = 'modal-date';
        dateEl.textContent = date;

        const titleEl = document.createElement('h3');
        titleEl.className = 'modal-title';
        titleEl.id = 'modalTitle';
        titleEl.textContent = title;

        const contentEl = document.createElement('div');
        contentEl.className = 'modal-body-text';
        // content は data属性からのHTMLエンティティをデコードして使用
        contentEl.innerHTML = content;

        modalBody.appendChild(dateEl);
        modalBody.appendChild(titleEl);
        modalBody.appendChild(contentEl);

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // フォーカスをモーダルに移動
        if (closeBtn) closeBtn.focus();
    };

    window.closeModal = function() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';

        // フォーカスを元の要素に戻す
        if (previousFocus) previousFocus.focus();
    };

    // 閉じるボタン
    if (closeBtn) {
        closeBtn.addEventListener('click', window.closeModal);
    }

    // 背景クリックで閉じる
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) window.closeModal();
        });
    }

    // Escapeキーで閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            window.closeModal();
        }
    });

    // フォーカストラップ
    if (modal) {
        modal.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;

            const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        });
    }
}

/* 4b. 多言語フォーム: 送信時にメッセージ先頭へ言語タグを付与
   （Google Form側の項目追加不要。EN/ZHからの問い合わせを回答一覧で識別できる） */
function setupFormLang() {
    const lang = pageLang();
    if (lang === 'ja') return;
    const form = document.querySelector('form[target="hidden_iframe"]');
    if (!form) return;
    form.addEventListener('submit', () => {
        // IDは言語別(field-message / -en / -zh)なので name で拾う
        const msg = form.querySelector('textarea[name="entry.2097370578"]');
        if (msg && msg.value.indexOf('[lang:') !== 0) {
            msg.value = '[lang:' + lang + '] ' + msg.value;
        }
    });
}

/* 5. ニュースボタンのイベント設定（data属性ベース） */
function setupNewsButtons() {
    document.querySelectorAll('.list-row[data-title]').forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.dataset.title;
            const date = btn.dataset.date;
            const content = btn.dataset.content;
            window.openModal(title, date, content);
        });
    });
}
