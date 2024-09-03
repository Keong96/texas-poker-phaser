import HomeScene from './home.js';
import LobbyScene from './lobby.js';
import GameScene from './game.js';
import CreateRoomScene from './create_room.js';
import JoinRoomScene from './join_room.js';

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 900,
    height: 1600
  },
  scene: [HomeScene, LobbyScene, CreateRoomScene, JoinRoomScene, GameScene],
  //scene: [LobbyScene, CreateRoomScene, JoinRoomScene, GameScene],
  dom: {
    createContainer: true
  },
  parent: 'phaser-container'
};

const game = new Phaser.Game(config);