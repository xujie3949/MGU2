import createDebug, { enable } from 'debug';

const namespace = 'App::UtilLogger';

enable(namespace);

const logger = createDebug(namespace);

export default logger;

