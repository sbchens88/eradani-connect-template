const rpgController = require('../../../controllers/rpg');
const respond = require('../../../middlewares/respond');
const path = require('path');

module.exports = function mountRPG(router) {

    router.get('/linux-calc/ui', (req, res) => res.sendFile(path.join(__dirname, '../../../../public/linux-calc.html')));
    
    router.get('/linux-calc/:num', respond((req, res) => rpgController.linuxCalc(req.params.num)));

};