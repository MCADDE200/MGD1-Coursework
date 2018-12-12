class aSprite {
    constructor(x, y, imageSRC){
        this.index = 0;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.sImage = new Image();
        this.sImage.src = imageSRC;
    }
    // Getter
    get xPos(){
        return this.x;
    }

    get yPos(){
        return this.y;
    }

    // Setter
    set xPos(newX){
        this.x = newX;
    }

    set yPos(newY){
        this.y = newY;
    }

    // Method
    render() {
        canvasContext.drawImage(this.sImage,this.x, this.y);
    }

    update(elapsed) {
        this.xPos += this.vx * elapsed;
        this.yPos += this.vy * elapsed;
    }

    // Method
    sPos(newX,newY){
        this.x = newX;
        this.y = newY;
    }

    // Method
    sVel(newX, newY){
        this.vx = newX;
        this.vy = newY;
    }

    // Static Method
    static distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        return Math.hypot(dx, dy);
    }

}

//missile Class--------------------------------------------------------------------
class Missile extends aSprite {
    constructor(x, y, imageSRC, sx, sy, sWidth, sHeight) {
        super(x, y, imageSRC);
        this.sx = sx;
        this.sy = sy;
        this.sWidth = sWidth;
        this.sHeight = sHeight;

    }

    render() {
        canvasContext.drawImage(this.sImage, this.x, this.y, this.sx, this.sy);

    }

    update(elapsed) {
        super.update(elapsed);
        this.sVel(this.vx, this.vy - 75);
    }
}
//Spaceship Class--------------------------------------------------------------------
class Spaceship extends aSprite {
    constructor(x, y, imageSRC, sx, sy, sWidth, sHeight)
    {
        super(x, y, imageSRC);
        this.sx = sx;
        this.sy = sy;
        this.sWidth = sWidth;
        this.sHeight = sHeight;
        this.speed = 15;
    }

    render() {
        canvasContext.drawImage(this.sImage, this.x, this.y, this.sx, this.sy);
    }

    update(elapsed) {
        if (lastPt != null) {
            var dir = 1;

            var disSquared = Math.pow(this.x - (lastPt.x - this.sx * 0.5), 2);
            if (this.x > lastPt.x-this.sx*0.5) dir = -1;
            this.x += dir * this.speed * elapsed * ((disSquared / (this.speed* this.speed)));
            if (disSquared < 15) this.x = lastPt.x - this.sx * 0.5;

            var dir = 1;

            var disSquaredY = Math.pow(this.y - (lastPt.y - this.sy * 0.5), 2);
            if (this.y > lastPt.y-this.sy*0.5) dir = -1;
            this.y += dir * this.speed * elapsed * ((disSquaredY / (this.speed* this.speed)));
            if (disSquaredY < 15) this.y = lastPt.y - this.sy * 0.5;

        }
    }
}
//Enemy Class--------------------------------------------------------------------------
class Enemy extends aSprite {
    constructor(x, y, imageSRC, sx, sy, sWidth, sHeight)
        {
            super(x, y, imageSRC);
            this.sx = sx;
            this.sy = sy;
            this.sWidth = sWidth;
            this.sHeight = sHeight;
            this.speed = 15;
        }

        render() {
            canvasContext.drawImage(this.sImage, this.x, this.y, this.sx, this.sy);
        }

    update(elapsed) {
        super.update(elapsed);
        this.sVel(enemyXSpeed, enemyYSpeed);

            //if(soundMgr != null) soundMgr.playSound(0);
    }
}
//Enemy Bullet Class--------------------------------------------------------------------
class EnemyBullet extends aSprite {
    constructor(x, y, imageSRC, sx, sy, sWidth, sHeight) {
        super(x, y, imageSRC);
        this.sx = sx;
        this.sy = sy;
        this.sWidth = sWidth;
        this.sHeight = sHeight;
        //this.radius = radius;
        //this.vx = Math.random() * 400 - 200;
    }

    render() {
        canvasContext.drawImage(this.sImage, this.x, this.y, this.sx, this.sy);

    }

    update(elapsed) {
        super.update(elapsed);
        this.sVel(this.vx, this.vy + 75);
    }
}

//Sprite spawing prototypes
function bSprite(x, y, imageSRC, velx, vely) {
    this.zindex = 0;
    this.x = x;
    this.y = y;
    this.vx = velx;
    this.vy = vely;
    this.sImage = new Image();
    this.sImage.src = imageSRC;
}

