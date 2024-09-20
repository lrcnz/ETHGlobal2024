import { app } from "./app";
import { initDB } from "./libs/db";

initDB();

const server = app.listen(8000, () => {
  console.log("Server is running on http://localhost:4000");
});

process.on('SIGINT', function () {
  server.close();
  console.log('Server closed successfully');
});
