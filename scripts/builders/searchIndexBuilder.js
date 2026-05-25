const fs = require('fs');
const path = require('path');
const { paths } = require('../config');
const logger = require('../utils/logger');
const fileSystem = require('../utils/fileSystem');

class SearchIndexBuilder {
    constructor() {
        this.linksPath = paths.linksJson;
        this.outputPath = paths.searchIndex;
    }

    build() {
        logger.start('开始生成搜索索引...');

        if (!fileSystem.exists(this.linksPath)) {
            logger.error('链接数据文件不存在: ' + this.linksPath);
            return false;
        }

        try {
            const data = fileSystem.readJson(this.linksPath);
            if (!data || !data.categories) {
                throw new Error('数据格式错误：缺少categories字段');
            }

            const index = [];

            data.categories.forEach(category => {
                const categoryTitle = category.title || '';
                const categoryId = category.id || '';

                category.links.forEach((link, linkIndex) => {
                    index.push({
                        id: 'card-' + categoryId + '-' + linkIndex,
                        title: link.name || '',
                        description: link.desc || '',
                        link: link.url || '',
                        tag: link.tag || '',
                        category: categoryTitle,
                        page: '/'
                    });
                });
            });

            const outputDir = path.dirname(this.outputPath);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            fs.writeFileSync(this.outputPath, JSON.stringify(index, null, 2), 'utf-8');

            logger.success('搜索索引生成成功: ' + this.outputPath);
            logger.info('索引条目数: ' + index.length);
            return true;

        } catch (error) {
            logger.error('搜索索引生成失败: ' + error.message);
            return false;
        }
    }
}

module.exports = SearchIndexBuilder;
