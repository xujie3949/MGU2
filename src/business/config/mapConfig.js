const mapConfig = {
    // dbId将来可能会变,因为某个大区库只包含局部地区数据
    dbId: 13,
    serviceUrl: 'http://fs-road.navinfo.com/dev/trunk/service',
    zooms: {
        minZoom: 10,
        maxZoom: 21,
        minEditZoom: 15,
    },
};

export default mapConfig;
