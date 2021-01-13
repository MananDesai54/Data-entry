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
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var cors_1 = __importDefault(require("cors"));
var helmet_1 = __importDefault(require("helmet"));
var mongoose_1 = require("mongoose");
var node_schedule_1 = __importDefault(require("node-schedule"));
var web_push_1 = __importDefault(require("web-push"));
dotenv_1.default.config();
var app = express_1.default();
var PORT = process.env.PORT || 5000;
var connectToDatabase = function () { return __awaiter(void 0, void 0, void 0, function () {
    var connection, _a, _b, _c, error_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                connection = mongoose_1.connect(process.env.DATABASE_URL, {
                    useUnifiedTopology: true,
                    useNewUrlParser: true,
                });
                _b = (_a = console).log;
                _c = ["Connected with database: "];
                return [4 /*yield*/, connection];
            case 1:
                _b.apply(_a, _c.concat([(_d.sent()).connection.host]));
                return [3 /*break*/, 3];
            case 2:
                error_1 = _d.sent();
                console.log(error_1.message);
                process.exit(1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
connectToDatabase().then(function () {
    app.listen(PORT, function () {
        return console.log("Server is running at http://127.0.0.1:" + PORT);
    });
});
var personModel = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
});
var Person = mongoose_1.model("Person", personModel);
var subscriptionModel = new mongoose_1.Schema({
    subscription: {
        type: Object,
        required: true,
    },
});
var Subscription = mongoose_1.model("Subscription", subscriptionModel);
/**
 * Schedule push notifications
 */
node_schedule_1.default.scheduleJob("30 17 */1 * *", function () { return __awaiter(void 0, void 0, void 0, function () {
    var persons, filteredPersons, message_1, todayPersons_1, tomorrowPersons_1, subs, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, Person.find({})];
            case 1:
                persons = _a.sent();
                filteredPersons = persons.filter(function (person) { return new Date(person.dueDate).getTime() > Date.now(); });
                if (!(filteredPersons.length === 0)) return [3 /*break*/, 2];
                message_1 = "No more dues are remaining";
                return [3 /*break*/, 4];
            case 2:
                todayPersons_1 = persons.filter(function (person) {
                    return new Date(person.dueDate).getDate() === new Date().getDate() &&
                        new Date(person.dueDate).getMonth() === new Date().getMonth() &&
                        new Date(person.dueDate).getFullYear() === new Date().getFullYear();
                });
                console.log(todayPersons_1);
                console.log("============================================");
                tomorrowPersons_1 = persons.filter(function (person) {
                    return new Date(person.dueDate).getDate() === new Date().getDate() + 1 &&
                        new Date(person.dueDate).getMonth() === new Date().getMonth() &&
                        new Date(person.dueDate).getFullYear() === new Date().getFullYear();
                });
                console.log(tomorrowPersons_1);
                message_1 = "Your Post due reminder";
                web_push_1.default.setVapidDetails("mailto:test@test.com", process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY);
                return [4 /*yield*/, Subscription.find({})];
            case 3:
                subs = _a.sent();
                subs.forEach(function (sub) { return __awaiter(void 0, void 0, void 0, function () {
                    var subscription;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                subscription = sub.subscription;
                                return [4 /*yield*/, web_push_1.default.sendNotification({
                                        endpoint: subscription.endpoint,
                                        keys: {
                                            auth: subscription.keys.auth,
                                            p256dh: subscription.keys.p256dh,
                                        },
                                    }, JSON.stringify({
                                        title: message_1,
                                        content: "You have " + todayPersons_1.length + " dues Today and " + tomorrowPersons_1.length + " dues tomorrow",
                                        openUrl: "/list",
                                    }))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                console.log(error_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
//cors & helmet => for security
app.use(cors_1.default());
app.use(helmet_1.default());
// used to log requests
if (process.env.NODE_ENV === "development") {
    app.use(morgan_1.default("dev"));
}
app.use(express_1.default.json());
app.get("/", function (_, res) {
    res.json("API running.");
});
app.post("/subscribe", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var subscription, sub, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                subscription = req.body.subscription;
                console.log(subscription);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                if (!subscription) return [3 /*break*/, 3];
                sub = new Subscription({
                    subscription: subscription,
                });
                return [4 /*yield*/, sub.save()];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).json({
                        subscription: sub,
                    })];
            case 3: return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                console.log(error_3.message);
                res.status(500).json({
                    message: "Something went wrong",
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.post("/auth", function (req, res) {
    var _a = req.body, name = _a.name, password = _a.password;
    if (name.toLowerCase() === "vrunda" && password === "vrunda6977") {
        res.status(200).json("Login");
    }
    else {
        res.status(400).json({
            message: "Invalid credentials",
        });
    }
});
app.get("/data", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var person, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Person.find({})];
            case 1:
                person = _a.sent();
                return [2 /*return*/, res.json(person)];
            case 2:
                error_4 = _a.sent();
                console.log(error_4.message);
                res.status(500).json({
                    message: "Something went wrong",
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, person, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Person.findById(id)];
            case 2:
                person = _a.sent();
                if (!person) {
                    return [2 /*return*/, res.status(404).json({
                            message: "Person Not found",
                        })];
                }
                return [2 /*return*/, res.json(person)];
            case 3:
                error_5 = _a.sent();
                console.log(error_5.message);
                res.status(500).json({
                    message: "Something went wrong",
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, amount, date, dueDate, person, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, amount = _a.amount, date = _a.date, dueDate = _a.dueDate;
                if (!name || !amount || !date || !dueDate) {
                    console.log(name, amount, date, dueDate);
                    return [2 /*return*/, res.status(400).json({
                            message: "Provide all fields",
                        })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                person = new Person({
                    name: name,
                    amount: amount,
                    date: date,
                    dueDate: dueDate,
                });
                return [4 /*yield*/, person.save()];
            case 2:
                _b.sent();
                return [2 /*return*/, res.json(person)];
            case 3:
                error_6 = _b.sent();
                console.log(error_6.message);
                res.status(500).json({
                    message: "Something went wrong",
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.put("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, amount, date, dueDate, id, person, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, amount = _a.amount, date = _a.date, dueDate = _a.dueDate;
                id = req.params.id;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, Person.findById(id)];
            case 2:
                person = _b.sent();
                if (name)
                    person.name = name;
                if (amount)
                    person.amount = amount;
                if (date)
                    person.date = date;
                if (dueDate)
                    person.dueDate = dueDate;
                return [4 /*yield*/, person.save()];
            case 3:
                _b.sent();
                return [2 /*return*/, res.json(person)];
            case 4:
                error_7 = _b.sent();
                console.log(error_7.message);
                res.status(500).json({
                    message: "Something went wrong",
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.delete("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, person, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Person.findByIdAndDelete(id)];
            case 2:
                person = _a.sent();
                return [2 /*return*/, res.json({ success: true })];
            case 3:
                error_8 = _a.sent();
                console.log(error_8.message);
                res.status(500).json({
                    message: "Something went wrong",
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
