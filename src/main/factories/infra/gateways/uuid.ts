import { UUIDHandler, UniqueId } from "@/infra/gateways";

export const makeUuidHandler = (): UUIDHandler => {
   return new UUIDHandler();
};

export const makeUniqueId = (): UniqueId => {
   return new UniqueId(new Date());
};
