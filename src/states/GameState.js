class GameState extends Phaser.State {

	constructor() {
		super();
		this.platforms = null;
		this.player = null;
		this.cursors = null;
		this.stars = null;
		this.score = 0;
		this.scoreText = null;
	}

	preload() {
		console.log("preload()");
		this.game.load.image('sky', 'assets/sky.png');
		this.game.load.image('ground', 'assets/platform.png');
		this.game.load.image('star', 'assets/star.png');
		this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
	}

	create() {
		console.log("create()")
		let center = { x: this.game.world.centerX, y: this.game.world.centerY }

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.add.sprite(0, 0, 'sky');

		this.platforms = this.game.add.group();
		this.platforms.enableBody = true;
		var ground = this.platforms.create(0, this.game.world.height - 64, 'ground');
		ground.scale.setTo(2, 2);
		ground.body.immovable = true;

		var ledge = this.platforms.create(400, 400, 'ground');
		ledge.body.immovable = true;
		ledge = this.platforms.create(-150, 250, 'ground');
		ledge.body.immovable = true;

		this.player = this.game.add.sprite(32, this.game.world.height - 150, 'dude');
		this.game.physics.arcade.enable(this.player);

		this.player.body.bounce.y = 0.2;
		this.player.body.gravity.y = 300;
		this.player.body.collideWorldBounds = true;

		this.player.animations.add('left', [0, 1, 2, 3], 10, true);
		this.player.animations.add('right', [5, 6, 7, 8], 10, true);

		this.stars = this.game.add.group();
		this.stars.enableBody = true;

		for (var i =0; i < 12; i++) {
			var star = this.stars.create(i * 70, 0, 'star');
			star.body.gravity.y = 6;
			star.body.bounce.y = 0.7 + Math.random() * 0.2;
		}

		this.scoreText = this.game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000'});

		this.cursors = this.game.input.keyboard.createCursorKeys();
	}

	update() {
		//console.log('update()');
		this.game.physics.arcade.collide(this.stars, this.platforms);
		this.game.physics.arcade.collide(this.player, this.platforms);
		this.game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
		this.player.body.velocity.x = 0;

		if (this.cursors.left.isDown) {
			this.player.body.velocity.x = -150;
			this.player.animations.play('left');
		} else if (this.cursors.right.isDown) {
			this.player.body.velocity.x = 150;
			this.player.animations.play('right');
		} else {
			this.player.animations.stop();
			this.player.frame = 4;
		}

		if (this.cursors.up.isDown && this.player.body.touching.down) {
			this.player.body.velocity.y = -350;
		}
	}

	collectStar(player, star) {
		star.kill();
		this.score += 10;
		this.scoreText.text = 'Score: ' + this.score;
	}
}

export default GameState;
