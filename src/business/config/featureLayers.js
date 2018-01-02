const featureLayers = {
    AdAdmin: {
        name: '行政区划代表点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'ADADMIN',
            minZoom: 15,
        },
    },
    AdFace: {
        name: '行政区划面',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'ADFACE',
            minZoom: 15,
        },
    },
    AdLink: {
        name: '行政区划组成线',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'ADLINK',
            minZoom: 15,
        },
    },
    AdNode: {
        name: '行政区划组成点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'ADNODE',
            minZoom: 17,
        },
    },
    IxPoi: {
        name: '兴趣点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'IXPOI',
            minZoom: 17,
        },
    },
    LcFace: {
        name: '土地覆盖面',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'LCFACE',
            minZoom: 15,
        },
    },
    LcLink: {
        name: '土地覆盖线',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'LCLINK',
            minZoom: 15,
        },
    },
    LcNode: {
        name: '土地覆盖点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'LCNODE',
            minZoom: 17,
        },
    },
    LuFace: {
        name: '土地利用面',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'LUFACE',
            minZoom: 15,
        },
    },
    LuLink: {
        name: '土地利用线',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'LULINK',
            minZoom: 15,
        },
    },
    LuNode: {
        name: '土地利用点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'LUNODE',
            minZoom: 17,
        },
    },
    CmgBuilding: {
        name: '市街图feature',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'CMGBUILDING',
            minZoom: 15,
        },
    },
    CmgBuildFace: {
        name: '市街图面',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'CMGBUILDFACE',
            minZoom: 15,
        },
    },
    CmgBuildLink: {
        name: '市街图线',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'CMGBUILDLINK',
            minZoom: 15,
        },
    },
    CmgBuildNode: {
        name: '市街图点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'CMGBUILDNODE',
            minZoom: 17,
        },
    },
    RdHighSpeedBranch: {
        name: '高速分歧',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDHIGHSPEEDBRANCH',
            serverFeatureType: 'RDBRANCH',
            minZoom: 15,
        },
    },
    RdAspectBranch: {
        name: '方面分歧',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDASPECTBRANCH',
            serverFeatureType: 'RDBRANCH',
            minZoom: 15,
        },
    },
    RdICBranch: {
        name: 'IC分歧',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDICBRANCH',
            serverFeatureType: 'RDBRANCH',
            minZoom: 15,
        },
    },
    Rd3DBranch: {
        name: '3d分歧',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RD3DBRANCH',
            serverFeatureType: 'RDBRANCH',
            minZoom: 15,
        },
    },
    RdComplexSchema: {
        name: '复杂路口模式图',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDCOMPLEXSCHEMA',
            serverFeatureType: 'RDBRANCH',
            minZoom: 15,
        },
    },
    RdRealImage: {
        name: '实景图',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDREALIMAGE',
            serverFeatureType: 'RDBRANCH',
            minZoom: 15,
        },
    },
    RdSignAsReal: {
        name: '实景看板',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDSIGNASREAL',
            serverFeatureType: 'RDBRANCH',
            minZoom: 15,
        },
    },
    RdSeriesBranch: {
        name: '连续分歧',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDSERIESBRANCH',
            serverFeatureType: 'RDBRANCH',
            minZoom: 15,
        },
    },
    RdSchematicBranch: {
        name: '交叉点大路口模式图',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDSCHEMATICBRANCH',
            serverFeatureType: 'RDBRANCH',
            minZoom: 15,
        },
    },
    RdSignBoardBranch: {
        name: '方向看板',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDSIGNBOARD',
            serverFeatureType: 'RDBRANCH',
            minZoom: 15,
        },
    },
    RdCross: {
        name: '路口',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDCROSS',
            minZoom: 15,
        },
    },
    RdDirectRoute: {
        name: '顺行',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDDIRECTROUTE',
            minZoom: 15,
        },
    },
    RdElectronicEye: {
        name: '电子眼',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDELECTRONICEYE',
            minZoom: 15,
        },
    },
    RdGate: {
        name: '大门',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDGATE',
            minZoom: 15,
        },
    },
    RdGsc: {
        name: '立交',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDGSC',
            minZoom: 15,
        },
    },
    RdHgwgLimit: {
        name: '限高限重',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDHGWGLIMIT',
            minZoom: 15,
        },
    },
    RdLane: {
        name: '详细车道',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDLANE',
            minZoom: 15,
        },
    },
    RdLaneConnexity: {
        name: '车信',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDLANECONNEXITY',
            minZoom: 15,
        },
    },
    RdLink: {
        name: '道路线',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDLINK',
            minZoom: 1,
        },
    },
    RdLinkSpeedLimit: {
        name: '线限速',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDLINKSPEEDLIMIT',
            minZoom: 15,
        },
    },
    RdLinkSpeedLimitDependent: {
        name: '条件线限速',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDLINKSPEEDLIMIT_DEPENDENT',
            minZoom: 15,
            editable: false,
        },
    },
    RdMileagePile: {
        name: '里程桩',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDMILEAGEPILE',
            minZoom: 15,
        },
    },
    RdNode: {
        name: '道路点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDNODE',
            minZoom: 17,
        },
    },
    RdRestriction: {
        name: '交限',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDRESTRICTION',
            minZoom: 15,
        },
    },
    RdRestrictionTruck: {
        name: '卡车交限',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDRESTRICTIONTRUCK',
            serverFeatureType: 'RDRESTRICTION',
            minZoom: 15,
        },
    },
    RdSameLink: {
        name: '同一线',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDSAMELINK',
            minZoom: 15,
        },
    },
    RdSameNode: {
        name: '同一点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDSAMENODE',
            minZoom: 17,
        },
    },
    RdSe: {
        name: '分叉口',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDSE',
            minZoom: 15,
        },
    },
    RdSlope: {
        name: '坡度',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDSLOPE',
            minZoom: 15,
        },
    },
    RdSpeedBump: {
        name: '减速带',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDSPEEDBUMP',
            minZoom: 15,
        },
    },
    RdSpeedLimit: {
        name: '普通点限速',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDSPEEDLIMIT',
            minZoom: 15,
        },
    },
    RdSpeedLimitDependent: {
        name: '条件点限速',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDSPEEDLIMIT_DEPENDENT',
            minZoom: 15,
        },
    },
    RdTollgate: {
        name: '收费站',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDTOLLGATE',
            minZoom: 15,
        },
    },
    RdTrafficSignal: {
        name: '信号灯',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDTRAFFICSIGNAL',
            minZoom: 15,
        },
    },
    RdVariableSpeed: {
        name: '可变限速',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDVARIABLESPEED',
            minZoom: 15,
        },
    },
    RdVoiceGuide: {
        name: '语音引导',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDVOICEGUIDE',
            minZoom: 15,
        },
    },
    RdLinkWarning: {
        name: '警示信息',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDLINKWARNING',
            minZoom: 15,
        },
    },
    RwLink: {
        name: '铁路线',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RWLINK',
            minZoom: 15,
        },
    },
    RwNode: {
        name: '铁路点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RWNODE',
            minZoom: 17,
        },
    },
    ZoneFace: {
        name: 'ZONE面',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'ZONEFACE',
            minZoom: 15,
        },
    },
    ZoneLink: {
        name: 'ZONE线',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'ZONELINK',
            minZoom: 15,
        },
    },
    ZoneNode: {
        name: 'Zone点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'ZONENODE',
            minZoom: 17,
        },
    },
    RdObject: {
        name: 'CRF对象',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDOBJECT',
            minZoom: 15,
        },
    },
    RdInter: {
        name: 'CRF交叉点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDINTER',
            minZoom: 15,
        },
    },
    RdRoad: {
        name: 'CRF道路',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDROAD',
            minZoom: 15,
        },
    },
    TmcLocation: {
        name: 'TMCLocation',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDTMCLOCATION',
            minZoom: 15,
        },
    },
    TmcPoint: {
        name: 'TMC点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'TMCPOINT',
            minZoom: 15,
        },
    },
    TmcLine: {
        name: 'TMC线',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'TMCLINE',
            minZoom: 15,
        },
    },
    IxPointAddress: {
        name: '点门牌',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'IXPOINTADDRESS',
            minZoom: 17,
        },
    },
};

export default featureLayers;

