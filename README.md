# 🤖 ClaudeStrap - Claude Web Interface

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-327FC7?style=for-the-badge&logo=github&logoColor=white)](https://journeyhans.github.io/ClaudeStrap/)
[![Live Demo](https://img.shields.io/badge/Live-Demo-00D9FF?style=for-the-badge&logo=vercel&logoColor=white)](https://journeyhans.github.io/ClaudeStrap/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

一个功能完整的 Claude 网页界面，支持对话历史管理、多会话和数据导出功能。

## 🌐 在线体验

**🚀 立即体验**: [https://journeyhans.github.io/ClaudeStrap/](https://journeyhans.github.io/ClaudeStrap/)

无需下载，直接在浏览器中使用！

## ✨ 功能特性

### 🎯 核心功能
- 🎨 现代化的用户界面设计
- 🔒 安全的 API 密钥存储（本地存储）
- 💬 实时对话功能
- 📱 响应式设计，支持移动设备
- ⚡ 快速响应和加载状态

### 📚 对话历史管理
- 📝 **多对话支持** - 创建和管理多个独立对话
- 💾 **自动保存** - 对话内容自动保存到本地存储
- 🔄 **对话切换** - 在不同对话间自由切换
- ✏️ **标题编辑** - 自定义对话标题
- 🗑️ **删除功能** - 删除不需要的对话

### 📤 数据导出
- 📄 **单对话导出** - 导出单个对话为 Markdown 文件
- 📚 **批量导出** - 一键导出所有对话历史
- 📊 **格式化输出** - 包含时间戳和完整对话内容

### 🎨 界面特性
- 🖼️ **侧边栏设计** - 直观的对话历史列表
- 🎯 **活跃状态** - 清晰显示当前对话
- 🌙 **现代风格** - 渐变背景和流畅动画
- 📐 **响应式布局** - 适配各种屏幕尺寸

## 🚀 使用方法

### 🌐 在线使用（推荐）
1. 访问 [https://journeyhans.github.io/ClaudeStrap/](https://journeyhans.github.io/ClaudeStrap/)
2. 在顶部的输入框中输入您的 Claude API 密钥
3. （可选）修改 API URL（如果需要）
4. 点击"保存配置"按钮

### 💻 本地使用
1. 下载或克隆本项目
2. 打开 `index.html` 文件
3. 在顶部的输入框中输入您的 Claude API 密钥
4. （可选）修改 API URL（如果需要）
5. 点击"保存配置"按钮

### 对话管理
- **新建对话** - 点击侧边栏"➕ 新对话"按钮
- **切换对话** - 点击侧边栏中的对话标题
- **编辑标题** - 点击对话旁的"✏️"按钮
- **删除对话** - 点击对话旁的"🗑️"按钮
- **清空当前** - 点击"清空对话"按钮
- **清空所有** - 点击"🗑️ 清空历史"按钮

### 导出功能
- **导出当前对话** - 点击"📥 导出对话"按钮
- **导出所有对话** - 点击侧边栏"📥 导出全部"按钮

### 日常使用
1. 在底部的输入框中输入您的问题
2. 按 Enter 键或点击"发送"按钮
3. 等待 Claude 回复
4. 继续对话或开始新对话

## 📁 文件说明

- `index.html` - 主页面文件
- `script.js` - JavaScript 功能实现
- `style.css` - 样式文件
- `README.md` - 说明文档

## 🛠️ 技术栈

- **前端**: HTML5, CSS3 (Flexbox), 原生 JavaScript (ES6+)
- **API**: Claude API v1
- **存储**: LocalStorage
- **导出**: Markdown 格式

## 🌐 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🔒 安全说明

- API 密钥仅保存在您的浏览器本地存储中
- 所有对话数据存储在本地，不会上传到任何服务器
- 建议在本地环境中使用此界面
- 请妥善保管您的 API 密钥，不要分享给他人

## 💡 使用技巧

1. **定期导出** - 建议定期导出重要对话作为备份
2. **标题管理** - 使用有意义的标题便于后续查找
3. **多对话分类** - 不同主题使用不同对话
4. **移动使用** - 支持手机浏览器，可随时随地使用

## 🚀 开始使用

### 🌟 推荐：在线体验
**立即访问**: [https://journeyhans.github.io/ClaudeStrap/](https://journeyhans.github.io/ClaudeStrap/)

无需下载，直接在浏览器中开始您的 Claude 对话之旅！

### 📦 本地部署
如果您更喜欢本地使用，可以：
```bash
# 克隆项目
git clone https://github.com/JourneyHans/ClaudeStrap.git

# 进入项目目录
cd ClaudeStrap

# 打开 index.html 文件
```

或者直接下载 ZIP 文件并解压后打开 `index.html`。

---

## 📈 项目统计

[![GitHub stars](https://img.shields.io/github/stars/JourneyHans/ClaudeStrap?style=social)](https://github.com/JourneyHans/ClaudeStrap)
[![GitHub forks](https://img.shields.io/github/forks/JourneyHans/ClaudeStrap?style=social)](https://github.com/JourneyHans/ClaudeStrap)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！如果您发现了问题或有改进建议，请：

1. [创建 Issue](https://github.com/JourneyHans/ClaudeStrap/issues)
2. Fork 项目
3. 创建您的特性分支
4. 提交您的改动
5. 推送到分支
6. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

**⭐ 如果这个项目对您有帮助，请考虑给个 Star！**