export default function pong(id:any)
{
  const canvas = id;
  const ctx = canvas.getContext('2d');

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

  let BallDirX = 4;
  let BallDirY = Math.random() / 20;
  let BallVelocity = 1;

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

  const keysState: { [key: string]: boolean } = {};

  window.addEventListener('keydown', (event: KeyboardEvent) =>
  {
      keysState[event.key] = true;
  });

  window.addEventListener('keyup', (event) => 
  {
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
      if (TimeInM <= 0 && TimeInS <= 0)
        ResetAll();
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

  function Goal(LastedTouch: Number)
  {
    if (LastedTouch === 1)
      PlayerScore1 += 1;
    else
      PlayerScore2 += 1;
    ResetBallStats();
  };

  // PADDLE //

  function MovePaddle()
  {
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

    if (keysState["ArrowUp"])
    {
      if (Paddle2.y - Paddle2Speed > 0)
        Paddle2.y -= Paddle2Speed;
    }
    else if (keysState["ArrowDown"])
    {
      if (Paddle2.y + Paddle2Speed < PongHeight - Paddle2.height)
        Paddle2.y += Paddle2Speed;
    }
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

  function DrawScore(Score1: number, Score2: number)
  {
    ctx.fillStyle = ScoreColor;
    ctx.font = "bold 70px Poppins";
    ctx.textAlign = "center";
    ctx.fillText(Score1, PongWidth / 4, PongHeight / 4);
    ctx.fillText(Score2, PongWidth - (PongWidth / 4), PongHeight / 4);
  };

  function DrawTimer(Min: number, Sec: number)
  {
    ctx.fillStyle = ScoreColor;
    ctx.font = "bold 70px Poppins";
    ctx.textAlign = "center";
    if (TimeInS < 10)
      ctx.fillText(TimeInM + ':' + TimeInS + 0, (PongWidth / 2), PongHeight - (PongHeight / 20) + 5);
    else
      ctx.fillText(TimeInM + ':' + TimeInS, (PongWidth / 2), PongHeight - (PongHeight / 20) + 5);
    setInterval(() => {

        TimeInS -= 1;
        if (TimeInS < 0)
        {
          TimeInS = 59;
          TimeInM -= 1;
        }
        return ;
    }, 1000);
  };

  // BALL //

  function DrawPongBall()
  {
      ctx.strokeStyle = BallStroke;
      ctx.fillStyle = BallColor;
      ctx.lineWidth = 1

      ctx.beginPath();
      ctx.arc(BallX, BallY, BallRay, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
  };

  function ResetBallStats()
  {
      LastedTouch *= -1;
      BallRay = 10;
      BallVelocity = 1;
      BallX = PongWidth / 2;
      BallY = PongHeight / 2;
      BallDirX = (4 * LastedTouch);
  };

  // PHYSICS //

  function BallPhysics()
  {
    WallColision();
    GoalColision();
    PaddleColision(Paddle1);
    PaddleColision(Paddle2);

    BallX += BallDirX;
    BallY += BallDirY;
  };

  function GoalColision()
  {
    if (BallX + BallRay >= PongWidth || BallX - BallRay <= 0)
      Goal(LastedTouch);
  };

  function WallColision()
  {
    if (BallY + BallRay >= PongHeight)
      BallY *= -1;
  };

  function PaddleColision(Paddle: any)
  {
    let dx = Math.abs(BallX - Paddle.x - Paddle.width / 2);
    let dy = Math.abs(BallY - Paddle.y - Paddle.height / 2);

    if (dx <= (BallRay + Paddle.width / 2) && dy <= ((Paddle.height / 2) + BallRay))
    {
      BallDirX *= -1;
      BallVelocity += 0.05;
      LastedTouch *= -1;
      return ;
    }
  };

}

// DRAW //

// COLOR //

function rgba(r: number, g: number, b: number, a: number) 
{
  return `rgba(${r}, ${g}, ${b}, ${a})`
};