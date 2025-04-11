const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(process.cwd(), ".public.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
