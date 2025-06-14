(() => {
    // This IIFE creates a private scope for the flower language module.

    // --- DOM ELEMENTS ---
    let datePicker, weekdayDisplay, lunarDisplay, styleSelect, flowerSelect, 
        flowerLangDisplay, goldenSentenceDisplay, eventInput, 
        generateBtn, copyBtn, promptOutput;

    function queryDOMElements() {
        datePicker = document.getElementById('date-picker');
        weekdayDisplay = document.getElementById('weekday-display');
        lunarDisplay = document.getElementById('lunar-display');
        styleSelect = document.getElementById('style-select');
        flowerSelect = document.getElementById('flower-select');
        flowerLangDisplay = document.getElementById('flower-lang-display');
        goldenSentenceDisplay = document.getElementById('golden-sentence-display');
        eventInput = document.getElementById('event-input');
        generateBtn = document.getElementById('generate-btn');
        copyBtn = document.getElementById('copy-btn');
        promptOutput = document.getElementById('prompt-output');
    }

    const promptTemplate = `请生成一张为 [公历日期] 设计的日签图片，包含背景图和特定排版的文字。
整体风格：[您想要的风格，例如：中国水墨风格、清新插画风格、可爱卡通风格、温馨水彩风格等]。
背景图案：以“[当日花名]”为主题，例如几朵盛开的 [当日花名]，带些其他点缀。构图需考虑文字区域，在图片上部、中部、底部留有适当空间。

画面比例：默认9：16长屏

文字内容与大致排版（请AI尽力清晰、准确地在图片上渲染以下汉字内容）：

1.  图片左上角或顶部显著位置:
    文字内容：“[当日花名]”

2.  图片右上角区域:
    第一行文字：“[公历日期]”
    第二行文字：一条细长的横线作为分隔
    第三行文字：“[星期几]”
    第四行文字：“[农历日期，例如：乙巳年五月十七]”

3.  图片中部区域 (可与背景有一定融合，但文字需清晰可辨):
    第一行文字（作为花语或主题）：“[花语]”
    第二行文字（作为金句，可分行显示）：“[金句内容]”

4.  图片底部区域:
    文字内容：“宜: [当日宜事，例如：亲近自然, 放松心情]”

补充要求：文字颜色与背景协调，排版美观，字体具有设计感但易于阅读，整体画面高清，色彩和谐。`;

    const lunarCalendar = {
        tg: '甲乙丙丁戊己庚辛壬癸',
        dz: '子丑寅卯辰巳午未申酉戌亥',
        mz: '正二三四五六七八九十冬腊',
        lunarInfo: [0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0],
        nStr1: ['日','一','二','三','四','五','六','七','八','九','十'],
        nStr2: ['初','十','廿','卅',' '],
        lYearDays: (y) => { let i, sum = 348; for(i=0x8000; i>0x8; i>>=1) sum += (lunarCalendar.lunarInfo[y-1900] & i)? 1: 0; return(sum+lunarCalendar.leapDays(y)); },
        leapDays: (y) => { if(lunarCalendar.leapMonth(y)) return((lunarCalendar.lunarInfo[y-1900] & 0x10000)? 30: 29); else return(0); },
        leapMonth: (y) => { return(lunarCalendar.lunarInfo[y-1900] & 0xf); },
        monthDays: (y,m) => { return( (lunarCalendar.lunarInfo[y-1900] & (0x10000>>m))? 30: 29 ); },
        toLunar: (objDate) => {
            let i, leap=0, temp=0;
            let baseDate = new Date(1900,0,31);
            let offset = (objDate - baseDate)/86400000;
            for(i=1900; i<2050 && offset>0; i++) { temp=lunarCalendar.lYearDays(i); offset-=temp; }
            if(offset<0) { offset+=temp; i--; }
            let year = i;
            leap = lunarCalendar.leapMonth(i);
            let isLeap = false;
            for(i=1; i<13 && offset>0; i++) {
                if(leap>0 && i==(leap+1) && isLeap==false) { --i; isLeap = true; temp = lunarCalendar.leapDays(year); }
                else { temp = lunarCalendar.monthDays(year, i); }
                if(isLeap==true && i==(leap+1)) isLeap = false;
                offset -= temp;
            }
            if(offset==0 && leap>0 && i==leap+1) { if(isLeap) { isLeap = false; } else { isLeap = true; --i; } }
            if(offset<0){ offset += temp; --i; }
            let month = i;
            let day = Math.round(offset) + 1;
            let cDay = (d)=>{ let s; switch(d){ case 10: s='初十'; break; case 20: s='二十'; break; case 30: s='三十'; break; default: s=lunarCalendar.nStr2[Math.floor(d/10)]; s+=lunarCalendar.nStr1[d%10]; } return(s); };
            let yearCyl = year - 1864;
            return { year: lunarCalendar.tg[yearCyl%10] + lunarCalendar.dz[yearCyl%12] + '年', month: (isLeap?'闰':'') + lunarCalendar.mz[month-1] + '月', day: cDay(day) };
        }
    };

    function updateDateInfo(dateString) {
        const date = new Date(dateString);
        const adjustedDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        weekdayDisplay.textContent = weekdays[adjustedDate.getDay()];
        const lunarDate = lunarCalendar.toLunar(adjustedDate);
        lunarDisplay.textContent = `${lunarDate.year}${lunarDate.month}${lunarDate.day}`;
    }

    function updateFlowerDropdown(month, day) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentMonthStr = monthNames[month - 1];
        const flowersForMonth = flowerData.filter(item => item['月份'] && item['月份'].includes(`(${currentMonthStr})`));
        
        flowerSelect.innerHTML = '';
        if (flowersForMonth.length === 0) {
            flowerSelect.innerHTML = '<option>当月无花语数据</option>';
            return;
        }

        flowersForMonth.forEach(flower => {
            const option = document.createElement('option');
            option.textContent = flower['花名'].replace(/\s*\(.*\)\s*/, '').trim();
            option.value = flower['花名'];
            flowerSelect.appendChild(option);
        });

        const flowerForDay = flowersForMonth.find(f => parseInt(f['序号'], 10) === day);
        if (flowerForDay) {
            flowerSelect.value = flowerForDay['花名'];
        }
        
        flowerSelect.dispatchEvent(new Event('change'));
    }

    function generateSuitableActivity(language) {
        if (!language) return "亲近自然, 放松心情";
        const activityMap = {'吉祥':['祈愿美好, 迎接好运','分享福气, 传递喜悦'],'好运':['祈愿美好, 迎接好运','把握机遇, 期待惊喜'],'富贵':['规划理财, 创造价值','享受生活, 感恩富足'],'纯洁':['静心思考, 保持纯真','回归初心, 感受宁静'],'高洁':['提升品格, 严于律己','阅读好书, 陶冶情操'],'坚强':['磨练意志, 挑战自我','坚持锻炼, 强健体魄'],'爱情':['表达爱意, 珍惜缘分','与爱人约会, 制造浪漫'],'希望':['展望未来, 拥抱希望','制定计划, 迎接挑战'],'快乐':['分享快乐, 感受生活','看场喜剧, 放声大笑'],'思念':['怀念过往, 感恩相遇','联系旧友, 互道安好'],'美丽':['发现美好, 提升品味','精心打扮, 自信出门'],'幸福':['珍惜当下, 感受幸福','为家人做饭, 共享天伦'],'美好':['创造美好, 记录点滴','帮助他人, 收获快乐'],'未来':['规划未来, 努力前行','学习新知, 投资自己'],'尊敬':['尊敬师长, 心怀感恩','帮助长辈, 表达孝心'],'忘忧':['放松心情, 忘却烦恼','听听音乐, 舒缓压力'],'家庭':['陪伴家人, 享受温馨','组织家庭聚会, 共享欢乐'],'梦想':['追逐梦想, 永不放弃','为梦想行动, 迈出一步']};
        for (const key in activityMap) {
            if (language.includes(key)) {
                const activities = activityMap[key];
                return activities[Math.floor(Math.random() * activities.length)];
            }
        }
        return "亲近自然, 放松心情";
    }

    function updateFlowerInfo() {
        const selectedFlowerName = flowerSelect.value;
        const flower = flowerData.find(f => f['花名'] === selectedFlowerName);
        if (flower) {
            const flowerLanguage = flower['花语 (四字)'];
            flowerLangDisplay.textContent = flowerLanguage;
            goldenSentenceDisplay.textContent = flower['金句'];
            eventInput.value = generateSuitableActivity(flowerLanguage);
        } else {
            flowerLangDisplay.textContent = '';
            goldenSentenceDisplay.textContent = '';
            eventInput.value = '亲近自然, 放松心情';
        }
    }

    function generatePrompt() {
        const date = new Date(datePicker.value);
        const adjustedDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
        const replacements = {
            '[公历日期]': adjustedDate.toLocaleDateString('zh-CN'),
            '[您想要的风格，例如：中国水墨风格、清新插画风格、可爱卡通风格、温馨水彩风格等]': styleSelect.value,
            '[当日花名]': flowerSelect.options[flowerSelect.selectedIndex].text,
            '[星期几]': weekdayDisplay.textContent,
            '[农历日期，例如：乙巳年五月十七]': lunarDisplay.textContent,
            '[花语]': flowerLangDisplay.textContent,
            '[金句内容]': goldenSentenceDisplay.textContent,
            '[当日宜事，例如：亲近自然, 放松心情]': eventInput.value
        };
        let finalPrompt = promptTemplate;
        for (const key in replacements) {
            finalPrompt = finalPrompt.replace(new RegExp(key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replacements[key]);
        }
        promptOutput.value = finalPrompt;
    }

    function copyPrompt() {
        if (!promptOutput.value) {
            alert('请先生成提示词！');
            return;
        }
        navigator.clipboard.writeText(promptOutput.value).then(() => {
            alert('提示词已成功复制到剪贴板！');
        }, () => {
            alert('复制失败，请手动复制。');
        });
    }

    function init() {
        console.log('Flower module init started.');
        queryDOMElements();
        if (datePicker) {
            console.log('Flower module elements found. Adding listeners.');
            datePicker.addEventListener('change', () => {
                console.log('Date changed.');
                const date = new Date(datePicker.value);
                const day = date.getUTCDate(); 
                updateDateInfo(datePicker.value);
                updateFlowerDropdown(date.getUTCMonth() + 1, day);
            });
            flowerSelect.addEventListener('change', updateFlowerInfo);
            generateBtn.addEventListener('click', generatePrompt);
            copyBtn.addEventListener('click', copyPrompt);

            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            datePicker.value = `${yyyy}-${mm}-${dd}`;
            
            console.log('Setting initial date and dispatching change event.');
            datePicker.dispatchEvent(new Event('change'));
        } else {
            console.error('Flower module datePicker not found!');
        }
    }

    init();
})();
