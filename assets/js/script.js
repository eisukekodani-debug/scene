document.addEventListener('DOMContentLoaded', () => {
    console.log("Script loaded. Initializing..."); // 読み込み確認用
    setupScroll();
    setupMobileMenu();
    setupModal(); // モーダル機能も分離して整理
});

/* * 1. スクロールアニメーション & ヘッダー制御 
 * (IntersectionObserver を使用した現代的な実装)
 */
function setupScroll() {
    // --- A. 画像のふわっと表示 (IntersectionObserver) ---
    const reveals = document.querySelectorAll('.reveal');
    
    // 監視の設定: 要素が10%見えたら反応する
    const observerOptions = {
        root: null, // ビューポートを基準
        rootMargin: "0px",
        threshold: 0.1 
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 画面に入った場合
                entry.target.classList.add('active');
                // 一度表示したら監視をやめる（パフォーマンス向上）
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 全ての .reveal 要素を監視開始
    if (reveals.length > 0) {
        reveals.forEach(el => revealObserver.observe(el));
    } else {
        console.warn("No '.reveal' elements found."); // 要素がない場合の警告
    }


    // --- B. ヘッダーの背景色変更 (スクロール検知) ---
    const header = document.querySelector('.site-header');
    
    if (header) { // headerが存在する場合のみ実行（エラー防止）
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    } else {
        console.error("Header element (.site-header) not found.");
    }
}

/* * 2. スマホメニューの切り替え
 */
function setupMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu'); // 名前重複を避けるため変数名変更
    const toggle = document.querySelector('.nav-toggle');
    
    // HTML側で onclick="toggleMenu()" を使っている場合は
    // グローバルスコープに関数を公開する必要があります。
    // そのため、windowオブジェクトに割り当てます。
    window.toggleMenu = function() {
        if (mobileMenu && toggle) {
            mobileMenu.classList.toggle('active');
            toggle.classList.toggle('active');
        }
    };
}

/* * 3. ニュース詳細モーダル
 */
function setupModal() {
    // HTMLの onclick="openModal(...)" から呼ばれる関数をwindowに登録
    window.openModal = function(title, date, content) {
        const modalBody = document.getElementById('modalBody');
        const modal = document.getElementById('newsModal');
        
        if (modalBody && modal) {
            modalBody.innerHTML = `
                <p style="color:var(--text-muted); margin-bottom:16px; font-family:var(--font-display);">${date}</p>
                <h3 style="font-family:var(--font-serif); font-size:24px; margin-bottom:32px;">${title}</h3>
                <div style="line-height:2;">${content}</div>
            `;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = function() {
        const modal = document.getElementById('newsModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // 背景クリックで閉じる処理
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('newsModal');
        // modalが存在し、かつクリックされたのがmodal背景そのものである場合
        if (modal && e.target === modal) {
            window.closeModal();
        }
    });
}