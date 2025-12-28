// 代码示例数据
const codeExamples = {
    python: {
        name: "Python",
        icon: "fab fa-python",
        code: `# Python 示例 - 计算斐波那契数列
def fibonacci(n):
    """返回第n个斐波那契数"""
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fibonacci(n-1) + fibonacci(n-2)

# 打印前10个斐波那契数
print("斐波那契数列前10项:")
for i in range(1, 11):
    fib_num = fibonacci(i)
    print(f"F({i}) = {fib_num}")

# 使用列表推导式计算平方数
squares = [x**2 for x in range(1, 11)]
print("\\n1到10的平方:", squares)

# 简单的类示例
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def greet(self):
        return f"你好，我是{self.name}，今年{self.age}岁。"

# 创建对象
person = Person("张三", 25)
print("\\n" + person.greet())`
    },
    java: {
        name: "Java",
        icon: "fab fa-java",
        code: `// Java 示例 - 简单的类和方法
public class Main {
    public static void main(String[] args) {
        System.out.println("Java 示例程序");
        
        // 创建对象并调用方法
        Calculator calc = new Calculator();
        int sum = calc.add(5, 3);
        int product = calc.multiply(5, 3);
        
        System.out.println("5 + 3 = " + sum);
        System.out.println("5 * 3 = " + product);
        
        // 数组示例
        int[] numbers = {1, 2, 3, 4, 5};
        System.out.print("数组元素: ");
        for (int num : numbers) {
            System.out.print(num + " ");
        }
    }
}

// 简单的计算器类
class Calculator {
    // 加法方法
    public int add(int a, int b) {
        return a + b;
    }
    
    // 乘法方法
    public int multiply(int a, int b) {
        return a * b;
    }
    
    // 阶乘计算方法
    public int factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }
}`
    },
    csharp: {
        name: "C#",
        icon: "fas fa-code",
        code: `// C# 示例 - 简单的控制台程序
using System;
using System.Collections.Generic;

namespace CodeLibrary
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("C# 示例程序");
            
            // 创建对象并调用方法
            MathOperations mathOps = new MathOperations();
            double circleArea = mathOps.CalculateCircleArea(5.0);
            Console.WriteLine($"半径为5的圆面积: {circleArea:F2}");
            
            // 列表示例
            List<string> fruits = new List<string> { "苹果", "香蕉", "橙子", "葡萄" };
            Console.WriteLine("\\n水果列表:");
            foreach (string fruit in fruits)
            {
                Console.WriteLine($"- {fruit}");
            }
            
            // 调用泛型方法
            int maxNumber = mathOps.Max(42, 17, 89);
            Console.WriteLine($"\\n最大值: {maxNumber}");
        }
    }
    
    // 数学运算类
    public class MathOperations
    {
        // 计算圆面积
        public double CalculateCircleArea(double radius)
        {
            return Math.PI * radius * radius;
        }
        
        // 泛型方法：返回三个值中的最大值
        public T Max<T>(T a, T b, T c) where T : IComparable<T>
        {
            T max = a;
            if (b.CompareTo(max) > 0) max = b;
            if (c.CompareTo(max) > 0) max = c;
            return max;
        }
    }
}`
    },
    cpp: {
        name: "C++",
        icon: "fas fa-cogs",
        code: `// C++ 示例 - 基本数据结构和算法
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// 简单的矩形类
class Rectangle {
private:
    double width;
    double height;
    
public:
    // 构造函数
    Rectangle(double w, double h) : width(w), height(h) {}
    
    // 计算面积
    double area() const {
        return width * height;
    }
    
    // 计算周长
    double perimeter() const {
        return 2 * (width + height);
    }
    
    // 显示矩形信息
    void display() const {
        cout << "矩形: " << width << " x " << height << endl;
        cout << "面积: " << area() << endl;
        cout << "周长: " << perimeter() << endl;
    }
};

// 模板函数：交换两个值
template <typename T>
void swapValues(T &a, T &b) {
    T temp = a;
    a = b;
    b = temp;
}

int main() {
    cout << "C++ 示例程序" << endl;
    
    // 创建矩形对象
    Rectangle rect(5.0, 3.0);
    rect.display();
    
    // 向量示例
    vector<int> numbers = {7, 3, 9, 1, 5};
    cout << "\\n排序前的数字: ";
    for (int num : numbers) {
        cout << num << " ";
    }
    
    // 排序向量
    sort(numbers.begin(), numbers.end());
    
    cout << "\\n排序后的数字: ";
    for (int num : numbers) {
        cout << num << " ";
    }
    
    // 使用模板函数
    int x = 10, y = 20;
    cout << "\\n\\n交换前: x = " << x << ", y = " << y << endl;
    swapValues(x, y);
    cout << "交换后: x = " << x << ", y = " << y << endl;
    
    return 0;
}`
    },
    go: {
        name: "Go",
        icon: "fas fa-code",
        code: `// Go 示例 - 并发编程示例
package main

import (
	"fmt"
	"sync"
	"time"
)

// 结构体定义
type Employee struct {
	ID        int
	FirstName string
	LastName  string
	Salary    float64
}

// 方法：获取全名
func (e Employee) FullName() string {
	return e.FirstName + " " + e.LastName
}

// 方法：增加薪水
func (e *Employee) IncreaseSalary(percent float64) {
	e.Salary += e.Salary * percent / 100
}

// 并发示例：使用goroutines和channels
func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
	defer wg.Done()
	for job := range jobs {
		fmt.Printf("Worker %d 开始处理任务 %d\\n", id, job)
		time.Sleep(time.Second) // 模拟工作耗时
		results <- job * 2      // 返回处理结果
		fmt.Printf("Worker %d 完成处理任务 %d\\n", id, job)
	}
}

func main() {
	fmt.Println("Go 示例程序")
	
	// 创建员工对象
	emp := Employee{
		ID:        1,
		FirstName: "张",
		LastName:  "三",
		Salary:    50000,
	}
	
	fmt.Printf("员工: %s\\n", emp.FullName())
	fmt.Printf("当前薪水: %.2f\\n", emp.Salary)
	
	// 增加薪水
	emp.IncreaseSalary(10)
	fmt.Printf("加薪后薪水: %.2f\\n", emp.Salary)
	
	// 并发示例
	fmt.Println("\\n并发示例:")
	jobs := make(chan int, 10)
	results := make(chan int, 10)
	var wg sync.WaitGroup
	
	// 启动3个worker
	for w := 1; w <= 3; w++ {
		wg.Add(1)
		go worker(w, jobs, results, &wg)
	}
	
	// 发送5个任务
	for j := 1; j <= 5; j++ {
		jobs <- j
	}
	close(jobs)
	
	// 等待所有worker完成
	wg.Wait()
	close(results)
	
	// 收集结果
	fmt.Print("任务结果: ")
	for result := range results {
		fmt.Printf("%d ", result)
	}
	fmt.Println()
}`
    },
    javascript: {
        name: "JavaScript",
        icon: "fab fa-js",
        code: `// JavaScript 示例 - 现代ES6+特性
// 箭头函数和模板字符串
const greet = (name) => \`你好，\${name}！欢迎使用赛博代码库。\`;

// 类定义
class Vehicle {
    constructor(make, model, year) {
        this.make = make;
        this.model = model;
        this.year = year;
    }
    
    // 获取车辆信息
    getInfo() {
        return \`\${this.year}年 \${this.make} \${this.model}\`;
    }
    
    // 静态方法
    static compareYears(vehicle1, vehicle2) {
        return vehicle1.year - vehicle2.year;
    }
}

// 继承
class ElectricCar extends Vehicle {
    constructor(make, model, year, batteryCapacity) {
        super(make, model, year);
        this.batteryCapacity = batteryCapacity;
    }
    
    // 重写父类方法
    getInfo() {
        return \`\${super.getInfo()} (电动，电池容量: \${this.batteryCapacity}kWh)\`;
    }
}

// 创建对象
const car1 = new Vehicle('丰田', '凯美瑞', 2020);
const car2 = new ElectricCar('特斯拉', 'Model 3', 2022, 75);

console.log(greet('开发者'));
console.log(car1.getInfo());
console.log(car2.getInfo());

// 数组方法示例
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log('\\n原始数组:', numbers);

// 使用map
const squares = numbers.map(n => n * n);
console.log('平方数:', squares);

// 使用filter
const evenNumbers = numbers.filter(n => n % 2 === 0);
console.log('偶数:', evenNumbers);

// 使用reduce
const sum = numbers.reduce((total, n) => total + n, 0);
console.log('总和:', sum);

// 异步函数示例
async function fetchData() {
    console.log('\\n开始获取数据...');
    // 模拟API调用
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ data: '模拟数据', status: '成功' });
        }, 1000);
    });
}

// 使用async/await
(async () => {
    const result = await fetchData();
    console.log('获取数据结果:', result);
})();`
    }
};

