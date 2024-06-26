var app = angular.module('CardGame', ['ngMaterial', 'ngSanitize']);

app.filter('stateLabel', function () {
	return function (state) {
		if ((state == undefined || state == null)) {
			return state;
		} else if (state === "NEW_HAND") {
			return "Flip";
		} else if (state === "DEAL") {
			return "Next Round";
		}
	}
});

app.filter('card', function () {
	const faces = {
		11: "FaceCards_Jack.svg",
		12: "FaceCards_Queen.svg",
		13: "FaceCards_King.svg",
		14: "A",
	};

	return function (card) {
		if (card == undefined || card == null || card == "") {
			return '<img src="AD_bcLogo.png" class="card-class" />';
		} else {
			var str = "";

			if (card.value > 10 && card.value < 14) {

				return '<img src="' + faces[card.value] + '" class="card-class" />';

			} else if (card.value === 14) {
				str += faces[card.value]
			} else {
				str += card.value;
			}

			return '<h2 class="number">' + str + '</h2>';
		}
	}
});


var _bc = new BrainCloudWrapper("_mainWrapper");

app.controller('GameCtrl', ['$scope', '$mdDialog', '$mdSidenav', function ($scope, $mdDialog, $mdSidenav) {

	const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
	const suits = ["Diamonds", "Hearts", "Clubs", "Spades"];
	const deck = [];

	angular.forEach(suits, function (suit) {
		angular.forEach(cards, function (card) {
			deck.push({ value: card, suit: suit });
		});
	});

	$scope.title = "Acey Deucey";

	$scope.userId = null;

	$scope.showLogin = true;
	$scope.showGame = false;
	$scope.showLeaderboard = false;

	$scope.cards = [];
	$scope.card1;
	$scope.card2;
	$scope.card3;

	$scope.money = 0;
	$scope.bet = 1;
	$scope.gamesLost = 0;
	$scope.gamesWon = 0;
	$scope.dollarsWon = 0;

	$scope.gameResults = [];
	$scope.longestStreak = 0;
	$scope.refills = 0;

	$scope.leaderboard = [];

	$scope.leaderboardRank = 0;

	$scope.leaderboardPageOffset = 0;

	const leaderBoardAround = 5;

	$scope.disablePrev = false;
	$scope.disableNext = false;

	$scope.state = "DEAL";

	$scope.message = "You're a Winner!";

	// we initialize the brainCloud client library here with our game id, secret, and game version
	_bc.initialize("10129", "b983ec3d-208d-4ea3-be89-27e5acc7a3c0", "1.0.0");

	// to spit json requests/responses to the console
	//_bc.enableLogging(true);

	// change this url if you want to point to another brainCloud server
	// brainCloudManager.setDispatcherURL("https://api.braincloudservers.com/dispatcher");

	$scope.dispatchButtonPress = function () {
		if ($scope.state === "NEW_HAND") {
			$scope.state = "DEAL";
			$scope.deal();
		} else if ($scope.state === "DEAL") {
			$scope.state = "NEW_HAND";
			$scope.newHand();
		}
	};

	$scope.randomCard = function () {
		var position = Math.floor(Math.random() * $scope.cards.length);
		var card = $scope.cards.splice(position, 1)[0];
		return card;
	};

	$scope.newHand = function () {

		// Draw cards until they have different values
		do {
			angular.copy(deck, $scope.cards);

			var t1 = $scope.randomCard();
			var t2 = $scope.randomCard();

		} while (t1.value === t2.value);

		// Determine which one is low and which is high
		var sorted = [t1, t2].sort(function compareNumbers(a, b) {
			return a.value - b.value;
		});

		$scope.card1 = sorted[0];
		$scope.card2 = sorted[1];

		$scope.card3 = "";
		$scope.gameStatusMsg = "";
	};

	$scope.deal = function () {
		$scope.card3 = $scope.randomCard();

		var incrementData = {};

		// In between
		if ($scope.card3.value > $scope.card1.value && $scope.card3.value < $scope.card2.value) {
			$scope.gameStatusMsg = $scope.message + " You Won $" + $scope.bet;
			$scope.gamesWon++;
			$scope.dollarsWon += $scope.bet;
			incrementData["Wins"] = 1;
			incrementData["DollarsWon"] = $scope.bet;

			$scope.gameResults.push(true);

			_bc.product.awardCurrency(
				"bucks",
				$scope.bet,
				function (result) {
					$scope.$apply(function () {
						$scope.money = result.data.currencyMap.bucks.balance;
					});
				}
			);


			// Same as high or low card
		} else if ($scope.card3.value === $scope.card1.value || $scope.card3.value === $scope.card2.value) {
			$scope.gameStatusMsg = "You Posted. You lose $" + $scope.bet * 2;
			$scope.gamesLost++;

			incrementData["Posts"] = 1;
			incrementData["Losses"] = 1;

			$scope.gameResults.push(false);

			_bc.product.consumeCurrency(
				"bucks",
				$scope.bet * 2,
				function (result) {
					$scope.$apply(function () {
						$scope.money = result.data.currencyMap.bucks.balance;
					});
				}
			);


			// Outside the middle
		} else {
			$scope.gameStatusMsg = "You Lost $" + $scope.bet;
			$scope.gamesLost++;

			incrementData["Losses"] = 1;

			$scope.gameResults.push(false);

			_bc.product.consumeCurrency(
				"bucks",
				$scope.bet,
				function (result) {
					$scope.$apply(function () {
						$scope.money = result.data.currencyMap.bucks.balance;
					});
				}
			);

		}

		// Calculate the longest winning streak for current session
		var longestStreak = 0;
		var counter = 0;
		angular.forEach($scope.gameResults, function (gameResult) {
			if (gameResult === false) {
				if (counter > longestStreak) {
					longestStreak = counter;
				}
				counter = 0;
			}
			else {
				counter++;
			}
		});

		// And update the streak stat if it's larger
		if (longestStreak > $scope.longestStreak) {
			incrementData["WinsInARow"] = longestStreak - $scope.longestStreak;
			$scope.longestStreak = longestStreak;
		}

		_bc.playerStatistics.incrementPlayerStats(
			incrementData,
			function (result) { console.log(true, "updatePlayerStatistics"); console.log(result.status, 200, "Expecting 200"); },
			0
		);

		_bc.globalStatistics.incrementGlobalStats(
			{ GamesPlayed: 1 },
			function (result) { console.log(true, "incrementGlobalGameStatistics"); console.log(result.status, 200, "Expecting 200"); },
			0
		);

		_bc.socialLeaderboard.postScoreToLeaderboard(
			"AceyDeucyPlayers",
			($scope.dollarsWon * 1000) - $scope.refills,
			{ "DollarsWon": $scope.dollarsWon, "Refills": $scope.refills },
			function (result) { console.log(true, "postScoreCallback"); console.log(result.status, 200, "Expecting 200"); }
		);


	};

	$scope.login = function () {
		// Prevent multiple simultanious logins, or Mobile Safari's busted form validation
		if ($scope.loggingIn || $scope.loginForm.$invalid) {
			return;
		}

		$scope.loggingIn = true;

		var loginCallback = function (result) {
			$scope.loggingIn = false;

			console.log("authenticationCallback");
			console.log(result);

			if (result.status === 200) {
				try {
					$scope.money = result.data.rewards.currency.bucks.balance;
				} catch (e) {
					$scope.money = 0;
				}

				$scope.userId = result.data.id;

				if (result.data && result.data.newUser === "false") {
					_bc.playerStatistics.readAllUserStats(
						function (result) {
							console.log(true, "readPlayerStatisticsCallback");
							console.log(result);

							$scope.$apply(function () {
								if (result.data && result.data.statistics) {
									$scope.gamesWon = result.data.statistics.Wins;
									$scope.gamesLost = result.data.statistics.Losses;
									$scope.refills = result.data.statistics.Refills;
									$scope.dollarsWon = result.data.statistics.DollarsWon;
								}
							});

						}
					);

					_bc.entity.getEntitiesByType(
						'congratsMessage',
						function (result) {
							console.log(true, "readEntityByType");
							console.log(result);

							if (result.data && result.data.entities && result.data.entities.length > 0) {
								$scope.$apply(function () {
									if (result.data.entities[0].data['msg']) {
										$scope.message = result.data.entities[0].data['msg'];
									}
								});
							}
						}
					);


					// Hide login section and display the gameplay
					$scope.$apply(function () {
						$scope.showLogin = false;
						$scope.showGame = true;
					});

				} else {

					_bc.product.awardCurrency(
						"bucks",
						100,
						function (result) {
							$scope.$apply(function () {
								$scope.money = result.data.currencyMap.bucks.balance;
							});
						}
					);


					// Hide login section and display the user name config
					$scope.$apply(function () {
						$scope.showLogin = false;
						$scope.showUsername = true;
					});

				}

			} else {
				$mdDialog.show(
					$mdDialog.alert()
						.content('The password you entered was incorrect')
						.ok('Okay')
				);
			}
		}

		_bc.authenticateEmailPassword(
			$scope.email,
			$scope.password,
			true,
			loginCallback
		);
	};

	$scope.setUsername = function () {

		_bc.playerState.updatePlayerName($scope.username, function (result) {
			console.log(true, "updatePlayerName");
			console.log(result);

		}
		);

		_bc.entity.createEntity(
			"congratsMessage", { "msg": $scope.message }, null,
			function (result) {
				console.log(true, "readEntityByType");
				console.log(result);

				$scope.$apply(function () {
					$scope.showUsername = false;
					$scope.showGame = true;
				});

			},
			0
		);
	};

	$scope.freeMoney = function () {

		var incrementData = { Refills: 1 };

		$scope.refills++;
		_bc.playerStatistics.incrementUserStats(
			incrementData,
			function (result) { console.log(true, "updatePlayerStatistics"); console.log(result.status, 200, "Expecting 200"); },
			0
		);

		_bc.product.awardCurrency(
			"bucks",
			100,
			function (result) {
				$scope.$apply(function () {
					$scope.money = result.data.currencyMap.bucks.balance;
				});
			}
		);

	};

	$scope.showHelp = function () {
		$mdDialog.show(
			$mdDialog.alert()
				.title('Acey Duecey Rules')
				.content('Two cards are shown to the player. They are then able to bet on whether or not the third card will be between the two. If it is, they win their bet. If it is equal to either of the cards, they lose double their bet.')
				.ok('Close')
		);

	};



	$scope.resetPassword = function () {
		_bc.brainCloudClient.authentication.resetEmailPassword(
			$scope.email,
			function (result) {
				console.log(result);

				$mdDialog.show(
					$mdDialog.alert()
						.content("E-mail sent")
						.ok('Ok')
				);

			}
		);


		$scope.showForgotPassword = false;
		$scope.showLogin = true;

	};


	$scope.showLeaderboards = function () {
		$scope.showGame = false;

		_bc.socialLeaderboard.getGlobalLeaderboardView(
			"AceyDeucyPlayers",
			_bc.socialLeaderboard.sortOrder.HIGH_TO_LOW,
			leaderBoardAround - 1,
			leaderBoardAround,
			function (result) {

				$scope.$apply(function () {
					angular.copy(result.data.leaderboard, $scope.leaderboard);

					angular.forEach($scope.leaderboard, function (l) {
						if (l.playerId === $scope.userId) {
							$scope.leaderboardRank = l.rank;
						}
					});

					$scope.showLeaderboard = true;
					$scope.title = "Leaderboards";

					$mdSidenav('left').close();

				});

			});

	};

	$scope.pageLeaderboard = function (direction) {

		$scope.leaderboardPageOffset += direction;

		var start = ($scope.leaderboardRank - 4 > 0 ? $scope.leaderboardRank - 4 : 0) + ($scope.leaderboardPageOffset * (leaderBoardAround * 2));

		if (start <= 0) {
			start = 0;
			$scope.disablePrev = true;
		} else {
			$scope.disablePrev = false;

		}
		var end = start + (2 * leaderBoardAround) - 1;
		_bc.socialLeaderboard.getGlobalLeaderboardPage(
			"AceyDeucyPlayers",
			_bc.socialLeaderboard.sortOrder.HIGH_TO_LOW,
			start,
			end,
			function (result) {

				$scope.$apply(function () {
					angular.copy(result.data.leaderboard, $scope.leaderboard);

					// if(result.data.social_leaderboard.length < (end - start) ){
					//     $scope.disableNext = true;
					// } else {
					//     $scope.disableNext = false;
					// }

					if (result.data.moreAfter) {
						$scope.disableNext = false;
					} else {
						$scope.disableNext = true;

					}

				});

			});
	};

	$scope.showGameAgain = function () {
		$scope.showLeaderboard = false;
		$scope.showGame = true;
		$scope.title = "Acey Deucey";

		$mdSidenav('left').close();
	};

	$scope.toggleLeftSideMenu = function () {
		$mdSidenav('left').toggle()
			.then(function () {
				console.debug("toggle left is done");
			});
	};

	// Initialize game
	$scope.dispatchButtonPress();
}]);
