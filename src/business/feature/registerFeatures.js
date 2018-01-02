import FeatureFactory from '../../navinfo/mapApi/render/FeatureFactory';
import createRdLink from './RdLink';
import createRdNode from './RdNode';

function registerFeatures() {
    const featureFactory = FeatureFactory.getInstance();
    featureFactory.register(4, createRdLink);
    featureFactory.register(16, createRdNode);
}

export default registerFeatures;

