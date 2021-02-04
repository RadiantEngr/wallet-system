"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.requestPasswordReset = void 0;
var user_1 = require("../models/user");
var jwt_simple_1 = __importDefault(require("jwt-simple"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var mailer_1 = __importDefault(require("../mailer"));
var requestPasswordReset = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, _id, token, subject, content, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                email = req.body.email;
                return [4 /*yield*/, user_1.User.findOne({ email: email })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(400).json({ message: "You are not a registered user" })];
                }
                _id = user._id;
                token = jwt_simple_1.default.encode({ _id: _id }, "" + process.env.JWT_SECRET);
                subject = "PASSWORD RESET";
                content = "Click the following link to reset your password:\nhttp://localhost:3000/apiv1/" + token;
                mailer_1.default(subject, content, email);
                res.status(200).json({ message: "Email notification sent", token: token });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                res.status(400).json({ Error: err_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.requestPasswordReset = requestPasswordReset;
var changePassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, _a, email, newPassword, confirmNewPassword, user, payload, saltRounds, hashedPassword, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                token = req.params.token;
                _a = req.body, email = _a.email, newPassword = _a.newPassword, confirmNewPassword = _a.confirmNewPassword;
                if (newPassword.length < 4 || newPassword !== confirmNewPassword) {
                    res.status(400).send("Make sure passwords match and has at least 4 characters");
                }
                return [4 /*yield*/, user_1.User.findOne({ email: email })];
            case 1:
                user = _b.sent();
                payload = jwt_simple_1.default.decode(token, "" + process.env.JWT_SECRET);
                if (!(payload._id == user._id)) return [3 /*break*/, 4];
                saltRounds = 10;
                return [4 /*yield*/, bcrypt_1.default.hash(newPassword, saltRounds)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, user_1.User.findOneAndUpdate({ email: email }, {
                        $set: {
                            password: hashedPassword
                        }
                    })];
            case 3:
                _b.sent();
                res.status(200).json({ message: "Password has been reset successfully" });
                return [3 /*break*/, 5];
            case 4:
                res.status(401).json({ message: "You are not allowed to perform this activity" });
                _b.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_2 = _b.sent();
                res.status(401).json({ Error: err_2.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.changePassword = changePassword;
