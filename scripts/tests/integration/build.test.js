const MainBuilder = require('../../builders/mainBuilder');
const fileSystem = require('../../utils/fileSystem');
const path = require('path');
const fs = require('fs');

describe('MainBuilder Integration', () => {
  let mainBuilder;
  const testDir = path.join(__dirname, '..', '..', 'temp-test');
  const testDataDir = path.join(testDir, 'data');
  const testCsvPath = path.join(testDataDir, 'links.csv');
  const testTemplatePath = path.join(testDir, 'pages', 'examples', 'template.html');

  beforeEach(() => {
    // 创建测试目录结构
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    
    fs.mkdirSync(testDataDir, { recursive: true });
    fs.mkdirSync(path.dirname(testTemplatePath), { recursive: true });

    // 创建测试CSV文件
    const csvContent = `category_id,category_icon,category_title,category_subtitle,link_name,link_url,link_icon,link_desc,link_tag
test,fas fa-test,Test Category,Subtitle,Test Link,https://example.com,fas fa-link,Test description,test`;
    fs.writeFileSync(testCsvPath, csvContent);

    // 创建测试模板
    const templateContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Test Template</title>
</head>
<body>
    <main>
        <section class="hero">
            <h1>Hero Section</h1>
        </section>
    </main>
</body>
</html>
    `;
    fs.writeFileSync(testTemplatePath, templateContent);

    // 创建MainBuilder实例
    mainBuilder = new MainBuilder({ production: false });
    
    // 重写路径配置
    mainBuilder.htmlBuilder.templatePath = testTemplatePath;
    mainBuilder.htmlBuilder.outputPath = path.join(testDir, 'index.html');
  });

  afterEach(() => {
    // 清理测试目录
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  test('fullBuild should complete successfully', async () => {
    // 模拟CSV转换模块
    const mockCsvConverter = {
      convertCsvToJson: jest.fn().mockImplementation((options) => {
        const jsonData = {
          categories: [
            {
              id: 'test',
              title: 'Test Category',
              subtitle: 'Subtitle',
              icon: 'fas fa-test',
              links: [
                {
                  name: 'Test Link',
                  url: 'https://example.com',
                  icon: 'fas fa-link',
                  desc: 'Test description',
                  tag: 'test'
                }
              ]
            }
          ]
        };
        
        const jsonPath = path.join(options.path, options.output);
        fs.writeFileSync(jsonPath, JSON.stringify(jsonData));
      })
    };
    
    mainBuilder.csvConverter = mockCsvConverter;

    const result = await mainBuilder.fullBuild();

    expect(result).toBe(true);
    expect(mockCsvConverter.convertCsvToJson).toHaveBeenCalled();
    
    // 检查输出文件是否存在
    const outputPath = mainBuilder.htmlBuilder.outputPath;
    expect(fs.existsSync(outputPath)).toBe(true);
  });

  test('convertCsvToJson should handle missing CSV file', () => {
    // 删除CSV文件
    fs.unlinkSync(testCsvPath);

    const result = mainBuilder.convertCsvToJson();

    expect(result).toBe(false);
  });

  test('buildHtml should handle missing template file', () => {
    // 删除模板文件
    fs.unlinkSync(testTemplatePath);

    const result = mainBuilder.buildHtml();

    expect(result).toBe(false);
  });
});