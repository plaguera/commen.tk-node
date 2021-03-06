import { Request, Response } from 'express';
import { Controller } from './controller';
import { RequestParameters } from '@octokit/graphql/dist-types/types';

/**
 * Controller in charge of user and viewer requests.
 */
export class UserController extends Controller {
    /**
     * Returns information of @id user, if no @id is specified, of the user whose credentials are being used.
     * @param req Request
     * @param res Response
     */
    static async get(req: Request, res: Response) {
        let query: RequestParameters;
        if (req.params.id) {
            query = {
                query: `query GETuser ($id: String!) {
                    user(login: $id) {
                        login
                        url
                        avatarUrl(size: 80)
                    }
                }`,
                id: req.params.id
            };
        } else {
            if (!(req.signedCookies.access_token || req.headers.authorization)) {
                Controller.sendResponse(res, 200, { viewer: undefined });
                return;
            }
            query = {
                query: `query GETviewer {
                    viewer {
                        login
                        url
                        avatarUrl(size: 80)
                    }
                }`
            };
        }
        Controller.graphql(req, res, query);
    }
}