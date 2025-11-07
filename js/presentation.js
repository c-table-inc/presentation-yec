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
    // スライド16（Difyデモスライド）ではキーボードナビゲーションを無効化
    // currentSlideは0から始まるので、スライド16はインデックス15
    if (currentSlide === 15) {
        return; // スライド16では何もしない
    }

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
    // スライド16（Difyデモスライド）ではスワイプナビゲーションを無効化
    if (currentSlide === 15) {
        return; // スライド16では何もしない
    }

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

// タブ切り替え機能（議事録Markdownスライド用）
function switchTab(tabName) {
    // すべてのタブボタンとコンテンツからactiveクラスを削除
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });

    // クリックされたタブをアクティブに
    event.target.closest('.tab-btn').classList.add('active');

    // 対応するコンテンツを表示
    if (tabName === 'markdown') {
        document.getElementById('markdown-content').classList.add('active');
        document.getElementById('markdown-content').style.display = 'block';
    } else if (tabName === 'preview') {
        document.getElementById('preview-content').classList.add('active');
        document.getElementById('preview-content').style.display = 'block';
    }
}

// ===== Dify API連携機能 =====
// TODO: 以下の設定を実際のDify環境に合わせて変更してください
const DIFY_CONFIG = {
    apiUrl: 'https://lately-large-garfish.ngrok-free.app/v1/workflows/run',  // DifyのAPIエンドポイント
    apiKey: 'app-9yTmmY406gJDkKZVzFCWGPRR',  // DifyのAPIキー
    // または chat-messages エンドポイントの場合
    // apiUrl: 'https://api.dify.ai/v1/chat-messages',
};

// 生成されたプロンプトを保存する変数
let generatedPromptText = '';

// プロンプト生成関数
async function generatePrompt() {
    const jobRole = document.getElementById('jobRole').value;
    const businessGoal = document.getElementById('businessGoal').value;
    const resultDiv = document.getElementById('promptResult');
    const loadingDiv = document.getElementById('loadingIndicator');
    const generateBtn = document.getElementById('generatePromptBtn');
    const copyBtn = document.getElementById('copyPromptBtn');

    // 入力チェック
    if (!businessGoal.trim()) {
        resultDiv.innerHTML = '<p class="error-message">⚠️ 業務目的を入力してください。</p>';
        copyBtn.style.display = 'none';
        return;
    }

    // ローディング表示
    resultDiv.style.display = 'none';
    loadingDiv.style.display = 'block';
    generateBtn.disabled = true;
    copyBtn.style.display = 'none';

    try {
        // Dify API呼び出し
        const response = await fetch(DIFY_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${DIFY_CONFIG.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: {
                    job_role: jobRole,
                    business_goal: businessGoal
                },
                response_mode: 'blocking',
                user: 'presentation-user'
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // レスポンスからプロンプトを取得（Difyの応答形式に合わせて調整）
        let generatedPrompt = '';

        // Dify Workflow API の戻り値: {"output": "プロンプト内容"}
        if (data.output) {
            generatedPrompt = data.output;
        }
        // Workflow API の別形式
        else if (data.data && data.data.outputs) {
            generatedPrompt = data.data.outputs.text || data.data.outputs.result || data.data.outputs.output || JSON.stringify(data.data.outputs);
        }
        // Chat Messages API の場合
        else if (data.answer) {
            generatedPrompt = data.answer;
        }
        // その他の形式
        else {
            generatedPrompt = JSON.stringify(data, null, 2);
        }

        // 生成されたプロンプトを保存
        generatedPromptText = generatedPrompt;

        // 結果を表示
        resultDiv.innerHTML = `<pre style="margin: 0; white-space: pre-wrap; font-size: 1.05rem;">${escapeHtml(generatedPrompt)}</pre>`;

        // コピーボタンを表示
        copyBtn.style.display = 'flex';

    } catch (error) {
        console.error('Dify API Error:', error);
        resultDiv.innerHTML = `
            <div class="error-message">
                <strong>⚠️ エラーが発生しました</strong><br><br>
                ${escapeHtml(error.message)}<br><br>
                <small>※ DIFY_CONFIG の設定を確認してください（js/presentation.js）</small>
            </div>
        `;
        copyBtn.style.display = 'none';
    } finally {
        // ローディング終了
        loadingDiv.style.display = 'none';
        resultDiv.style.display = 'block';
        generateBtn.disabled = false;
    }
}

// 生成されたプロンプトをクリップボードにコピーする関数
async function copyGeneratedPrompt() {
    const copyBtn = document.getElementById('copyPromptBtn');

    if (!generatedPromptText) {
        return;
    }

    try {
        await navigator.clipboard.writeText(generatedPromptText);

        // ボタンの表示を一時的に変更
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> コピー済み';
        copyBtn.classList.add('copied');

        // 2秒後に元に戻す
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.classList.remove('copied');
        }, 2000);

    } catch (err) {
        console.error('クリップボードへのコピーに失敗しました:', err);

        // フォールバック: 古いブラウザ用
        const textArea = document.createElement('textarea');
        textArea.value = generatedPromptText;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            copyBtn.innerHTML = '<i class="fas fa-check"></i> コピー済み';
            copyBtn.classList.add('copied');

            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> コピー';
                copyBtn.classList.remove('copied');
            }, 2000);
        } catch (err2) {
            console.error('フォールバックコピーも失敗しました:', err2);
        }
        document.body.removeChild(textArea);
    }
}

// HTMLエスケープ関数（XSS対策）
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