// 应用状态
let currentLanguage = 'python';
let currentTheme = 'cyber';

// DOM元素
const languageList = document.querySelector('.language-list');
const codeEditor = document.getElementById('code-editor');
const currentLanguageTitle = document.getElementById('current-language');
const infoLanguage = document.getElementById('info-language');
const infoLines = document.getElementById('info-lines');
const infoChars = document.getElementById('info-chars');
const infoLastSave = document.getElementById('info-last-save');

// 初始化语言列表
function initLanguageList() {
    for (const [key, lang] of Object.entries(codeExamples)) {
        const languageItem = document.createElement('div');
        languageItem.className = `language-item ${key === currentLanguage ? 'active' : ''}`;
        languageItem.dataset.lang = key;
        
        languageItem.innerHTML = `
            <i class="${lang.icon} language-icon"></i>
            <span>${lang.name}</span>
        `;
        
        languageItem.addEventListener('click', () => {
            switchLanguage(key);
        });
        
        languageList.appendChild(languageItem);
    }
}

// 切换语言
function switchLanguage(lang) {
    currentLanguage = lang;
    const langData = codeExamples[lang];
    
    // 更新代码编辑器
    codeEditor.value = langData.code;
    
    // 更新UI
    currentLanguageTitle.textContent = `${langData.name} 示例`;
    infoLanguage.textContent = langData.name;
    
    // 更新活动状态
    document.querySelectorAll('.language-item').forEach(item => {
        item.classList.toggle('active', item.dataset.lang === lang);
    });
    
    // 更新代码统计
    updateCodeStats();
    
    // 保存到本地存储
    saveToLocalStorage();
}