bSprite.prototype.renderF = function(width, height)
{
    canvasContext.drawImage(this.sImage,this.x, this.y, width, height );
}

bSprite.prototype.render = function()
{
    canvasContext.drawImage(this.sImage,this.x, this.y);
}

bSprite.prototype.update = function(deltaTime)
{
    this.x += deltaTime * this.vx;
    this.y += deltaTime * this.vy;
}
//------------------------------------------------------------------------------------------------------

//Global variables
var canvas;
var canvasContext;
var gravity = 1000;

//Used for the various background images in the game
var bkgdImage;
var menuImage;
var gameOverImage;

//Sets up player and enemies
var missile;
var pSpaceship;
var enemies = [];
var enemiesCollidedBool = [];
var enemyXSpeed = 200;
var enemyYSpeed = 0;
var numberOfEnemies;
var enemyBullets = [];
var lastPt = null;

var playerScore;
var highScore;

var gameState = 0;

var timer = 0.0;

var soundMgr;

//Used to fit the canvas onto the display
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function load()
{
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    if(storageAvailable('localStorage')) //Checks if there is local storage availabe
    {
        console.log("storage available");
        // if(localStorage.getItem('player_name'))
        // {
        //     console.log("data");
        //     showScore();
        // }
    }
    else
    {
        console.log("No Storage Available!!");
    }
    init();
}

function init() {

    if (canvas.getContext) {
        //Set Event Listeners for window, mouse and touch

        window.addEventListener('resize', resizeCanvas, false);
        window.addEventListener('orientationchange', resizeCanvas, false);

        canvas.addEventListener("touchstart", touchDown, false);
        canvas.addEventListener("touchmove", touchXY, true);
        canvas.addEventListener("touchend", touchUp, false);

        document.body.addEventListener("touchcancel", touchUp, false);

        canvas.addEventListener("mousedown", mouseDown, false);
        canvas.addEventListener("mousemove", mouseDown, false);
        canvas.addEventListener("mouseup", mouseUp, false);


        resizeCanvas();


        if(localStorage.getItem('player_score') != null)
        {
            highScore = localStorage.getItem('player_score'); //looks for the high score in local storage
        }
        else
        {
            highScore = 0; //If this cannot be found sets the highscore to 0
            localStorage.setItem('player_score', 0);
        }
        
        numberOfEnemies = 3; //Sets the number of enemies in the game
        playerScore = 0; //Sets player score to 0

        //Load all the background images in
        bkgdImage = new bSprite(0,0,'BackgroundSpace.png', 0,0);
        menuImage = new bSprite(0,0,'MainMenuBackground.png', 0,0);
        gameOverImage = new bSprite(0,0,'GameOverScreen.jpg', 0,0);

        //Create the spaceship and the missles it fires
        pSpaceship = new Spaceship(canvas.width/2, canvas.height - 50 , 'spaceship1.png', 80, 80, 80, 80);
        missile = new Missile(pSpaceship.x + (pSpaceship.sWidth/2), pSpaceship.y, 'Bullet.png', 40, 40, 40, 40);

        //These methods are used to set up the enemies and how they fire at the player
        ResetEnemies()
        ResetBullets()

        //Start the main menu music
        if (soundMgr != null) soundMgr.playMusic(0);

        startTimeMS = Date.now();

        gameLoop();

        //These setIntervals will be used so that the player fires at a steady rate
        //The enemies will be a bit varied between 1.8 and 1 second this can provide more challenge to the player
        var randomSpawnThing = setInterval(SpawnMissile, 800);
        var spawnEnemyBullets = setInterval(SpawnEnemyBullet, Math.floor(Math.random() * (1800 - 1000)+ 1000));
        //var randomSpawnEnemyThing = setInterval(SpawnEnemies, 7000);
    }
}

function gameLoop(){
    switch(gameState)
    {
        case 0:
        RenderMainMenu(elapsed); //Render the main menu
        break;

        case 1:

        var elapsed = (Date.now() - startTimeMS)/1000;
    update(elapsed); //Update and render the objects in the game
    render(elapsed);
    startTimeMS = Date.now();

    //These 3 methods are used to check for any collision dection between player, enemies and projectiles
    BulletEnemyChecks();
    EnemyBulletPlayerChecks();
    EnemyPlayerChecks();
    //This will ensure the enemies bounce around the screen
    EnemyMovementChecks();
        //This will check to see if there are any enemies left in the game
    CheckEnemies();
        break;

        case 2:

        //Used to render the game over screen
        RenderGameOver(elapsed);
        break;
    }
    requestAnimationFrame(gameLoop);

}

