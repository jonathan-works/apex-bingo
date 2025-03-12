import { Router } from 'express';

const router = Router();

export function setRoutes(app) {
  router.get('/api/example', (req, res) => {
    res.json({ message: 'Hello from the Express API!' });
  });

  app.use(router);
}