export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.chatMessages = [];
    this.chatVisible = false;
    this.seats = [];
    this.seatInfos = [];
    this.callButton = null;
    this.callButtonText = null;
    this.raiseButton = null;
    this.raiseButtonText = null
    this.foldButton = null;
    this.foldButtonText = null;
    this.raiseBar = null;
    this.playerCard1 = null;
    this.playerCard2 = null;
    this.currentGameState = "pre-flop";
    this.publicCard = [];
  }

  init(data) {
    // Initialization with data passed from LobbyScene
    this.roomId = data.roomId;
    this.betAmount = data.betAmount;

    // Example player data (replace with actual data received from lobby or server)
    this.player = {
      id: 1,
      name: 'Player 1',
      chips: 1000,
      position: 0, // Example position
      isSmallBlind: false,
      isBigBlind: false,
      isDealer: false
    };
  }

  preload() {
    // Preload assets specific to the game scene
    this.load.image('background', 'images/background.png');
    this.load.image('backButton', 'images/back-button.png');
    this.load.image('table', 'images/table.png');
    this.load.image('cardslot', 'images/cardslot.png');
    this.load.image('cardback', 'images/cardback.png');
    this.load.image('seat', 'images/seat.png');
    this.load.image('my-seat', 'images/my-seat.png');
    this.load.image('user', 'images/user.png');
    this.load.image('seat-info', 'images/seat-info.png');
    this.load.image('bubbleChat', 'images/bubble-chat.png');
    this.load.image('call-button', 'images/call-button.png');
    this.load.image('raise-button', 'images/raise-button.png');
    this.load.image('fold-button', 'images/fold-button.png');
    this.load.spritesheet('cards', 'images/all-cards.png', { frameWidth: 100, frameHeight: 150 });
  }

  create() {
    this.roomId = "1234";
    this.betAmount = "$5 / $10"
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Create game elements
    this.add.image(450, 800, 'background').setDisplaySize(900, 1600);
    this.add.text(centerX, centerY-400, `Table : ${this.roomId}`, { font: '24px Brothers', fill: '#ffff00' }).setOrigin(0.5).setDepth(5);
    this.add.text(centerX, centerY-350, `${this.betAmount}`, { font: '24px Brothers', fill: '#ffff00' }).setOrigin(0.5).setDepth(5);

    let backButton = this.add.image(centerX-350, centerY-700, 'backButton').setDisplaySize(100, 100);
    backButton.setInteractive();
    backButton.on('pointerdown', () => {
      this.scene.start('LobbyScene');
    });
    // // Initialize WebSocket connection
    // this.socket = new WebSocket('ws://localhost:8080');
    // this.socket.addEventListener('open', () => {
    //     console.log('Connected to server');
    //     // Additional logic when connected
    //     // Example: Send initial player information to server
    //     this.socket.send(JSON.stringify({ action: 'getPlayerInfo', playerId: this.player.id }));
    // });

    // // Handle incoming messages from server
    // this.socket.addEventListener('message', (event) => {
    //   const data = JSON.parse(event.data);
    //   this.handleServerMessage(data);
    // });

    this.setupTable(centerX, centerY);

    this.setupSeats(centerX, centerY);

    this.setupGameButtons(centerX, centerY);

    this.setupChat(centerX, centerY);

  }

  setupTable(centerX, centerY) {
    this.add.image(centerX, centerY-100, 'table').setDisplaySize(650, 1200);
    let cardSlots = [];
    let cardSlotPosX = centerX - 125;

    for(var i = 0; i < 3; i++)
    {
      let cardslot = this.add.image(cardSlotPosX, centerY-100, 'cardslot').setDisplaySize(105, 160);
      cardSlots.push(cardslot);
      cardSlotPosX += 125;
    }

    let cardslot1 = this.add.image(centerX-65, centerY+75, 'cardslot').setDisplaySize(105, 160);
    cardSlots.push(cardslot1);
    cardSlotPosX += 125;

    let cardslot2 = this.add.image(centerX+65, centerY+75, 'cardslot').setDisplaySize(105, 160);
    cardSlots.push(cardslot2);
    cardSlotPosX += 125;

    this.playerCard1 = this.add.image(centerX-50, 1300, 'cards', 1).setDisplaySize(135, 210).setAngle(-10).setDepth(1).setAlpha(0);
    this.playerCard2 = this.add.image(centerX+50, 1300, 'cards', 1).setDisplaySize(135, 210).setAngle(10).setDepth(1).setAlpha(0);
  }

  setupChat(centerX, centerY) {
    let bubbleChat = this.add.image(centerX + 350, centerY + 400, 'bubbleChat').setDisplaySize(128, 128);
    bubbleChat.setInteractive();
    bubbleChat.on('pointerdown', () => {
      this.toggleChatbox();
    });

    let chatPannel = this.add.image(centerX, centerY + 400, 'roomListPanel').setDisplaySize(400, 400).setVisible(false);
    
    // Chat messages display area
    this.chatDisplay = this.add.text(centerX, centerY + 400, '', {
      font: '20px Arial', fill: '#ffffff', wordWrap: { width: 600, useAdvancedWrap: true }
    }).setOrigin(0, 0).setVisible(false);

    // Chat input field and send button
    this.chatInputContainer = this.add.dom(centerX, centerY + 500).createFromHTML(`
      <div style="display: none;" id="chatContainer">
        <input type="text" id="chatInput" placeholder="Type a message" style="font-size: 20px; width: 500px; height: 30px; padding: 5px;">
        <button id="sendButton" style="font-size: 20px; height: 40px; padding: 5px;">Send</button>
      </div>
    `);

    // Add event listener for sending messages
    document.getElementById('sendButton').addEventListener('click', () => this.sendChatMessage());
    document.getElementById('chatInput').addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.sendChatMessage();
      }
    });
  }

  handleServerMessage(data) {
    switch (data.action) {
      case 'getPlayerInfo':
        console.log('Received player info from server:', data.playerInfo);
        this.updatePlayerInfo(data.playerInfo);
        break;
      case 'dealCard':
        console.log('Dealing card:', data.card);
        this.dealCard(data.card);
        break;
      default:
        console.log('Unhandled server message:', data);
    }
  }

  updatePlayerInfo(playerInfo) {
    // Example: Update local player information
    this.player.name = playerInfo.name;
    this.player.chips = playerInfo.chips;
    // Update UI elements with player info if needed
  }

  // dealCard(card) {
  //   // Example: Deal card animation or update card slots
  //   // This depends on your game's card dealing mechanism
  //   // For example, adding a card to the table:
  //   this.addCardToTable(card);
  // }

  addCardToTable(pos, cardFrameIndex=null) {
    // Example: Add a card to the table
    // Adjust position and other parameters based on your game's design
    // Example implementation:
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    const cardSlotPositions = [
        { x: centerX - 125, y: centerY - 100 },
        { x: centerX, y: centerY - 100 },
        { x: centerX + 125, y: centerY - 100 },
        { x: centerX - 65, y: centerY + 75 },
        { x: centerX + 65, y: centerY + 75 }
    ];

    if(cardFrameIndex == null)
      cardFrameIndex = Math.floor(Math.random() * 52);

    let card = this.add.image(cardSlotPositions[pos].x, cardSlotPositions[pos].y-3 , 'cards', cardFrameIndex).setDisplaySize(95, 150);
    card.setOrigin(0.5, 0.5);
    this.publicCard.push(card);
  }

  setupSeats(centerX, centerY) {
    // Example: Set up interactive seats for players
    const seatPositions = [
      { x: centerX, y: centerY-700 },
      { x: 800, y: 500 },
      { x: 100, y: 500 },
      { x: 800, y: 900 },
      { x: 100, y: 900 },
      { x: centerX, y: centerY+450 },
    ];

    this.seats = [];
    seatPositions.forEach((position, index) => {
      let seat = this.add.image(position.x, position.y, 'seat').setDisplaySize(100, 100);

      let seatInfoBoxPosX = 0;
      let seatInfoBoxPosY = 0;
      let seatInfoContent = "- Empty Seat -";
      let seatInfoContentColor = "#ffffff";
      let seatInfoSizeX = 250;
      let seatInfoSizeY = 150;
      switch(index)
      {
        case 0:
          seatInfoBoxPosX = position.x;
          seatInfoBoxPosY = position.y+110;
          break;
        case 1:
        case 3:
          seatInfoBoxPosX = position.x-55;
          seatInfoBoxPosY = position.y+105;
          break;
        case 2:
        case 4:
          seatInfoBoxPosX = position.x+55;
          seatInfoBoxPosY = position.y-105;
          break;
        case 5:
          seatInfoSizeX = 400;
          seatInfoSizeY = 200;
          seatInfoBoxPosX = position.x;
          seatInfoBoxPosY = position.y-100;
          seatInfoContent = "$250\nSit down at this table";
          seatInfoContentColor = "#ffff00";
          seat.setTexture("my-seat");
          seat.setDisplaySize(150, 150)
          seat.setInteractive();
          seat.setDepth(5);
          seat.on('pointerdown', () => this.handleSeatClick(index, centerX, centerY));
          break;
      }
      let seatInfoBox = this.add.image(seatInfoBoxPosX, seatInfoBoxPosY, 'seat-info').setDisplaySize(seatInfoSizeX, seatInfoSizeY);
      let seatInfoText =  this.add.text(seatInfoBoxPosX, seatInfoBoxPosY, seatInfoContent, { font: '24px Brothers', fill: seatInfoContentColor, align: 'center'}).setOrigin(0.5, 0.5);
      let seatInfoContainer = this.add.container(0, 0, [seatInfoBox, seatInfoText]);
      this.seatInfos.push(seatInfoContainer);

      this.seats.push(seat);
    });
  }

  handleSeatClick(seatIndex, centerX, centerY) {
    this.seats[seatIndex].setAlpha(0);
    this.seatInfos[seatIndex].getAt(1).setText(`Test User \n $250.00`);
    this.toggleGameButtons()
    this.playerCard1.setAlpha(1);
    this.playerCard2.setAlpha(1);
  }

  setupGameButtons(centerX, centerY) {

    this.callButton = this.add.image(centerX-150, 1500, 'call-button').setDisplaySize(128, 128).setAlpha(0).setInteractive();
    this.callButtonText = this.add.text(centerX-150, 1500, `Call\n $10`, { font: '28px Brothers', fill: '#000000' }).setOrigin(0.5).setDepth(5).setAlpha(0);

    this.raiseButton = this.add.image(centerX, 1500, 'raise-button').setDisplaySize(128, 128).setAlpha(0).setInteractive();
    this.raiseButtonText = this.add.text(centerX, 1500, `Raise`, { font: '24px Brothers', fill: '#000000', align:"center" }).setOrigin(0.5).setDepth(5).setAlpha(0);

    this.foldButton = this.add.image(centerX+150, 1500, 'fold-button').setDisplaySize(128, 128).setAlpha(0).setInteractive();
    this.foldButtonText = this.add.text(centerX+150, 1500, `Fold`, { font: '28px Brothers', fill: '#000000' }).setOrigin(0.5).setDepth(5).setAlpha(0);

    this.raiseBar = this.add.dom(centerX, centerY + 625).createFromHTML(`
      <input type="range" class="form-control-range" id="raiseBarSlider" min="0" max="100" value="0" step="1">
    `).setDepth(3).setAlpha(0);

    const slider = this.raiseBar.getChildByID('raiseBarSlider');
    slider.addEventListener('input', ()=>{
      this.raiseButtonText.setText(`Raise\n$${(250 * (slider.value/100)).toFixed(2)}`);
    });

    this.callButton.on('pointerdown', () => {
      //this.socket.send(JSON.stringify({ action: 'bet', playerId: this.player.id }));
      switch(this.currentGameState)
      {
        case "pre-flop":
          this.addCardToTable(0);
          this.addCardToTable(1);
          this.addCardToTable(2);
          this.currentGameState = "flop";
          break;
        case "flop":
          this.addCardToTable(3);
          this.currentGameState = "turn";
          break;
        case "turn":
          this.addCardToTable(4);
          this.currentGameState = "river";
          break;
        case "river":
          for(let i = 0; i < this.publicCard.length; i++)
          {
            this.publicCard[i].destroy();
          }
          this.publicCard = [];
          this.currentGameState = "pre-flop";
          break;
      }
    });

    this.raiseButton.on('pointerdown', () => {
      if(this.raiseBar.alpha == 0)
      {
        this.raiseBar.setAlpha(1);
      }
      else
      {
        //this.socket.send(JSON.stringify({ action: 'bet', playerId: this.player.id }));
        switch(this.currentGameState)
        {
          case "pre-flop":
            this.addCardToTable(0);
            this.addCardToTable(1);
            this.addCardToTable(2);
            this.currentGameState = "flop";
            break;
          case "flop":
            this.addCardToTable(3);
            this.currentGameState = "turn";
            break;
          case "turn":
            this.addCardToTable(4);
            this.currentGameState = "river";
            break;
        }
      }
    });

    this.foldButton.on('pointerdown', () => {
      //this.socket.send(JSON.stringify({ action: 'bet', playerId: this.player.id }));
      switch(this.currentGameState)
      {
        case "pre-flop":
          this.addCardToTable(0);
          this.addCardToTable(1);
          this.addCardToTable(2);
          this.currentGameState = "flop";
          break;
        case "flop":
          this.addCardToTable(3);
          this.currentGameState = "turn";
          break;
        case "turn":
          this.addCardToTable(4);
          this.currentGameState = "river";
          break;
      }
    });
  }

  toggleGameButtons() {
    this.callButton.setAlpha(this.callButton.alpha === 1 ? 0 : 1);
    this.callButtonText.setAlpha(this.callButtonText.alpha === 1 ? 0 : 1);
    this.raiseButton.setAlpha(this.raiseButton.alpha === 1 ? 0 : 1);
    this.raiseButtonText.setAlpha(this.raiseButtonText.alpha === 1 ? 0 : 1);
    this.foldButton.setAlpha(this.foldButton.alpha === 1 ? 0 : 1);
    this.foldButtonText.setAlpha(this.foldButtonText.alpha === 1 ? 0 : 1);
  }

  sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    if (message) {
      this.chatMessages.push(message);
      this.updateChatDisplay();
      chatInput.value = '';
    }
  }

  updateChatDisplay() {
    this.chatDisplay.setText(this.chatMessages.join('\n'));
  }

  toggleChatbox(chatPannel) {
    this.chatVisible = !this.chatVisible;
    this.chatDisplay.setVisible(this.chatVisible);
    this.chatPannel.setVisible(this.chatVisible);
    document.getElementById('chatContainer').style.display = this.chatVisible ? 'block' : 'none';
  }

  update() {
    // Update game logic, animations, etc.
  }
}