function render(elapsed) {
    canvasContext.clearRect(0,0,canvas.width, canvas.height);
    bkgdImage.renderF(canvas.width, canvas.height)
    UpdateScore(); //Render the score on the screen

    //Render player missile and the player
    missile.render();
    pSpaceship.render();
    
    //Render Enemy Bullets 
    for (var i = 0; i < numberOfEnemies; i++)
    {
        enemyBullets[i].render();
    }

    //Render enemies which have not been destroyed
    for (var i = 0; i < numberOfEnemies; i++)
    {
        if(!enemiesCollidedBool[i])
        {
            enemies[i].render();
        }
    }
}

function update(elapsed) {

    //Update player missile and the player
    missile.update(elapsed);
    pSpaceship.update(elapsed);

    //Update Enemy Bullets 
    for (var i = 0; i < numberOfEnemies; i++)
    {
        enemyBullets[i].update(elapsed);
    }

    //Update enemies which have not been destroyed
    for (var i = 0; i < numberOfEnemies; i++)
    {
        enemies[i].update(elapsed);
    }
}

function RenderMainMenu(elapsed)
{
    canvasContext.clearRect(0,0,canvas.width, canvas.height);
    menuImage.renderF(canvas.width, canvas.height); //Renders Background
    canvasContext.fillStyle = "#ffffff"; //Makes the colour white(easy to see on black backgrounds)
    canvasContext.font = "bold 50px Impact"; //Chooses the font 
    canvasContext.textAlign = "center"; //Aligns the text
    canvasContext.textBaseline = "top"; //Sets the baseline to the top
    canvasContext.fillText("Galaga Strike", canvas.width/2, 0, canvas.width); //Name of game
    //This will change the text for the next set of writing
    canvasContext.font = "bold 30px Impact";
    canvasContext.textAlign = "left";
    canvasContext.textBaseline = "center";
    canvasContext.fillText("Shoot alien ships to gain score", 0, canvas.height/2 - 30, canvas.width);
    canvasContext.fillText("Avoid their attacks or you will blow up", 0, canvas.height/2, canvas.width);
    canvasContext.fillText("Tap to begin...", 0, canvas.height/2 + 30, canvas.width);
    
}

function RenderGameOver(elapsed)
{
    canvasContext.clearRect(0,0,canvas.width, canvas.height);
    gameOverImage.renderF(canvas.width, canvas.height);
    canvasContext.fillStyle = "#ffffff";
    canvasContext.font = "bold 50px Impact";
    canvasContext.textAlign = "center";
    canvasContext.textBaseline = "top";
    canvasContext.fillText("Galaga Strike", canvas.width/2, 0, canvas.width);
    canvasContext.fillText("Score: " + playerScore.toString(), canvas.width/2, 50, canvas.width); //Display the players score
    canvasContext.fillText("High Score: " + localStorage.getItem('player_score').toString(), canvas.width/2, 100, canvas.width); //Display the high score stored locally
    canvasContext.font = "bold 30px Impact";
    canvasContext.textAlign = "left";
    canvasContext.textBaseline = "center";
    canvasContext.fillText("Game Over!!", 0, canvas.height/2 - 30, canvas.width);
    canvasContext.fillText("The aliens have defeated you", 0, canvas.height/2, canvas.width);
    canvasContext.fillText("Tap if you wish to try again...", 0, canvas.height/2 + 30, canvas.width);
    if(playerScore > localStorage.getItem('player_score'))
    {
        localStorage.setItem('player_score', playerScore); //Set new high score if the player got a higher score
    }
}

function ResetEnemies()
{
    for (var i = 0; i < numberOfEnemies; i++)
    {
        enemiesCollidedBool[i] = false; //Set the  collision back to false
    }
    
    var enemyPattern = Math.round(Math.random() * (4)) //Choose a random enemy pattern

    switch(enemyPattern)
    {
        case 1:
        EnemyPattern1();
        break;
        case 2:
        EnemyPattern2();
        break;
        case 3:
        EnemyPattern3();
        break;
        case 4:
        EnemyPattern4();
        break;
    }
}

