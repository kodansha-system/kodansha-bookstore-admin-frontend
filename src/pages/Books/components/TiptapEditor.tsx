import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import Image from "@tiptap/extension-image";
import { useEffect } from "react";

interface Props {
  value?: string;
  onChange: (content: string) => void;
}

const TiptapEditor = ({ value = "", onChange }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily,
      Image.configure({
        inline: true,
        allowBase64: true, // Cho phép paste ảnh dạng base64
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const { state } = view;

        // Xử lý paste ảnh
        for (const item of items) {
          if (item.type.indexOf("image") === 0) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onload = (readerEvent) => {
                const base64 = readerEvent.target?.result;
                if (base64) {
                  view.dispatch(
                    state.tr.replaceSelectionWith(
                      state.schema.nodes.image.create({
                        src: base64,
                      })
                    )
                  );
                }
              };
              reader.readAsDataURL(file);
            }
            return true;
          }
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return <div>Đang tải trình soạn thảo...</div>;
  }

  return (
    <div className="border rounded p-2 min-h-[200px]">
      {/* Thanh công cụ */}
      <div className="flex flex-wrap gap-1 mb-2">
        {/* Nút in đậm */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded ${
            editor.isActive("bold") ? "bg-gray-200" : ""
          }`}
        >
          <strong>B</strong>
        </button>

        {/* Nút in nghiêng */}
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded ${
            editor.isActive("italic") ? "bg-gray-200" : ""
          }`}
        >
          <em>I</em>
        </button>

        {/* Nút màu chữ */}
        <input
          type="color"
          onInput={(event) =>
            editor.chain().focus().setColor(event.currentTarget.value).run()
          }
          value={editor.getAttributes("textStyle").color || "#000000"}
          className="w-8 h-8"
        />

        {/* Nút font size */}
        <select
          onChange={(event) =>
            editor.chain().focus().setFontFamily(event.target.value).run()
          }
          value={editor.getAttributes("textStyle").fontFamily || ""}
          className="p-1 border rounded"
        >
          <option value="">Font</option>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
        </select>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
