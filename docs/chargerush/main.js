// The title of the game to be displayed on the title screen
title = "Space Bird";

// The description, which is also displayed on the title screen
description = `
 Left Click to Jump

+ Hold to Jump Higher

 Avoid Green Obstacles
`;

// The array of custom sprites
characters = [
`
  
YYYY 
 yyyy
Yyyyly
 yyyy
 r  r 
`,`
 gggg
glgggg
glgggg
gggggg
gggggg
 gggg
`,`
y  y
yyyyyy
 y  y
yyyyyy
 y  y
`
];

// Game design variable container
const G = {
	WIDTH: 200,
	HEIGHT: 150,

    STAR_SPEED_MIN: 0.1,
	STAR_SPEED_MAX: 0.2,

    STAR2_SPEED_MIN: 0.4,
	STAR2_SPEED_MAX: 0.7,
    
    PLAYER_FIRE_RATE: 25,
    PLAYER_GUN_OFFSET: 3,

    FBULLET_SPEED: 5,

    ENEMY_MIN_BASE_SPEED: 0.7,
    ENEMY_MAX_BASE_SPEED: 1.0,
    ENEMY_FIRE_RATE: 45,

    EBULLET_SPEED: 1.0,
    EBULLET_ROTATION_SPD: 0.1
};

// Game runtime options
// Refer to the official documentation for all available options
options = {
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
    isCapturing: true,
    isCapturingGameCanvasOnly: true,
    captureCanvasScale: 2,
    seed: 1,
    isPlayingBgm: true,
    isReplayEnabled: true,
    theme: "dark"
};

// JSDoc comments for typing
/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} Star
 */

/**
 * @type { Star [] } - A decorative floating object in the background
 */
let stars;

/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} Star2
 */

/**
 * @type { Star2 [] } - A decorative floating object in the background
 */
let stars2;

/**
 * @typedef {{
 * pos: Vector,
 * firingCooldown: number,
 * isFiringLeft: boolean,
 * playerSpeed: number
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
 * @typedef {{
 * pos: Vector
 * }} FBullet - The current position of the object
 */

/**
 * @type { FBullet [] }
 */
let fBullets;

/**
 * @typedef {{
 * pos: Vector,
 * firingCooldown: number
 * }} Enemy
 */

/**
 * @type { Enemy [] }
 */
let enemies;

/**
 * @typedef {{
 * pos: Vector,
 * angle: number,
 * rotation: number
 * }} EBullet
 */

/**
 * @type { EBullet [] }
 */
let eBullets;

/**
 * @type { number }
 */
let currentEnemySpeed;

/**
 * @type { number } - The downwards floating speed of this object
 */
let waveCount;

/**
 * 
 */

 let addSpeed = 0;
 let jumpPlay = true;

