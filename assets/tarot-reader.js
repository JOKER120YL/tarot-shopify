// 塔罗牌抽卡功能

import tarotData from './tarot-data.js';

document.addEventListener('DOMContentLoaded', function() {
  // 初始化塔罗牌读取器
  initTarotReader();
});

/**
 * 初始化塔罗牌读取器
 */
function initTarotReader() {
  const tarotReaderSection = document.querySelector('.tarot-card-reader');
  
  // 如果页面上没有塔罗牌读取器，则退出
  if (!tarotReaderSection) return;
  
  const tarotDeck = document.getElementById('tarotDeck');
  const drawCardBtn = document.getElementById('drawCardBtn');
  const tarotResult = document.getElementById('tarotResult');
  const drawAgainBtn = document.getElementById('drawAgainBtn');
  
  // 绑定抽卡按钮事件
  if (drawCardBtn) {
    drawCardBtn.addEventListener('click', drawTarotCard);
  }
  
  // 绑定再抽一次按钮事件
  if (drawAgainBtn) {
    drawAgainBtn.addEventListener('click', resetTarotReader);
  }
  
  // 点击卡牌也可以抽卡
  if (tarotDeck) {
    tarotDeck.addEventListener('click', drawTarotCard);
  }
}

/**
 * 抽取塔罗牌
 */
function drawTarotCard() {
  // 获取大阿卡纳牌数据
  const majorArcana = tarotData.majorArcana;
  
  // 随机选择一张牌
  const randomIndex = Math.floor(Math.random() * majorArcana.length);
  const selectedCard = majorArcana[randomIndex];
  
  // 显示卡牌动画
  animateCardDrawing();
  
  // 延迟显示结果，让动画有时间完成
  setTimeout(() => {
    // 显示卡牌结果
    displayCardResult(selectedCard);
    
    // 获取并显示产品推荐
    getProductRecommendations(selectedCard);
  }, 1000);
}

/**
 * 卡牌抽取动画
 */
function animateCardDrawing() {
  const tarotDeck = document.getElementById('tarotDeck');
  const tarotCardBack = document.querySelector('.tarot-card-back');
  
  if (tarotCardBack) {
    tarotCardBack.classList.add('tarot-card-animation');
  }
}

/**
 * 显示卡牌结果
 * @param {Object} card - 选中的塔罗牌
 */
function displayCardResult(card) {
  const tarotDeck = document.getElementById('tarotDeck');
  const drawCardBtn = document.getElementById('drawCardBtn');
  const tarotResult = document.getElementById('tarotResult');
  const tarotCardImage = document.getElementById('tarotCardImage');
  const tarotCardName = document.getElementById('tarotCardName');
  const tarotCardMeaning = document.getElementById('tarotCardMeaning');
  const tarotCardEnergy = document.getElementById('tarotCardEnergy');
  
  // 隐藏抽卡按钮和卡组
  if (tarotDeck && tarotDeck.parentNode) {
    tarotDeck.parentNode.style.display = 'none';
  }
  if (drawCardBtn) {
    drawCardBtn.style.display = 'none';
  }
  
  // 设置卡牌图片
  if (tarotCardImage) {
    tarotCardImage.src = card.image.includes('http') ? card.image : `{{ 'assets/' | append: card.image | asset_url }}`;
    tarotCardImage.alt = card.name;
  }
  
  // 设置卡牌名称
  if (tarotCardName) {
    tarotCardName.textContent = card.name;
  }
  
  // 设置卡牌含义
  if (tarotCardMeaning) {
    tarotCardMeaning.textContent = card.meaning;
  }
  
  // 设置卡牌能量
  if (tarotCardEnergy) {
    tarotCardEnergy.textContent = card.energy;
  }
  
  // 显示结果区域
  if (tarotResult) {
    tarotResult.classList.remove('hidden');
  }
}

/**
 * 获取产品推荐
 * @param {Object} card - 选中的塔罗牌
 */
