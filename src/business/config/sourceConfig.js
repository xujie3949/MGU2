import mapConfig from './mapConfig';
import dataTransform from '../feature/dataTransform';

/**
 * Created by xujie3949 on 2017/1/11.
 */
const sourceConfig = {
    objSource: {
        sourceUrl: `${mapConfig.serviceUrl}/render/obj/getByTileWithGap?access_token=${mapConfig.token}`,
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

export default sourceConfig;

