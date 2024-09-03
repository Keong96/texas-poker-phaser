export default class CreateRoomScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CreateRoomScene' });
    this.selectedButton = null;
    this.selectedBetAmount = null;
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
    this.add.text(centerX, centerY - 400, 'CREATE ROOM', { font: '64px Brothers', fill: '#ffffff', align: 'center' }).setOrigin(0.5, 0);
    this.add.text(centerX, centerY - 200, 'Bet Amount', { font: '36px Brothers', fill: '#ffffff', align: 'center' }).setOrigin(0.5, 0);

    let backButton = this.add.image(centerX-350, centerY-700, 'backButton').setDisplaySize(100, 100);
    backButton.setInteractive();
    backButton.on('pointerdown', () => {
      this.scene.start('LobbyScene');
    });

    const buttonValues = [5, 10, 20, 50, 100];
    const buttonPositions = buttonValues.map((_, index) => ({
      x: centerX - 210 + index * 105,
      y: centerY - 100,
    }));

    this.buttons = [];

    buttonValues.forEach((value, index) => {
      let button = this.add.image(buttonPositions[index].x, buttonPositions[index].y, 'unselectedButton').setOrigin(0.5).setDisplaySize(100, 50);
      button.setInteractive();
      this.buttons.push(button);

      // Default select $5
      if (value === 5) {
        this.selectedButton = button;
        this.selectedBetAmount = value;
        button.setTexture('selectedButton');
      }

      this.add.text(button.x, button.y-3, `$${value}`, { font: 'bold 24px Arial', fill: '#000000' }).setOrigin(0.5);

      button.on('pointerdown', () => {this.handleButtonClick(button);});
    });

    this.add.dom(centerX, centerY+50).createFromHTML(`
      <input type="password" id="passwordInput" disabled placeholder="Enter password" style="font-size: 24px; width: 400px; height: 40px; padding: 5px; text-align: center;">
    `);

    const checkboxHTML = `
      <label style="font-size: 24px; color: #ffffff;">
        <input type="checkbox" id="togglePasswordInput" style="width: 24px; height: 24px;">
        Enable Password
      </label>
    `;
    this.add.dom(centerX, centerY - 15).createFromHTML(checkboxHTML);

    const togglePasswordInput = document.getElementById('togglePasswordInput');
    togglePasswordInput.addEventListener('change', () => {
      const passwordInput = document.getElementById('passwordInput');
      passwordInput.disabled = !togglePasswordInput.checked;
    });

    // Create room button
    let createRoomButton = this.add.image(centerX, centerY + 350, 'unselectedButton').setOrigin(0.5).setDisplaySize(400, 100);

    this.add.text(centerX, centerY + 340, 'Create Room', {
      font: 'bold 36px Brothers', fill: '#000000', padding: { x: 10, y: 5 }
    }).setOrigin(0.5);

    createRoomButton.setInteractive();
    createRoomButton.on('pointerdown', () => this.handleCreateRoom());
  }

  handleButtonClick(button, value) {
    if (this.selectedButton) {
      this.selectedButton.setTexture('unselectedButton');
    }
    this.selectedButton = button;
    this.selectedBetAmount = value;
    button.setTexture('selectedButton');
  }

  handleCreateRoom() {
    const password = document.getElementById('passwordInput').value;
    let roomId = "1234";
    let betAmount = selectedButton
    this.scene.start('GameScene', { roomId: roomId , betAmount: betAmount});
  }
}