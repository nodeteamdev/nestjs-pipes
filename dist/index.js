"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderByPipe = exports.WherePipe = void 0;
const where_pipe_1 = __importDefault(require("./prisma/where.pipe"));
exports.WherePipe = where_pipe_1.default;
const order_by_pipe_1 = __importDefault(require("./prisma/order-by.pipe"));
exports.OrderByPipe = order_by_pipe_1.default;
//# sourceMappingURL=index.js.map