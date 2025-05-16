import * as Rpc from '../Rpc/Rpc.ts';

const insertSimpleBrowserJavaScript = async (params) => {
  if (!params.code) {
    throw new Error('code is required');
  }
  await Rpc.invoke('WebView.executeExternalCommand', 'SimpleBrowser.insertJavaScript', params.code);
  return {
    type: 'simple-browser-javascript-was-applied',
  };
};

export default insertSimpleBrowserJavaScript;
