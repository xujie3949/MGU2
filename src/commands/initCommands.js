import commandManager from 'Commands/commandManager';
import Command from 'Commands/Command';

function initCommands() {
  commandManager.add(new Command({ key: 'select', name: '选择', desc: '选择', icon: 'scan' }));
  commandManager.add(new Command({ key: 'add', name: '新增', desc: '新增', icon: 'plus-circle' }));
  commandManager.add(new Command({ key: 'del', name: '删除', desc: '删除', icon: 'minus-circle' }));
  commandManager.add(new Command({ key: 'info', name: '详情', desc: '详情', icon: 'info-circle' }));
}

export default initCommands;