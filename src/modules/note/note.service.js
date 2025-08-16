import NoteModel from "../../db/models/notes.model.js";
import { CustomError } from "../../utils/custom/custom_error_class.js";

export const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body || {};

    const result = await NoteModel.create([
      { title, content, userId: req.user._id },
    ]);
    console.log({ result });

    return res
      .status(201)
      .json({ success: true, message: "note created successfully!" });
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { title, content } = req.body || {};

    const updateObjectQuery = {};
    if (title) updateObjectQuery.title = title;
    if (content) updateObjectQuery.content = content;

    if (!Object.keys(updateObjectQuery).length) {
      throw new CustomError("nothing to update", 400);
    }

    const result = await NoteModel.findOneAndUpdate(
      { _id: req.note._id },
      updateObjectQuery,
      { new: true }
    );
    console.log({ result });

    return res.json({
      success: true,
      message: "note updated successfully!",
      body: result,
    });
  } catch (error) {
    next(error);
  }
};

export const replaceWithNewNote = async (req, res, next) => {
  try {
    const { title, content } = req.body || {};

    if (!title || !content) {
      throw new CustomError("title and content both required", 400);
    }

    const result = await NoteModel.findOneAndUpdate(
      { _id: req.note._id },
      { title, content },
      { new: true }
    );
    console.log({ result });

    return res.json({
      success: true,
      message: "note updated successfully!",
      body: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTitleOfAllNotes = async (req, res, next) => {
  try {
    const notesCount = await NoteModel.find({
      userId: req.user._id,
    }).countDocuments();
    console.log({ notesCount });

    if (!notesCount) {
      throw new CustomError("no notes are found", 404);
    }

    const { title } = req.body || {};

    if (!title) {
      throw new CustomError("title field is required", 400);
    }

    const result = await NoteModel.updateMany(
      { userId: req.user._id },
      { title }
    );
    console.log({ result });

    return res.json({
      success: true,
      message: "all notes updated successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const note = await NoteModel.findOneAndDelete({ _id: req.note._id });
    console.log({ note });

    return res.json({
      success: true,
      message: "note deleted successfully!",
      body: note,
    });
  } catch (error) {
    next(error);
  }
};
