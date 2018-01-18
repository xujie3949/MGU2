import triangleImage from 'Images/map/triangle.png';

/**
 * Created by xujie on 2016/5/11 0011.
 */
const symbols = [
    // 解决语法错误
    {
        name: 'py_task',
        type: 'SimpleFillSymbol',
        opacity: 0,
        outLine: {
            type: 'SimpleLineSymbol',
            style: 'solid',
            color: 'blue',
            width: 3,
        },
    },
    // 质检任务圈
    {
        name: 'py_qua_task',
        type: 'SimpleFillSymbol',
        opacity: 0,
        outLine: {
            type: 'SimpleLineSymbol',
            style: 'solid',
            color: 'red',
            width: 3,
        },
    }, {
        name: 'ls_link', // 所有link高亮
        type: 'SimpleLineSymbol',
        color: '#00ffff',
        width: 2,
    }, {
        name: 'pt_node_s', // 所有link的snode高亮
        type: 'CircleMarkerSymbol',
        color: 'white',
        radius: 4,
        outLine: {
            color: 'blue',
            width: 1,
        },
    }, {
        name: 'pt_node_e', // 所有link的enode高亮
        type: 'CircleMarkerSymbol',
        color: 'blue',
        radius: 4,
        outLine: {
            color: 'blue',
            width: 1,
        },
    }, {
        name: 'pt_rdNode_e',
        type: 'CircleMarkerSymbol',
        color: 'blue',
        radius: 4,
        outLine: {
            color: 'blue',
            width: 1,
        },
    }, {
        name: 'pt_rdNode',
        type: 'CircleMarkerSymbol',
        color: 'blue',
        radius: 2,
        outLine: {
            color: 'blue',
            width: 1,
        },
    }, {
        name: 'ls_sameLink', // 同一线
        type: 'SimpleLineSymbol',
        color: '#00CCFF',
        width: 2,
    }, {
        name: 'pt_rdSameNode',
        type: 'CircleMarkerSymbol',
        color: '#00CCFF',
        radius: 2,
        outLine: {
            color: '#00CCFF',
            width: 1,
        },
    }, {
        name: 'ls_rwLink', // rwlink样式
        type: 'CompositeLineSymbol',
        symbols: [
            {
                type: 'SimpleLineSymbol',
                color: '#0033FF',
                width: 3,
                style: 'solid',
            }, {
                type: 'SimpleLineSymbol',
                color: 'white',
                width: 2,
                style: 'solid',
            }, {
                type: 'CartoLineSymbol',
                color: '#0033FF',
                width: 2,
                pattern: [10, 10],
            },
        ],
    }, {
        name: 'pt_rdNode_normal',
        type: 'SquareMarkerSymbol',
        color: 'blue',
        size: 10,
    }, {
        name: 'pt_rdNode_main',
        type: 'SquareMarkerSymbol',
        color: 'red',
        size: 10,
    }, {
        name: 'ls_rdlink_cross',
        type: 'SimpleLineSymbol',
        color: 'blue',
        width: 2,
    }, {
        name: 'ls_rdLink_in', // 进入线
        type: 'SimpleLineSymbol',
        color: '#238E23',
        width: 2,
    }, {
        name: 'ls_rdLink_via', // 经过线
        type: 'SimpleLineSymbol',
        color: '#9932CD',
        width: 2,
    }, {
        name: 'ls_rdLink_out', // 退出线
        type: 'SimpleLineSymbol',
        color: '#4D4DFF',
        width: 2,
    }, {
        name: 'ls_rdLink_defaultOut', // 候选退出线
        type: 'SimpleLineSymbol',
        color: 'red',
        width: 2,
    }, {
        name: 'ls_rdLink_join', // 接续线
        type: 'SimpleLineSymbol',
        color: '#9f4d95',
        width: 2,
    }, {
        name: 'ls_tmc_link', // tmcLocation高亮
        type: 'SimpleLineSymbol',
        color: '#00CC33',
        width: 2,
    }, {
        name: 'pt_rdNode_in', // 进入点
        type: 'CircleMarkerSymbol',
        color: 'yellow',
        radius: 2,
    }, {
        name: 'pt_rdNode_cross', // 路口点
        type: 'CircleMarkerSymbol',
        color: 'red',
        radius: 10,
    }, {
        name: 'pt_selectPoint', // 选择点位置
        type: 'CircleMarkerSymbol',
        color: 'red',
        radius: 3,
    }, { // 关系高亮边框
        name: 'pt_feature_relationBorder',
        type: 'SquareMarkerSymbol',
        color: 'transparent',
        size: 30,
        outLine: {
            width: 3,
            color: '#00ffff',
        },
    }, {
        name: 'pt_node_cross', // 类似路口的复合型
        type: 'CompositeMarkerSymbol',
        symbols: [
            {
                type: 'SquareMarkerSymbol',
                color: '#dddddd',
                size: 10,
                outLine: {
                    color: '#0066cc',
                    width: 1,
                },
            }, {
                type: 'CircleMarkerSymbol',
                color: '#0066cc',
                radius: 3,
            },
        ],
    }, {
        name: 'pt_face', // face类型
        type: 'SimpleFillSymbol',
        color: '#51d0f9',
        opacity: 0.5,
    }, {
        name: 'py_face', // face类型
        type: 'SimpleFillSymbol',
        color: '#ffff00',
        opacity: 0.5,
    }, {
        name: 'cmgFeature_face', // cmgfeature_face类型
        type: 'SimpleFillSymbol',
        color: 'green',
        opacity: 0.5,
    }, {
        name: 'pt_tip_square',
        type: 'SquareMarkerSymbol',
        color: 'rgba(225,225,225,0)',
        size: 30,
        outLine: {
            color: '#00ffff',
            width: 3,
        },
    }, {
        name: 'pt_relation_border',
        type: 'SquareMarkerSymbol',
        color: 'transparent',
        size: 30,
        outLine: {
            width: 3,
            color: '#45c8f2',
        },
    }, {
        name: 'py_tip_Polygon', // 面符号
        type: 'SimpleFillSymbol',
        color: 'transparent',
        outLine: {
            type: 'SimpleLineSymbol',
            color: '#00ffff',
            width: 2,
        },
    }, {
        name: 'pt_node',
        type: 'CircleMarkerSymbol',
        color: 'blue',
        radius: 3,
        outLine: {
            color: 'blue',
            width: 1,
        },
    }, { // 高亮tips点
        name: 'pt_tip_point',
        type: 'CircleMarkerSymbol',
        radius: 3,
        color: '#00ffff',
        opacity: 1,
    }, { // 高亮边框颜色
        name: 'ls_boders',
        type: 'SimpleLineSymbol',
        color: '#00ffff',
        width: 3,
    }, { // 高亮tips图标
        name: 'tip_circle',
        type: 'CircleMarkerSymbol',
        radius: 16,
        color: 'transparent',
        outLine: {
            width: 3,
            color: '#00ffff',
        },
    }, { // 高亮tips要素编号
        name: 'tip_num',
        type: 'CompositeMarkerSymbol',
        symbols: [
            {
                type: 'ImageMarkerSymbol',
                url: '../../images/newPoi/toolIcon/tips-background.png',
                width: 30,
                height: 20,
            }, {
                type: 'TextMarkerSymbol',
                color: '#ffffff',
            },
        ],
    }, {
        name: 'pt_adAdminLoc',
        type: 'ImageMarkerSymbol',
        url: '../../images/road/img/star.png',
        width: 24,
        height: 24,
        offsetX: 0,
        offsetY: 0,
    }, {
        name: 'pt_Poi',
        type: 'CircleMarkerSymbol',
        color: '#00ffff',
        radius: 7,
    }, {
        name: 'pt_poiLocation',
        type: 'ImageMarkerSymbol',
        url: '../../images/poi/map/marker_red_16.png',
        width: 24,
        height: 33,
        offsetX: 0,
        offsetY: -16,
    }, {
        name: 'pt_poiCreateLoc',
        type: 'ImageMarkerSymbol',
        url: '../../images/poi/map/marker_blue_32.png',
        width: 24,
        height: 33,
        offsetX: 0,
        offsetY: -16,
    }, {
        name: 'pt_poiGuide',
        type: 'CircleMarkerSymbol',
        color: 'transparent',
        radius: 4,
        outLine: {
            color: 'red',
            width: 1,
        },
    }, {
        name: 'ls_guideLink',
        type: 'SimpleLineSymbol',
        style: 'dash',
        color: 'red',
    }, {
        name: 'ls_guideLink_blue',
        type: 'SimpleLineSymbol',
        style: 'dash',
        color: 'blue',
    }, {
        name: 'ls_link_part_0', // 立交组成link颜色0
        type: 'SimpleLineSymbol',
        color: '#14B7FC',
        width: 4,
    }, {
        name: 'ls_link_part_1', // 立交组成link颜色1
        type: 'SimpleLineSymbol',
        color: '#4FFFB6',
        width: 4,
    }, {
        name: 'ls_link_part_2', // 立交组成link颜色2
        type: 'SimpleLineSymbol',
        color: '#F8B19C',
        width: 4,
    }, {
        name: 'ls_link_part_3', // 立交组成link颜色3
        type: 'SimpleLineSymbol',
        color: '#FCD6A4',
        width: 4,
    }, {
        name: 'pt_rdNode_same', // 用于同一点高亮
        type: 'CircleMarkerSymbol',
        color: 'black',
        radius: 4,
    }, {
        name: 'pt_adNode_same', // 用于同一点高亮
        type: 'CircleMarkerSymbol',
        color: 'red',
        radius: 4,
    }, {
        name: 'pt_zoneNode_same', // 用于同一点高亮
        type: 'CircleMarkerSymbol',
        color: 'Blue',
        radius: 4,
    }, {
        name: 'pt_luNode_same', // 用于同一点高亮
        type: 'CircleMarkerSymbol',
        color: 'Green',
        radius: 4,
    }, {
        name: 'ls_rdLink_same', // 用于同一线高亮
        type: 'SimpleLineSymbol',
        color: 'black',
        width: 3,
    }, {
        name: 'ls_adLink_same', // 用于同一线高亮
        type: 'SimpleLineSymbol',
        color: 'red',
        width: 3,
    }, {
        name: 'ls_zoneLink_same', // 用于同一线高亮
        type: 'SimpleLineSymbol',
        color: 'Blue',
        width: 3,
    }, {
        name: 'ls_luLink_same', // 用于同一线高亮
        type: 'SimpleLineSymbol',
        color: 'Green',
        width: 3,
    },
    // 捕捉相关符号
    {
        name: 'snap_pt_cross',
        type: 'CompositeMarkerSymbol',
        symbols: [
            {
                type: 'CrossMarkerSymbol',
                size: 40,
                color: 'blue',
            }, {
                type: 'CircleMarkerSymbol',
                radius: 4,
                color: 'blue',
            },
        ],
    }, {
        name: 'snap_pt_given_point',
        type: 'CircleMarkerSymbol',
        radius: 1,
        color: 'blue',
    }, {
        name: 'snap_pt_vertex',
        type: 'CircleMarkerSymbol',
        radius: 2,
        color: 'blue',
    },
    // 关系编辑相关符号
    {
        name: 'relationEdit_ls_inLink',
        type: 'SimpleLineSymbol',
        style: 'solid',
        color: 'red',
        width: 3,
    }, {
        name: 'relationEdit_pt_node',
        type: 'CircleMarkerSymbol',
        color: 'red',
        radius: 3,
    }, {
        name: 'relationEdit_ls_viaLink',
        type: 'SimpleLineSymbol',
        style: 'solid',
        color: 'yellow',
        width: 3,
    }, {
        name: 'relationEdit_ls_viaLink_selected',
        type: 'SimpleLineSymbol',
        style: 'solid',
        color: 'yellow',
        width: 3,
        shadowColor: 'brown',
        shadowBlur: 10,
    }, {
        name: 'relationEdit_ls_viaLink_editing',
        type: 'SimpleLineSymbol',
        style: 'solid',
        color: 'brown',
        width: 3,
    }, {
        name: 'relationEdit_ls_outLink',
        type: 'SimpleLineSymbol',
        style: 'solid',
        color: 'green',
        width: 3,
    }, {
        name: 'relationEdit_ls_outLink_selected',
        type: 'SimpleLineSymbol',
        style: 'solid',
        color: 'green',
        width: 3,
        shadowColor: 'green',
        shadowBlur: 10,
    }, {
        name: 'relationEdit_ls_outLink_editing',
        type: 'SimpleLineSymbol',
        style: 'solid',
        color: 'blue',
        width: 3,
    }, {
        name: 'relationEdit_ls_recommend_outLink',
        type: 'SimpleLineSymbol',
        style: 'solid',
        color: 'blue',
        width: 3,
    }, {
        name: 'relationEdit_py_buffer',
        type: 'SimpleFillSymbol',
        opacity: 0,
        outLine: {
            type: 'SimpleLineSymbol',
            style: 'dashDot',
            color: 'blue',
            width: 1,
        },
    }, {
        name: 'relationEdit_tx_center_info',
        type: 'TextMarkerSymbol',
        color: 'red',
        font: '微软雅黑',
        size: 20,
    }, {
        name: 'relationEdit_tx_mouse_info',
        type: 'TextMarkerSymbol',
        color: 'blue',
        font: '微软雅黑',
        size: 20,
        // 保证文字在鼠标下方不被鼠标遮盖
        offsetY: 30,
    }, {
        name: 'relationEdit_ls_edge',
        type: 'SimpleLineSymbol',
        style: 'solid',
        color: 'blue',
    }, {
        name: 'selectTool_ls_rectSelect',
        type: 'SimpleLineSymbol',
        style: 'dot',
        color: 'blue',
        width: 1,
    }, {
        name: 'selectTool_py_rectSelect',
        type: 'SimpleFillSymbol',
        opacity: 0,
        outLine: {
            type: 'SimpleLineSymbol',
            style: 'dot',
            color: 'blue',
            width: 1,
        },
    }, {
        name: 'tmc_line',
        type: 'SimpleLineSymbol',
        color: '#0600FF',
        width: 4,
    }, {
        name: 'relationEdit_ls_line_point_direct',
        type: 'CompositeLineSymbol',
        symbols: [
            {
                type: 'EndMarkerLineSymbol',
                direction: 'e',
                times: 1,
                marker: {
                    type: 'TriangleMarkerSymbol',
                    width: 12,
                    height: 10,
                    color: 'red',
                    outLine: {
                        width: 1,
                        color: 'red',
                    },
                },
            }, {
                type: 'SimpleLineSymbol',
                style: 'solid',
                color: 'red',
                width: 3,
            },
        ],
    }, {
        name: 'pt_line_point', // 线上点
        type: 'CircleMarkerSymbol',
        color: 'red',
        radius: 5,
    }, {
        name: 'shapeEdit_ls_edge',
        type: 'SimpleLineSymbol',
        style: 'solid',
        color: 'red',
    }, {
        name: 'shapeEdit_pt_start_vertex',
        type: 'SquareMarkerSymbol',
        size: 6,
        color: 'green',
    }, {
        name: 'shapeEdit_pt_end_vertex',
        type: 'SquareMarkerSymbol',
        size: 6,
        color: 'blue',
    }, {
        name: 'shapeEdit_pt_vertex',
        type: 'CircleMarkerSymbol',
        radius: 2,
        color: 'red',
    }, {
        name: 'shapeEdit_pt_snap_point',
        type: 'CrossMarkerSymbol',
        size: 20,
        color: 'green',
    }, {
        name: 'shapeEdit_pt_snap_link',
        type: 'CrossMarkerSymbol',
        size: 20,
        color: 'red',
    }, {
        name: 'shapeEdit_pt_selected_vertex',
        type: 'CircleMarkerSymbol',
        radius: 3,
        color: 'white',
        outLine: {
            color: 'black',
            width: 1,
        },
    }, {
        name: 'shapeEdit_ls_dash',
        type: 'CartoLineSymbol',
        pattern: [2, 2],
        style: 'dash',
        color: 'black',
    }, {
        name: 'shapeEdit_py_red',
        type: 'SimpleFillSymbol',
        color: 'red',
        opacity: 0.1,
    }, {
        name: 'relationEdit_same_node_selected',
        type: 'CircleMarkerSymbol',
        color: 'green',
        radius: 3,
    }, {
        name: 'relationEdit_same_node_main', // 同一点主要素样式
        type: 'CircleMarkerSymbol',
        color: 'blue',
        radius: 4,
        outLine: {
            color: 'blue',
            width: 1,
        },
    }, {
        name: 'relationEdit_crf_obj', // 用于crf对象代表点
        type: 'ImageMarkerSymbol',
        url: '../../images/road/crf/12.png',
        width: 10,
        height: 10,
    }, {
        name: 'relationEdit_gsc_candidates', // 立交备选点位样式
        type: 'CrossMarkerSymbol',
        size: 20,
        color: 'red',
    }, {
        name: 'distance_tool_pt_length_text',
        type: 'TextMarkerSymbol',
        font: '微软雅黑',
        size: 10,
        color: 'green',
    }, {
        name: 'distance_tool_pt_vertex',
        type: 'CircleMarkerSymbol',
        radius: 3,
        color: 'red',
    }, {
        name: 'distance_tool_ls_edge',
        type: 'SimpleLineSymbol',
        style: 'solid',
        color: 'blue',
    }, {
        name: 'angle_tool_pt_angle_text',
        type: 'TextMarkerSymbol',
        font: '微软雅黑',
        size: 20,
        color: 'red',
    }, {
        name: 'area_tool_pt_area_text',
        type: 'CenterMarkerFillSymbol',
        marker: {
            type: 'TextMarkerSymbol',
            font: '微软雅黑',
            size: 15,
            color: 'black',
        },
    }, {
        name: 'pt_streetView_heading',
        type: 'ImageMarkerSymbol',
        url: '../../images/main/pano_fan_direction.png',
        width: 32,
        height: 32,
    }, {
        name: 'pt_tips', // 高亮tips
        type: 'CircleMarkerSymbol',
        color: 'red',
        radius: 5,
    }, {
        name: 'sketch_line',
        type: 'SimpleLineSymbol',
        style: 'solid',
        color: 'black',
    }, {
        name: 'ls_link_selected', // 通用link选中样式，用于闪烁高亮
        type: 'SimpleLineSymbol',
        color: 'blue',
        width: 3,
        shadowColor: 'blue',
        shadowBlur: 10,
    }, {
        name: 'complexEdit_poi_old',
        type: 'CircleMarkerSymbol',
        color: 'green',
        radius: 5,
    }, {
        name: 'complexEdit_poi_new',
        type: 'CircleMarkerSymbol',
        color: 'red',
        radius: 5,
    }, {
        name: 'complexEdit_dash_line_center_arrow',
        type: 'CompositeLineSymbol',
        symbols: [
            {
                type: 'SimpleLineSymbol',
                style: 'dash',
            },
            {
                type: 'CenterMarkerLineSymbol',
                times: 1,
                marker: {
                    type: 'TriangleMarkerSymbol',
                    color: 'red',
                    width: 10,
                    height: 20,
                    sunken: 10,
                },
            },
        ],
    }, {
        name: 'complexEdit_dash_line_green',
        type: 'CompositeLineSymbol',
        symbols: [
            {
                type: 'SimpleLineSymbol',
                color: 'green',
                style: 'dash',
            },
        ],
    }, {
        name: 'complexEdit_dash_line_red',
        type: 'CompositeLineSymbol',
        symbols: [
            {
                type: 'SimpleLineSymbol',
                color: 'red',
                style: 'dash',
            },
        ],
    }, {
        name: 'complexEdit_poi_guide_link',
        type: 'SimpleLineSymbol',
        color: 'green',
        width: 3,
    }, {
        name: 'point_move_poi',
        type: 'CircleMarkerSymbol',
        color: 'purple',
        radius: 5,
    }, {
        name: 'link_move_poi',
        type: 'SimpleLineSymbol',
        color: 'purple',
        width: 2,
    }, {
        name: 'polygon_move_poi',
        type: 'SimpleFillSymbol',
        color: 'transparent',
        outLine: {
            type: 'CartoLineSymbol',
            color: 'purple',
            width: 1,
            pattern: [4, 2],
        },
    }, {
        name: 'conditionSpeedLimitRectangle',
        type: 'RectangleMarkerSymbol',
        width: 20,
        height: 50,
        color: 'transparent',
        outLine: {
            width: 3,
            color: '#00ffff',
        },
    }, {
        name: 'pointAddress_textInfo',
        type: 'TextMarkerSymbol',
        offsetY: 15,
    }, {
        name: 'trajectory_currentPoint',
        type: 'ImageMarkerSymbol',
        url: triangleImage,
        height: 20,
        width: 30,
    },
];

export default symbols;

