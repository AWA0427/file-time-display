<%*
// 获取时间数据（完全匹配图片格式）
const created = tp.file.creation_date("YYYY年MM月DD日 HH:mm");
const modified = tp.file.last_modified_date("YYYY年MM月DD日 HH:mm");
%>
<div class="inline-title-container">
  <h1 class="inline-title"><% tp.file.title %></h1>
  <div class="note-time-display">
    <span class="note-created">CT:<%= created %></span>
    <span class="note-modified">MT:<%= modified %></span>
  </div>
</div>