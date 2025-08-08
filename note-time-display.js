// 保存至 Templater 脚本文件夹（如 Templates/Scripts/）
function initTimeDisplay() {
  const title = document.querySelector('.inline-title');
  if (!title) return;

  // 从文件元数据获取时间（兼容旧笔记）
  const file = app.workspace.getActiveFile();
  if (!file) return;
  
  const created = new Date(file.stat.ctime).toLocaleDateString();
  const modified = new Date(file.stat.mtime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  
  // 注入时间数据
  title.dataset.created = created;
  title.dataset.modified = modified;
}

// 监听笔记打开事件
app.workspace.on('file-open', () => setTimeout(initTimeDisplay, 300));