function getProductRecommendations(card) {
  // 在实际应用中，这里应该调用Shopify API获取产品
  // 这里使用模拟数据进行演示
  const productGrid = document.getElementById('tarotProductGrid');
  
  if (!productGrid) return;
  
  // 清空产品网格
  productGrid.innerHTML = '';
  
  // 获取要显示的产品数量
  const productsToShow = parseInt(document.querySelector('.tarot-card-reader').dataset.productsToShow || 3);
  
  // 模拟产品数据
  const mockProducts = [
    {
      id: 1,
      title: '神秘月光石手链',
      price: '¥299',
      image: 'moonstone-bracelet.jpg',
      url: '/products/moonstone-bracelet',
      energyMatch: '与' + card.name + '的能量高度匹配，增强直觉和内在力量。'
    },
    {
      id: 2,
      title: '紫水晶吊坠项链',
      price: '¥399',
      image: 'amethyst-necklace.jpg',
      url: '/products/amethyst-necklace',
      energyMatch: '与' + card.name + '的能量相辅相成，提升精神意识和保护能量。'
    },
    {
      id: 3,
      title: '太阳石耳环',
      price: '¥259',
      image: 'sunstone-earrings.jpg',
      url: '/products/sunstone-earrings',
      energyMatch: '与' + card.name + '的能量相互共振，带来活力和积极能量。'
    },
    {
      id: 4,
      title: '拉长石能量手镯',
      price: '¥329',
      image: 'labradorite-bangle.jpg',
      url: '/products/labradorite-bangle',
      energyMatch: '与' + card.name + '的能量形成平衡，增强保护和转化能力。'
    },
    {
      id: 5,
      title: '海蓝宝石戒指',
      price: '¥459',
      image: 'aquamarine-ring.jpg',
      url: '/products/aquamarine-ring',
      energyMatch: '与' + card.name + '的能量完美融合，促进沟通和内心平静。'
    },
    {
      id: 6,
      title: '绿松石项链',
      price: '¥359',
      image: 'turquoise-necklace.jpg',
      url: '/products/turquoise-necklace',
      energyMatch: '与' + card.name + '的能量相互增强，带来保护和治愈能量。'
    }
  ];
  
  // 根据卡牌标签筛选产品（在实际应用中，这里应该使用更复杂的算法）
  // 这里简单地随机打乱产品顺序
  const shuffledProducts = [...mockProducts].sort(() => 0.5 - Math.random());
  
  // 显示指定数量的产品
  const productsToDisplay = shuffledProducts.slice(0, productsToShow);
  
  // 创建产品卡片并添加到网格中
  productsToDisplay.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    productCard.innerHTML = `
      <div class="product-card-image-container">
        <img src="${product.image.includes('http') ? product.image : `{{ '${product.image}' | asset_url }}`}" alt="${product.title}" class="product-card-image">
      </div>
      <div class="product-card-info">
        <h4 class="product-card-title">${product.title}</h4>
        <div class="product-card-price">${product.price}</div>
        <div class="product-card-energy-match">${product.energyMatch}</div>
        <a href="${product.url}" class="product-card-link">查看详情</a>
      </div>
    `;
    
    productGrid.appendChild(productCard);
  });
}

/**
 * 重置塔罗牌读取器
 */
function resetTarotReader() {
  const tarotDeck = document.getElementById('tarotDeck');
  const drawCardBtn = document.getElementById('drawCardBtn');
  const tarotResult = document.getElementById('tarotResult');
  
  // 隐藏结果区域
  if (tarotResult) {
    tarotResult.classList.add('hidden');
  }
  
  // 显示抽卡按钮和卡组
  if (tarotDeck && tarotDeck.parentNode) {
    tarotDeck.parentNode.style.display = 'flex';
  }
  if (drawCardBtn) {
    drawCardBtn.style.display = 'block';
  }
  
  // 重置卡牌动画
  const tarotCardBack = document.querySelector('.tarot-card-back');
  if (tarotCardBack) {
    tarotCardBack.classList.remove('tarot-card-animation');
  }
}