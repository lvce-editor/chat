import * as Rpc from '../Rpc/Rpc.ts';

const layoutTogglePanel = async () => {
  await Rpc.invoke('WebView.executeExternalCommand', 'Layout.togglePanel');
  return {
    type: 'command-executed-successfully',
  };
};

export default layoutTogglePanel;
