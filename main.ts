import { 
  App, 
  Plugin, 
  PluginSettingTab, 
  Setting, 
  TFile, 
  MarkdownView,
  moment 
} from 'obsidian';

interface FileTimeDisplaySettings {
  dateFormat: string;
  showCreated: boolean;
  showModified: boolean;
  position: 'below-title' | 'above-content';
}

const DEFAULT_SETTINGS: FileTimeDisplaySettings = {
  dateFormat: 'YYYY-MM-DD HH:mm',
  showCreated: true,
  showModified: true,
  position: 'below-title'
};

export default class FileTimeDisplayPlugin extends Plugin {
  settings: FileTimeDisplaySettings;
  private timeDisplayEl: HTMLElement | null = null;

  async onload() {
    await this.loadSettings();
    
    // 初始化时间显示
    this.addTimeDisplay();
    
    // 注册事件监听器
    this.registerEventListeners();
    
    // 添加设置选项卡
    this.addSettingTab(new FileTimeDisplaySettingTab(this.app, this));
  }
  
  private registerEventListeners() {
    // 监听文件切换事件
    this.registerEvent(
      this.app.workspace.on('file-open', (file) => {
        this.addTimeDisplay();
      })
    );
    
    // 监听文件修改事件
    this.registerEvent(
      this.app.vault.on('modify', (file) => {
        if (file === this.app.workspace.getActiveFile()) {
          this.updateTimeDisplay();
        }
      })
    );
    
    // 监听文件重命名事件
    this.registerEvent(
      this.app.vault.on('rename', (file) => {
        if (file === this.app.workspace.getActiveFile()) {
          this.updateTimeDisplay();
        }
      })
    );
  }
  
  private addTimeDisplay() {
    // 清理旧的时间显示
    this.timeDisplayEl?.remove();
    this.timeDisplayEl = null;
    
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) return;
    
    const file = view.file;
    if (!file) return;
    
    // 创建时间显示容器
    this.timeDisplayEl = document.createElement('div');
    this.timeDisplayEl.className = 'file-time-display';
    
    // 更新显示内容
    this.updateTimeDisplay();
    
    // 根据设置插入位置
    if (this.settings.position === 'below-title') {
      // 插入到标题下方
      const titleEl = view.containerEl.querySelector('.inline-title');
      if (titleEl) {
        titleEl.after(this.timeDisplayEl);
      }
    } else {
      // 插入到内容上方
      const contentEl = view.containerEl.querySelector('.markdown-preview-view');
      if (contentEl) {
        contentEl.prepend(this.timeDisplayEl);
      }
    }
  }
  
  private updateTimeDisplay() {
    if (!this.timeDisplayEl) return;
    
    const file = this.app.workspace.getActiveFile();
    if (!file) return;
    
    const createdTime = moment(file.stat.ctime);
    const modifiedTime = moment(file.stat.mtime);
    
    let displayHTML = '';
    
    if (this.settings.showCreated) {
      displayHTML += `<span class="created-time">
        <span class="icon">C-T</span>
        <span class="label">创建: </span>
        <span class="time-value">${createdTime.format(this.settings.dateFormat)}</span>
      </span>`;
    }
    
    if (this.settings.showCreated && this.settings.showModified) {
      displayHTML += `<span class="separator"> | </span>`;
    }
    
    if (this.settings.showModified) {
      displayHTML += `<span class="modified-time">
        <span class="icon">M-T</span>
        <span class="label">修改: </span>
        <span class="time-value">${modifiedTime.format(this.settings.dateFormat)}</span>
      </span>`;
    }
    
    this.timeDisplayEl.innerHTML = displayHTML;
  }
  
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  
  async saveSettings() {
    await this.saveData(this.settings);
    this.updateTimeDisplay(); // 保存设置后更新显示
  }
}