import * as geom from 'jsts/org/locationtech/jts/geom';
import * as algorithm from 'jsts/org/locationtech/jts/algorithm';
import * as densify from 'jsts/org/locationtech/jts/densify';
import * as dissolve from 'jsts/org/locationtech/jts/dissolve';
import * as geomgraph from 'jsts/org/locationtech/jts/geomgraph';
import * as index from 'jsts/org/locationtech/jts/index';
import * as io from 'jsts/org/locationtech/jts/io';
import * as noding from 'jsts/org/locationtech/jts/noding';
import * as operation from 'jsts/org/locationtech/jts/operation';
import * as precision from 'jsts/org/locationtech/jts/precision';
import * as simplify from 'jsts/org/locationtech/jts/simplify';
import * as triangulate from 'jsts/org/locationtech/jts/triangulate';
import * as linearref from 'jsts/org/locationtech/jts/linearref';

import 'jsts/org/locationtech/jts/monkey';

export default {
    algorithm,
    densify,
    dissolve,
    geom,
    geomgraph,
    index,
    io,
    noding,
    operation,
    precision,
    simplify,
    triangulate,
    linearref,
};