// 更新代码统计
function updateCodeStats() {
    const code = codeEditor.value;
    const lines = code.split('\n').length;
    const chars = code.length;
    
    infoLines.textContent = lines;
    infoChars.textContent = chars;
}

// 保存到本地存储
function saveToLocalStorage() {
    const codeData = {
        language: currentLanguage,
        code: codeEditor.value,
        lastSave: new Date().toLocaleString()
    };
    
    localStorage.setItem('cyberCodeLibrary', JSON.stringify(codeData));
    infoLastSave.textContent = codeData.lastSave;
    
    // 显示保存提示
    showNotification('代码已保存到本地存储');
}

// 从本地存储加载
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('cyberCodeLibrary');
    if (savedData) {
        try {
            const codeData = JSON.parse(savedData);
            if (codeExamples[codeData.language]) {
                switchLanguage(codeData.language);
                codeEditor.value = codeData.code;
                infoLastSave.textContent = codeData.lastSave;
                updateCodeStats();
            }
        } catch (e) {
            console.error('加载保存的数据时出错:', e);
        }
    }
}

// 显示通知
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: rgba(0, 20, 40, 0.9);
        color: #00ffea;
        border: 1px solid #00ffea;
        padding: 15px 20px;
        border-radius: 4px;
        font-family: 'Share Tech Mono', monospace;
        z-index: 1000;
        box-shadow: 0 0 15px rgba(0, 255, 234, 0.5);
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // 3秒后移除通知
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 切换主题
function switchTheme(theme) {
    currentTheme = theme;
    
    // 移除所有主题类
    document.body.classList.remove('cyber-theme', 'matrix-theme', 'neon-theme', 'terminal-theme');
    
    // 根据主题设置颜色
    let primaryColor, secondaryColor, bgColor;
    
    switch(theme) {
        case 'matrix':
            primaryColor = '#00ff00';
            secondaryColor = '#00aa00';
            bgColor = '#001100';
            break;
        case 'neon':
            primaryColor = '#ff00ff';
            secondaryColor = '#ff00aa';
            bgColor = '#110011';
            break;
        case 'terminal':
            primaryColor = '#ffffff';
            secondaryColor = '#cccccc';
            bgColor = '#000000';
            break;
        case 'cyber':
        default:
            primaryColor = '#00ffea';
            secondaryColor = '#00aaff';
            bgColor = '#0a0a14';
            break;
    }
    
    // 更新CSS变量
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    document.documentElement.style.setProperty('--bg-color', bgColor);
    
    // 更新UI元素
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    
    // 更新边框和文字颜色
    const elementsToUpdate = document.querySelectorAll('.panel-header, .language-item, .code-header, .btn, .section-title, .info-label, .corner-decoration');
    elementsToUpdate.forEach(el => {
        el.style.borderColor = primaryColor;
        if (el.classList.contains('panel-header') || el.classList.contains('section-title') || 
            el.classList.contains('info-label') || el.classList.contains('btn')) {
            el.style.color = primaryColor;
        }
    });
    
    // 更新阴影
    const shadowElements = document.querySelectorAll('#language-panel, #utility-panel, .btn:hover');
    shadowElements.forEach(el => {
        el.style.boxShadow = `0 0 15px ${primaryColor}40`;
    });
    
    // 更新网格和扫描线
    document.querySelector('.cyber-grid').style.backgroundImage = 
        `linear-gradient(${primaryColor}10 1px, transparent 1px),
         linear-gradient(90deg, ${primaryColor}10 1px, transparent 1px)`;
    
    document.querySelector('.scan-line').style.background = 
        `linear-gradient(to bottom, transparent, ${primaryColor}80, transparent)`;
    
    // 保存主题偏好
    localStorage.setItem('cyberCodeLibraryTheme', theme);
}

