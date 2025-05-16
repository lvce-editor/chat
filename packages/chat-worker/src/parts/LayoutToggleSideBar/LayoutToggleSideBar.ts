import * as Rpc from '../Rpc/Rpc.ts';

const layoutToggleSideBar = async () => {
  await Rpc.invoke('WebView.executeExternalCommand', 'Layout.toggleSideBar');
  return {
    type: 'command-executed-successfully',
  };
};

export default layoutToggleSideBar;
