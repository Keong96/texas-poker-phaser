export default class LobbyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LobbyScene' });
  }

  preload() {
    this.load.image('background', 'images/background.png');
    this.load.image('user-info', 'images/user-info.png');

    this.load.image('quick-join', 'images/quick-join.png');
    this.load.image('create-room', 'images/create-room.png');
    this.load.image('join-room', 'images/join-room.png');
    this.load.image('leaderboard', 'images/leaderboard.png');
    this.load.image('setting', 'images/setting.png');
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Background
    this.add.image(centerX, centerY, 'background').setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    // Setting
    this.add.image(825, 100, 'setting').setDisplaySize(96, 96);

    // User Info
    let userInfo = this.add.image(centerX-50, 150, 'user-info').setDisplaySize(671, 239);
    let usernameText = this.add.text(centerX+35, 105, `Username`, { font: '36px Brothers', fill: '#ffffff' }).setOrigin(0.5);
    let balanceText = this.add.text(centerX+35, 185, `$8888.88`, { font: '36px Brothers', fill: '#ffffff' }).setOrigin(0.5);

    let quickJoinButton = this.add.image(centerX-200, centerY-250, 'quick-join').setDisplaySize(350, 475).setInteractive();
    quickJoinButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    let createRoomButton = this.add.image(centerX+200, centerY-250, 'create-room').setDisplaySize(350, 475).setInteractive();
    createRoomButton.on('pointerdown', () => {
      this.scene.start('CreateRoomScene');
    });

    let joinRoombutton = this.add.image(centerX-200, centerY+250, 'join-room').setDisplaySize(350, 475).setInteractive();
    joinRoombutton.on('pointerdown', () => {
      this.scene.start('JoinRoomScene');
    });

    let leaderBoardButton = this.add.image(centerX+200, centerY+250, 'leaderboard').setDisplaySize(350, 475).setInteractive();
  }

  update() {
    // Update logic for lobby scene if needed
  }
}
