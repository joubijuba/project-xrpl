import EncryptionController from "./controllers/EncryptionController";
import { getServer } from "./bootServer";

const main = () => {
  const expressServer = getServer();
  const encryptionController = new EncryptionController(expressServer);
}

main()