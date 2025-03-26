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
  res.sendFile(path.join(__dirname, 'layout/theme.liquid'));
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
    
    // 简单替换content_for_layout占位符
    const renderedPage = layoutContent.replace('{{ content_for_layout }}', templateContent);
    
    // 发送渲染后的页面
    res.send(renderedPage);
  } else {
    res.status(404).send('Page not found');
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Shopify主题预览服务器运行在 http://localhost:${port}`);
  console.log(`访问塔罗牌页面: http://localhost:${port}/pages/tarot`);
});