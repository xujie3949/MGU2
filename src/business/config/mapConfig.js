const mapConfig = {
    // dbId将来可能会变,因为某个大区库只包含局部地区数据
    // dbId: 13,
    dbId: 23,
    // serviceUrl: 'http://fastmap.navinfo.com/beta/service',
    serviceUrl: 'http://192.168.4.130:8010',
    zooms: {
        minZoom: 10,
        maxZoom: 21,
        minEditZoom: 15,
    },
};

export default mapConfig;
