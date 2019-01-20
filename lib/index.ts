import { parse as parseContentType } from 'content-type';
import { IncomingMessage, ServerResponse } from 'http';
import getRawBody from 'raw-body';
import { decode } from 'jsonwebtoken';

export function jose(contentTypes = ['application/jose']) {
    return async(req: IncomingMessage, res: ServerResponse, next: Function) => {
        try {
            const contentType = parseContentType(req);
            if (contentType && contentTypes.includes(contentType.type)) {
                const rawBody = await getRawBody(req, {
                    length: req.headers['content-length'],
                    limit: '1mb',
                    encoding: contentType.parameters.charset,
                });
                // TODO: Support providing additional options for decoding/decrypting/verifying
                const body = decode(rawBody, {complete: true});
                Object.defineProperty(req, 'body', {value: body});    
            }
            next();
        } catch (err) {
            next(err);
        }
    };
}