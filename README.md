# Trick or Tense — Halloween English Adventure

A responsive Year 3 English learning game for practising the present continuous tense.

## Features
- Interactive 3D village map built with React Three Fiber and Three.js
- Six sequential learning quests: Pumpkin Patch, Haunted House, Witch's Carnival, Candy Forest, Monster Castle and News Studio
- Text-to-speech support for vocabulary and model sentences
- Random action spinner, partner dialogue prompts and 10-question quiz
- 80% quiz pass target, candy rewards and saved progress using localStorage
- Final speaking challenge and learner reflection
- Responsive layout and Netlify configuration

## Run locally
1. Install Node.js (LTS).
2. Open this folder in a terminal.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL printed by Vite.

## Build
Run `npm run build`. The production website is generated in `dist/`.

## Deploy to Netlify
1. Push this project to a GitHub repository.
2. In Netlify choose **Add new project → Import an existing project**.
3. Select the repository.
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy.

The included `netlify.toml` already defines these settings and the single-page-app redirect.

## Teaching notes
The game is designed around the sentence pattern **Who + am/is/are + verb-ing**. It supports the Year 3 lesson objective of describing actions using the present continuous tense. Teacher-led modelling, pair talk and spoken practice should accompany independent gameplay.

## Media and licensing
This starter project uses emoji, CSS shapes and browser text-to-speech rather than third-party copyrighted music or video. If you add external images, audio or video, check the licence, attribute the creator where required, and obtain appropriate permission. Do not collect pupils' personal information unless your school has approved the platform and data handling.
