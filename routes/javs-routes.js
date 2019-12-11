const express = require('express');

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1'
  }
];

router.get('/:jid', (req, res, next) => {
  const javId = req.params.jid;
  const jav = DUMMY_PLACES.find(j => {
    return j.id === javId;
  });
  if (!jav) {
    const error = new Error('Could not find the video you are looking for.');
    error.code = 404;
    throw error;
}
  res.json({ jav });
});

router.get('/', (req, res, next) => {
  res.json({ DUMMY_PLACES });
});

module.exports = router;