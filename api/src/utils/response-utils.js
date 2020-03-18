module.exports = class ResponseUtils {

    static erro(res, message) {
        res.status(200).send({ status: -1, message: message });
    }

    static sucesso(res, status, message) {
        res.status(200).send({ status: status, message: message });
    };
}