//Move enemies at the top of screen left and right
function EnemyPattern1()
{
    enemyXSpeed = 200;
    enemyYSpeed = 0;
    for (var i = 0; i < numberOfEnemies; i++)
    {
        enemies[i] = new Enemy(i*(100), 0, 'aliens.png', 80, 80, 80, 80);
    }
}

//Move enemies from top left to bottom right then bounce off edges
function EnemyPattern2()
{
    enemyXSpeed = 200;
    enemyYSpeed = 200;
    for (var i = 0; i < numberOfEnemies; i++)
    {
        enemies[i] = new Enemy(i*(100), 0, 'aliens.png', 80, 80, 80, 80);
    }
}

//Moves enemies directly down the screen the back up
function EnemyPattern3()
{
    enemyXSpeed = 0;
    enemyYSpeed = 200;
    for (var i = 0; i < numberOfEnemies; i++)
    {
        enemies[i] = new Enemy(i*(100), 0, 'aliens.png', 80, 80, 80, 80);
    }
}

//Move enemies from top right to bottom left then bounce off edges
function EnemyPattern4()
{
    enemyXSpeed = -200;
    enemyYSpeed = 200;
    for (var i = 0; i < numberOfEnemies; i++)
    {
        enemies[i] = new Enemy(canvas.width - i*(100), 0, 'aliens.png', 80, 80, 80, 80);
    }
}

//Sets up the enemy lasers
function ResetBullets()
{
    for (var i = 0; i < numberOfEnemies; i++)
        {
            enemyBullets[i] = new EnemyBullet(0, 0, 'laser.png', 40, 40, 40, 40);
        }
}

function CheckEnemies()
{
    //Once all the enemies have been shot this will reset them
    var checkNum = 0;
    for (var i = 0; i < numberOfEnemies; i++)
    {
        if(enemiesCollidedBool[i])
        {
            checkNum++;
        }
    }
    if(checkNum == numberOfEnemies)
    {
        ResetEnemies();
        checkNum = 0;
    }
    else{
        checkNum = 0;
    }
}

function SpawnMissile()
{
    //Spawn the missile from the player and play a sound
    missile = new Missile(pSpaceship.x + (pSpaceship.sWidth/2), pSpaceship.y, 'Bullet.png', 40, 40, 40, 40);
    if(gameState == 1)
    {
        if (soundMgr != null) soundMgr.playSound(0);
    }
}

function SpawnEnemyBullet()
{
    var soundBool = false; //Used to make sure the laser sound only fires once even if multiple enemies fire
    for(var i = 0; i < numberOfEnemies; i++)
    {
        if(!enemiesCollidedBool[i]) //Checks so only enemies currently in game can shoot
        {
            //Give the enemies a 40% of firing a laser
            var shootCheck = Math.floor(Math.random() * (10));
            if(shootCheck > 6)
            {
                enemyBullets[i] = new EnemyBullet(enemies[i].x + (enemies[i].sWidth/2), enemies[i].y - (enemies[i].sHeight), 'laser.png', 40, 40, 40, 40); //Spawns laser on enemy
                if(!soundBool)
                {
                    if(gameState == 1)
                        {
                            if (soundMgr != null) soundMgr.playSound(1); //Plays laser sound
                        }
                    soundBool = true;
                }
            }
        }
    }

}

function BulletEnemyChecks()
{
    for (var i = 0; i < numberOfEnemies; i++)
    {
        var collided = [];
        if(!enemiesCollidedBool[i])
        {
            collided[i] = collisionDetection(missile ,enemies[i]); //Checks if missle hits enemy
        }
        if(collided[i])
        {
            enemiesCollidedBool[i] = true;
            playerScore += 100; //Adds to score
            if (soundMgr != null) soundMgr.playSound(2);//Plays explosion sound
            missile.x = -1000;
        }
        
    }
}

function EnemyMovementChecks()
{
    //Keeps the enemies in the game screen
    for (var i = 0; i < numberOfEnemies; i++)
    {
        if(!enemiesCollidedBool[i])
        {
            if((enemies[i].x) > canvas.width)
            {
                enemyXSpeed = -200;
            }
            if((enemies[i].x) < 0)
            {
                enemyXSpeed = 200;
            }
            if((enemies[i].y) > canvas.width)
            {
                enemyYSpeed = -200;
            }
            if((enemies[i].y) < 0)
            {
                enemyYSpeed = 200;
            }
        }
    }
}

