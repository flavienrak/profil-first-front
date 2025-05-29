'use client';

import React from 'react';
import StarterKit from '@tiptap/starter-kit';
import TextUnderline from '@tiptap/extension-underline';

import { EditorContent, EditorProvider, useCurrentEditor } from '@tiptap/react';
import { Bold, Italic, Redo, Underline, Undo } from 'lucide-react';
import { cn } from '@/lib/utils';

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 justify-between bg-[var(--bg-primary-color)] p-2 rounded-t-sm">
      <button
        onClick={(event) => {
          event.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cn(
          'h-8 w-8 flex justify-center items-center cursor-pointer rounded-sm',
          editor.isActive('bold')
            ? 'bg-gray-300 text-gray-800'
            : 'hover:text-gray-800 hover:bg-gray-200',
        )}
      >
        <Bold size={16} />
      </button>
      <button
        onClick={(event) => {
          event.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn(
          'h-8 w-8 flex justify-center items-center cursor-pointer rounded-sm',
          editor.isActive('italic')
            ? 'bg-gray-300 text-gray-800'
            : 'hover:text-gray-800 hover:bg-gray-200',
        )}
      >
        <Italic size={16} />
      </button>
      <button
        onClick={(event) => {
          event.preventDefault();
          editor.chain().focus().toggleUnderline().run();
        }}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={cn(
          'h-8 w-8 flex justify-center items-center cursor-pointer rounded-sm',
          editor.isActive('underline')
            ? 'bg-gray-300 text-gray-800'
            : 'hover:text-gray-800 hover:bg-gray-200',
        )}
      >
        <Underline size={18} />
      </button>
      <button
        onClick={(event) => {
          event.preventDefault();
          editor.chain().focus().undo().run();
        }}
        disabled={!editor.can().chain().focus().undo().run()}
        className={cn(
          'h-8 w-8 p-1 flex justify-center items-center rounded-sm',
          editor.can().chain().focus().undo().run()
            ? 'bg-gray-300 text-gray-800 cursor-pointer'
            : '',
        )}
      >
        <Undo size={22} />
      </button>
      <button
        onClick={(event) => {
          event.preventDefault();
          editor.chain().focus().redo().run();
        }}
        disabled={!editor.can().chain().focus().redo().run()}
        className={cn(
          'h-8 w-8 p-1 flex justify-center items-center rounded-sm',
          editor.can().chain().focus().redo().run()
            ? 'bg-gray-300 text-gray-800 cursor-pointer'
            : '',
        )}
      >
        <Redo size={22} />
      </button>
    </div>
  );
};

function MyEditorContent({ content }: { content: string }) {
  const { editor } = useCurrentEditor();

  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}

export default function TextEditor({
  content,
  readOnly = false,
  dynamic = false,
  className,
  onChange,
}: {
  content: string;
  readOnly?: boolean;
  dynamic?: boolean;
  className?: string;
  onChange?: (content: string) => void;
}) {
  return (
    <div
      className={cn(
        'w-full flex flex-col text-[0.875em] cursor-text',
        className,
        dynamic
          ? 'text-[var(--text-primary-color)] border-[var(--text-primary-color)]/10'
          : '',
      )}
    >
      <EditorProvider
        editable={!readOnly}
        slotBefore={!readOnly && <MenuBar />}
        extensions={[StarterKit, TextUnderline]}
        onUpdate={({ editor }) => {
          if (!readOnly) {
            const htmlContent = editor.getHTML();
            if (onChange) {
              onChange(htmlContent);
            }
          }
        }}
        content={content}
      >
        <MyEditorContent content={content} />
      </EditorProvider>
    </div>
  );
}
