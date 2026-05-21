import type { Student } from "./auth-context";
import { ivanCall, type IvanResult } from "./ivan-api";

export type IvanRole = {
  _id: string;
  name: string;
  permissions: string[];
  isSystem: boolean;
};

export type IvanCourseGroupRef = {
  _id: string;
  name?: string;
  active?: boolean;
  qrCode?: string;
};

/** Форма User из спеки Ивана (components.schemas.User). */
export type IvanUser = {
  _id: string;
  email: string;
  firstName?: string;
  profession?: string; // → Student.role («Роль в бизнесе»)
  fieldOfActivity?: string; // → Student.industry («Сфера деятельности»)
  city?: string; // → Student.region («Регион»)
  role?: IvanRole; // access-роль (не бизнес-роль)
  courseGroup?: IvanCourseGroupRef | null;
  lastLogin?: string;
  createdAt?: string;
};

/** GET /profile с relay-куки и авто-refresh на 401. */
export function fetchProfile(cookie: string | null): Promise<IvanResult<IvanUser>> {
  return ivanCall<IvanUser>({ path: "/profile", cookie, retryOn401: true });
}

/**
 * User (Ивана) → Student (наш UI-контракт из auth-context).
 * Phase 1: program/project = null, isActive = true. Привязку к группе и проектам
 * подключим в Phase 2 (из u.courseGroup и эндпоинтов проектов).
 */
export function mapUserToStudent(u: IvanUser): Student {
  return {
    id: u._id,
    email: u.email,
    firstName: u.firstName ?? null,
    lastName: null, // у Ивана только firstName
    role: u.profession ?? null, // «Роль в бизнесе» ← profession
    industry: u.fieldOfActivity ?? null, // «Сфера деятельности»
    region: u.city ?? null, // «Регион» = city
    isActive: true, // Phase 2: из courseGroup.active
    program: null, // Phase 2
    project: null, // Phase 2
  };
}
