import NoteModel from "../../db/models/notes.model.js";
import { CustomError } from "../../utils/custom/custom_error_class.js";
import asyncHandler from "../../utils/handlers/async_handler.js";

export const createNote = asyncHandler(async (req, res, next) => {
  const { title, content } = req.body || {};

  const result = await NoteModel.create([
    { title, content, userId: req.user._id },
  ]);
  console.log({ result });

  return res
    .status(201)
    .json({ success: true, message: "note created successfully!" });
});

export const updateNote = asyncHandler(async (req, res, next) => {
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
    { new: true, runValidators: true }
  );
  console.log({ result });

  return res.json({
    success: true,
    message: "note updated successfully!",
    body: result,
  });
});

export const replaceWithNewNote = asyncHandler(async (req, res, next) => {
  const { title, content } = req.body || {};

  if (!title || !content) {
    throw new CustomError("title and content both required", 400);
  }

  const result = await NoteModel.findOneAndUpdate(
    { _id: req.note._id },
    { title, content },
    { new: true, runValidators: true }
  );
  console.log({ result });

  return res.json({
    success: true,
    message: "note updated successfully!",
    body: result,
  });
});

export const updateTitleOfAllNotes = asyncHandler(async (req, res, next) => {
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
    { title },
    {runValidators: true}
  );
  console.log({ result });

  return res.json({
    success: true,
    message: "all notes updated successfully!",
  });
});

export const deleteNote = asyncHandler(async (req, res, next) => {
  const note = await NoteModel.findOneAndDelete({ _id: req.note._id });
  console.log({ note });

  return res.json({
    success: true,
    message: "note deleted successfully!",
    body: note,
  });
});

export const getNotesOfUser = asyncHandler(async (req, res, next) => {
  let { pageSize = 2, page = 1 } = req.query || {};
  pageSize = Number(pageSize);
  page = Number(page);

  if (page <= 0 || pageSize <= 0) {
    throw new CustomError("page and pageSize numbers must be greator than 0");
  }
  const offset = pageSize * (page - 1);
  const [totalCount, notes] = await Promise.all([
    NoteModel.countDocuments({ userId: req.user._id }),
    NoteModel.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(offset),
  ]);
  console.log({ totalCount });

  return res.json({
    success: true,
    body: {
      totalNotes: totalCount,
      pageSize,
      page,
      tatalPages: Math.ceil(totalCount / pageSize),
      notes,
    },
  });
});

export const getNoteById = asyncHandler(async (req, res, next) => {
  return res.json({
    success: true,
    body: req.note,
  });
});

export const getNoteByContent = asyncHandler(async (req, res, next) => {
  const contentQuery = req.query.content;
  console.log({ contentQuery });

  if (!contentQuery) {
    throw new CustomError("content to find with is missing", 400);
  }

  const result = await NoteModel.find({
    $and: [
      {
        content: { $regex: contentQuery, $options: "i" },
        userId: req.user._id,
      },
    ],
  });

  if (!result.length) {
    throw new CustomError("no notes were found", 404);
  }

  return res.json({
    success: true,
    body: result,
  });
});

export const getNotesWithLoggedUserInfo = asyncHandler(
  async (req, res, next) => {
    const notes = await NoteModel.find(
      { userId: req.user._id },
      { title: 1, userId: 1, createdAt: 1 }
    ).populate([{ path: "userId", select: "email" }]);

    if (!notes.length) {
      throw new CustomError("no notes were found", 404);
    }

    return res.json({
      success: true,
      body: notes,
    });
  }
);

export const getAllNotesAndSearchWithTitle = asyncHandler(
  async (req, res, next) => {
    const titleQuery = req.query.title;
    console.log({ titleQuery });

    const result = await NoteModel.aggregate([
      {
        $match: {
          $and: [
            { userId: req.user._id },
            titleQuery ? { title: titleQuery } : {},
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "userId",
          as: "user",
          pipeline: [
            {
              $project: {
                _id: 0,
                name: 1,
                email: 1,
              },
            },
          ],
        },
      },
    ]);

    if (!result.length) {
      throw new CustomError("no notes were found", 404);
    }

    return res.json({
      success: true,
      body: result,
    });
  }
);

export const deleteAllNotes = asyncHandler(async (req, res, next) => {
  const result = await NoteModel.deleteMany({ userId: req.user._id });

  console.log({ result });

  if (!result.deletedCount) {
    throw new CustomError("no notes were found", 404);
  }

  return res.json({
    success: true,
    message: "all notes were deleted!",
  });
});
