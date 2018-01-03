import stores from '../../stores/stores';

const mapConfig = {
    token: stores.userStore.token,
    dbId: 13,
    serviceUrl: 'http://fs-road.navinfo.com/dev/trunk/service',
    zooms: {
        minZoom: 10,
        maxZoom: 21,
        minEditZoom: 15,
    },
};

export default mapConfig;
