const md5 = require('md5');

module.exports = class CriptoUtils {

    static criptografar(senha) {
        try {
            return md5(senha).toUpperCase();
        } catch (e) {
            return null;
        }
    }

}