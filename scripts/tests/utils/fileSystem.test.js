const fileSystem = require('../../utils/fileSystem');
const path = require('path');
const fs = require('fs');

describe('FileSystem Utility', () => {
  const testDir = path.join(__dirname, '..', '..', 'temp-test');
  const testFile = path.join(testDir, 'test.txt');
  const testJsonFile = path.join(testDir, 'test.json');

  beforeEach(() => {
    // 清理测试目录
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    // 清理测试目录
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  test('ensureDir should create directory if not exists', () => {
    expect(fs.existsSync(testDir)).toBe(false);
    
    const result = fileSystem.ensureDir(testDir);
    
    expect(result).toBe(testDir);
    expect(fs.existsSync(testDir)).toBe(true);
  });

  test('writeFile should create file with content', () => {
    const content = 'Hello, World!';
    
    const result = fileSystem.writeFile(testFile, content);
    
    expect(result).toBe(true);
    expect(fs.existsSync(testFile)).toBe(true);
    expect(fs.readFileSync(testFile, 'utf8')).toBe(content);
  });

  test('readFile should return content if file exists', () => {
    const content = 'Test content';
    fs.mkdirSync(path.dirname(testFile), { recursive: true });
    fs.writeFileSync(testFile, content);
    
    const result = fileSystem.readFile(testFile);
    
    expect(result).toBe(content);
  });

  test('readFile should return default value if file not exists', () => {
    const defaultValue = 'default';
    
    const result = fileSystem.readFile(testFile, defaultValue);
    
    expect(result).toBe(defaultValue);
  });

  test('writeJson should create JSON file', () => {
    const data = { name: 'test', value: 123 };
    
    const result = fileSystem.writeJson(testJsonFile, data);
    
    expect(result).toBe(true);
    expect(fs.existsSync(testJsonFile)).toBe(true);
    
    const content = fs.readFileSync(testJsonFile, 'utf8');
    expect(JSON.parse(content)).toEqual(data);
  });

  test('readJson should parse JSON file', () => {
    const data = { name: 'test', value: 123 };
    fs.mkdirSync(path.dirname(testJsonFile), { recursive: true });
    fs.writeFileSync(testJsonFile, JSON.stringify(data));
    
    const result = fileSystem.readJson(testJsonFile);
    
    expect(result).toEqual(data);
  });

  test('exists should check file existence', () => {
    expect(fileSystem.exists(testFile)).toBe(false);
    
    fs.mkdirSync(path.dirname(testFile), { recursive: true });
    fs.writeFileSync(testFile, 'test');
    
    expect(fileSystem.exists(testFile)).toBe(true);
  });
});