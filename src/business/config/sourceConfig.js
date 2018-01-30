import { autorun } from 'mobx';

import navinfo from 'navinfo';
import mapConfig from './mapConfig';
import dataTransform from '../feature/dataTransform';

/**
 * Created by xujie3949 on 2017/1/11.
 */

// const url = `${mapConfig.serviceUrl}/render/obj/getByTileWithGap`;
const url = `${mapConfig.serviceUrl}/tollgate/render/getObjByTile?access_token={token}&
parameter={"dbId":${mapConfig.dbId},"gap":10,"types":{types},"x":{x},"y":{y},"z":{z}}`;

const sourceConfig = {
    objSource: {
        url: url,
        parser: dataTransform,
        subdomains: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'],
    },
};

export default sourceConfig;
