import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import template from '../views/template';
import App from '../../components/App';
import {
  getStory, getMedium, getGithub, getProjects,
} from '../api';

const router = express.Router();

router.get('/', async (req, res) => {
  const story = await getStory();
  const medium = await getMedium();
  const github = await getGithub();
  const projects = await getProjects();

  const state = {
    story, medium, github, projects,
  };
  const body = renderToString(<App {...state} />);

  res.send(
    template({
      state,
      body,
    }),
  );
});

export default router;
