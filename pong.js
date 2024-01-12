// import tunsing from 'ranem.jpeg';

// --- global var --- //

const canvas = document.getElementById('Pong');
const ctx = canvas.getContext('2d');

// visual

  // visual

  const Background = "#7EE8B4 ";
  const ScoreColor = rgba(0, 0, 0, 0.5);
  let   TimerColor = rgba(0, 0, 0, 0.5);


  // size of canvas

  const PongWidth = canvas.width;
  const PongHeight = canvas.height;

  // score and time

  let PlayerScore1 = 0;
  let PlayerScore2 = 0;

  let TimeInM = 5;
  let TimeInS = 0;

  // Status of game

  let LastedTouch = 1;
  let EndGame = false;

  // Ball info

  let BallColor = 'White';
  let BallStroke = 'black';

  let BallRay = 10;

  let BallX = PongWidth / 2;
  let BallY = PongHeight / 2;

  let BallDirY = 0;
  let BallVelocity = 1.8;
  let BallDirX = 2;

  // Paddle

  const PaddleColor = "white";
  const PaddleBorder = "black";

  let Paddle1Speed = 10;
  let Paddle2Speed = 10;

  let Paddle1 = 
  {
      width: 15,
      height: 100,
      x: 0,
      y: (PongHeight / 2) - 50
  }

  let Paddle2 = 
  {
      width: 15,
      height: 100,
      x: PongWidth - 15,
      y: (PongHeight / 2) - 50
  }

  // bonus

  let BonusStatus = false

  // --------------------------------- //

  const keysState = {};

  window.addEventListener('keydown', (event) => {
    keysState[event.key] = true;
  });
  
  window.addEventListener('keyup', (event) => {
    keysState[event.key] = false;
  });

  GameStart();

  // --------------------------------- //

  function GameStart()
  {
      Update()
      DrawElement();

  };

  function Update()
  {
    if (EndGame === false)
    {
      DrawElement();
      MovePaddle();
      BallPhysics();
      requestAnimationFrame(Update);
    }
  };

  function ResetAll()
  {
    BallX = PongWidth / 2;
    BallY = PongHeight / 2;
    BallDirX = 0;
    BallDirY = 0;
    TimeInM = 0;
    TimeInS = 0;
    EndGame = true;
  };

  // MAP //

  function DrawElement()
  {
    DrawPongZone();
    // DrawMap();
    DrawScore(PlayerScore1, PlayerScore2);
    DrawTimer(TimeInM, TimeInS);
    DrawPongBall();
    DrawPaddle();
  };

  function DrawPongZone() 
  {
    ctx.fillStyle = Background;

    ctx.beginPath();
    ctx.fillRect(0, 0, PongWidth, PongHeight);
    ctx.closePath();

    ctx.fillStyle = rgba(0, 0, 0, 0.2);

    ctx.beginPath();
    ctx.fillRect((PongWidth / 2) - 5, 0, 10, PongHeight - (PongHeight / 6));
    ctx.closePath();
  };

  function Goal(LastedTouch)
  {
    if (LastedTouch === 1)
      PlayerScore1 += 1;
    else
      PlayerScore2 += 1;
    // pausecomp(1000);
    ResetBallStats();
  };

  // PADDLE //

  function MovePaddle()
  {
    console.log(keysState);
    if (keysState["ArrowLeft"])
    {
      if (Paddle1.y - Paddle1Speed > 0)
        Paddle1.y -= Paddle1Speed;
    }
    else if (keysState["ArrowRight"])
    {
      if (Paddle1.y + Paddle1Speed < PongHeight - Paddle1.height)
        Paddle1.y += Paddle1Speed;
    }

    if (keysState["a"])
    {
      if (Paddle2.y - Paddle2Speed > 0)
        Paddle2.y -= Paddle2Speed;
    }
    else if (keysState["d"])
    {
      if (Paddle2.y + Paddle2Speed < PongHeight - Paddle2.height)
        Paddle2.y += Paddle2Speed;
    }
  };

  function DrawMap()
  {
    const background = new Image();
    background.src = tunsing;

    ctx.drawImage(background, 0, 0, PongWidth, PongHeight);
  };

  function DrawPaddle() 
  {
    ctx.strokeStyle = PaddleBorder;
    ctx.fillStyle = PaddleColor;
    ctx.lineWidth = 2.5
  
    ctx.beginPath();
    ctx.fillRect(Paddle1.x, Paddle1.y, Paddle1.width, Paddle1.height);
    ctx.strokeRect(Paddle1.x, Paddle1.y, Paddle1.width, Paddle1.height);

    ctx.fillRect(Paddle2.x, Paddle2.y, Paddle2.width, Paddle2.height);
    ctx.strokeRect(Paddle2.x, Paddle2.y, Paddle2.width, Paddle2.height);
    ctx.closePath();
  };

  function DrawScore(Score1, Score2)
  {
    ctx.fillStyle = ScoreColor;
    ctx.font = "bold 70px Poppins";
    ctx.textAlign = "center";
    ctx.fillText(Score1, PongWidth / 4, PongHeight / 4);
    ctx.fillText(Score2, PongWidth - (PongWidth / 4), PongHeight / 4);
  };

  function DrawTimer(Min, Sec)
  {
    ctx.fillStyle = ScoreColor;
    ctx.font = "bold 70px Poppins";
    ctx.textAlign = "center";
    if (TimeInS < 10)
      ctx.fillText(TimeInM + ':' + TimeInS + 0, (PongWidth / 2), PongHeight - (PongHeight / 20) + 5);
    else
      ctx.fillText(TimeInM + ':' + TimeInS, (PongWidth / 2), PongHeight - (PongHeight / 20) + 5);
  };

  // BALL //

  function DrawPongBall()
  {
      ctx.strokeStyle = BallStroke;
      ctx.fillStyle = BallColor;
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.arc(BallX, BallY, BallRay, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
  };

  function ResetBallStats()
  {
      BallRay = 10;
      BallVelocity = 1.8;
      BallX = PongWidth / 2;
      BallY = PongHeight / 2;
      BallDirX = (2 * LastedTouch) * BallVelocity;
      BallDirY = 0;
  };

  // PHYSICS //

  function BallPhysics()
  {
    PaddleColision();
    WallColision(); 

    BallX += (BallDirX * BallVelocity);
    BallY += BallDirY;
    console.log(BallVelocity);
  };

  function BallMovement(Paddle)
  {
    const ImpactY = (Paddle.y - BallY) * -1;
    
    if (ImpactY <= Paddle.height / 5)
    {
      BallDirX = 3;
      BallDirY = -3;
    }
    else if (ImpactY <= (Paddle.height / 5) * 2)
    {
      BallDirX = 3;
      BallDirY = -1;
    }
    else if (ImpactY <= (Paddle.height / 5) * 3)
    {
      BallDirX = 3;
      BallDirY = 0;
    }
    else if (ImpactY <= (Paddle.height / 5) * 4)
    {
      BallDirX = 3;
      BallDirY = 1;
    }
    else if (ImpactY <= Paddle.height)
    {
      BallDirX = 3;
      BallDirY = 3;
    }

  };

  function WallColision()
  {
    if (BallY - BallRay <= 0 || BallY + BallRay >= PongHeight)
      BallDirY *= -1;
    else if (BallX + BallRay >= PongWidth || BallX - BallRay <= 0)
      Goal(LastedTouch);
  };

  function PaddleColision()
  {
    let dx1 = Math.abs(BallX - Paddle1.x - Paddle1.width / 2);
    let dy1 = Math.abs(BallY - Paddle1.y - Paddle1.height / 2);

    let dx2 = Math.abs(BallX - Paddle2.x - Paddle2.width / 2);
    let dy2 = Math.abs(BallY - Paddle2.y - Paddle2.height / 2);

    if (dx1 <= (BallRay + Paddle1.width / 2) && dy1 <= ((Paddle1.height / 2) + BallRay))
    {
      BallMovement(Paddle1);
      if (BallVelocity < 4)
        BallVelocity += 0.3;
      LastedTouch *= -1;
    }
    else if (dx2 <= (BallRay + Paddle2.width / 2) && dy2 <= ((Paddle2.height / 2) + BallRay))
    {
      BallMovement(Paddle2);
      BallDirX *= -1;
      if (BallVelocity < 4)
        BallVelocity += 0.3;
      LastedTouch *= -1;
    }
  };

// ------ COLOR ------ ///

function rgba(r, g, b, a) 
{
  return `rgba(${r}, ${g}, ${b}, ${a})`
};

function pausecomp(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
};