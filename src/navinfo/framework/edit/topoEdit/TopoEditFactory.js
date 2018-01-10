/**
 * Created by xujie3949 on 2016/12/28.
 */

fastmap.uikit.topoEdit.TopoEditFactory = L.Class.extend({
    initialize: function () {
        // 绑定函数作用域
        FM.Util.bind(this);
    },

    createTopoEditor: function (geoLiveType, map) {
        switch (geoLiveType) {
            case 'RDRESTRICTION':
                return new fastmap.uikit.topoEdit.RDRestrictionTopoEditor(map);
            case 'RDRESTRICTIONTRUCK':
                return new fastmap.uikit.topoEdit.RDRestrictionTruckTopoEditor(map);
            case 'RDCROSS':
                return new fastmap.uikit.topoEdit.RDCrossTopoEditor(map);
            case 'CMGBUILDING':
                return new fastmap.uikit.topoEdit.CmgBuildingTopoEditor(map);
            case 'RDMILEAGEPILE':
                return new fastmap.uikit.topoEdit.RDMileagePileTopoEditor(map);
            case 'RDELECTRONICEYE':
                return new fastmap.uikit.topoEdit.RDElectronicEyeTopoEditor(map);
            case 'RDTRAFFICSIGNAL':
                return new fastmap.uikit.topoEdit.RDTrafficSignalTopoEditor(map);
            case 'RDSPEEDBUMP':
                return new fastmap.uikit.topoEdit.RDSpeedBumpTopoEditor(map);
            case 'RDSLOPE':
                return new fastmap.uikit.topoEdit.RDSlopeTopoEditor(map);
            // case 'RDWARNINGINFO':
            //     return new fastmap.uikit.topoEdit.RDWaringInfoTopoEditor(map);
            case 'RDLINKWARNING':
                return new fastmap.uikit.topoEdit.RDLinkWarningTopoEditor(map);
            case 'RDSPEEDLIMIT':
            case 'RDSPEEDLIMIT_DEPENDENT':
                return new fastmap.uikit.topoEdit.RDSpeedLimitTopoEditor(map);
            case 'RDSE':
                return new fastmap.uikit.topoEdit.RdSeTopoEditor(map);
            case 'RDGATE':
                return new fastmap.uikit.topoEdit.RdGateTopoEditor(map);
            case 'RDHIGHSPEEDBRANCH':   // 高速分歧
                return new fastmap.uikit.topoEdit.RdHighSpeedBranchTopoEditor(map);
            case 'RDASPECTBRANCH':// 方面分歧
                return new fastmap.uikit.topoEdit.RdAspectBranchTopoEditor(map);
            case 'RDICBRANCH':// IC分歧
                return new fastmap.uikit.topoEdit.RdICBranchTopoEditor(map);
            case 'RD3DBRANCH':// 3d分歧
                return new fastmap.uikit.topoEdit.Rd3DBranchTopoEditor(map);
            case 'RDCOMPLEXSCHEMA':// 复杂路口模式图
                return new fastmap.uikit.topoEdit.RdComplexSchemaTopoEditor(map);
            case 'RDREALIMAGE':// 实景图
                return new fastmap.uikit.topoEdit.RdRealImageTopoEditor(map);
            case 'RDSIGNASREAL':// 实景看板
                return new fastmap.uikit.topoEdit.RdSignAsRealTopoEditor(map);
            case 'RDSERIESBRANCH':// 连续分歧
                return new fastmap.uikit.topoEdit.RdSeriesBranchTopoEditor(map);
            case 'RDSCHEMATICBRANCH':// 交叉点大路口模式图
                return new fastmap.uikit.topoEdit.RdSchematicBranchTopoEditor(map);
            case 'RDSIGNBOARD':// 方向看板
                return new fastmap.uikit.topoEdit.RdSignBoardTopoEditor(map);
            case 'RDTOLLGATE':
                return new fastmap.uikit.topoEdit.RdTollGateTopoEditor(map);
            case 'RDHGWGLIMIT':
                return new fastmap.uikit.topoEdit.RdHgWgLimitTopoEditor(map);
            case 'RDLINK':
                return new fastmap.uikit.topoEdit.RDLinkTopoEditor(map);
            case 'LCLINK':
                return new fastmap.uikit.topoEdit.LCLinkTopoEditor(map);
            case 'LULINK':
                return new fastmap.uikit.topoEdit.LULinkTopoEditor(map);
            case 'CMGBUILDLINK':
                return new fastmap.uikit.topoEdit.CmgBuildLinkTopoEditor(map);
            case 'TIPBORDER':
                return new fastmap.uikit.topoEdit.TipBorderTopoEditor(map);
            case 'IXPOI':
                return new fastmap.uikit.topoEdit.IxPoiTopoEditor(map);
                // 情报点
            case 'PointInfo':
                return new fastmap.uikit.topoEdit.InfoTopoEditor(map);
            // 情报线
            case 'LineInfo':
                return new fastmap.uikit.topoEdit.InfoTopoEditor(map);
            // 情报面
            case 'PolygonInfo':
                return new fastmap.uikit.topoEdit.InfoTopoEditor(map);
            // 情报型情报点
            case 'QPointInfo':
                return new fastmap.uikit.topoEdit.InfoTopoEditor(map);
            // 情报型情报线
            case 'QLineInfo':
                return new fastmap.uikit.topoEdit.InfoTopoEditor(map);
            // 情报型情报面
            case 'QPolygonInfo':
                return new fastmap.uikit.topoEdit.InfoTopoEditor(map);
            case 'IXPOINTADDRESS':
                return new fastmap.uikit.topoEdit.PointAddressTopoEditor(map);
            case 'ADADMIN':
                return new fastmap.uikit.topoEdit.AdAdminTopoEditor(map);
            case 'RDVARIABLESPEED':
                return new fastmap.uikit.topoEdit.RDVariableSpeedTopoEditor(map);
            case 'RDVOICEGUIDE':
                return new fastmap.uikit.topoEdit.RDVoiceGuideTopoEditor(map);
            case 'RDDIRECTROUTE':
                return new fastmap.uikit.topoEdit.RDDirectRouteTopoEditor(map);
            case 'RDLANECONNEXITY':
                return new fastmap.uikit.topoEdit.RDLaneConnexityTopoEditor(map);
            case 'RDNODE':
                return new fastmap.uikit.topoEdit.RDNodeTopoEditor(map);
            case 'RDSAMENODE':
                return new fastmap.uikit.topoEdit.RDSameNodeTopoEditor(map);
            case 'RDSAMELINK':
                return new fastmap.uikit.topoEdit.RDSameLineTopoEditor(map);
            case 'LUNODE':
                return new fastmap.uikit.topoEdit.LUNodeTopoEditor(map);
            case 'CMGBUILDNODE':
                return new fastmap.uikit.topoEdit.CmgBuildNodeTopoEditor(map);
            case 'LCNODE':
                return new fastmap.uikit.topoEdit.LCNodeTopoEditor(map);
            case 'ZONENODE':
                return new fastmap.uikit.topoEdit.ZoneNodeTopoEditor(map);
            case 'ZONELINK':
                return new fastmap.uikit.topoEdit.ZoneLinkTopoEditor(map);
            case 'RWNODE':
                return new fastmap.uikit.topoEdit.RWNodeTopoEditor(map);
            case 'RWLINK':
                return new fastmap.uikit.topoEdit.RWLinkTopoEditor(map);
            case 'ADNODE':
                return new fastmap.uikit.topoEdit.ADNodeTopoEditor(map);
            case 'ADLINK':
                return new fastmap.uikit.topoEdit.ADLinkTopoEditor(map);
            case 'RDINTER':
                return new fastmap.uikit.topoEdit.RDInterTopoEditor(map);
            case 'RDROAD':
                return new fastmap.uikit.topoEdit.RDRoadTopoEditor(map);
            case 'RDOBJECT':
                return new fastmap.uikit.topoEdit.RDObjectTopoEditor(map);
            case 'RDGSC':
                return new fastmap.uikit.topoEdit.RDGscTopoEditor(map);
            case 'ADFACE':
                return new fastmap.uikit.topoEdit.ADFaceTopoEditor(map);
            case 'LUFACE':
                return new fastmap.uikit.topoEdit.LUFaceTopoEditor(map);
            case 'CMGBUILDFACE':
                return new fastmap.uikit.topoEdit.CmgBuildFaceTopoEditor(map);
            case 'LCFACE':
                return new fastmap.uikit.topoEdit.LCFaceTopoEditor(map);
            case 'ZONEFACE':
                return new fastmap.uikit.topoEdit.ZoneFaceTopoEditor(map);
            case 'RDLINKSPEEDLIMIT':
            case 'RDLINKSPEEDLIMIT_DEPENDENT':
                return new fastmap.uikit.topoEdit.RdLinkSpeedLimitTopoEditor(map);
            default:
                return null;
        }
    },

    createBuffer: function (geoLiveType, map) {
        if (geoLiveType == 'RDMULTIDIGITIZED') {
            return new fastmap.uikit.topoEdit.RDMultiDigitizedTopoEditor(map);
        }
        return new fastmap.uikit.topoEdit.RDSideRoadTopoEditor(map);
    },

    createAdminJoinFacesTopoEditor: function (map) {
        return new fastmap.uikit.topoEdit.AdminJoinFacesTopoEditor(map);
    },

    createLineDimensionsDepart: function (geoLiveType, map) {
        switch (geoLiveType) {
            case 'ADFACE':
                return new fastmap.uikit.topoEdit.ADFaceTopoEditor(map);
            case 'LUFACE':
                return new fastmap.uikit.topoEdit.LUFaceTopoEditor(map);
            case 'LCFACE':
                return new fastmap.uikit.topoEdit.LCFaceTopoEditor(map);
            case 'ZONEFACE':
                return new fastmap.uikit.topoEdit.ZoneFaceTopoEditor(map);
            case 'CMGBUILDFACE':
                return new fastmap.uikit.topoEdit.CmgBuildFaceTopoEditor(map);
            default:
                return null;
        }
    },

    createTipsTopoEditor: function (geoLiveType, map) {
        switch (geoLiveType) {
            case 'TIPBORDER':
                return new fastmap.uikit.topoEdit.RDSideRoadTopoEditor(map);
            case 'TIPTOLLGATE':
                return new fastmap.uikit.topoEdit.TipTollGateTopoEditor(map);
            case 'TIPRAILWAYCROSSING':
                return new fastmap.uikit.topoEdit.TipRailWayTopoEditor(map);
            case 'TIPLINKS':
                return new fastmap.uikit.topoEdit.TipLinksTopoEditor(map);
            case 'TIPROADTYPE':
                return new fastmap.uikit.topoEdit.TipRoadTypeTopoEditor(map);
            case 'TIPROADDIRECTION':
                return new fastmap.uikit.topoEdit.TipRoadDirectionTopoEditor(map);
            case 'TIPDRIVEWAYMOUNT':
                return new fastmap.uikit.topoEdit.TipDriveWayMountTopoEditor(map);
            case 'TIPROADNAME':
                return new fastmap.uikit.topoEdit.TipRoadNameTopoEditor(map);
            case 'TIPDELETETAG':
                return new fastmap.uikit.topoEdit.TipDeleteTagTopoEditor(map);
            case 'TIPROUNDABOUT':
                return new fastmap.uikit.topoEdit.TipRoundAboutTopoEditor(map);
            case 'TIPCONNECT':
                return new fastmap.uikit.topoEdit.TipConnectTopoEditor(map);
            case 'TIPLANECONNEXITY':
                return new fastmap.uikit.topoEdit.TipLaneConnexityTopoEditor(map);
            case 'TIPPEDESTRIANSTREET':
                return new fastmap.uikit.topoEdit.TipPedestrianStreetTopoEditor(map);
            case 'TIPFC':
                return new fastmap.uikit.topoEdit.TipFCTopoEditor(map);
            case 'TIPREGIONROAD':
                return new fastmap.uikit.topoEdit.TipRegionRoadTopoEditor(map);
            case 'TIPROADSA':
                return new fastmap.uikit.topoEdit.TipRoadSATopoEditor(map);
            case 'TIPROADPA':
                return new fastmap.uikit.topoEdit.TipRoadPATopoEditor(map);
            case 'TIPRAMP':
                return new fastmap.uikit.topoEdit.TipRampTopoEditor(map);
            case 'TIPBRIDGE':
                return new fastmap.uikit.topoEdit.TipBridgeTopoEditor(map);
            case 'TIPTUNNEL':
                return new fastmap.uikit.topoEdit.TipTunnelTopoEditor(map);
            case 'TIPMAINTENANCE':
                return new fastmap.uikit.topoEdit.TipMaintenanceTopoEditor(map);
            case 'TIPBUSLANE':
                return new fastmap.uikit.topoEdit.TipBusLaneTopoEditor(map);
            case 'TIPMULTIDIGITIZED':
                return new fastmap.uikit.topoEdit.TipMultiDigitizedTopoEditor(map);
            case 'TIPRESTRICTION':
                return new fastmap.uikit.topoEdit.TipRestrictionTopoEditor(map);
            case 'TIPTRAFFICSIGNAL':
                return new fastmap.uikit.topoEdit.TipTrafficSignalTopoEditor(map);
            case 'TIPSKETCH':
                return new fastmap.uikit.topoEdit.TipSketchTopoEditor(map);
            case 'TIPGPSDOT':
                return new fastmap.uikit.topoEdit.TipGPSDotTopoEditor(map);
            case 'TIPHIGHWAYCONNECT':
                return new fastmap.uikit.topoEdit.TipHighWayConnectTopoEditor(map);
            case 'TIPNOMALRESTRICTION':
                return new fastmap.uikit.topoEdit.TipNomalRestrictionTopoEditor(map);
            case 'TIPGSC':
                return new fastmap.uikit.topoEdit.TipGSCTopoEditor(map);
            case 'TIPBATCHGSC':
                return new fastmap.uikit.topoEdit.TipBatchGSCTopoEditor(map);
            case 'TIPDELETEPROPERTYINPROGRESS':
                return new fastmap.uikit.topoEdit.TipDeletePropertyInProgressEditor(map);
            case 'TIPBUILDTIMECHANGE':
                return new fastmap.uikit.topoEdit.TipBuildTimeChangeTopoEditor(map);
            case 'TIPLINKCOPY':
                return new fastmap.uikit.topoEdit.TipLinkUpDownDepartTopoEditor(map);
            case 'TIPGENERAL':
                return new fastmap.uikit.topoEdit.TipGeneralTopoEditor(map);
            default:
                return null;
        }
    },
    // 框选测线tipLinks
    batchSelectTipLinks: function (map, geoLiveType) {
        switch (geoLiveType) {
            case 'TIPLINKS':
                return new fastmap.uikit.topoEdit.TipLinksBatchSelectTopoEditor(map);
            default:
                return null;
        }
    },
    selectTipsAndPOITopoEditor: function (geoLiveType, map) {
        switch (geoLiveType) {
            case 'REGIONSELECT':
                return new fastmap.uikit.topoEdit.SelectTipsAndPOITopoEditor(map);
            default:
                return null;
        }
    },

    drawCircleTopoEditor: function (geoLiveType, map) {
        switch (geoLiveType) {
            case 'DRAWSUBTASK':
                return new fastmap.uikit.topoEdit.DrawSubTaskTopoEditor(map);
            default:
                return null;
        }
    },

    indexBatchTopoEditor: function (map, geoLiveType) {
        switch (geoLiveType) {
            case 'IXPOI':
                return new fastmap.uikit.topoEdit.IxPoiBatchTopoEditor(map);
            case 'IXPOINTADDRESS':
                return new fastmap.uikit.topoEdit.IxPointAddressBatchTopoEditor(map);
            default:
                return null;
        }
    },

    destroy: function () {
        fastmap.uikit.topoEdit.TopoEditFactory.instance = null;
    },

    statics: {
        instance: null,

        getInstance: function () {
            if (!fastmap.uikit.topoEdit.TopoEditFactory.instance) {
                fastmap.uikit.topoEdit.TopoEditFactory.instance =
                    new fastmap.uikit.topoEdit.TopoEditFactory();
            }
            return fastmap.uikit.topoEdit.TopoEditFactory.instance;
        }
    }
});

