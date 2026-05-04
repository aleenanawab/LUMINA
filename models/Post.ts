import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  status: "draft" | "published";
  authorId: mongoose.Types.ObjectId;
  tags: string[];
  likes: mongoose.Types.ObjectId[];
  views: number;
  readTime: number;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 },
    readTime: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// Text index for search
PostSchema.index({ title: "text", content: "text" });

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;