const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(process.cwd(), ".public.env"), quiet: true });
dotenv.config({ path: path.resolve(process.cwd(), ".env"), quiet: true });
