/**
 * Created by chenx on 2017-5-12
 */

/* 背景图层配置 */
const background = [];

/* 参考图层配置 */
const overlay = ['feedback'];

/* 场景图层配置 */
const scenes = {
    defaultScene: 'BaseInfoScene',
    scenes: {
        /* 常规场景配置 */
        BaseInfoScene: {
            type: 'feature',
            label: 'roadFeature',
            name: '基础信息场景',
            layers: ['RdLink', 'RdNode'],
        },
    },
};

export default {
    background: background,
    overlay: overlay,
    scenes: scenes,
};

