#!/usr/bin/env node
/**
 * JSON 转 CSV（反向转换工具）
 * 
 * 从 data/links.json 读取导航数据，生成扁平 CSV 文件，保存为 data/test.csv
 * 
 * 用法：
 *   node json_to_csv.js [--output <文件名>] [--path <输出目录>] [--encoding <编码>]
 * 
 * 示例：
 *   node json_to_csv.js                           # 默认输出 data/test.csv (UTF-8 with BOM)
 *   node json_to_csv.js --encoding gbk            # 输出为 GBK 编码
 *   node json_to_csv.js -o backup.csv -p ./export
 */

const fs = require('fs');
const path = require('path');

// ========== 配置 ==========
const rootDir = path.join(__dirname, '..');
const dataDir = path.join(rootDir, 'data');
const jsonPath = path.join(dataDir, 'links.json');

// 默认输出
const defaultOutputFile = 'test.csv';
const defaultOutputPath = dataDir;
const defaultEncoding = 'utf8bom';  // 特殊标记，实际写入时添加 BOM

// CSV 列配置
const COLUMNS = [
    { key: 'category_id',      label: 'category_id' },
    { key: 'category_icon',    label: 'category_icon' },
    { key: 'category_title',   label: 'category_title' },
    { key: 'category_subtitle',label: 'category_subtitle' },
    { key: 'link_name',        label: 'link_name' },
    { key: 'link_url',         label: 'link_url' },
    { key: 'link_icon',        label: 'link_icon' },
    { key: 'link_desc',        label: 'link_desc' },
    { key: 'link_tag',         label: 'link_tag' },
];

// ========== 解析命令行参数 ==========
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        output: defaultOutputFile,
        path: defaultOutputPath,
        encoding: defaultEncoding,
    };
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        const val = args[i + 1];
        if (arg === '-o' || arg === '--output') {
            options.output = val; i++;
        } else if (arg === '-p' || arg === '--path') {
            options.path = val; i++;
        } else if (arg === '--encoding') {
            options.encoding = val; i++;
        }
    }
    return options;
}

// ========== CSV 转义 ==========
function escapeCsvField(field) {
    if (field === null || field === undefined) return '';
    const str = String(field);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}

// ========== 写入文件（支持编码转换和 BOM） ==========
function writeFileWithEncoding(filePath, content, encoding) {
    if (encoding === 'utf8bom') {
        // UTF-8 with BOM
        const bom = Buffer.from([0xEF, 0xBB, 0xBF]);
        const contentBuffer = Buffer.from(content, 'utf8');
        const finalBuffer = Buffer.concat([bom, contentBuffer]);
        fs.writeFileSync(filePath, finalBuffer);
    } else {
        // 其他编码：使用 Buffer 转换（仅支持 Node.js 内置支持的编码）
        // 注意：Node.js 的 Buffer 支持 'utf8', 'gbk', 'gb2312', 'latin1' 等
        fs.writeFileSync(filePath, content, encoding);
    }
}

// ========== 主转换函数 ==========
function convertJsonToCsv(jsonFile, outputFile, encoding) {
    if (!fs.existsSync(jsonFile)) {
        console.error(`❌ 错误：找不到 JSON 文件 ${jsonFile}`);
        process.exit(1);
    }

    console.log(`📖 读取 JSON: ${jsonFile}`);
    const jsonContent = fs.readFileSync(jsonFile, 'utf8');
    let data;
    try {
        data = JSON.parse(jsonContent);
    } catch (e) {
        console.error('❌ JSON 解析失败:', e.message);
        process.exit(1);
    }

    if (!data.categories || !Array.isArray(data.categories)) {
        console.error('❌ JSON 格式不正确，缺少 categories 数组');
        process.exit(1);
    }

    // 生成 CSV 行
    const rows = [];
    
    // 表头
    const header = COLUMNS.map(col => escapeCsvField(col.label)).join(',');
    rows.push(header);

    let totalLinks = 0;
    data.categories.forEach(category => {
        const categoryFields = {
            category_id: category.id || '',
            category_icon: category.icon || '',
            category_title: category.title || '',
            category_subtitle: category.subtitle || '',
        };

        if (category.links && Array.isArray(category.links)) {
            category.links.forEach(link => {
                const linkFields = {
                    link_name: link.name || '',
                    link_url: link.url || '',
                    link_icon: link.icon || '',
                    link_desc: link.desc || '',
                    link_tag: link.tag || '',
                };

                const rowData = { ...categoryFields, ...linkFields };
                const row = COLUMNS.map(col => escapeCsvField(rowData[col.key])).join(',');
                rows.push(row);
                totalLinks++;
            });
        }
    });

    const csvContent = rows.join('\n');

    // 写入文件（处理编码）
    writeFileWithEncoding(outputFile, csvContent, encoding);

    console.log(`✅ 转换成功！`);
    console.log(`   输入: ${jsonFile}`);
    console.log(`   输出: ${outputFile}`);
    console.log(`   编码: ${encoding === 'utf8bom' ? 'UTF-8 with BOM' : encoding}`);
    console.log(`   分类数: ${data.categories.length}`);
    console.log(`   链接总数: ${totalLinks}`);
}

// ========== 主入口 ==========
if (require.main === module) {
    const options = parseArgs();
    const outputDir = path.resolve(options.path);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    const outputFile = path.join(outputDir, options.output);
    
    convertJsonToCsv(jsonPath, outputFile, options.encoding);
}