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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processResults = void 0;
const _1 = require(".");
const path_1 = require("path");
const constants_1 = require("../constants");
const nodemailer_1 = __importDefault(require("nodemailer"));
const processResults = (suite, options) => __awaiter(void 0, void 0, void 0, function* () {
    if (!options.host ||
        !options.port) {
        console.error("Missing SMTP options");
        return;
    }
    if (!options.from) {
        console.error("Missing from email address");
        return;
    }
    if (!options.to) {
        console.error("Missing to email address");
        return;
    }
    if (!suite) {
        return;
    }
    const transporter = nodemailer_1.default.createTransport({
        host: options.host,
        secure: options.secure,
        port: options.port,
        auth: {
            user: options.username,
            pass: options.password,
        },
    });
    const totalStatus = (0, _1.getTotalStatus)(suite.suites);
    const summary = (0, _1.getSummaryDetails)(suite);
    const testMarkup = [];
    for (const crntSuite of suite.suites) {
        const project = crntSuite.project();
        const tests = (0, _1.getTestsPerFile)(crntSuite);
        for (const filePath of Object.keys(tests)) {
            const fileName = (0, path_1.basename)(filePath);
            const content = yield (0, _1.getHtmlTable)(tests[filePath], !!options.showError);
            if (content) {
                testMarkup.push(`<h3 style="${constants_1.styles.heading3}">${(0, _1.getTestHeading)(fileName, process.platform, project)}</h3>`);
                testMarkup.push(content);
            }
        }
    }
    const totalFailed = totalStatus.failed + totalStatus.timedOut;
    const hasFailed = totalFailed > 0;
    if (!options.mailOnSuccess && !hasFailed) {
        console.log("Not sending email on success");
        return;
    }
    const toFields = options.to.split(",").map((to) => to.trim());
    const info = yield transporter.sendMail({
        from: options.from,
        to: toFields.join(", "),
        subject: `${options.subject} - ${hasFailed ? "Failed" : "Success"}`,
        html: `<h2 style="${constants_1.styles.heading2}">Summary</h2>
${summary}

<h2 style="${constants_1.styles.heading2}">Test results</h2>
${testMarkup.join("")}

${options.linkToResults
            ? `<br/><hr/><br/><a style="${constants_1.styles.anchor}" href="${options.linkToResults}">View results</a>`
            : ""}
    `,
    });
    console.log(`Message sent: ${info.messageId}`);
});
exports.processResults = processResults;
