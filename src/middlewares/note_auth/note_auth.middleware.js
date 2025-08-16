import NoteModel from "../../db/models/notes.model.js";
import { CustomError } from "../../utils/custom/custom_error_class.js";

export const noteAuthMiddleware = async (req, res, next) => {
  try {
    const noteId = req.params.noteId;
    const note = await NoteModel.findById(noteId);

    if (!note) {
      throw new CustomError("note not found", 404);
    }

    if (!req.user._id.equals(note.userId)) {
      throw new CustomError("not authorized to update this note", 403);
    }
    req.note = note;
    next();
  } catch (error) {
    next(error);
  }
};
