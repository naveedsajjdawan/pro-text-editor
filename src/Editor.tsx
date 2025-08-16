import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';

const FONT_SIZES = ['12px', '14px', '16px', '20px', '24px', '32px'];
const EMOJIS = ['😀', '😂', '😍', '👍', '🎉', '🔥', '😎', '🤔', '🙌', '🚀'];

const MenuBar = ({ editor, onEmoji }: { editor: any; onEmoji: (emoji: string) => void }) => {
  if (!editor) return null;
  const currentFontSize = editor.getAttributes('textStyle').fontSize || '16px';
  return (
    <div style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center', background: '#f5f5f5', padding: 8, borderRadius: 6 }}>
      <button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} style={{ fontWeight: editor.isActive('bold') ? 'bold' : 'normal' }}>B</button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} style={{ fontStyle: editor.isActive('italic') ? 'italic' : 'normal' }}>I</button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} disabled={!editor.can().chain().focus().toggleUnderline().run()} style={{ textDecoration: editor.isActive('underline') ? 'underline' : 'none' }}>U</button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} style={{ textDecoration: editor.isActive('strike') ? 'line-through' : 'none' }}>S</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} style={{ fontWeight: editor.isActive('heading', { level: 1 }) ? 'bold' : 'normal' }}>H1</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={{ fontWeight: editor.isActive('heading', { level: 2 }) ? 'bold' : 'normal' }}>H2</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} style={{ fontWeight: editor.isActive('heading', { level: 3 }) ? 'bold' : 'normal' }}>H3</button>
      <select
        onChange={e => editor.chain().focus().setFontSize(e.target.value).run()}
        value={currentFontSize}
        style={{ marginLeft: 8 }}
      >
        {FONT_SIZES.map(size => (
          <option key={size} value={size}>{size.replace('px', '')}</option>
        ))}
      </select>
      <input
        type="color"
        onChange={e => editor.chain().focus().setColor(e.target.value).run()}
        value={editor.getAttributes('textStyle').color || '#000000'}
        title="Text color"
        style={{ marginLeft: 8 }}
      />
      <button
        onClick={() => {
          const color = prompt('Highlight color (hex, e.g. #FFFF00):', '#FFFF00');
          if (color) editor.chain().focus().toggleHighlight({ color }).run();
        }}
        style={{ background: editor.isActive('highlight') ? editor.getAttributes('highlight').color || '#FFFF00' : '#fff', marginLeft: 8 }}
        title="Highlight"
      >
        🖌️
      </button>
      <select
        onChange={e => onEmoji(e.target.value)}
        defaultValue=""
        style={{ marginLeft: 8 }}
        title="Insert emoji"
      >
        <option value="" disabled>
          😊
        </option>
        {EMOJIS.map(emoji => (
          <option key={emoji} value={emoji}>{emoji}</option>
        ))}
      </select>
    </div>
  );
};

// FontSize extension
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: '16px',
        parseHTML: (element: HTMLElement) => element.style.fontSize || '16px',
        renderHTML: (attributes: any) => {
          if (!attributes.fontSize) return {};
          return { style: `font-size: ${attributes.fontSize}` };
        },
      },
    };
  },
  addCommands() {
    return {
      setFontSize: (size: string) => ({ commands }: any) => {
        return commands.setMark('textStyle', { fontSize: size });
      },
    };
  },
});

const Editor: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const editor = useEditor({
    editable: editMode,
    extensions: [
      StarterKit,
      Underline,
      Color,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      FontSize,
    ],
    content: '<p>Hello, ProTextEditor!</p>',
  });

  // Sync edit mode with editor
  React.useEffect(() => {
    if (editor) editor.setEditable(editMode);
  }, [editMode, editor]);

  // Insert emoji at current selection
  const handleEmoji = (emoji: string) => {
    if (editor) editor.chain().focus().insertContent(emoji).run();
  };

  return (
    <div>
      {editMode && <MenuBar editor={editor} onEmoji={handleEmoji} />}
      <div
        onDoubleClick={() => setEditMode(true)}
        style={{ border: '1px solid #ccc', borderRadius: 6, minHeight: 200, padding: 12, background: editMode ? '#fff' : '#f9f9f9', cursor: editMode ? 'text' : 'pointer' }}
      >
        <EditorContent editor={editor} />
      </div>
      {!editMode && <div style={{ marginTop: 8, color: '#888' }}>Double-click to edit</div>}
    </div>
  );
};

export default Editor;
