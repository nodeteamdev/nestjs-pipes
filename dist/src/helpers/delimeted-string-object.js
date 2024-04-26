"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function delimetedStringObject(n, v, d) {
    n = n.split(d || '.');
    n.reverse();
    return n.reduce(function (res, it, c) {
        if (c === 0)
            return { [it]: res };
        return { [it]: { is: res } };
    }, v);
}
exports.default = delimetedStringObject;
//# sourceMappingURL=delimeted-string-object.js.map