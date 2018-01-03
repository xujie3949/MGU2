import { autorun } from 'mobx';

import stores from 'Stores/stores';
import navinfo from 'Navinfo';
import mapConfig from './mapConfig';
import dataTransform from '../feature/dataTransform';

/**
 * Created by xujie3949 on 2017/1/11.
 */

const url = `${mapConfig.serviceUrl}/render/obj/getByTileWithGap`;

const sourceConfig = {
    objSource: {
        sourceUrl: url,
        parsor: dataTransform,
        type: 'classical',
        subdomains: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'],
        requestParameter: {
            dbId: mapConfig.dbId,
            gap: 10,
            types: [],
        },
    },
};

autorun(() => {
    if (!stores.userStore.user) {
        return;
    }

    navinfo.common.Util.forOwn(sourceConfig, source => {
        source.sourceUrl = `${url}?access_token=${stores.userStore.user.mapToken}`;
    });
});

export default sourceConfig;