// The game loop function
function update() {
    // The init function running at startup
	if (!ticks) {
		stars = times(35, () => {
            const posX = rnd(0, G.WIDTH);
            const posY = rnd(0, G.HEIGHT);
            return {
                pos: vec(posX, posY),
                speed: rnd(G.STAR_SPEED_MIN, G.STAR_SPEED_MAX)
            };
        });

        stars2 = times(8, () => {
            const posX = rnd(0, G.WIDTH);
            const posY = rnd(0, G.HEIGHT);
            return {
                pos: vec(posX, posY),
                speed: rnd(G.STAR2_SPEED_MIN, G.STAR2_SPEED_MAX)
            };
        });

        player = {
            pos: vec(G.WIDTH * 0.3, G.HEIGHT * 0.5),
            firingCooldown: G.PLAYER_FIRE_RATE,
            isFiringLeft: true,
            playerSpeed : 0.05
        };

        fBullets = [];
        enemies = [];
        eBullets = [];

        waveCount = 0;
	}

    addScore(1);

    // Spawning enemies
    if (enemies.length === 0) {
        currentEnemySpeed =
            rnd(G.ENEMY_MIN_BASE_SPEED, G.ENEMY_MAX_BASE_SPEED) * difficulty;
        if (waveCount < 3){
            for (let i = 0; i < 5; i++) {
                const posX = G.WIDTH//rnd(i * G.WIDTH * 0.1);
                const posY = rnd(0, G.HEIGHT);
                enemies.push({
                    pos: vec(posX, posY),
                    firingCooldown: G.ENEMY_FIRE_RATE 
                });
            }
        }
        else if (waveCount < 10){
            for (let i = 0; i < 10; i++) {
                const posX = G.WIDTH//rnd(i * G.WIDTH * 0.1);
                const posY = rnd(0, G.HEIGHT);
                enemies.push({
                    pos: vec(posX, posY),
                    firingCooldown: G.ENEMY_FIRE_RATE 
                });
            }
        }
        else {
            for (let i = 0; i < 15; i++) {
                const posX = G.WIDTH//rnd(i * G.WIDTH * 0.1);
                const posY = rnd(0, G.HEIGHT);
                enemies.push({
                    pos: vec(posX, posY),
                    firingCooldown: G.ENEMY_FIRE_RATE 
                });
            }
        }
        

        waveCount++; // Increase the tracking variable by one
    }

    // Update for Star
    stars.forEach((s) => {
        s.pos.x -= s.speed;
        if (s.pos.x < 0) s.pos.x = G.WIDTH;
        color("blue");
        box(s.pos, 1);
    });
    stars2.forEach((s) => {
        s.pos.x -= s.speed;
        if (s.pos.x < 0) s.pos.x = G.WIDTH;
        color("red");
        box(s.pos, rnd(1.7, 2.7));
    });

    // Updating and drawing the player
    //player.pos = vec(input.pos.x, input.pos.y);
    //player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);
    player.pos.y += player.playerSpeed;
    player.playerSpeed += 0.04;
    
    if (player.pos.y > G.HEIGHT + 5 || player.pos.y < -5)
    {
        end();
        play("laser");
    }

    if (input.isPressed)
    {
        if (jumpPlay){
            play("hit");
        }
        addSpeed += 0.085;
        player.pos.y -= addSpeed; 
        player.playerSpeed = 0.2;
        jumpPlay = false;
    }
    else {
        addSpeed = 0;
        jumpPlay = true;
    }
    /*player.firingCooldown--;
    if (player.firingCooldown <= 0) {
        const offset = (player.isFiringLeft)
            ? -G.PLAYER_GUN_OFFSET
            : G.PLAYER_GUN_OFFSET;
        fBullets.push({
            pos: vec(player.pos.x + offset, player.pos.y)
        });
        player.firingCooldown = G.PLAYER_FIRE_RATE;
        player.isFiringLeft = !player.isFiringLeft;

        color("yellow");
        particle(
            player.pos.x + offset, // x coordinate
            player.pos.y, // y coordinate
            6, // The number of particles
            1.5, // The speed of the particles
            -PI/2, // The emitting angle
            PI/4  // The emitting width
        );
    }*/
    color ("black");
    char("a", player.pos);

    /*fBullets.forEach((fb) => {
        fb.pos.y -= G.FBULLET_SPEED;
        color("yellow");
        box(fb.pos, 2);
    });*/


    remove(enemies, (e) => {
        e.pos.x -= currentEnemySpeed;
        /*e.firingCooldown--;
        if (e.firingCooldown <= 0) {
            eBullets.push({
                pos: vec(e.pos.x, e.pos.y),
                angle: e.pos.angleTo(player.pos),
                rotation: rnd()
            });
            e.firingCooldown = G.ENEMY_FIRE_RATE;
            play("select");
        }*/

        color("black");
        const isCollidingWithFBullets = char("b", e.pos).isColliding.rect.yellow;
        const isCollidingWithPlayer = char("b", e.pos).isColliding.char.a;
        if (isCollidingWithPlayer) {
            play("laser");
            end();
        }
        
        if (isCollidingWithFBullets) {
            color("yellow");
            particle(e.pos);
            play("explosion");
            addScore(10 * waveCount, e.pos);
        }
        
        return (isCollidingWithFBullets || e.pos.x < 0);
    });

    /*remove(fBullets, (fb) => {
        color("yellow");
        const isCollidingWithEnemies = box(fb.pos, 2).isColliding.char.b;
        return (isCollidingWithEnemies || fb.pos.y < 0);
    });

    remove(eBullets, (eb) => {
        eb.pos.x += G.EBULLET_SPEED * Math.cos(eb.angle);
        eb.pos.y += G.EBULLET_SPEED * Math.sin(eb.angle);
        eb.rotation += G.EBULLET_ROTATION_SPD;

        color("red");
        const isCollidingWithPlayer
            = char("c", eb.pos, {rotation: eb.rotation}).isColliding.char.a;
        if (isCollidingWithPlayer) {
            end();
            play("powerUp");
        }
        const isCollidingWithFBullets
            = char("c", eb.pos, {rotation: eb.rotation}).isColliding.rect.yellow;
        if (isCollidingWithFBullets) addScore(1, eb.pos);
        
        return (!eb.pos.isInRect(0, 0, G.WIDTH, G.HEIGHT));
    });*/
}