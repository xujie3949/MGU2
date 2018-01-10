import navinfo from 'Navinfo';

function registerEditControls() {
    const editControlFactory = navinfo.framework.editControl.EditControlFactory.getInstance();
    const Command = navinfo.framework.Ei.Command;
    commandFactory.register(new Command({ key: 'select', name: '选择', desc: '选择', icon: 'scan' }));
    commandFactory.register(new Command({ key: 'add', name: '新增', desc: '新增', icon: 'plus-circle' }));
    commandFactory.register(new Command({ key: 'del', name: '删除', desc: '删除', icon: 'minus-circle' }));
    commandFactory.register(new Command({ key: 'info', name: '详情', desc: '详情', icon: 'info-circle' }));
}

export default registerEditControls;
