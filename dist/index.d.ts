import type { Reporter, FullConfig, Suite, TestCase, FullResult, TestResult } from "@playwright/test/reporter";
export interface MailReporterOptions {
    host?: string;
    port?: number;
    secure?: boolean;
    username?: string;
    password?: string;
    from: string | undefined;
    to: string | undefined;
    subject: string;
    mailOnSuccess?: boolean;
    linkToResults?: string;
    showError?: boolean;
    quiet?: boolean;
    debug?: boolean;
}
declare class MailReporter implements Reporter {
    private options;
    private suite;
    constructor(options: MailReporterOptions);
    onBegin(_: FullConfig, suite: Suite): void;
    onStdOut(chunk: string | Buffer, _: void | TestCase, __: void | TestResult): void;
    onStdErr(chunk: string | Buffer, _: TestCase, __: TestResult): void;
    onEnd(_: FullResult): Promise<void>;
}
export default MailReporter;
