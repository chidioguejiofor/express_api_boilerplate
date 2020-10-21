import "dotenv/config";
import server from "./app";

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server Started at Port, ${PORT}`);
});
