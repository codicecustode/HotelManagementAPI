import app from './src/app/index';

const PORT = process.env.PORT 

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

