import app from './src/app.js';
import config from './src/config.js';

const PORT = process.env.PORT || config.port;

app.listen(PORT, () => {
  console.log(`Server is running @ http://127.0.0.1:${PORT}`);
});
