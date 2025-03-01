import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getSelectVirtualDom } from '../GetSelectVirtualDom/GetSelectVirtualDom.ts'

export const createFormContent = (blobUrl: string): VirtualElement => {
  return {
    type: 'div',
    className: ClassNames.FormContent,
    events: {
      dragover: 'handleDragOver',
      dragleave: 'handleDragLeave',
      drop: 'handleDrop',
    },
    children: [
      {
        type: 'div',
        className: ClassNames.ControlsWrapper,
        children: [
          {
            type: 'label',
            className: ClassNames.ImageUploadButton,
            children: [
              {
                type: 'input',
                className: ClassNames.ImageInput,
                name: 'image',
                inputType: 'file',
                accept: 'image/*',
                events: {
                  change: 'handleImageUpload',
                },
              },
              {
                type: 'div',
                className: ClassNames.ImageIcon,
                textContent: '📷',
              },
            ],
          },
          getSelectVirtualDom(),
        ],
      },
      {
        type: 'div',
        className: `${ClassNames.DropZone} ${ClassNames.Hidden}`,
        children: [
          {
            type: 'div',
            className: ClassNames.DropZoneText,
            textContent: 'Drop image here',
          },
        ],
      },
      {
        type: 'div',
        className: blobUrl ? ClassNames.ImagePreviewWrapper : `${ClassNames.ImagePreviewWrapper} ${ClassNames.Hidden}`,
        children: [
          {
            type: 'img',
            className: ClassNames.ImagePreview,
            src: blobUrl,
          },
          {
            type: 'button',
            className: ClassNames.RemoveImageButton,
            textContent: '×',
            events: {
              click: 'handleRemoveImage',
            },
          },
        ],
      },
      {
        type: 'textarea',
        className: ClassNames.Input,
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
