let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(n) {
    // 範囲チェック
    if (n >= totalSlides) currentSlide = 0;
    if (n < 0) currentSlide = totalSlides - 1;

    // すべてのスライドを非表示
    slides.forEach(slide => slide.classList.remove('active'));

    // 現在のスライドを表示
    slides[currentSlide].classList.add('active');

    // プログレスバー更新
    const progress = ((currentSlide + 1) / totalSlides) * 100;
    document.getElementById('progressBar').style.width = progress + '%';

    // スライド番号更新
    document.getElementById('slideNumber').textContent =
        `${currentSlide + 1} / ${totalSlides}`;

    // ナビゲーションのスライドカウンター更新
    const slideCounter = document.getElementById('slideCounter');
    if (slideCounter) {
        slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
    }

    // ボタンの有効/無効切り替え
    document.getElementById('prevBtn').disabled = currentSlide === 0;
    document.getElementById('nextBtn').disabled = currentSlide === totalSlides - 1;
}

function changeSlide(direction) {
    currentSlide += direction;
    showSlide(currentSlide);
}

// キーボードナビゲーション
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        if (currentSlide < totalSlides - 1) changeSlide(1);
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentSlide > 0) changeSlide(-1);
    } else if (e.key === 'Home') {
        currentSlide = 0;
        showSlide(currentSlide);
    } else if (e.key === 'End') {
        currentSlide = totalSlides - 1;
        showSlide(currentSlide);
    }
});

// タッチ/スワイプサポート
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
        // 左スワイプ（次へ）
        if (currentSlide < totalSlides - 1) changeSlide(1);
    }
    if (touchEndX > touchStartX + swipeThreshold) {
        // 右スワイプ（前へ）
        if (currentSlide > 0) changeSlide(-1);
    }
}

// 初期化
showSlide(0);

// コードブロックにコピーボタンを追加
function addCopyButtons() {
    const preElements = document.querySelectorAll('pre');

    preElements.forEach((pre, index) => {
        // すでにコンテナで囲まれていない場合のみ処理
        if (!pre.parentNode.classList.contains('code-container')) {
            // preをcode-containerで囲む
            const container = document.createElement('div');
            container.className = 'code-container';
            pre.parentNode.insertBefore(container, pre);
            container.appendChild(pre);

            // コピーボタンを作成
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.innerHTML = '<i class="fas fa-copy"></i> コピー';
            copyButton.setAttribute('data-code-index', index);

            // ボタンをコンテナに追加
            container.appendChild(copyButton);
        }
    });
}

// クリップボードにコピーする機能
async function copyToClipboard(text, button) {
    try {
        await navigator.clipboard.writeText(text);

        // ボタンの表示を一時的に変更
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> コピー済み';
        button.classList.add('copied');

        // 2秒後に元に戻す
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('copied');
        }, 2000);

    } catch (err) {
        console.error('クリップボードへのコピーに失敗しました:', err);

        // フォールバック: 古いブラウザ用
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            button.innerHTML = '<i class="fas fa-check"></i> コピー済み';
            button.classList.add('copied');

            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-copy"></i> コピー';
                button.classList.remove('copied');
            }, 2000);
        } catch (err2) {
            console.error('フォールバックコピーも失敗しました:', err2);
        }
        document.body.removeChild(textArea);
    }
}

// コピーボタンのクリックイベント
function setupCopyButtons() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.copy-button')) {
            e.preventDefault();
            const button = e.target.closest('.copy-button');
            const container = button.parentNode;
            const pre = container.querySelector('pre');
            const codeText = pre.textContent || pre.innerText;

            copyToClipboard(codeText, button);
        }
    });
}

// コピーボタンの初期化
addCopyButtons();
setupCopyButtons();

// クリックでのページ送り機能を削除
