const rcode = `# a remake of the sample function that prevents sample(x)=sample(1:x) when length(x)=1
mysample <- function(x){
  if (length(x)>1){
    return(sample(x))
  }
  else{
    return(x)
  }
}
# Mass hysteria simulation function:
# Input: vector of initial stats of minions and which side of the board they are on: 
# 0 = your side, 1 = opponent's side
# i.e. (attack1, health1, side1, attack2, health2, side 2,...)
# Output: matrix of stats of minions after mass hysteria has been cast
mass.hysteria <- function(stats){
  n <- length(stats)/3
  stats <- matrix(stats, ncol = 3, byrow = TRUE)
  order <- mysample(1:n) # randomise order of attackers
  # for each minion
  for (i in 1:n){
    # choose an attacker
    attacker <- order[i]
    # if attacker is alive
    if (stats[attacker, 2] > 0){
      # create a list of possible attackees
      attackee <- mysample(((1:n)[! 1:n %in% attacker])) # they can't be the attacker
      attackee <- attackee[stats[attackee, 2] > 0] # and they must be alive
      if (length(attackee) > 0){ # if there are minions to attack
        # choose one
        attackee <- attackee[1]
        # and then attack it
        stats[attacker, 2] <- stats[attacker, 2] - stats[attackee, 1]
        stats[attackee, 2] <- stats[attackee, 2] - stats[attacker, 1]
      }
    }
  }
  colnames(stats) <- c("Attack", "Health", "Side of board")
  return(stats)
}
# Multiple trials of mass hysteria
# Input: minions' initial stats & posistion and number of trials
# Output: mean stats left on board and proportion of trials in which every 
# minion dies (a full board clear)
test.mass.hysteria <- function(stats, trials){
  n <- length(stats)/3
  if (n %% 1 != 0){
    return("Invalid minion stats.")}
  else{
  stats.matrix <- matrix(stats, ncol = 3, byrow = TRUE)
  n.enemies <- length(stats.matrix[,3][stats.matrix[,3] == 1])
  survival <- rep(0, n)
  # Create 3D array to house the trials
  sim.stats <- array(0, dim = c(n, 3, trials))
  cleared <- rep(0, trials)
  # for each trial
  for (trial in 1:trials){
    # do the trial and put it in the array
    sim.stats[,3,trial] <- stats.matrix[,3]
    sim.stats[,,trial] <- mass.hysteria(stats)
    survival <- survival + (sim.stats[,,trial][,2] > 0)
    # see whether or not the trial resulted in a full clear of enemy board
    cleared[trial] <- identical(sim.stats[,2,trial][stats.matrix[,3]==1] <= 0, rep(TRUE, n.enemies))
  }
  # output results
  out <- cbind(apply(sim.stats, c(1,2), mean), survival/trials, stats.matrix[,2])[,c(1,5,2,4,3)]
  Exp.damage <- sum(out[out[,5]==1,][,1]*out[out[,5]==1,][,4])
  colnames(out) <- c("Attack:", "Health before:", "Mean health after:", "Chance of survival:", "Enemy?")
  cleared.rate <- mean(cleared)
  print(list("Minion stats" = out, "Chance of full enemy board clear" = cleared.rate,
  "Expectation of remaining enemy damage" = Exp.damage))
  }
}

test.mass.hysteria(stats = c(3,4,1, 4,1,1, 6,9,1, 2,1,0), trials = 10000)`

export default arr => {
  const txt = document.createElement('textarea')
  txt.id = 'forsen1'
  txt.innerHTML = rcode
  txt.style.display = 'none'
  document.getElementsByTagName('body')[0].appendChild(txt)
  ocpu.seturl('https://public.opencpu.org/ocpu/library/base/R')
  $('#submitbutton').on('click', function() {
    //arguments
    var mysnippet = new ocpu.Snippet($('#forsen1').val())
    //disable button
    $('button').attr('disabled', 'disabled')

    //perform the request
    var req = ocpu.call(
      'identity',
      {
        x: mysnippet
      },
      function(session) {
        session.getConsole(function(outtxt) {
          console.clear()
          console.log(outtxt)
          let lines = outtxt.split('\n')
          lines = lines.splice(lines.indexOf('$`Minion stats`'), lines.length - 1)
          console.log(lines[2].split(' ').filter(_ => _ !== ''))
        })
      }
    )

    //if R returns an error, alert the error message
    req.fail(function() {
      alert('Server error: ' + req.responseText)
    })

    req.always(function() {
      $('button').removeAttr('disabled')
    })
  })
}
