import { Router } from 'express';
import * as rpgController from 'src/controllers/rpg';
import validate from 'src/middlewares/validate';
import respond from 'src/middlewares/respond';
import * as validators from './validators';

// You can set login requirements on an API endpoint by putting `requireAuth` after the URL specification
export default function mountRPG(router: Router) {
    router.get(
        '/simple-calc/:num',
        validate(validators.simpleCalc),
        respond((req: any) => rpgController.simpleCalc(req.params.num))
    );
}
