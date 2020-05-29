import { Router } from 'express';
import * as rpgController from '../../../controllers/rpg';
import validate from '../../../middlewares/validate';
import respond from '../../../middlewares/respond';
import * as validators from './validators';

// You can set login requirements on an API endpoint by putting `requireAuth` after the URL specification
export default function mountRPG(router: Router) {
    router.get(
        '/linux-calc/:num',
        validate(validators.linuxCalc),
        respond((req: any) => rpgController.linuxCalc(req.params.num))
    );
}
