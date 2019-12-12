const express = require('express');

const idolsControllers = require('../controllers/idols-controllers')

const router = express.Router();


router.get('/:cid', idolsControllers.getIdolById);

router.get('/', idolsControllers.getIdols);

router.post('/newIdol', idolsControllers.createIdol);

router.patch('/:cid', idolsControllers.updateIdol);

router.delete('/:cid', idolsControllers.deleteIdol);

module.exports = router;
