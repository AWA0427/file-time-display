// 自动更新时间（每30分钟）
setInterval(() => {
  const lastModified = new Date(document.querySelector('.inline-title').dataset.modified);
  const now = new Date();
  const diffMinutes = Math.round((now - lastModified) / 60000);

  if (diffMinutes > 30) {
    updateModifiedTime();
  }
}, 30 * 60 * 1000); // 30分钟