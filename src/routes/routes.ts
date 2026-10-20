import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes.js";
import { ProjectRoutes } from "../modules/projects/projects.routes.js";
import { MentorRoutes } from "../modules/mentor/mentor.routes.js";

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
];

moduleRouters.forEach((route) => router.use(route.path, route.route));

export default router;
