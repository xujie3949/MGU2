import navinfo from 'Navinfo';
import createRdLink from './RdLink';
import createRdNode from './RdNode';

function registerFeatures() {
    const featureFactory = navinfo.mapApi.render.FeatureFactory.getInstance();
    featureFactory.register(4, createRdLink);
    featureFactory.register(16, createRdNode);
}

export default registerFeatures;

