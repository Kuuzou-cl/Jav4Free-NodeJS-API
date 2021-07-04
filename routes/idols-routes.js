const express = require('express');
const auth = require('../middleware/auth');
const idolsControllers = require('../controllers/idols-controllers');

const router = express.Router();

router.get('/getRandomIdols', idolsControllers.getRandom4Idols);

router.get('/getIdolsByPage/:page', idolsControllers.getIdolsByPage);

router.get('/idolsNotEmpty/:page', idolsControllers.getIdolsNotEmpty);

router.get('/:iid', idolsControllers.getIdolById);

router.get('/', idolsControllers.getIdols);

router.post('/newIdol', auth, idolsControllers.createIdol);

router.patch('/:iid', auth, idolsControllers.updateIdol);

router.delete('/deleteIdolsEmpty', auth, idolsControllers.deleteIdolsEmpty);

router.delete('/:iid', auth, idolsControllers.deleteIdol);

module.exports = router;