import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'

export const createFormContent = (blobUrl?: string): VirtualElement => {
  return {
    type: 'div',
    className: 'FormContent',
    children: [
      {
        type: 'label',
        className: 'ImageUploadButton',
        children: [
          {
            type: 'input',
            className: 'ImageInput',
            name: 'image',
            inputType: 'file',
            accept: 'image/*',
            events: {
              change: 'handleImageUpload',
            },
          },
          {
            type: 'div',
            className: 'ImageIcon',
            textContent: '📷',
          },
        ],
      },
      {
        type: 'div',
        className: blobUrl ? 'ImagePreviewWrapper' : 'ImagePreviewWrapper Hidden',
        children: [
          {
            type: 'img',
            className: 'ImagePreview',
            src: blobUrl,
          },
          {
            type: 'button',
            className: 'RemoveImageButton',
            textContent: '×',
            events: {
              click: 'handleRemoveImage',
            },
          },
        ],
      },
      {
        type: 'textarea',
        className: 'Input',
        name: 'Input',
        placeholder: 'Message...',
        events: {
          keydown: 'handleKeyDown',
          input: 'adjustHeight',
        },
      },
    ],
  }
}
