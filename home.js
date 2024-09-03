export default class HomeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HomeScene' });
  }

  preload() {
    this.load.image('background', 'images/background.png');
    this.load.image('logo', 'images/logo.png');
    this.load.image('loading', 'images/loading.png');
    this.load.image('tronlink', 'images/tronlink.png');
    this.load.image('tronlinkButton', 'images/600x100-blue-button.png');
    this.load.image('metamask', 'images/metamask.png');
    this.load.image('metamaskButton', 'images/600x100-orange-button.png');
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.add.image(0, 0, 'background').setDisplaySize(900, 1600).setOrigin(0);
    let logo = this.add.image(centerX, centerY - 300, 'logo').setDisplaySize(360, 360);
    logo.alpha = 0;

    let loading = this.add.image(centerX, centerY, 'loading').setDisplaySize(360, 360).setDepth(1);
    loading.alpha = 0;

    this.tweens.add({
      targets: logo,
      alpha: 1,
      duration: 1500,
      ease: 'Linear',
      yoyo: false,
      repeat: 0
    });

    this.setupConnectWallet(centerX, centerY, loading);
  }

  setupConnectWallet(centerX, centerY, loading)
  {
    let connectWalletContainer = this.add.container(centerX, centerY - 500);

    //tronlink
    let tronlinkButton = this.add.image(0, 700, 'tronlinkButton').setDisplaySize(600, 100).setOrigin(0.5);
    connectWalletContainer.add(tronlinkButton);

    let tronlinkText = this.add.text(50, 700, 'Connect TronLink',
    {
      font: '24px Arial',
      fill: '#ffffff',
    }).setOrigin(0.5).setInteractive();

    connectWalletContainer.add(tronlinkText);

    let tronlinkLogo = this.add.image(-250, 700, 'tronlink').setDisplaySize(64, 64).setOrigin(0.5);

    connectWalletContainer.add(tronlinkLogo);

    //metamask
    let metamaskButton = this.add.image(0, 825, 'metamaskButton').setDisplaySize(600, 100).setOrigin(0.5);
    connectWalletContainer.add(metamaskButton);

    let metamaskText = this.add.text(50, 825, 'Connect MetaMask',
    {
      font: '24px Arial',
      fill: '#ffffff',
    }).setOrigin(0.5).setInteractive();

    connectWalletContainer.add(metamaskText);

    let metamaskLogo = this.add.image(-250, 825, 'metamask').setDisplaySize(64, 64).setOrigin(0.5);

    connectWalletContainer.add(metamaskLogo);

    // if(window.tronWeb)
    // {
    //   if (window.tronWeb.ready)
    //   {
    //     tronlinkText.setText(window.tronWeb.defaultAddress.base58);
    //     tronlinkText.setInteractive(false);
    //   }
    // }
    // else
    // {
    //   if (this.sys.game.device.os.android || this.sys.game.device.os.iOS)
    //   {
    //   let platform = this.sys.game.device.os.android ? 'Android' : 'iOS';
    //   let storeLink = platform === 'Android' ? 
    //     'https://play.google.com/store/apps/details?id=com.tronlinkpro.wallet' : 
    //     'https://apps.apple.com/us/app/tronlink-tron-wallet/id1457849319';

    //   window.location.href = storeLink;
    //   }
    //   else
    //   {
    //     var tronlinkURL = "https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec";
    //     window.location.href = tronlinkURL;
    //   }
    // }
    
    tronlinkText.on('pointerdown', async() => {
      await this.connectTronLink(tronlinkText, loading)
    });
  }

  async connectTronLink(tronlinkText, loading) {
    // var address = "";

    // if (window.tronWeb && window.tronWeb.ready) {
    //   address = window.tronWeb.defaultAddress.base58;
    // } else {
    //   await tron.request({method: 'eth_requestAccounts'});
    //   address = window.tronWeb.defaultAddress.base58;
    // }

    loading.alpha = 1.0;

    this.tweens.add({
      targets: loading,
      angle: 360,
      duration: 1500,
      ease: 'Linear',
      yoyo: false,
      repeat: -1
    });

    //tronlinkText.setText(address);
    tronlinkText.setInteractive(false);

    setTimeout(() => {
      this.scene.start('LobbyScene', {  });
    }, "3000");
  }
}