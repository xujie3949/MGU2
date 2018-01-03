import navinfo from 'Navinfo';
import RdLink from './RdLink';
import RdNode from './RdNode';

function registerRenders() {
    const renderFactory = navinfo.mapApi.render.RenderFactory.getInstance();
    renderFactory.register('RDLINK', RdLink);
    renderFactory.register('RDNODE', RdNode);
}

export default registerRenders;

