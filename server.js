// 本地开发服务器
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// 静态文件服务
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// 处理Liquid模板
app.get('/', (req, res) => {
  // 读取主题布局
  const layoutContent = fs.readFileSync(path.join(__dirname, 'layout/theme.liquid'), 'utf8');
  
  // 简单处理一些基本的Liquid变量
  let renderedPage = layoutContent
    .replace(/{{ shop.name }}/g, 'Tarot Shopify Store')
    .replace(/{{ shop.locale }}/g, 'zh-CN')
    .replace(/{{ page_title }}/g, '首页')
    .replace(/{{ canonical_url }}/g, 'http://localhost:3000')
    .replace(/{{ content_for_header }}/g, '')
    .replace(/{{ content_for_layout }}/g, '<div class="welcome-message">欢迎来到塔罗牌商店</div>');
  
  // 处理资源URL
  renderedPage = renderedPage.replace(/{{ ['"](.*?)['"] \| asset_url \| (stylesheet_tag|script_tag) }}/g, (match, assetPath, tagType) => {
    const assetUrl = `/assets/${assetPath}`;
    return tagType === 'stylesheet_tag' 
      ? `<link rel="stylesheet" href="${assetUrl}">` 
      : `<script src="${assetUrl}"></script>`;
  });
  
  // 处理section标签
  renderedPage = processLiquidSections(renderedPage);
  
  res.send(renderedPage);
});

// 处理pages路由
app.get('/pages/:page', (req, res) => {
  const pageName = req.params.page;
  const templatePath = path.join(__dirname, `templates/page.${pageName}.liquid`);
  
  // 检查模板是否存在
  if (fs.existsSync(templatePath)) {
    // 读取模板内容
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    
    // 读取主题布局
    const layoutContent = fs.readFileSync(path.join(__dirname, 'layout/theme.liquid'), 'utf8');
    
    // 处理页面内容中的section标签
    let processedContent = processLiquidSections(templateContent);
    
    // 创建页面变量
    const pageData = {
      title: `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} - Tarot Shopify Store`,
      content: pageName === 'tarot' ? '<p>通过塔罗牌了解自己，获得指引。抽一张牌，看看宇宙想告诉你什么。</p>' : `<p>这是${pageName}页面的内容。</p>`
    };
    
    // 替换页面变量
    processedContent = processedContent
      .replace(/{{ page.title }}/g, pageData.title)
      .replace(/{{ page.content }}/g, pageData.content);
    
    // 处理主题布局
    let renderedPage = layoutContent
      .replace(/{{ shop.name }}/g, 'Tarot Shopify Store')
      .replace(/{{ shop.locale }}/g, 'zh-CN')
      .replace(/{{ page_title }}/g, pageData.title)
      .replace(/{{ canonical_url }}/g, `http://localhost:3000/pages/${pageName}`)
      .replace(/{{ content_for_header }}/g, '')
      .replace(/{{ content_for_layout }}/g, processedContent);
    
    // 处理资源URL
    renderedPage = renderedPage.replace(/{{ ['"](.*?)['"] \| asset_url \| (stylesheet_tag|script_tag) }}/g, (match, assetPath, tagType) => {
      const assetUrl = `/assets/${assetPath}`;
      return tagType === 'stylesheet_tag' 
        ? `<link rel="stylesheet" href="${assetUrl}">` 
        : `<script src="${assetUrl}"></script>`;
    });
    
    // 处理section标签
    renderedPage = processLiquidSections(renderedPage);
    
    // 发送渲染后的页面
    res.send(renderedPage);
  } else {
    res.status(404).send('Page not found');
  }
});

// 处理Liquid模板的函数
function processLiquidSections(content) {
  // 处理section标签
  let processedContent = content.replace(/{%\s*section\s+'([^']+)'\s*%}/g, (match, sectionName) => {
    const sectionPath = path.join(__dirname, `sections/${sectionName}.liquid`);
    if (fs.existsSync(sectionPath)) {
      const sectionContent = fs.readFileSync(sectionPath, 'utf8');
      // 移除schema部分，因为它只是用于Shopify编辑器的配置
      let sectionHtml = sectionContent.replace(/{%\s*schema\s*%}[\s\S]*?{%\s*endschema\s*%}/g, '');
      // 递归处理section内的Liquid标签
      return processLiquidTemplate(sectionHtml);
    }
    return `<!-- Section ${sectionName} not found -->`;
  });
  
  return processLiquidTemplate(processedContent);
}

// 处理所有Liquid模板标签
function processLiquidTemplate(content) {
  let processedContent = content;
  
  // 处理comment标签
  processedContent = processedContent.replace(/{%\s*comment\s*%}[\s\S]*?{%\s*endcomment\s*%}/g, '');
  
  // 处理if标签（简化处理）
  processedContent = processedContent.replace(/{%\s*if\s+([^%]+)\s*%}([\s\S]*?){%\s*endif\s*%}/g, (match, condition, content) => {
    // 简单处理，这里假设条件为真
    return content;
  });
  
  // 处理for标签（简化处理）
  processedContent = processedContent.replace(/{%\s*for\s+([^%]+)\s*%}([\s\S]*?){%\s*endfor\s*%}/g, (match, loopDef, content) => {
    // 简单处理，这里返回空字符串
    return '';
  });
  
  // 处理Liquid变量
  processedContent = processedContent.replace(/{{\s*([^}]+)\s*}}/g, (match, variable) => {
    // 处理asset_url过滤器
    if (variable.includes('asset_url')) {
      const assetMatch = variable.match(/['"](.*?)['"]\s*\|\s*asset_url/);
      if (assetMatch) {
        const assetPath = assetMatch[1];
        const assetUrl = `/assets/${assetPath}`;
        
        // 处理stylesheet_tag和script_tag过滤器
        if (variable.includes('stylesheet_tag')) {
          return `<link rel="stylesheet" href="${assetUrl}">`;
        } else if (variable.includes('script_tag')) {
          return `<script src="${assetUrl}"></script>`;
        } else {
          return assetUrl;
        }
      }
    }
    
    // 处理img_url过滤器
    if (variable.includes('img_url')) {
      const imgMatch = variable.match(/([^\|]+)\s*\|\s*img_url/);
      if (imgMatch) {
        // 简化处理，返回一个占位图片URL
        return '/assets/images/placeholder.jpg';
      }
    }
    
    // 处理其他变量（简化处理）
    if (variable.trim() === 'page.title') {
      return '塔罗牌抽卡';
    } else if (variable.trim() === 'page.content') {
      return '<p>通过塔罗牌了解自己，获得指引。抽一张牌，看看宇宙想告诉你什么。</p>';
    } else if (variable.trim() === 'shop.name') {
      return 'Tarot Shopify Store';
    } else if (variable.trim() === 'content_for_header') {
      return '';
    } else if (variable.trim().startsWith('section.settings.')) {
      // 处理section设置
      const settingKey = variable.trim().replace('section.settings.', '');
      // 返回一些默认值
      if (settingKey.includes('color')) {
        return '#6B5B95';
      } else if (settingKey.includes('title')) {
        return '为你推荐的能量匹配饰品';
      } else {
        return '';
      }
    }
    
    // 默认返回空字符串
    return '';
  });
  
  return processedContent;
}

// 启动服务器
app.listen(port, () => {
  console.log(`Shopify主题预览服务器运行在 http://localhost:${port}`);
  console.log(`访问塔罗牌页面: http://localhost:${port}/pages/tarot`);
});