import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'

export const createFormContent = (blobUrl: string): VirtualElement => {
  return {
    type: 'div',
    className: 'FormContent',
    events: {
      dragover: 'handleDragOver',
      dragleave: 'handleDragLeave',
      drop: 'handleDrop',
    },
    children: [
      {
        type: 'select',
        className: 'ModelSelect',
        name: 'ModelSelect',
        events: {
          change: 'handleModelSelect',
        },
        children: [
          {
            type: 'option',
            value: 'claude-3-5-haiku-20241022',
            textContent: 'Claude 3 Haiku',
          },
          {
            type: 'option',
            value: 'claude-3-5-sonnet-20241022',
            textContent: 'Claude 3 Sonnet',
          },
          {
            type: 'option',
            value: 'claude-3-opus-20240229',
            textContent: 'Claude 3 Opus',
          },
        ],
      },
      {
        type: 'div',
        className: 'DropZone Hidden',
        children: [
          {
            type: 'div',
            className: 'DropZoneText',
            textContent: 'Drop image here',
          },
        ],
      },
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
          input: 'handleInput',
          adjustHeight: 'adjustHeight',
        },
        textContent: '',
      },
    ],
  }
}
