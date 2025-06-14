(() => {
    // This IIFE creates a private scope for the quote module.

    // --- DOM ELEMENTS ---
    let randomQuoteBtn, quoteDisplayArea, quoteText, bookTitle, authorName,
        styleInput, backgroundInput, idInput, generatePromptBtn,
        copyPromptBtn, promptOutput;

    function queryDOMElements() {
        randomQuoteBtn = document.getElementById('random-quote-btn');
        quoteDisplayArea = document.getElementById('quote-display-area');
        quoteText = document.getElementById('quote-text');
        bookTitle = document.getElementById('book-title');
        authorName = document.getElementById('author-name');
        styleInput = document.getElementById('style-select-jinju');
        backgroundInput = document.getElementById('background-select-jinju');
        idInput = document.getElementById('id-input-jinju');
        generatePromptBtn = document.getElementById('generate-prompt-btn-jinju');
        copyPromptBtn = document.getElementById('copy-prompt-btn-jinju');
        promptOutput = document.getElementById('prompt-output-jinju');
    }

    // --- GLOBAL STATE ---
    let currentQuote = null;

    const promptTemplate = `请生成一张为金句名言设计的图片，包含背景图和特定排版的文字。
整体风格：[您想要的风格，例如：简约扁平、现代水彩、吉卜力感、电影概念、装饰艺术、几何抽象、低多边形、柔和粉彩、日式清新、现代矢量、印象光影、干净素描、丝网印刷、氛围写实、北欧简约等]。
背景图案：背景以“[您想要的背景图案，例如海边、森林、纯净、开阔、静谧、通透、简约、光影、层次、柔和、细腻、雅致、留白、空灵、辽远、清澈、质感等]”为主题。构图需考虑文字区域，在图片上部、中部、底部留有适当空间。
画面比例：默认3：4长屏
文字内容与大致排版（请AI尽力清晰、准确地在图片上渲染以下汉字内容）：
1. 图片左上角或顶部显著位置:
   文字内容：“[书名]”
2. 图片正中区域:
   文字内容：“[金句]”，这个文本块整体居中，内部文字左对齐，按标点符号进行断句换行
3. 图片底部区域:
   文字内容：“[作者，如“— 刘慈欣”]”
4. 底部正中央：字体偏小
   文字内容：“[博主id，默认为“@利利的小书房”]”
补充要求：文字颜色与背景协调，排版美观，字体具有设计感但易于阅读，整体画面高清，色彩和谐。上述文字内容四个字不体现在图中。`;

    // --- CORE FUNCTIONS ---
    function displayRandomQuote() {
        if (typeof quoteData === 'undefined' || quoteData.length === 0) {
            alert('金句数据为空或未加载，请检查 quote_data.js 文件。');
            return;
        }
        
        currentQuote = quoteData[Math.floor(Math.random() * quoteData.length)];
        
        quoteText.textContent = currentQuote.金句;
        bookTitle.textContent = currentQuote.书名;
        authorName.textContent = `— ${currentQuote.作者}`;
        
        quoteDisplayArea.style.display = 'block';
    }

    function generatePrompt() {
        console.log('generatePrompt function called.');
        if (!currentQuote) {
            alert('请先抽取一条金句！');
            return;
        }
        console.log('currentQuote is valid.');

        console.log('Style select element:', styleInput);
        console.log('Background select element:', backgroundInput);

        const replacements = {
            '[您想要的风格，例如：简约扁平、现代水彩、吉卜力感、电影概念、装饰艺术、几何抽象、低多边形、柔和粉彩、日式清新、现代矢量、印象光影、干净素描、丝网印刷、氛围写实、北欧简约等]': styleInput.value,
            '[您想要的背景图案，例如海边、森林、纯净、开阔、静谧、通透、简约、光影、层次、柔和、细腻、雅致、留白、空灵、辽远、清澈、质感等]': backgroundInput.value,
            '[书名]': currentQuote.书名,
            '[金句]': currentQuote.金句,
            '[作者，如“— 刘慈欣”]': authorName.textContent,
            '[博主id，默认为“@利利的小书房”]': idInput.value
        };
        console.log('Replacements object:', replacements);

        let finalPrompt = promptTemplate;
        for (const key in replacements) {
            finalPrompt = finalPrompt.replace(new RegExp(key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replacements[key]);
        }
        
        console.log('Final prompt generated.');
        promptOutput.value = finalPrompt;
        console.log('Textarea updated.');
    }

    function copyPrompt() {
        if (!promptOutput.value) {
            alert('请先生成提示词！');
            return;
        }
        navigator.clipboard.writeText(promptOutput.value).then(() => {
            alert('提示词已成功复制到剪贴板！');
        }).catch(err => {
            alert('复制失败，请手动复制。');
            console.error('Copy failed', err);
        });
    }

    // --- INITIALIZATION ---
    function init() {
        queryDOMElements();
        if (randomQuoteBtn) {
            randomQuoteBtn.addEventListener('click', displayRandomQuote);
            generatePromptBtn.addEventListener('click', generatePrompt);
            copyPromptBtn.addEventListener('click', copyPrompt);
        }
    }

    init();
})();
