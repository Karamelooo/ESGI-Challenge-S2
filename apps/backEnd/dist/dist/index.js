"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const mongoString = process.env.DB_URL || 'mongodb://esgi:esgi@database:27017';
mongoose_1.default.connect(mongoString)
    .then(() => {
    console.log('Database Connected');
})
    .catch((error) => {
    console.error(error);
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server started and listening on port ${PORT}`);
});
