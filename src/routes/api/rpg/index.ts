import { Router } from 'express';
import * as rpgController from '../../../controllers/rpg';
import validate from '../../../middlewares/validate';
import respond from '../../../middlewares/respond';
import * as validators from './validators';

// You can set login requirements on an API endpoint by putting `requireAuth` after the URL specification
export default function mountRPG(router: Router) {
    router.get(
        '/simple-calc/:num',
        validate(validators.simpleCalc),
        respond((req: any) => rpgController.simpleCalc(req.params.num))
    );
}
