const express = require('express');

const idolsControllers = require('../controllers/idols-controllers');

const router = express.Router();

router.get('/getRandomIdols', idolsControllers.getRandom4Idols);

router.get('/getIdolsByPage/:page', idolsControllers.getIdolsByPage);

router.get('/:iid', idolsControllers.getIdolById);

router.get('/', idolsControllers.getIdols);

router.post('/newIdol', idolsControllers.createIdol);

router.patch('/:iid', idolsControllers.updateIdol);

router.delete('/:iid', idolsControllers.deleteIdol);

module.exports = router;