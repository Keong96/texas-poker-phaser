export default class JoinRoomScene extends Phaser.Scene {
  constructor() {
    super({ key: 'JoinRoomScene' });
  }

  init(data) {
    this.roomId = data.roomId;
    this.betAmount = data.betAmount;
  }

  preload() {
    // Preload button images
    this.load.image('background', 'images/background.png');
    this.load.image('panel', 'images/panel2.png');
    this.load.image('unselectedButton', 'images/button3.png');
    this.load.image('selectedButton', 'images/button-green.png');
    this.load.image('backButton', 'images/back-button.png');
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.add.image(centerX, centerY, 'background').setDisplaySize(this.cameras.main.width, this.cameras.main.height);
    this.add.image(centerX, centerY, 'panel').setDisplaySize(700, 950);
    this.add.text(centerX, centerY - 400, `Join Room`, { font: '64px Brothers', fill: '#ffffff', align: 'center' }).setOrigin(0.5, 0);
    this.add.text(centerX, centerY - 200, 'Room ID', { font: '36px Brothers', fill: '#ffffff', align: 'center' }).setOrigin(0.5, 0);

    let backButton = this.add.image(centerX-350, centerY-700, 'backButton').setDisplaySize(100, 100);
    backButton.setInteractive();
    backButton.on('pointerdown', () => {
      this.scene.start('LobbyScene');
    });

    this.add.dom(centerX, centerY-100).createFromHTML(`
      <input type="text" id="roomIdInput" placeholder="Enter Room Id" style="font-size: 24px; width: 400px; height: 40px; padding: 5px; text-align: center;">
    `);

    const checkboxHTML = `
      <label style="font-size: 24px; color: #ffffff;">
        <input type="checkbox" id="togglePasswordInput" style="width: 24px; height: 24px;">
        Password?
      </label>
    `;
    this.add.dom(centerX, centerY - 15).createFromHTML(checkboxHTML);

    const togglePasswordInput = document.getElementById('togglePasswordInput');
    togglePasswordInput.addEventListener('change', () => {
      const passwordInput = document.getElementById('passwordInput');
      passwordInput.disabled = !togglePasswordInput.checked;
    });

    this.add.dom(centerX, centerY+50).createFromHTML(`
      <input type="password" id="passwordInput" disabled placeholder="Enter password" style="font-size: 24px; width: 400px; height: 40px; padding: 5px; text-align: center;">
    `);

    let joinRoomButton = this.add.image(centerX, centerY + 350, 'unselectedButton').setOrigin(0.5).setDisplaySize(400, 100);

    this.add.text(centerX, centerY + 340, 'Join Room', {
      font: 'bold 36px Arial', fill: '#000000', padding: { x: 10, y: 5 }
    }).setOrigin(0.5);

    joinRoomButton.setInteractive();
    joinRoomButton.on('pointerdown', () => this.handleJoinRoom());
  }

  handleJoinRoom() {
    const password = document.getElementById('passwordInput').value;
    this.scene.start('GameScene', { roomId: roomId , betAmount: betAmount});
  }
}