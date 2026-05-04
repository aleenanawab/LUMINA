"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from "lucide-react";

interface RichEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichEditor({ content, onChange }: RichEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Tell your story..." }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const ToolbarButton = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-all ${
        active
          ? "bg-cyan-500/20 text-cyan-400"
          : "dark:text-gray-400 text-gray-500 hover:dark:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-white/5"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-white/10 dark:bg-white/3 bg-gray-50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <div className="w-px h-6 dark:bg-white/10 bg-gray-200 my-auto mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Inline Code"
        >
          <Code size={16} />
        </ToolbarButton>
        <div className="w-px h-6 dark:bg-white/10 bg-gray-200 my-auto mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote size={16} />
        </ToolbarButton>
        <div className="w-px h-6 dark:bg-white/10 bg-gray-200 my-auto mx-1" />
        <ToolbarButton onClick={addLink} title="Add Link">
          <LinkIcon size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Add Image">
          <ImageIcon size={16} />
        </ToolbarButton>
        <div className="w-px h-6 dark:bg-white/10 bg-gray-200 my-auto mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo size={16} />
        </ToolbarButton>
      </div>

      {/* Editor Content */}
      <div
        className="p-4 bg-white dark:bg-[#111111] min-h-[350px] cursor-text"
        onClick={() => editor.commands.focus()}
      >
        <EditorContent editor={editor} className="min-h-[300px] outline-none" />
      </div>
    </div>
  );
}