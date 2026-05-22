import { ivanCall, type IvanResult } from "./ivan-api";

export type IvanRole = {
  _id: string;
  name: string;
  permissions: string[];
  isSystem: boolean;
};

/** User из спеки Ивана (components.schemas.User). */
export type IvanUser = {
  _id: string;
  email: string;
  firstName?: string;
  profession?: string;
  fieldOfActivity?: string;
  city?: string;
  /** Роль доступа. null/отсутствует → НЕ админ (только saas-teacher). */
  role?: IvanRole | null;
  lastLogin?: string;
  createdAt?: string;
};

/** GET /profile с relay-куки и авто-refresh на 401. */
export function fetchProfile(cookie: string | null): Promise<IvanResult<IvanUser>> {
  return ivanCall<IvanUser>({ path: "/profile", cookie, retryOn401: true });
}
