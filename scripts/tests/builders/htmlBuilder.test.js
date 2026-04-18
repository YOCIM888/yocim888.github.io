const HtmlBuilder = require('../../builders/htmlBuilder');
const fileSystem = require('../../utils/fileSystem');
const path = require('path');
const fs = require('fs');

describe('HtmlBuilder', () => {
  let htmlBuilder;
  const testDir = path.join(__dirname, '..', '..', 'temp-test');
  const testTemplatePath = path.join(testDir, 'template.html');
  const testLinksPath = path.join(testDir, 'links.json');
  const testOutputPath = path.join(testDir, 'output.html');

  beforeEach(() => {
    // 创建测试目录
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testDir, { recursive: true });

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

    // 创建测试数据
    const testData = {
      categories: [
        {
          id: 'test-category',
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
    fs.writeFileSync(testLinksPath, JSON.stringify(testData));

    // 创建HtmlBuilder实例
    htmlBuilder = new HtmlBuilder();
    htmlBuilder.templatePath = testTemplatePath;
    htmlBuilder.linksPath = testLinksPath;
    htmlBuilder.outputPath = testOutputPath;
  });

  afterEach(() => {
    // 清理测试目录
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  test('buildCategoryHtml should generate valid HTML', () => {
    const category = {
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
    };

    const html = htmlBuilder.buildCategoryHtml(category, 0);

    expect(html).toContain('class="category"');
    expect(html).toContain('id="test"');
    expect(html).toContain('Test Category');
    expect(html).toContain('https://example.com');
    expect(html).toContain('Test Link');
  });

  test('build should create output file', () => {
    const result = htmlBuilder.build();

    expect(result).toBe(true);
    expect(fs.existsSync(testOutputPath)).toBe(true);

    const outputContent = fs.readFileSync(testOutputPath, 'utf8');
    expect(outputContent).toContain('<!DOCTYPE html>');
    expect(outputContent).toContain('Test Category');
    expect(outputContent).toContain('https://example.com');
  });

  test('validate should check HTML structure', () => {
    // 先构建HTML
    htmlBuilder.build();

    const validation = htmlBuilder.validate();

    expect(validation.valid).toBe(true);
    expect(validation.errors).toBeNull();
  });

  test('validate should detect invalid HTML', () => {
    // 创建无效的HTML文件
    fs.writeFileSync(testOutputPath, 'invalid content');

    const validation = htmlBuilder.validate();

    expect(validation.valid).toBe(false);
    expect(validation.errors).toBeDefined();
    expect(validation.errors.length).toBeGreaterThan(0);
  });

  test('replaceTemplateContent should replace main content', () => {
    const template = `
<!DOCTYPE html>
<html>
<body>
    <main>
        <section class="hero">Hero</section>
    </main>
</body>
</html>
    `;

    const newContent = '<div>New Content</div>';
    const result = htmlBuilder.replaceTemplateContent(template, newContent);

    expect(result).toContain('<section class="hero">Hero</section>');
    expect(result).toContain('<div>New Content</div>');
    expect(result).toContain('<!DOCTYPE html>');
  });
});