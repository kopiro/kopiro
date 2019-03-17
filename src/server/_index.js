import express from 'express';
import indexRouter from './routes/index';
import paths from '../../paths';
import fetcher from './fetcher';

fetcher();
setInterval(fetcher, 60 * 60 * 1000);

const server = express();

server.use('/', indexRouter);
server.use(express.static(paths.public));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serving at http://localhost:${PORT}`);
});