// 切换亮色/暗色模式
function toggleLightMode() {
    const isDark = document.body.style.backgroundColor !== 'rgb(240, 240, 245)';
    
    if (isDark) {
        document.body.style.backgroundColor = '#f0f0f5';
        document.body.style.color = '#333333';
        document.querySelectorAll('.code-editor-container, #language-panel, #utility-panel').forEach(el => {
            el.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        });
        document.querySelector('.code-editor').style.backgroundColor = '#ffffff';
        document.querySelector('.code-editor').style.color = '#333333';
        document.getElementById('theme-toggle-btn').innerHTML = '<i class="fas fa-adjust"></i> 切换暗色模式';
    } else {
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
        document.querySelectorAll('.code-editor-container, #language-panel, #utility-panel').forEach(el => {
            el.style.backgroundColor = '';
        });
        document.querySelector('.code-editor').style.backgroundColor = '';
        document.querySelector('.code-editor').style.color = '';
        document.getElementById('theme-toggle-btn').innerHTML = '<i class="fas fa-adjust"></i> 切换亮色模式';
        // 重新应用当前主题
        switchTheme(currentTheme);
    }
}

// 导出代码
function exportCode() {
    const code = codeEditor.value;
    const lang = codeExamples[currentLanguage].name;
    const filename = `cyber-code-${lang}-${new Date().toISOString().slice(0, 10)}.txt`;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification(`代码已导出为: ${filename}`);
}

// 新建代码文件
function newCodeFile() {
    if (confirm('创建新文件将清除当前编辑器内容，是否继续？')) {
        codeEditor.value = `// 新建 ${codeExamples[currentLanguage].name} 文件
// 创建时间: ${new Date().toLocaleString()}
// 开始编写您的代码...`;
        updateCodeStats();
        showNotification('已创建新文件');
    }
}

// 复制代码到剪贴板
function copyToClipboard() {
    codeEditor.select();
    document.execCommand('copy');
    
    // 取消选择
    window.getSelection().removeAllRanges();
    
    showNotification('代码已复制到剪贴板');
}

// 清空代码编辑器
function clearCodeEditor() {
    if (confirm('确定要清空代码编辑器吗？')) {
        codeEditor.value = '';
        updateCodeStats();
        showNotification('代码编辑器已清空');
    }
}

// 初始化事件监听器
function initEventListeners() {
    // 代码编辑器输入事件
    codeEditor.addEventListener('input', updateCodeStats);
    
    // 按钮事件
    document.getElementById('copy-btn').addEventListener('click', copyToClipboard);
    document.getElementById('save-btn').addEventListener('click', saveToLocalStorage);
    document.getElementById('clear-btn').addEventListener('click', clearCodeEditor);
    document.getElementById('export-btn').addEventListener('click', exportCode);
    document.getElementById('new-btn').addEventListener('click', newCodeFile);
    document.getElementById('theme-toggle-btn').addEventListener('click', toggleLightMode);
    
    // 主题选择事件
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchTheme(btn.dataset.theme);
        });
    });
}

// 初始化应用
function initApp() {
    initLanguageList();
    initEventListeners();
    
    // 加载保存的数据
    loadFromLocalStorage();
    
    // 加载保存的主题
    const savedTheme = localStorage.getItem('cyberCodeLibraryTheme') || 'cyber';
    switchTheme(savedTheme);
    
    // 初始代码统计
    updateCodeStats();
}

// 当页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);