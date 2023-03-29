import { AuthenticationMiddleware } from "@/application/middlewares";
import { makeJwtTokenHandler } from "@/main/factories/infra/gateways";

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
    const jwt = makeJwtTokenHandler();
    return new AuthenticationMiddleware(jwt.validate.bind(jwt));
    /**
     * bind faz com que a referência para o objeto jwt não seja perdida.
     * dessa forma, o ponteiro this não é undefined, e conseguimos acessar os atributos da classe
     */
};
