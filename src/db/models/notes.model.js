// @ts-check
import { model, Schema } from "mongoose";

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
      validate: {
        validator: function (value) {
          if (value === value.toUpperCase()) {
            return false;
          }
          return true;
        },
        message: (props) => {
          return "title must not be entirely uppercase";
        },
      },
    },
    content: {
      type: String,
      required: true,
      minLength: 10,
    },
    userId: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const NoteModel = model("Note", noteSchema);
export default NoteModel;
