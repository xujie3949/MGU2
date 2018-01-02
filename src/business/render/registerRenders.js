import RenderFactory from '../../navinfo/mapApi/render/RenderFactory';
import RdLink from './RdLink';
import RdNode from './RdNode';

function registerRenders() {
    const renderFactory = RenderFactory.getInstance();
    renderFactory.register('RDLINK', RdLink);
    renderFactory.register('RDNODE', RdNode);
}

export default registerRenders;

