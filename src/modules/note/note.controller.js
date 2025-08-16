import { Router } from "express";
import * as noteService from "../note/note.service.js";
import { authMiddleware } from "../../middlewares/auth/auth.middlerware.js";
import { noteAuthMiddleware } from "../../middlewares/note_auth/note_auth.middleware.js";

const noteRouter = Router();

noteRouter.use(authMiddleware);
noteRouter.post("/", noteService.createNote);
noteRouter.put("/all", noteService.updateTitleOfAllNotes);
noteRouter.patch("/:noteId", noteAuthMiddleware, noteService.updateNote);
noteRouter.put("/:noteId", noteAuthMiddleware, noteService.replaceWithNewNote);
noteRouter.delete("/:noteId", noteAuthMiddleware, noteService.deleteNote);

export default noteRouter;
