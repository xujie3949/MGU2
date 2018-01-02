import MeshLayer from './MeshLayer';

/**
 * @class
 * 1:25000图幅图层
 */
export default class OverlayLayer extends MeshLayer {
    /** *
     * 绘制图幅
     * @param {Object}context canvas context
     * @param meshId 图幅id
     * @param options 可选参数
     */
    drawRect(context, meshId, options) {
        const meshList = this.options.meshList;

        if (!meshList || meshList.length === 0) {
            return;
        }

        if (meshList.indexOf(parseInt(meshId, 10)) >= 0) {
            return;
        }

        // 对不在图幅列表中的图幅进行遮盖
        context.globalAlpha = 0.2;
        context.fillStyle = 'gray'; // 颜色
        context.fillRect(options.min.x, options.min.y, options.getSize().x, options.getSize().y); // 填充 x y坐标 宽 高
    }
}
