// luck.js
document.addEventListener('DOMContentLoaded', function() {
    // 全局数据
    const appData = {
        // 运势数据
        dailyLuck: {
            scores: [45, 52, 68, 74, 81, 87, 92, 78, 65, 59],
            colors: ["霓虹蓝", "深空紫", "数字绿", "机械银", "量子红", "数据黄", "网络橙", "虚拟青", "电磁粉", "像素白"],
            numbers: [3, 7, 11, 16, 22, 27, 33, 38, 42, 49],
            directions: ["北", "东北", "东", "东南", "南", "西南", "西", "西北"],
            shouldDo: ["尝试新事物", "主动沟通", "学习新技能", "投资理财", "整理房间", "联系老朋友", "锻炼身体", "制定计划"],
            avoidDo: ["犹豫不决", "冲动消费", "过度承诺", "熬夜", "与人争执", "拖延重要事项", "过度饮食", "轻信谣言"],
            analyses: [
                "今日整体运势处于高位，能量场稳定。工作中可能会遇到新的机遇，建议积极把握。人际关系方面，沟通顺畅，适合团队协作。健康状态良好，注意保持规律作息。",
                "今日运势平稳，适合处理日常事务。工作中可能会有小挑战，但凭借你的能力可以轻松解决。感情方面需要多一些耐心和理解，避免小误会升级。",
                "今日能量充沛，适合开启新项目或学习新技能。财运方面有上升趋势，但需要谨慎投资。健康方面注意饮食均衡，避免过度劳累。",
                "今日社交运势强劲，适合参加集体活动或结识新朋友。工作中可能会有贵人相助，带来意想不到的机遇。感情方面适合表达心意，坦诚沟通。",
                "今日思考能力突出，适合进行策划或创意工作。但需要注意细节，避免因小失大。健康方面可能出现轻微疲劳，注意适当休息。"
            ]
        },
        
        // 占卜数据
        divinations: [
            "量子波动显示：你所询问的事项近期会有积极进展，但需要保持耐心。关键人物可能会在本周内出现，带来新的机遇。",
            "能量场分析：当前局势存在一些不确定性，建议不要急于做出决定。等待更多信息出现后再行动会更稳妥。",
            "概率计算：你所期望的结果有68%的实现可能性。主要障碍来自外部环境因素，而非个人能力问题。",
            "时空轨迹模拟：过去的决策正在产生积极影响，未来的3-7天内可能会有重要进展。保持现有方向即可。",
            "数据流解读：你所担心的问题实际上没有看起来那么严重。尝试换个角度思考，可能会发现新的解决方案。",
            "神经网络分析：人际关系方面可能需要更多投入。一段被忽视的关系可能会成为解决问题的关键。",
            "混沌系统预测：短期内可能会有意外变化，但这实际上是向更好方向发展的契机。保持灵活应对的态度。",
            "能量图谱显示：你的个人能量场目前处于平衡状态，这有利于吸引正面机遇。注意保持这种平衡。"
        ],
        
        // 塔罗牌数据
        tarotCards: [
            { name: "愚者", meaning: "新的开始，冒险，天真", direction: "正位" },
            { name: "魔术师", meaning: "能力，技能，创造力", direction: "正位" },
            { name: "女祭司", meaning: "直觉，潜意识，神秘", direction: "逆位" },
            { name: "皇后", meaning: "丰饶，养育，感性", direction: "正位" },
            { name: "皇帝", meaning: "权威，结构，控制", direction: "逆位" },
            { name: "教皇", meaning: "传统，信仰，教育", direction: "正位" },
            { name: "恋人", meaning: "关系，选择，价值观", direction: "正位" },
            { name: "战车", meaning: "意志，胜利，前进", direction: "逆位" },
            { name: "力量", meaning: "勇气，耐心，控制", direction: "正位" },
            { name: "隐士", meaning: "内省，孤独，指引", direction: "逆位" },
            { name: "命运之轮", meaning: "命运，转折点，循环", direction: "正位" },
            { name: "正义", meaning: "公平，真理，因果", direction: "正位" },
            { name: "倒吊人", meaning: "牺牲，等待，新视角", direction: "逆位" },
            { name: "死神", meaning: "结束，转变，新生", direction: "正位" },
            { name: "节制", meaning: "平衡，调和，适度", direction: "正位" },
            { name: "恶魔", meaning: "束缚，物质，无知", direction: "逆位" },
            { name: "塔", meaning: "剧变，启示，解放", direction: "正位" },
            { name: "星星", meaning: "希望，灵感，平静", direction: "正位" },
            { name: "月亮", meaning: "恐惧，幻觉，潜意识", direction: "逆位" },
            { name: "太阳", meaning: "成功，快乐，活力", direction: "正位" },
            { name: "审判", meaning: "重生，召唤，反思", direction: "正位" },
            { name: "世界", meaning: "完成，整合，成就", direction: "逆位" }
        ],
        
        // 财运数据
        fortuneLevels: ["较低", "中等", "较高"],
        fortuneAnalyses: [
            "今日财运整体平稳，投资方面可能出现新的机会，但需要谨慎评估风险。建议关注科技和能源领域的动态。避免冲动消费，特别是电子产品和虚拟商品。",
            "财运呈上升趋势，特别是偏财方面可能有意外收获。但需要注意合理规划支出，避免因社交活动产生过多开销。投资方面建议采取稳健策略。",
            "正财运强劲，工作相关收入可能有增加机会。但投资方面需要格外谨慎，避免高风险操作。今日适合处理财务文件或制定长期理财计划。",
            "财运波动较大，可能会有计划外的支出。建议推迟重大消费决策，特别是大额购物。偏财运势一般，不宜参与投机活动。"
        ],
        
        // 桃花运数据
        loveAnalyses: [
            "今日社交能量较强，适合参加集体活动或结识新朋友。已有伴侣者沟通顺畅，适合深入交流。单身者可能在日常环境中遇到有缘人，建议保持开放心态。",
            "人际关系方面需要更多主动性。已有伴侣者可以计划一些特别的活动增进感情。单身者可能会通过朋友介绍认识有趣的人，但需要时间发展。",
            "感情运势平稳，适合处理关系中的细节问题。沟通时注意表达方式，避免误解。单身者可能会在职场或学习环境中遇到潜在对象。",
            "今日适合关注自我成长而非主动寻找感情。已有伴侣者需要给对方更多个人空间。单身者可能会在兴趣社群中发现志同道合的人。"
        ],
        
        // 抽签数据
        lotterySticks: [
            { level: "上上签", text: "春风得意马蹄疾，一日看尽长安花。运势如日中天，万事皆宜，把握良机可成大业。" },
            { level: "上签", text: "山重水复疑无路，柳暗花明又一村。虽有困境，但转机即将到来，保持信心。" },
            { level: "中签", text: "千淘万漉虽辛苦，吹尽狂沙始到金。需要付出努力才能获得回报，坚持就是胜利。" },
            { level: "中平签", text: "月有阴晴圆缺，人有旦夕祸福。运势平稳，保持平常心，顺其自然即可。" },
            { level: "下签", text: "行路难，行路难，多歧路，今安在？面临挑战，需谨慎决策，避免冲动。" },
            { level: "下下签", text: "屋漏偏逢连夜雨，船迟又遇打头风。运势较低，宜守不宜攻，等待时机好转。" }
        ]
    };
    
    // 元素引用
    const elements = {
        // 时间显示
        currentDate: document.getElementById('current-date'),
        currentTime: document.getElementById('current-time'),
        
        // 功能按钮
        functionBtns: document.querySelectorAll('.function-btn'),
        
        // 面板
        resultPanels: document.querySelectorAll('.result-panel'),
        
        // 今日运势元素
        dailyScore: document.getElementById('daily-score'),
        luckyColor: document.getElementById('lucky-color'),
        luckyNumber: document.getElementById('lucky-number'),
        luckyDirection: document.getElementById('lucky-direction'),
        shouldDo: document.getElementById('should-do'),
        avoidDo: document.getElementById('avoid-do'),
        dailyAnalysis: document.getElementById('daily-analysis'),
        generateDailyBtn: document.getElementById('generate-daily'),
        
        // 占卜元素
        questionInput: document.getElementById('question-input'),
        askQuestionBtn: document.getElementById('ask-question'),
        energyLevel: document.getElementById('energy-level'),
        divinationText: document.getElementById('divination-text'),
        
        // 塔罗牌元素
        tarotCards: document.querySelectorAll('.tarot-card'),
        tarotReading: document.getElementById('tarot-reading'),
        drawTarotBtn: document.getElementById('draw-tarot'),
        
        // 财运元素
        fortuneMeter: document.getElementById('fortune-meter'),
        investmentChance: document.getElementById('investment-chance'),
        expenseRisk: document.getElementById('expense-risk'),
        windfallChance: document.getElementById('windfall-chance'),
        fortuneAnalysis: document.getElementById('fortune-analysis'),
        analyzeFortuneBtn: document.getElementById('analyze-fortune'),
        
        // 桃花运元素
        loveDesc: document.getElementById('love-desc'),
        loveAnalysis: document.getElementById('love-analysis'),
        analyzeLoveBtn: document.getElementById('analyze-love'),
        
        // 抽签元素
        lotteryStick: document.getElementById('lottery-stick'),
        stickText: document.getElementById('stick-text'),
        luckLevel: document.getElementById('luck-level'),
        lotteryReading: document.getElementById('lottery-reading'),
        drawLotteryBtn: document.getElementById('draw-lottery'),
        saveLotteryBtn: document.getElementById('save-lottery')
    };
    
    // 音频元素
    const clickSound = document.getElementById('click-sound');
    const successSound = document.getElementById('success-sound');
    
    // 工具函数
    const utils = {
        // 随机选择数组元素
        randomChoice: (arr) => arr[Math.floor(Math.random() * arr.length)],
        
        // 随机数字范围
        randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        
        // 播放声音
        playSound: (soundElement) => {
            soundElement.currentTime = 0;
            soundElement.play().catch(e => console.log("音频播放被阻止:", e));
        },
        
        // 格式化日期
        formatDate: (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
            const weekday = weekdays[date.getDay()];
            return `${year}年${month}月${day}日 星期${weekday}`;
        },
        
        // 格式化时间
        formatTime: (date) => {
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        }
    };
    
    // 初始化函数
    function init() {
        // 更新时间
        updateTime();
        setInterval(updateTime, 1000);
        
        // 初始化今日运势
        generateDailyLuck();
        
        // 绑定功能切换事件
        elements.functionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                switchFunction(this.dataset.function);
            });
        });
        
        // 绑定今日运势生成事件
        elements.generateDailyBtn.addEventListener('click', generateDailyLuck);
        
        // 绑定占卜事件
        elements.askQuestionBtn.addEventListener('click', performDivination);
        
        // 绑定塔罗牌事件
        elements.drawTarotBtn.addEventListener('click', drawTarotCards);
        
        // 绑定财运分析事件
        elements.analyzeFortuneBtn.addEventListener('click', analyzeFortune);
        
        // 绑定桃花运分析事件
        elements.analyzeLoveBtn.addEventListener('click', analyzeLove);
        
        // 绑定抽签事件
        elements.drawLotteryBtn.addEventListener('click', drawLottery);
        elements.saveLotteryBtn.addEventListener('click', saveLottery);
        
        // 绑定塔罗牌点击事件
        elements.tarotCards.forEach(card => {
            card.addEventListener('click', function() {
                this.classList.toggle('flipped');
                utils.playSound(clickSound);
            });
        });
        
        // 绑定抽签筒点击事件
        elements.lotteryStick.addEventListener('click', drawLottery);
        
        // 初始生成一些数据
        performDivination();
        analyzeFortune();
        analyzeLove();
    }
    
    // 更新时间显示
    function updateTime() {
        const now = new Date();
        elements.currentDate.textContent = utils.formatDate(now);
        elements.currentTime.textContent = utils.formatTime(now);
    }
    
    // 切换功能
    function switchFunction(functionName) {
        // 更新活动按钮
        elements.functionBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.function === functionName) {
                btn.classList.add('active');
            }
        });
        
        // 更新活动面板
        elements.resultPanels.forEach(panel => {
            panel.classList.remove('active');
            if (panel.id === `${functionName}-panel`) {
                panel.classList.add('active');
            }
        });
        
        utils.playSound(clickSound);
    }
    
    // 生成今日运势
    function generateDailyLuck() {
        elements.dailyScore.textContent = utils.randomChoice(appData.dailyLuck.scores);
        elements.luckyColor.textContent = utils.randomChoice(appData.dailyLuck.colors);
        elements.luckyNumber.textContent = utils.randomChoice(appData.dailyLuck.numbers);
        elements.luckyDirection.textContent = utils.randomChoice(appData.dailyLuck.directions);
        elements.shouldDo.textContent = utils.randomChoice(appData.dailyLuck.shouldDo);
        elements.avoidDo.textContent = utils.randomChoice(appData.dailyLuck.avoidDo);
        elements.dailyAnalysis.textContent = utils.randomChoice(appData.dailyLuck.analyses);
        
        // 添加动画效果
        elements.dailyScore.style.transform = 'scale(1.2)';
        setTimeout(() => {
            elements.dailyScore.style.transform = 'scale(1)';
        }, 300);
        
        utils.playSound(successSound);
    }
    
    // 执行占卜
    function performDivination() {
        const question = elements.questionInput.value.trim();
        
        if (question === '') {
            elements.divinationText.textContent = "请先输入您的问题，然后点击'开始占卜'按钮。";
            return;
        }
        
        const randomEnergy = utils.randomInt(60, 95);
        elements.energyLevel.textContent = `${randomEnergy}%`;
        
        // 更新能量条
        const energyBar = document.querySelector('.energy-bar');
        energyBar.style.setProperty('--energy-width', `${randomEnergy}%`);
        
        elements.divinationText.textContent = `问题："${question}"\n\n${utils.randomChoice(appData.divinations)}`;
        
        utils.playSound(successSound);
    }
    
    // 抽取塔罗牌
    function drawTarotCards() {
        // 重置所有卡片
        elements.tarotCards.forEach(card => {
            card.classList.remove('flipped');
        });
        
        // 随机选择三张不同的牌
        const selectedCards = [];
        const usedIndices = new Set();
        
        while (selectedCards.length < 3) {
            const randomIndex = utils.randomInt(0, appData.tarotCards.length - 1);
            if (!usedIndices.has(randomIndex)) {
                usedIndices.add(randomIndex);
                selectedCards.push(appData.tarotCards[randomIndex]);
            }
        }
        
        // 更新卡片显示
        elements.tarotCards.forEach((card, index) => {
            const cardNameElement = card.querySelector('.card-name');
            const cardData = selectedCards[index];
            cardNameElement.textContent = `${cardData.name} (${cardData.direction})`;
            
            // 设置延迟翻转动画
            setTimeout(() => {
                card.classList.add('flipped');
            }, 500 + index * 300);
        });
        
        // 生成解读
        const reading = `过去：${selectedCards[0].name} (${selectedCards[0].direction}) - ${selectedCards[0].meaning}\n\n` +
                       `现在：${selectedCards[1].name} (${selectedCards[1].direction}) - ${selectedCards[1].meaning}\n\n` +
                       `未来：${selectedCards[2].name} (${selectedCards[2].direction}) - ${selectedCards[2].meaning}\n\n` +
                       `综合解读：这三张牌显示了一个从${selectedCards[0].meaning}到${selectedCards[2].meaning}的发展过程。当前阶段的关键是${selectedCards[1].meaning}。`;
        
        elements.tarotReading.textContent = reading;
        
        utils.playSound(successSound);
    }
    
    // 分析财运
    function analyzeFortune() {
        const randomFortune = utils.randomInt(40, 95);
        const meterFill = elements.fortuneMeter.querySelector('.meter-fill');
        const meterValue = elements.fortuneMeter.querySelector('.meter-value');
        
        meterFill.style.width = `${randomFortune}%`;
        meterValue.textContent = `${randomFortune}%`;
        
        // 随机生成其他数据
        elements.investmentChance.textContent = utils.randomChoice(appData.fortuneLevels);
        elements.expenseRisk.textContent = utils.randomChoice(appData.fortuneLevels);
        elements.windfallChance.textContent = utils.randomChoice(appData.fortuneLevels);
        
        // 根据财运指数设置颜色
        if (randomFortune >= 80) {
            elements.investmentChance.className = 'value high';
        } else if (randomFortune >= 60) {
            elements.investmentChance.className = 'value medium';
        } else {
            elements.investmentChance.className = 'value low';
        }
        
        elements.fortuneAnalysis.textContent = utils.randomChoice(appData.fortuneAnalyses);
        
        utils.playSound(successSound);
    }
    
    // 分析桃花运
    function analyzeLove() {
        const randomLove = utils.randomInt(30, 95);
        const loveValueElement = document.querySelector('.love-value');
        const loveDescElement = elements.loveDesc;
        const progressBars = document.querySelectorAll('.progress-fill');
        
        // 更新桃花指数
        loveValueElement.textContent = randomLove;
        
        // 更新描述
        if (randomLove >= 80) {
            loveDescElement.textContent = '非常旺盛';
            loveDescElement.style.color = '#ff00ff';
        } else if (randomLove >= 60) {
            loveDescElement.textContent = '中等偏上';
            loveDescElement.style.color = '#ff88ff';
        } else if (randomLove >= 40) {
            loveDescElement.textContent = '一般';
            loveDescElement.style.color = '#a0a0ff';
        } else {
            loveDescElement.textContent = '较低';
            loveDescElement.style.color = '#8888ff';
        }
        
        // 更新进度条
        progressBars.forEach((bar, index) => {
            let width;
            if (index === 0) width = utils.randomInt(40, 80);
            else if (index === 1) width = utils.randomInt(50, 90);
            else width = utils.randomInt(30, 70);
            
            bar.style.width = `${width}%`;
            bar.parentElement.nextElementSibling.textContent = `${width}%`;
        });
        
        elements.loveAnalysis.textContent = utils.randomChoice(appData.loveAnalyses);
        
        utils.playSound(successSound);
    }
    
    // 抽签
    function drawLottery() {
        const selectedStick = utils.randomChoice(appData.lotterySticks);
        
        // 动画效果
        elements.lotteryStick.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            elements.lotteryStick.style.transform = 'translateY(0)';
        }, 300);
        
        // 更新签文
        elements.stickText.textContent = selectedStick.level;
        elements.luckLevel.textContent = selectedStick.level;
        elements.lotteryReading.textContent = selectedStick.text;
        
        // 根据签的等级设置颜色
        if (selectedStick.level.includes('上上') || selectedStick.level.includes('上签')) {
            elements.luckLevel.style.backgroundColor = 'rgba(0, 255, 128, 0.2)';
            elements.luckLevel.style.color = '#00ff88';
            elements.luckLevel.style.borderColor = 'rgba(0, 255, 128, 0.5)';
        } else if (selectedStick.level.includes('中签') || selectedStick.level.includes('中平')) {
            elements.luckLevel.style.backgroundColor = 'rgba(255, 200, 0, 0.2)';
            elements.luckLevel.style.color = '#ffcc00';
            elements.luckLevel.style.borderColor = 'rgba(255, 200, 0, 0.5)';
        } else {
            elements.luckLevel.style.backgroundColor = 'rgba(255, 50, 50, 0.2)';
            elements.luckLevel.style.color = '#ff5555';
            elements.luckLevel.style.borderColor = 'rgba(255, 50, 50, 0.5)';
        }
        
        utils.playSound(successSound);
    }
    
    // 保存签文
    function saveLottery() {
        const stickText = elements.stickText.textContent;
        const lotterReading = elements.lotteryReading.textContent;
        
        if (stickText === '点击抽签') {
            alert('请先抽取签文！');
            return;
        }
        
        // 创建保存内容
        const saveContent = `抽签时间：${utils.formatDate(new Date())} ${utils.formatTime(new Date())}\n` +
                          `签文等级：${stickText}\n` +
                          `签文解读：${lotterReading}\n\n` +
                          `保存自：赛博运势分析系统`;
        
        // 创建下载链接
        const blob = new Blob([saveContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `赛博签文_${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('签文已保存！');
        utils.playSound(clickSound);
    }
    
    // 启动应用
    init();
});