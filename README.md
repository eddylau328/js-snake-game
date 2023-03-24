# js-snake-game

## Aim

- To build a functional classic game 'Snake'

## Rules

- provide GUI for the game
- setup position records for the Snake (head and body)
- setup position record for the Apple (target for the snake)
- update snake positions in a loop
- provide control inputs to move the snake
- check whether the Snake head hit the boundary or not
- check whether the Snake head hit its body or not
- check whether the Snake head hit the Apple or not
- provide restart function

## Tricky Handles

- lock the last input direction before each iteration
  - as the direction should stay the same for all checking and updates
- allow reverse when only snake head
- game over checking should be predicting the next steps of the head
  - as it can prevent the snake head run over the screen
  - which cause different array index exceed its length issues
