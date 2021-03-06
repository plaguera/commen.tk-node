import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { InstallationController } from './controllers/installation-controller';
import morgan from 'morgan';
import routes from './routes';
import env from './environment';

/**
 * Express Webserver with custom routes, middleware and cors support.
 */
class Server {

	/**
	 * Express Server Object
	 */
	public express: express.Application;

	constructor() {
		this.express = express();
		this.middleware();
		this.enableCors();
		this.routes();
		this.installationController();
	}

	/**
	 * Enables CORS requests in the server with the selected headers and methods.
	 */
	enableCors() {
		const options: cors.CorsOptions = {
			allowedHeaders: [
				'Origin',
				'X-Requested-With',
				'Content-Type',
				'Accept',
				'X-Access-Token',
				'Authorization'
			],
			credentials: true,
			methods: 'GET,POST,PUT,DELETE',
			origin: true,
			preflightContinue: false
		};
		this.express.use(cors(options));
	}

	/**
	 * Adds all necessary middleware to the server.
	 */
	middleware() {
		this.express.use(cookieParser(env.cookie_secret));
		this.express.use(express.json());
		this.express.use(express.urlencoded({ extended: true }));
		this.express.use(compression());
		this.express.use(morgan('combined'));
		this.express.set('trust proxy', 1);
	}

	/**
	 * Adds all the routes in './routes' to the server.
	 */
	routes() {
		this.express.use('/', routes);
	}

	/**
	 * Sets up the @InstallationController
	 */
	installationController() {
		InstallationController.init(
			env.github_app.identifier,
			env.github_app.private_key
		);
	}
}

export default new Server().express;
