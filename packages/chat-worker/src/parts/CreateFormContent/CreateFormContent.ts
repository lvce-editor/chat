import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'
import { getSelectVirtualDom } from '../GetSelectVirtualDom/GetSelectVirtualDom.ts'

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
        type: 'div',
        className: 'ControlsWrapper',
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
          getSelectVirtualDom(),
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
