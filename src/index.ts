require('dotenv').config();
import express from './server';
import log from './logger';
import env from './environment';

log.debug('NODE_ENV', env.node_env);
log.debug('CWD\t', env.cwd);
let port = env.port || '8080';

express.listen(port, () => {
	console.log(`Server started on port ${port}`);
});