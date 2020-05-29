/**
 * Built-in Error class for returning error codes as API responses. If this
 * error is caught by the root-level Respond middleware, a response will be
 * sent to the client using the `status` code and `message` fields of the
 * APIError. The `additionalData` field is stripped by default, with the
 * exception of data under `additionalData.send`. This key can be used to
 * send arbitrary error data back to the client.
 */
export default class APIError extends Error {
    /** An RFC-compliant HTTP status code to send to the client. */
    status: number;
    /** A human-friendly string message to send to the client. */
    message: string;
    /** Arbitrary additional error data. Only data under the `send` key will be sent to the client. All other data will simply be logged. */
    additionalData: any;

    constructor(status: number, message: string, additionalData?: any) {
        super();
        this.status = status;
        this.message = message;
        if (additionalData) {
            this.additionalData = additionalData;
        }
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON(): object {
        return {
            type: APIError,
            status: this.status,
            message: this.message,
            additionalData: this.additionalData,
            stack: this.stack
        };
    }
}
