'use client';

import React from 'react';
import StarterKit from '@tiptap/starter-kit';
import TextUnderline from '@tiptap/extension-underline';

import { EditorContent, EditorProvider, useCurrentEditor } from '@tiptap/react';
import { Bold, Italic, Redo, Underline, Undo } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const MenuBar = () => {
  const { fontSize } = useSelector((state: RootState) => state.persistInfos);
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-[0.25em] justify-between bg-gray-100 p-[0.5em] rounded-t-[0.25em]">
      <button
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          event.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cn(
          'h-[2em] w-[2em] flex justify-center items-center cursor-pointer rounded-[0.125em]',
          editor.isActive('bold') ? 'bg-gray-300' : 'hover:bg-gray-200',
        )}
      >
        <Bold size={fontSize} />
      </button>
      <button
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          event.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn(
          'h-[2em] w-[2em] flex justify-center items-center cursor-pointer rounded-[0.125em]',
          editor.isActive('italic') ? 'bg-gray-300' : 'hover:bg-gray-200',
        )}
      >
        <Italic size={fontSize} />
      </button>
      <button
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          event.preventDefault();
          editor.chain().focus().toggleUnderline().run();
        }}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={cn(
          'h-[2em] w-[2em] flex justify-center items-center cursor-pointer rounded-[0.125em]',
          editor.isActive('underline') ? 'bg-gray-300' : 'hover:bg-gray-200',
        )}
      >
        <Underline size={fontSize + 2} />
      </button>
      <button
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          event.preventDefault();
          editor.chain().focus().undo().run();
        }}
        disabled={!editor.can().chain().focus().undo().run()}
        className={cn(
          'h-[2em] w-[2em] p-[0.25em] flex justify-center items-center rounded-[0.125em]',
          editor.can().chain().focus().undo().run()
            ? 'bg-gray-300 cursor-pointer'
            : '',
        )}
      >
        <Undo size={fontSize + 6} />
      </button>
      <button
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          event.preventDefault();
          editor.chain().focus().redo().run();
        }}
        disabled={!editor.can().chain().focus().redo().run()}
        className={cn(
          'h-[2em] w-[2em] p-[0.25em] flex justify-center items-center rounded-[0.125em]',
          editor.can().chain().focus().redo().run()
            ? 'bg-gray-300 cursor-pointer'
            : '',
        )}
      >
        <Redo size={fontSize + 6} />
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
  onChange,
}: {
  content: string;
  onChange: (content: string) => void;
}) {
  return (
    <div className="w-full flex flex-col text-[0.875em] border rounded-sm cursor-text">
      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={[StarterKit, TextUnderline]}
        onUpdate={({ editor }) => {
          const htmlContent = editor.getHTML();
          onChange(htmlContent);
        }}
        content={content}
      >
        <MyEditorContent content={content} />
      </EditorProvider>
    </div>
  );
}
