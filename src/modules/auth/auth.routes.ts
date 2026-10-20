import { Request, Response, Router } from "express";

const router: Router = Router();

router.post("/login", (req: Request, res: Response) => {
  res.send("Abc");
});

export const AuthRoutes = router;
