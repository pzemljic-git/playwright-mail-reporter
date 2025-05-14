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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class MailReporter {
    constructor(options) {
        this.options = options;
        const defaultOptions = {
            host: undefined,
            port: undefined,
            secure: true,
            username: undefined,
            password: undefined,
            from: undefined,
            to: undefined,
            subject: "Playwright Test Results",
            linkToResults: undefined,
            mailOnSuccess: true,
            showError: false,
            quiet: false,
            debug: false,
        };
        this.options = Object.assign(Object.assign({}, defaultOptions), options);
        // Set default options
        if (typeof options.mailOnSuccess === "undefined") {
            this.options.mailOnSuccess = true;
        }
        console.log(`Using the Mail Reporter`);
        if (process.env.NODE_ENV === "development" || this.options.debug) {
            console.log(`Using debug mode`);
            // Do not return the API key
            const clonedOptions = Object.assign({}, this.options);
            clonedOptions.password = clonedOptions.password
                ? "**********"
                : "NOT DEFINED";
            console.log(`Options: ${JSON.stringify(clonedOptions, null, 2)}`);
        }
    }
    onBegin(_, suite) {
        this.suite = suite;
    }
    onStdOut(chunk, _, __) {
        if (this.options.quiet) {
            return;
        }
        const text = chunk.toString("utf-8");
        process.stdout.write(text);
    }
    onStdErr(chunk, _, __) {
        if (this.options.quiet) {
            return;
        }
        const text = chunk.toString("utf-8");
        process.stderr.write(text);
    }
    onEnd(_) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, utils_1.processResults)(this.suite, this.options);
        });
    }
}
exports.default = MailReporter;