function EnemyBulletPlayerChecks()
{
    var collided = false;
    for (var i = 0; i < numberOfEnemies; i++)
    {
        collided = collisionDetection(enemyBullets[i], pSpaceship);//Checks if enemy laser hits the player
        if (collided)
        {
            if (soundMgr != null) soundMgr.playSound(2); //Plays explosion sound if it has
            gameState = 2; //Moves to game over screen
        }
    }

}

function EnemyPlayerChecks()
{
    var collided = false;
    for (var i = 0; i < numberOfEnemies; i++)
    {
        collided = collisionDetection(enemies[i], pSpaceship); //Checks if an enemy hits the player
        if (collided)
        {
            if (soundMgr != null) soundMgr.playSound(2); //Plays explosion sound if it has
            gameState = 2; //Moves to game over screen
        }
    }
}


function collisionDetection(sprite1 , sprite2){
    //This is used to tell if 2 sprites are colliding with each other
    if (sprite1.x < sprite2.x + sprite2.sWidth &&
        sprite1.x + sprite1.sWidth > sprite2.x &&
        sprite1.y < sprite2.y + sprite2.sHeight &&
        sprite1.sHeight + sprite1.y > sprite2.y) {
        return true;
     }
}

function UpdateScore()
{
    canvasContext.fillStyle = "#ffffff"; //Makes font white
    canvasContext.font = "bold 30px Impact";
    canvasContext.fillText("Score : " + playerScore.toString(), 0, canvas.height -100, canvas.width); //Puts it in the bottom left corner
}

function RestartGame()
{
    //Resets the game so that you can play again
    numberOfEnemies = 3;
    playerScore = 0;

    pSpaceship = new Spaceship(canvas.width/2, canvas.height- 100, 'spaceship1.png', 80, 80, 80, 80);
    missile = new Missile(pSpaceship.x + (pSpaceship.sWidth/2), pSpaceship.y, 'Bullet.png', 40, 40, 40, 40);

    ResetEnemies()
    ResetBullets()

    //if (soundMgr != null) soundMgr.playMusic(0);

        startTimeMS = Date.now();

        gameLoop();

        // var randomSpawnThing = setInterval(SpawnBullet, 800);
        // var spawnEnemyBullets = setInterval(SpawnEnemyBullet, Math.floor(Math.random() * (1800 - 1000)+ 1000));
    //init();
    gameState = 1;
}

//Persistent Storage
function storageAvailable(type)
{
    try
    {
        var storage = window[type], x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e)
    {
        return e instanceof DOMException &&(
            //right is for firefox
            e.code === 22 || e.code === 1014 ||
            //test name field
            e.name === 'QuotaExceededError' ||
            //firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') && storage.length !== 0;
    }
}

function populateStorage(){
    localStorage.setItem('player_score', document.getElementById('score').value);
    console.log("populate");
    showScore();
}

function showScore()
{
    var currentScore = localStorage.getItem('player_score');

    document.getElementById('show').innerHTML = "High score is "+ currentScore;
}

//touch events--------------------------------------------------------------------
function touchUp(evt) {
    evt.preventDefault();
    // Terminate touch path
    lastPt=null;
    //Used to change between game scenes and music by touching the screen
    if(gameState == 0)
    {
        if (soundMgr != null) soundMgr.playMusic(1);
        gameState = 1;
    }
    if (gameState == 2)
    {
        if (soundMgr != null) soundMgr.playMusic(2);
        RestartGame();
    }
}

function touchDown(evt) {
    evt.preventDefault();
    if(gameOverScreenScreen)
    {
        return;
    }
    touchXY(evt);
}

function touchXY(evt) {
    evt.preventDefault();
    lastPt = {x:evt.touches[0].pageX, y:evt.touches[0].pageY};
}

function mouseDown(evt){
    evt.preventDefault();
    if(gameState == 1)
    {
        lastPt = { x: evt.pageX, y: evt.pageY };
    }
    // if(gameState == 0 || gameState == 2)
    // {
    //     gameState = 1;
    // }
}

function mouseUp(evt){
    evt.preventDefault();
    //Used to change between game scenes and music by clicking the screen
    if(gameState == 0)
        {
            if (soundMgr != null) soundMgr.playMusic(1);
            gameState = 1;
        }
        if (gameState == 2)
        {
            if (soundMgr != null) soundMgr.playMusic(2);
            RestartGame();
        }
}