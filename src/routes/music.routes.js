

import {Router} from 'express';
import { musics, searchMusic } from '../controllers/musics.controllers.js';
import { artists, searchArtist } from '../controllers/artists.controllers.js';

const musicRouter = Router();

musicRouter.route("/top-musics").get(musics);
musicRouter.route("/search-artist").get(searchArtist);
musicRouter.route("/artists").get(artists);
musicRouter.route("/search-musics").get(searchMusic);

export default musicRouter