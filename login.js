export default class LoginScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LoginScene' });
  }

  preload() {
    this.load.image('background', 'images/background.png');
    this.load.image('connectWalletButton', 'images/bet-button.png');
    this.load.image('connectWalletButtonPressed', 'images/bet-button-pressed.png');
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    let connectWalletContainer = this.add.container(centerX, centerY);

    let connectWalletButton = this.add.image(0, 0, 'connectWalletButton').setInteractive().setOrigin(0.5);;
    connectWalletContainer.add(connectWalletButton);

    let connectWalletText = this.add.text(0, -10, 'Connect With Wallet', { font: '24px Arial', fill: '#ffffff' }).setOrigin(0.5);
    connectWalletContainer.add(connectWalletText);

    connectWalletButton.on('pointerdown', () => {
      connectWalletButton.setTexture('connectWalletButtonPressed');
      this.connectTronLink()
    });

    connectWalletButton.on('pointerup', () => {
      connectWalletButton.setTexture('connectWalletButton');
    });
  }

  
}