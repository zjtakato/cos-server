import cors from 'cors';
import multer from 'multer';
import config from './config';
import express from 'express';
import { DiskStorage } from './libs';

const app = express();
const disk = new DiskStorage({ dest: config.dest });
const multipary = multer({ storage: multer.memoryStorage() });

app.use(cors({ origin: config.corsOrigin }));
app.use(`/${config.dest}`, express.static(config.dest));

app.use(multipary.any());

app.post('/upload', async (req, res) => {
  const file = (req.files as Express.Multer.File[])?.[0];
  if (!file) return res.status(403).send('Forbidden');
  // TODO: DYMANIC BUCKET AND VALIDATE ACCESS KEY
  const diskPath = await disk.saveFile(file, 'tempBucket');
  const url = `${config.domain}/${diskPath}`;
  return res.json({ success: true, data: { url } });
});

app.listen(config.port, () => {
  console.log(`cos-server running in ${config.domain}`);
});
