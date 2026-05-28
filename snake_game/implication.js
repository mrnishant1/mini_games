//game is world and contains canvas
const game = new Scene(canvas, context);

//snake is Linked List consHeads nodes named as "Game_Objects"
const snake_body = new snake();
//appendLL is function to append node in LinkedList
snake_body.appendLL(game,0,0);

//setGameObject -- helps to push snake part to snake_body[] in game world 
//help in render game_Objects in world 
game.setGameObject(snake_body);

//Keypress for direction
window.addEventListener("keydown", (e) => {
  if(e.code!="ArrowLeft"&&e.code!="ArrowRight"&&e.code!="ArrowUp"&&e.code!="ArrowDown") {console.log(e.code); return}
  game.direction=e.code;
});

//to animate continuous
function animate() {
  game.renderAnimation(snake_body.Head);
  // requestAnimationFrame(animate);
}

setInterval(() => {
  animate()
}, 300);

document.getElementById("restart-btn")?.addEventListener("click", () => {
  location.reload();
});

// requestAnimationFrame(animate);
