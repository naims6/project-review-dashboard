import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes.js";
import { ProjectRoutes } from "../modules/projects/projects.routes.js";
import { MentorRoutes } from "../modules/mentor/mentor.routes.js";
import { AdminRoutes } from "../modules/admin/admin.routes.js";

const router: Router = Router();

const moduleRouters = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/projects",
    route: ProjectRoutes,
  },
  {
    path: "/mentor",
    route: MentorRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));

export default router;
