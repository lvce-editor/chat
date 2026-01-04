import type { VirtualElement } from '../VirtualDom/VirtualDom.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getSelectVirtualDom } from '../GetSelectVirtualDom/GetSelectVirtualDom.ts'

export const createFormContent = (blobUrl: string): VirtualElement => {
  return {
    children: [
      {
        children: [
          {
            className: ClassNames.DropZoneText,
            textContent: 'Drop image here',
            type: 'div',
          },
        ],
        className: `${ClassNames.DropZone} ${ClassNames.Hidden}`,
        type: 'div',
      },
      {
        children: [
          {
            children: [
              {
                className: ClassNames.ImagePreview,
                src: blobUrl,
                type: 'img',
              },
              {
                className: ClassNames.RemoveImageButton,
                events: {
                  click: 'handleRemoveImage',
                },
                textContent: '×',
                type: 'button',
              },
            ],
            className: blobUrl ? ClassNames.ImagePreviewWrapper : `${ClassNames.ImagePreviewWrapper} ${ClassNames.Hidden}`,
            type: 'div',
          },

          {
            className: ClassNames.Input,
            events: {
              adjustHeight: 'adjustHeight',
              input: 'handleInput',
              keydown: 'handleKeyDown',
            },
            name: 'Input',
            placeholder: 'Message...',
            textContent: '',
            type: 'textarea',
          },
          {
            children: [getSelectVirtualDom()],
            className: ClassNames.ControlsWrapper,
            type: 'div',
          },
        ],
        className: 'MessageColumns',
        type: 'div',
      },
    ],
    className: ClassNames.FormContent,
    events: {
      dragleave: 'handleDragLeave',
      dragover: 'handleDragOver',
      drop: 'handleDrop',
    },
    type: 'div',
  }
}
