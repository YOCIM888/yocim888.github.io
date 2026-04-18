const fs = require('fs');
const path = require('path');
const { paths } = require('../config');
const logger = require('../utils/logger');
const fileSystem = require('../utils/fileSystem');

class HtmlBuilder {
  constructor() {
    this.templatePath = paths.template;
    this.outputPath = paths.output;
    this.linksPath = paths.linksJson;
  }

  // 构建单个分类的HTML
  buildCategoryHtml(category, categoryIndex) {
    const titleText = category.subtitle ? 
      `${category.title} · ${category.subtitle}` : category.title;
    
    let categoryHtml = `<section class="category" id="${category.id}">\n`;
    categoryHtml += `  <div class="category-header">\n`;
    categoryHtml += `    <h2 class="category-title"><i class="${category.icon}"></i> ${titleText}</h2>\n`;
    categoryHtml += `    <button class="toggle-cards-btn" data-category="${category.id}">\n`;
    categoryHtml += `      <i class="fas fa-chevron-down"></i>\n`;
    categoryHtml += `      <span>展开</span>\n`;
    categoryHtml += `    </button>\n`;
    categoryHtml += `  </div>\n`;
    categoryHtml += `  <div class="card-grid collapsed">\n`;

    // 构建卡片HTML
    category.links.forEach((link, linkIndex) => {
      const cardId = `card-${category.id}-${linkIndex}`;
      categoryHtml += `    <a href="${link.url}" class="card" id="${cardId}" target="_blank" rel="noopener">\n`;
      categoryHtml += `      <i class="${link.icon} card-icon"></i>\n`;
      categoryHtml += `      <h3>${link.name}</h3>\n`;
      categoryHtml += `      <p>${link.desc || ''}</p>\n`;
      categoryHtml += `      <div class="card-footer">\n`;
      categoryHtml += `        <span class="card-link"><i class="fas fa-external-link-alt"></i> 访问</span>\n`;
      categoryHtml += `        <span class="tag">${link.tag || ''}</span>\n`;
      categoryHtml += `      </div>\n`;
      categoryHtml += `    </a>\n`;
    });

    categoryHtml += `  </div>\n`;
    categoryHtml += `</section>\n`;
    
    return categoryHtml;
  }

  // 构建所有分类的HTML
  buildCategoriesHtml(categories) {
    let categoriesHtml = '';
    
    categories.forEach((category, index) => {
      categoriesHtml += this.buildCategoryHtml(category, index);
    });
    
    return categoriesHtml;
  }

  // 替换模板中的内容
  replaceTemplateContent(template, newContent) {
    const mainRegex = /<main>([\s\S]*?)<\/main>/;
    const match = template.match(mainRegex);
    
    if (!match) {
      throw new Error('模板中未找到 <main> 标签');
    }

    const mainContent = match[1];
    const heroRegex = /<section class="hero">[\s\S]*?<\/section>/;
    const heroMatch = mainContent.match(heroRegex);
    
    if (!heroMatch) {
      throw new Error('模板中未找到 <section class="hero"> 区域');
    }

    const newMainContent = heroMatch[0] + newContent;
    return template.replace(mainRegex, `<main>${newMainContent}</main>`);
  }

  // 构建HTML文件
  build() {
    logger.start('开始构建HTML...');

    // 检查模板文件是否存在
    if (!fileSystem.exists(this.templatePath)) {
      logger.error(`模板文件不存在: ${this.templatePath}`);
      return false;
    }

    // 检查数据文件是否存在
    if (!fileSystem.exists(this.linksPath)) {
      logger.error(`数据文件不存在: ${this.linksPath}`);
      return false;
    }

    try {
      // 读取数据
      const data = fileSystem.readJson(this.linksPath);
      if (!data || !data.categories) {
        throw new Error('数据格式错误：缺少categories字段');
      }

      // 读取模板
      const template = fileSystem.readFile(this.templatePath);
      
      // 构建分类HTML
      const categoriesHtml = this.buildCategoriesHtml(data.categories);
      
      // 替换模板内容
      const newHtml = this.replaceTemplateContent(template, categoriesHtml);
      
      // 写入输出文件
      const success = fileSystem.writeFile(this.outputPath, newHtml);
      
      if (success) {
        logger.success(`HTML构建成功: ${this.outputPath}`);
        return true;
      } else {
        throw new Error('写入文件失败');
      }
      
    } catch (error) {
      logger.error('HTML构建失败:', error.message);
      return false;
    }
  }

  // 验证构建结果
  validate() {
    if (!fileSystem.exists(this.outputPath)) {
      return { valid: false, error: '输出文件不存在' };
    }

    const content = fileSystem.readFile(this.outputPath);
    const checks = [
      { name: '包含DOCTYPE', regex: /<!DOCTYPE html>/i },
      { name: '包含HTML标签', regex: /<html[^>]*>/i },
      { name: '包含head标签', regex: /<head>/i },
      { name: '包含body标签', regex: /<body[^>]*>/i },
      { name: '包含main标签', regex: /<main>/i }
    ];

    const errors = [];
    checks.forEach(check => {
      if (!check.regex.test(content)) {
        errors.push(check.name);
      }
    });

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : null
    };
  }
}

module.exports = HtmlBuilder;