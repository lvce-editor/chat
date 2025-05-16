import * as Rpc from '../Rpc/Rpc.ts';

const insertSimpleBrowserCss = async (params) => {
  if (!params.css) {
    throw new Error('css is required');
  }
  await Rpc.invoke('WebView.executeExternalCommand', 'SimpleBrowser.insertCss', params.css);
  return {
    type: 'simple-browser-css-was-applied',
  };
};

export default insertSimpleBrowserCss;
