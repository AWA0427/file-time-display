import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import FileTimeDisplayPlugin from './main';

export class FileTimeDisplaySettingTab extends PluginSettingTab {
  plugin: FileTimeDisplayPlugin;
  
  constructor(app: App, plugin: FileTimeDisplayPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  
  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    
    containerEl.createEl('h2', { text: '文件时间显示设置' });
    
    // 日期格式设置
    new Setting(containerEl)
      .setName('日期格式')
      .setDesc('使用 Moment.js 日期格式 (默认: YYYY-MM-DD HH:mm)')
      .addText(text => text
        .setPlaceholder('YYYY-MM-DD HH:mm')
        .setValue(this.plugin.settings.dateFormat)
        .onChange(async (value) => {
          this.plugin.settings.dateFormat = value;
          await this.plugin.saveSettings();
        }));
    
    // 显示创建时间开关
    new Setting(containerEl)
      .setName('显示创建时间')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.showCreated)
        .onChange(async (value) => {
          this.plugin.settings.showCreated = value;
          await this.plugin.saveSettings();
        }));
    
    // 显示修改时间开关
    new Setting(containerEl)
      .setName('显示修改时间')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.showModified)
        .onChange(async (value) => {
          this.plugin.settings.showModified = value;
          await this.plugin.saveSettings();
        }));
    
    // 显示位置设置
    new Setting(containerEl)
      .setName('显示位置')
      .addDropdown(dropdown => dropdown
        .addOption('below-title', '标题下方')
        .addOption('above-content', '内容上方')
        .setValue(this.plugin.settings.position)
        .onChange(async (value: 'below-title' | 'above-content') => {
          this.plugin.settings.position = value;
          await this.plugin.saveSettings();
          this.plugin.addTimeDisplay(); // 重新创建显示元素
        }));
  }
}