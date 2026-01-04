export const getTools = (): readonly any[] => {
  return [
    {
      description: 'Get Info about currently used language model and its version',
      input_schema: {
        properties: {},
        required: [],
        type: 'object',
      },
      name: 'get_model_version_info',
    },
    {
      description: 'Set the url of the simple browser',
      input_schema: {
        properties: {
          url: {
            description: 'The url of the simple browser or a search term',
            type: 'string',
          },
        },
        required: ['url'],
        type: 'object',
      },
      name: 'set_simple_browser_url',
    },
    {
      description:
        'Insert Css into the simple browser. Probably best to wrap your javascript code in an iife to not conflict with other code.',
      input_schema: {
        properties: {
          css: {
            description: 'The css to insert to the simple browser',
            type: 'string',
          },
        },
        required: ['css'],
        type: 'object',
      },
      name: 'simple_browser_insert_css',
    },
    {
      description: 'Insert JavaScript into the simple browser',
      input_schema: {
        properties: {
          code: {
            description: 'The javascript code to insert to the simple browser. This property is required',
            type: 'string',
          },
        },
        required: ['code'],
        type: 'object',
      },
      name: 'simple_browser_insert_javascript',
    },
    {
      description: 'Toggle the side bar',
      input_schema: {
        properties: {},
        required: [],
        type: 'object',
      },
      name: 'layout_toggle_side_bar',
    },
    {
      description: 'Layout: Show Search',
      input_schema: {
        properties: {},
        required: [],
        type: 'object',
      },
      name: 'layout_show_search',
    },
    {
      description: 'Layout: Show Source Control',
      input_schema: {
        properties: {},
        required: [],
        type: 'object',
      },
      name: 'layout_show_source_control',
    },
    {
      description: 'Toggle the panel',
      input_schema: {
        properties: {},
        required: [],
        type: 'object',
      },
      name: 'layout_toggle_panel',
    },
    {
      description: 'Show About info',
      input_schema: {
        properties: {},
        required: [],
        type: 'object',
      },
      name: 'help_show_about',
    },
    {
      description: 'Collapse all files in explorer',
      input_schema: {
        properties: {},
        required: [],
        type: 'object',
      },
      name: 'explorer_collapse_all',
    },
    {
      description: 'Bring the explorer in a mode to create a new file',
      input_schema: {
        properties: {},
        required: [],
        type: 'object',
      },
      name: 'explorer_new_file',
    },
    {
      description: 'Update the editing value in the explorer. Can only be called when the explorer is in new file mode',
      input_schema: {
        properties: {
          value: {
            type: 'string',
          },
        },
        required: ['value'],
        type: 'object',
      },
      name: 'explorer_update_editing_value',
    },
    {
      description: 'Finish creating a new file in the explorer',
      input_schema: {
        properties: {},
        required: [],
        type: 'object',
      },
      name: 'explorer_accept_edit',
    },
    {
      description: 'Focus next file in the explorer',
      input_schema: {
        properties: {},
        required: [],
        type: 'object',
      },
      name: 'explorer_focus_next',
    },
    {
      description: 'Focus previous file in the explorer',
      input_schema: {
        properties: {},
        required: [],
        type: 'object',
      },
      name: 'explorer_focus_previous',
    },
    {
      description: 'open recent items quickpick',
      input_schema: {
        properties: {},
        required: [],
        type: 'object',
      },
      name: 'quickpick_open_recent',
    },
    {
      description: 'Get the dom html of the simple browser',
      input_schema: {
        properties: {
          maxLength: {
            description: 'The max length of html code to query',
            type: 'number',
          },
        },
        required: [],
        type: 'object',
      },
      name: 'get_simple_browser_dom_tree',
    },
  ]
}
