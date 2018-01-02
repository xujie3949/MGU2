import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
    Row,
    Button,
    Icon,
    Divider,
    Tooltip,
} from 'antd';

import stores from 'Stores/stores';
import style from './styles/style.styl';

@observer
export default class ToolBar extends Component {
    constructor(props) {
        super(props);
    }

  onClick = e => {
      const key = e.currentTarget.getAttribute('data-key');
      const index = stores.toolBarStore.items.findIndex(item => item.key === key);
      if (index !== -1) {
          const command = stores.toolBarStore.items[index];
          command.excute();
      }
  };

  renderButton(command, index) {
      if (command === 'divider') {
          return (
            <Divider
                key={index}
                type="vertical"
              />
          );
      }
      return (
        <Tooltip
            key={command.key}
            placement="bottomRight"
              title={command.desc}
          >
              <Row
            key={command.key}
            type="flex"
                  align="middle"
            style={{
                      paddingLeft: '5px',
                      paddingRight: '5px',
                  }}
          >
            <Button
                      data-key={command.key}
                      size="small"
                    onClick={this.onClick}
                  >
                    <Icon type={command.icon}/>
                  </Button>
          </Row>
          </Tooltip>
      );
  }

  renderButtons() {
      return stores.toolBarStore.items.map((item, index) => this.renderButton(item, index));
  }

  render() {
      return (
        <Row
              className={style.container}
            type="flex"
            align="middle"
          >
            { this.renderButtons() }
          </Row>
      );
  }
}
