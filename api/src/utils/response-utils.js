module.exports = class ResponseUtils {

    static erro(res, message) {
        res.status(500).send({ message: message });
    }

    static falha(res, message) {
        res.status(400).send({ message: message });
    }

    static sucesso(res, message) {
        res.status(200).send({ message: message });
    };
}