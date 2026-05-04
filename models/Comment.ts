import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComment extends Document {
  content: string;
  postId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;