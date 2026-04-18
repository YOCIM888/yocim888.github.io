#!/usr/bin/env node
/**
 * CSV 转导航链接 JSON（纯 Node.js 实现）
 * 
 * 用法：
 *   node csv_to_navlinks.js <输入.csv> -o <输出.json> -p <输出目录>
 * 
 * 支持参数：
 *   -o, --output   输出文件名（默认 links.json）
 *   -p, --path     输出目录（默认当前目录）
 *   --encoding     文件编码（默认 utf-8）
 *   --delimiter    分隔符（默认 ,）
 *   --indent       JSON 缩进空格数（默认 2）
 *   --cid, --cicon, --ctitle, --csub  分类列名映射
 *   --lname, --lurl, --licon, --ldesc, --ltag  链接列名映射
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');  // 需要安装: npm install csv-parse

// 解析命令行参数
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        input: null,
        output: 'links.json',
        path: '.',
        encoding: 'utf-8',
        delimiter: ',',
        indent: 2,
        // 列名映射默认值
        cid: 'category_id',
        cicon: 'category_icon',
        ctitle: 'category_title',
        csub: 'category_subtitle',
        lname: 'link_name',
        lurl: 'link_url',
        licon: 'link_icon',
        ldesc: 'link_desc',
        ltag: 'link_tag',
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (!arg.startsWith('-')) {
            options.input = arg;
        } else {
            const val = args[i + 1];
            switch (arg) {
                case '-o': case '--output': options.output = val; i++; break;
                case '-p': case '--path': options.path = val; i++; break;
                case '--encoding': options.encoding = val; i++; break;
                case '--delimiter': options.delimiter = val; i++; break;
                case '--indent': options.indent = parseInt(val); i++; break;
                case '--cid': options.cid = val; i++; break;
                case '--cicon': options.cicon = val; i++; break;
                case '--ctitle': options.ctitle = val; i++; break;
                case '--csub': options.csub = val; i++; break;
                case '--lname': options.lname = val; i++; break;
                case '--lurl': options.lurl = val; i++; break;
                case '--licon': options.licon = val; i++; break;
                case '--ldesc': options.ldesc = val; i++; break;
                case '--ltag': options.ltag = val; i++; break;
            }
        }
    }
    if (!options.input) {
        console.error('错误：必须指定输入 CSV 文件');
        process.exit(1);
    }
    return options;
}

// 主转换函数
function convertCsvToJson(options) {
    const inputPath = options.input;
    const colMap = {
        cid: options.cid,
        cicon: options.cicon,
        ctitle: options.ctitle,
        csub: options.csub,
        lname: options.lname,
        lurl: options.lurl,
        licon: options.licon,
        ldesc: options.ldesc,
        ltag: options.ltag,
    };

    // 读取 CSV
    const content = fs.readFileSync(inputPath, options.encoding);
    // 移除 UTF-8 BOM 头（如果存在）
    const contentWithoutBOM = content.length > 0 && content.charCodeAt(0) === 0xFEFF ? content.slice(1) : content;
    const records = parse(contentWithoutBOM, {
        columns: true,
        delimiter: options.delimiter,
        skip_empty_lines: true,
        trim: true,
    });
    console.log(`解析到 ${records.length} 条记录`);
    if (records.length > 0) {
        console.log('列名:', Object.keys(records[0]));
    }

    // 按分类 ID 分组
    const categoriesMap = new Map();

    records.forEach(row => {
        const cid = row[colMap.cid];
        if (!cid) return;

        if (!categoriesMap.has(cid)) {
            categoriesMap.set(cid, {
                id: cid,
                icon: row[colMap.cicon] || '',
                title: row[colMap.ctitle] || '',
                subtitle: row[colMap.csub] || '',
                links: [],
            });
        }

        const linkName = row[colMap.lname];
        if (!linkName) return;

        const category = categoriesMap.get(cid);
        category.links.push({
            name: linkName,
            url: row[colMap.lurl] || '',
            icon: row[colMap.licon] || '',
            desc: row[colMap.ldesc] || '',
            tag: row[colMap.ltag] || '',
        });
    });

    // 转换为最终格式
    const result = {
        categories: Array.from(categoriesMap.values())
    };

    // 输出 JSON
    const outputDir = path.resolve(options.path);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    const outputFile = path.join(outputDir, options.output);
    fs.writeFileSync(outputFile, JSON.stringify(result, null, options.indent), 'utf-8');

    const totalLinks = result.categories.reduce((sum, cat) => sum + cat.links.length, 0);
    console.log(`✅ 转换成功！`);
    console.log(`   输入: ${inputPath}`);
    console.log(`   输出: ${outputFile}`);
    console.log(`   分类数: ${result.categories.length}`);
    console.log(`   链接总数: ${totalLinks}`);

    return result;
}

// 如果直接运行此脚本，执行命令行转换
if (require.main === module) {
    const opts = parseArgs();
    convertCsvToJson(opts);
}

// 导出供其他模块使用
module.exports = { convertCsvToJson };