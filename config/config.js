const path = require('path');

const cwd = process.cwd();
const packageJson = require(`${cwd}/package.json`);

const vendors = Object.keys(packageJson.dependencies);

const config = {
    host: 'localhost',
    port: '3000',
    path: {
        root: cwd,
        dll: path.join(cwd, '/dll'),
        output: path.join(cwd, '/public'),
        public: '/',
        htmlTemplate: path.join(cwd, 'src/index.html'),
        favicon: path.join(cwd, 'src/favicon.ico'),
        src: path.join(cwd, 'src/'),
        images: path.join(cwd, 'src/images/'),
        styles: path.join(cwd, 'src/styles/'),
        utils: path.join(cwd, 'src/utils/'),
        components: path.join(cwd, 'src/components/'),
        models: path.join(cwd, 'src/models/'),
        stores: path.join(cwd, 'src/stores/'),
        services: path.join(cwd, 'src/services/'),
        navinfo: path.join(cwd, 'src/navinfo/'),
        business: path.join(cwd, 'src/business/'),
    },
    vendors: vendors,
};

module.exports = config;
