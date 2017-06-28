const http = require('http');
const serverName = 'jfServerBase/' + require('./package.json').version;
/**
 * Crea un servidor web y permite recuperar el cuerpo de la respuesta
 * pasando un callback como segundo parámetro.
 */
module.exports = {
    /**
     * Crea el servidor web.
     *
     * @param {Number}   port    Puerto donde se escucharán las peticiones.
     * @param {Function} cb      Callback a ejecutar cuando se recibe una petición.
     * @param {String}   charset Juego de caracteres de los datos recibidos.
     */
    create(port, cb, charset = 'utf8')
    {
        if (typeof cb !== 'function')
        {
            throw new TypeError('El callback es obligatorio');
        }
        return http
            .createServer(
                (request, response) => this.getBody(
                    request,
                    body => {
                        response.setHeader('Server', serverName);
                        cb(request, response, body)
                    },
                    charset
                )
            )
            .listen(port);
    },
    /**
     * Devuelve el cuerpo de la petición/respuesta.
     *
     * @param {http.IncomingMessage} message Petición/respuesta recibida.
     * @param {Function}             cb      Callback a ejecutar cuando se lean todos los datos.
     * @param {String}               charset Juego de caracteres de los datos recibidos.
     */
    getBody(message, cb, charset = 'utf8')
    {
        let _body = [];
        message.addListener('data', chunk => _body.push(chunk));
        message.addListener(
            'end',
            chunk =>
            {
                if (chunk)
                {
                    _body.push(chunk);
                }
                _body = Buffer.concat(_body).toString(charset);
                if (message.headers && (message.headers['content-type'] || '').indexOf('json') !== -1)
                {
                    try
                    {
                        _body = JSON.parse(_body);
                    }
                    catch (e)
                    {
                    }
                }
                cb(_body);
            }
        );
    }
};
