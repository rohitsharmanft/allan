
import { handleCustomError, handleCatch } from "./index";

export const restrict = (allowedScopes: string[]) => {
  return async (req: any, res: any, next: any) => {
    try {
      const scope = req.session_data?.scope;

      if (!scope || !allowedScopes.includes(scope)) {
        throw await handleCustomError("UNAUTHORIZED", "ENGLISH");
      }

      next();
    } catch (err) {
      handleCatch(res, err);
    }
  };
};
