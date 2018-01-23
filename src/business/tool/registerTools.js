import navinfo from 'navinfo';
import TrajectoryPlaybackTool from './TrajectoryPlaybackTool';

function registerTools() {
    const toolController = navinfo.framework.tool.ToolController.getInstance();
    toolController.addTool(new navinfo.framework.edit.PathSmoothTool());
    toolController.addTool(new navinfo.framework.edit.PathVertexAddTool());
    toolController.addTool(new navinfo.framework.edit.PathVertexInsertTool());
    toolController.addTool(new navinfo.framework.edit.PathVertexMoveTool());
    toolController.addTool(new navinfo.framework.edit.PathVertexRemoveTool());
    toolController.addTool(new navinfo.framework.edit.PolygonSmoothTool());
    toolController.addTool(new navinfo.framework.edit.PolygonVertexAddTool());
    toolController.addTool(new navinfo.framework.edit.PolygonVertexInsertTool());
    toolController.addTool(new navinfo.framework.edit.PolygonVertexMoveTool());
    toolController.addTool(new navinfo.framework.edit.PolygonVertexRemoveTool());

    toolController.addTool(new TrajectoryPlaybackTool());
}

export default registerTools;
