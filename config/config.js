const path = require('path');

const cwd = process.cwd();
const packageJson = require(`${cwd}/package.json`);

const vendors = Object
  .keys(packageJson.dependencies)
  .filter(item => {
    // sanitize.css在使用ExtractTextPlugin插件单独抽取css时会报错,原因未知
    // 这里将sanitize.css库排除
    if (item === 'sanitize.css') {
      return false;
    }
    return true;
  });

const config = {
  host: '0.0.0.0',
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
  },
  vendors: vendors,
};

module.exports = config;
