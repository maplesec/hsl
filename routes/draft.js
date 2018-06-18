'use strict';

import express from 'express'
import Draft from '../controller/draft'
const router = express.Router();

router.get('/', Draft.getDraft);
router.post('/', Draft.createDraft);
router.get('/:draft_id', Draft.getDraftById);
router.delete('/:draft_id', Draft.deleteDraft);
router.put('/:draft_id', Draft.updateDraft);

export default router
