
var app = angular.module('CardGame', ['ngMaterial', 'ngSanitize']);

app.filter('stateLabel', function () {
	return function (state) {
		if ((state == undefined || state == null)) {
			return state;
		}
		else if (state === "NEW_HAND") {
			return "Flip";
		}
		else if (state === "DEAL") {
			return "Next Round";
		}
	}
});

// Set card images
app.filter('card', function () {
	const cardImages = {
		2: "FaceCards_2.svg",
		3: "FaceCards_3.svg",
		4: "FaceCards_4.svg",
		5: "FaceCards_5.svg",
		6: "FaceCards_6.svg",
		7: "FaceCards_7.svg",
		8: "FaceCards_8.svg",
		9: "FaceCards_9.svg",
		10: "FaceCards_10.svg",
		11: "FaceCards_Jack.svg",
		12: "FaceCards_Queen.svg",
		13: "FaceCards_King.svg",
		14: "FaceCards_Ace_Blue.svg"
	};

	return function (card) {
		if (card == undefined || card == null || card == "") {
			return '<img src="AD_bcLogo_dark.png" class="card-class" />';
		}
		else {
			return '<img src="' + cardImages[card.value] + '" class="card-class" />';
		}
	}
});

// Application IDs defined in PortalX: App > Design > Core App Info
var appId = "yourAppId"
var appSecret = "yourAppSecret"
var url = "yourServerURL"

var _bc = new BrainCloudWrapper("_mainWrapper");

app.controller('GameCtrl', ['$scope', '$mdDialog', '$mdSidenav', function ($scope, $mdDialog, $mdSidenav) {

	const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
	const suits = ["Diamonds", "Hearts", "Clubs", "Spades"];
	const deck = [];

	const insufficientFundsDialog = document.getElementById("insufficientFundsDialog")
	const addFundsButton = document.getElementById("addFunds")
	const cancelAddFundsButton = document.getElementById("cancel")

	const collectJackpotDialog = document.getElementById("collectJackpotDialog")
	const collectJackpotButton = document.getElementById("collectJackpotButton")

	angular.forEach(suits, function (suit) {
		angular.forEach(cards, function (card) {
			deck.push({ value: card, suit: suit });
		});
	});

	$scope.card1;
	$scope.card2;
	$scope.card3;

	/**
	 * Used to indicate $scope.deal() results
	 * DEFAULT (blue)
	 * WIN (green) - Card 3 is between Cards 1 and 2
	 * LOSS (black) - Card 3 is outside Cards 1 and 2
	 * POST (red) - Card 3 is the same as Card 1 or 2
	 */
	$scope.defaultBorder = '2px solid black'
	$scope.winBorder = '3px solid rgb(50,205,50)'
	$scope.lossBorder = '3px solid rgb(63,81,181)'
	$scope.postBorder = '3px solid red'

	$scope.brainCloudClientVersion = "Failed to initialize. Check App IDs."

	const leaderBoardAround = 5;

	// APP_ID:CHANNEL_TYPE:CHANNEL_ID
	$scope.channelId = appId + ":gl:jackpot"

	$scope.currentJackpot = 0

	$scope.currentWinStreak = 0

	$scope.jackpotDefaultValue = 0

	// TODO
	$scope.quickBet1 = 0
	$scope.quickBet2 = 0
	$scope.quickBet3 = 0
	$scope.quickBet4 = 0
	$scope.quickBetMax = 0

	// Percent of lost money that goes toward the Jackpot
	$scope.jackpotCut = 0

	/**
	 * Refresh the displayed jackpot value.
	 * @param {number} newJackpotAmount 
	 */
	$scope.updateDisplayedJackpot = function (newJackpotAmount) {
		console.log("refreshing jack to: " + newJackpotAmount)

		$scope.$apply(function () {
			$scope.currentJackpot = newJackpotAmount
		});
	}

	/**
	 * Increment the Jackpot if a user loses money, or "RESET" it if the user collects it.
	 * @param {number} amount 
	 */
	$scope.updateJackpot = function (amount) {
		var statistics = {
			"Jackpot": amount
		};

		_bc.globalStatistics.incrementGlobalStats(statistics, result => {
			var newJackpotAmount = result.data.statistics.Jackpot

			// Jackpot should never be zero. When a player collects the jackpot, reset it to a default value (defined in Design > Cloud Data > Global Properties)
			if (newJackpotAmount === 0) {
				$scope.updateJackpot($scope.jackpotDefaultValue)
			}

			// Send updated Jackpot amount through Chat Channel
			var content = {
				jackpotAmount: newJackpotAmount
			}
			var recordInHistory = true;

			_bc.chat.postChatMessage($scope.channelId, content, recordInHistory, result => {
				var status = result.status;
				console.log(status + "Post Chat Message Success : " + JSON.stringify(result, null, 2));
			});
		});
	}

	/**
	 * Increment the Global Stat for the current win streak and then reset the streak counter to zero.
	 * Only the stat of the current streak is incremented: 3 wins in a row increments ONLY "StreakOf3", not "StreakOf1" and "StreakOf2" as well.
	 */
	$scope.resetStreak = function () {
		var streakStat = "StreakOf"
		if ($scope.currentWinStreak < 10) {
			streakStat += "0"
		}
		streakStat += $scope.currentWinStreak

		var statistics = {
			[streakStat]: 1
		};

		_bc.globalStatistics.incrementGlobalStats(statistics, result => {
			var status = result.status;
			console.log(status + " : " + JSON.stringify(result, null, 2));
		});

		$scope.currentWinStreak = 0
	}

	/** Event listeners for Insufficient Funds and Collect Jackpot modals */
	addFundsButton.addEventListener("click", () => {

		// Increase balance by 500
		$scope.freeMoney(500)
		console.log("Increased balance by $500")
		insufficientFundsDialog.close()
	})

	cancelAddFundsButton.addEventListener("click", () => {
		insufficientFundsDialog.close()
	})

	collectJackpotButton.addEventListener("click", () => {
		console.log("adding " + $scope.currentJackpot + " dollars")

		$scope.awardCurrency($scope.currentJackpot)

		$scope.updateJackpot("RESET")

		// Reset win streak and update global stats (track average streak achieved by user)
		$scope.resetStreak()

		// Increment TimesJackpotCollected stat
		var statistics = {
			"TimesJackpotCollected": 1
		};

		_bc.globalStatistics.incrementGlobalStats(statistics, result => {
			var status = result.status;
			console.log("TimesJackpotCollected stat incremented " + status + " : " + JSON.stringify(result, null, 2));
		});

		collectJackpotDialog.close()
	})

	/**
	 * Logout automatically whenever the user refreshes or closes the application.
	 */
	window.addEventListener("beforeunload", (ev) => {

		// When false- the profileId is not cleared on logout. 
		// This allows Reconnect Authentication as there will be a saved profile ID to reference when the user returns.
		var forgetUser = false

		_bc.logoutOnApplicationClose(forgetUser)
	})

	$scope.updateUserBalance = function () {
		var vcId = "bucks"

		_bc.virtualCurrency.getCurrency(vcId, (getCurrencyResponse) => {
			var newBalance = getCurrencyResponse.data.currencyMap.bucks.balance
			$scope.$apply(function () {
				$scope.money = newBalance
			});
		})
	}

	$scope.awardCurrency = function (amountToAward) {
		var scriptName = "AwardCurrency"
		var vcAmount = amountToAward
		var scriptData = {
			"vcAmount": vcAmount
		}

		_bc.script.runScript(scriptName, scriptData, () => {
			$scope.updateUserBalance()
		})
	}

	$scope.consumeCurrency = function (amountToConsume) {
		var scriptName = "ConsumeCurrency"
		var vcAmount = amountToConsume
		var scriptData = {
			"vcAmount": vcAmount
		}

		_bc.script.runScript(scriptName, scriptData, () => {
			$scope.updateUserBalance()
		})

		var jackpotCut = amountToConsume * $scope.jackpotCut
		var houseCut = amountToConsume - jackpotCut

		// User lost money, so Jackpot increases
		$scope.updateJackpot(amountToConsume * $scope.jackpotCut)

		// Increment TotalWinnings stat with for House and Jackpot
		var statistics = {
			"TotalJackpotWinnings": jackpotCut,
			"TotalHouseWinnings": houseCut
		};
		
		_bc.globalStatistics.incrementGlobalStats(statistics, result =>
		{
			var status = result.status;
			console.log("Total Winnings stats incremented for Jackpot and House " + status + " : " + JSON.stringify(result, null, 2));
		});
	}

	/**
	 * Increment the number of wins since last loss (only a "POST" counts as a loss)
	 */
	$scope.updateCurrentWinStreak = function () {
		$scope.currentWinStreak++

		if ($scope.currentWinStreak == $scope.streakToWinJackpot) {
			console.log("YOU WON THE JACKPOT!")

			collectJackpotDialog.showModal()
		}
	}

	/**
	 * RTT Chat callback handler.
	 * @param {*} rttMessage RTT Chat update message
	 */
	var rttCallback = function (rttMessage) {

		// Update Jackpot with value received from Chat message
		if (rttMessage.data.content.jackpotAmount >= 0) {
			var newJackpotAmount = rttMessage.data.content.jackpotAmount
			console.log("Jackpot Amount: " + newJackpotAmount)
			$scope.updateDisplayedJackpot(newJackpotAmount)
		}
		else {
			console.log("not")
		}
	}

	/**
	 * Retrieve and connect to the app's chat channels (created in Design > Messaging > Chat Channels).
	 */
	$scope.connectToGlobalChannels = function () {
		var maxReturn = 0

		_bc.chat.channelConnect($scope.channelId, maxReturn, channelConnectResponse => {
			var status = channelConnectResponse.status

			if (status === 200) {
				console.log("Connected to Jackpot Updates channel")
			}
			else {

				// TODO:  what do we do if we fail to connect to one of the channels?
				console.log("Failed to connect to " + channel.name + " channel (ID: " + $scope.channelId + ")")
			}
		})
	}

	$scope.onRTTEnabled = function () {
		console.log("RTT Connected!")

		// Connect to default channels
		$scope.connectToGlobalChannels();
	}

	$scope.enableRTT = function () {

		// Register a callback for RTT Chat Channel updates
		_bc.rttService.registerRTTChatCallback(rttCallback);

		// Real-time Tech (RTT) must be checked on the dashboard, under Design | Core App Info | Advanced Settings.
		_bc.rttService.enableRTT(enableRTTSuccess => {
			console.log("enableRTT Response: " + JSON.stringify(enableRTTSuccess));
			$scope.onRTTEnabled()
		}, error => {
			console.log("enableRTT Error: " + JSON.stringify(error));
		});
	}

	var loginCallback = function (result) {
		$scope.loggingIn = false;

		console.log("authenticationCallback");
		console.log(JSON.stringify(result));

		if (result.status === 200) {

			// Sync the user's balance
			try {
				$scope.money = result.data.currency.bucks.balance;
			} catch (e) {
				$scope.money = 0;
			}

			$scope.userId = result.data.id;

			// Read info from existing/returning user
			if (result.data && result.data.newUser === "false") {

				// Display user's playerName or prompt them to add one
				if (result.data.playerName === null || result.data.playerName === 'undefined' || result.data.playerName === "") {

					// Update user's player name with their Universal ID
					_bc.playerState.updateUserName($scope.universalId, function (result) {
						console.log(true, "updateUserName");
						console.log(result);
						$scope.username = $scope.universalId
					}
					)

				}
				else {
					$scope.username = result.data.playerName

					// Hide login section and display the gameplay
					$scope.$apply(function () {
						$scope.showLogin = false;
						$scope.showGame = true;
					});
				}

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

				// Hide login section and display the gameplay
				$scope.$apply(function () {
					$scope.showLogin = false;
					$scope.showGame = true;
				});
			}

			// Setup new user
			else {
				
				// Update user's player name with their universal ID
				_bc.playerState.updateUserName($scope.universalId, function (result) {
					console.log(true, "updateUserName");
					console.log(result);
					$scope.username = $scope.universalId
				}
				)

				// Give the user bonus money to start
				$scope.awardCurrency(100)


				// Hide login section and display the user name config
				$scope.$apply(function () {
					$scope.showLogin = false;
					$scope.showGame = true;
				});

			}

			// Read Global Properties to setup game
			_bc.globalApp.readProperties(readPropertiesResponse => {
				
				console.log("Read Properties Response: " + JSON.stringify(readPropertiesResponse))
				// Read number of wins in a row required to collect Jackpot
				if (readPropertiesResponse.data.StreakToWinJackpot) {
					var streakToWinJackpot = readPropertiesResponse.data.StreakToWinJackpot.value

					$scope.$apply(function () {
						$scope.streakToWinJackpot = streakToWinJackpot
					});
				}

				// Read default starting value of Jackpot (also the value it will reset to upon collection)
				if (readPropertiesResponse.data.JackpotDefaultValue) {
					var jackpotDefaultValue = readPropertiesResponse.data.JackpotDefaultValue.value

					$scope.jackpotDefaultValue = jackpotDefaultValue
				}

				// Read values for Quick Bet buttons

				// TODO
				$scope.quickBet1 = readPropertiesResponse.data.QuickBet1.value
				$scope.quickBet2 = readPropertiesResponse.data.QuickBet2.value
				$scope.quickBet3 = readPropertiesResponse.data.QuickBet3.value
				$scope.quickBet4 = readPropertiesResponse.data.QuickBet4.value
				$scope.quickBetMax = readPropertiesResponse.data.QuickBetMax.value

				$scope.bet = $scope.quickBet1

				// Read Jackpot Cut (the amount of money lost that goes to the Jackpot)
				$scope.jackpotCut = readPropertiesResponse.data.JackpotCut.value

			});

			// Read Global Statistics to get current Jackpot amount
			_bc.globalStatistics.readAllGlobalStats(readAllGlobalStatsResponse => {
				if (readAllGlobalStatsResponse.data.statistics.Jackpot < $scope.jackpotDefaultValue) {
					$scope.updateJackpot($scope.jackpotDefaultValue)
				}
				else {
					var currentJackpot = readAllGlobalStatsResponse.data.statistics.Jackpot
					$scope.updateDisplayedJackpot(currentJackpot)
				}
			});

			// Upon login, enable RTT to connect to Chat Channel to listen for Jackpot updates
			$scope.enableRTT()
		}

		else {
			$scope.initializeGame()

			$scope.showLogin = true;
			$scope.showGame = false;
			$scope.showLeaderboard = false;

			$mdDialog.show(
				$mdDialog.alert()
					.content('Authentication Error')
					.ok('Okay')
			);
		}
	}

	$scope.dispatchButtonPress = function () {
		if ($scope.state === "NEW_HAND") {

			// Prompt the user to add more funds if they don't have enough money to play
			if ($scope.bet > $scope.money) {
				insufficientFundsDialog.showModal()
			}
			else {
				$scope.state = "DEAL";
				$scope.deal();
			}
		}
		else if ($scope.state === "DEAL") {
			$scope.state = "NEW_HAND";
			$scope.newHand();
		}
	};

	/**
	 * Set card borders back to default (i.e. remove hand result indicators)
	 */
	$scope.resetCardBorders = function () {
		$scope.card1Border = $scope.defaultBorder
		$scope.card2Border = $scope.defaultBorder
		$scope.card3Border = $scope.defaultBorder
	}

	/**
	 * Resets game (cards, stats, etc.).
	 */
	$scope.initializeGame = function () {
		if (!_bc.brainCloudClient.isInitialized()) {

			// change this url if you want to point to another brainCloud server
			_bc.brainCloudClient.setServerUrl(url);

			// we initialize the brainCloud client library here with our game id, secret, and game version
			_bc.initialize(appId, appSecret, "1.0.0");
			console.log("Initialized brainCloud Client: " + _bc.brainCloudClient.version)
			$scope.brainCloudClientVersion = _bc.brainCloudClient.version
			if (url.includes("internal")) {
				$scope.brainCloudClientVersion += " - dev"
			}
			else {
				$scope.brainCloudClientVersion += " - prod"
			}

			// to spit json requests/responses to the console
			_bc.brainCloudClient.enableLogging(true);
		}

		$scope.title = "Acey Deucey";

		$scope.userId = null
		$scope.username = null
		$scope.universalId = null

		$scope.cards = [];

		$scope.resetCardBorders()

		$scope.bet = 0;
		$scope.gamesLost = 0;
		$scope.gamesWon = 0;
		$scope.dollarsWon = 0;

		$scope.gameResults = [];
		$scope.refills = 0;

		$scope.leaderboard = [];

		$scope.leaderboardRank = 0;

		$scope.leaderboardPageOffset = 0;

		$scope.disablePrev = false;
		$scope.disableNext = false;

		$scope.state = "DEAL";

		$scope.currentWinStreak = 0

		// Amount to be won when Jackpot is collected. *Hopefully* real-time- dependant on how polling is implemented
		$scope.currentJackpot = 0

		// Percent of bet that goes to the Jackpot. Both "POST" and "LOSS" contribute to this, but only "POST" counts as a loss for the Win Streak.
		$scope.jackpotCut = 0

		// Number of wins in a row required to collect the Jackpot. Both "POST" and "WIN" contribute to the streak.
		$scope.streakToWinJackpot = 0

		$scope.dispatchButtonPress()
	}

	/**
	 * Resets game (cards, stats, etc.) and displays login menu.
	 */
	$scope.goToLoginMenu = function () {
		$scope.initializeGame()

		$scope.showLogin = true;
		$scope.showGame = false;
		$scope.showLeaderboard = false;
	}

	/**
	 * Checks for saved Profile/Anonymous IDs.
	 */
	$scope.reconnectUser = function () {
		console.log("Looking for saved IDs to see if Reconnect Authentication is possible . . .")

		if (_bc.canReconnect()) {
			console.log("Profile and Anonymous IDs found. Attempting Reconnect Authentication . . .")
			_bc.reconnect(loginCallback)
		}
		else {
			console.log("Profile and/or Anonymous IDs were not found. Going to login screen . . .")
			$scope.goToLoginMenu()
		}
	}

	$scope.randomCard = function () {
		var position = Math.floor(Math.random() * $scope.cards.length);
		var card = $scope.cards.splice(position, 1)[0];
		return card;
	};

	$scope.newHand = function () {

		// Reset card borders
		$scope.resetCardBorders()

		if ($scope.money === 0) {
			insufficientFundsDialog.showModal()
		}

		// Draw cards until there is a gap of at least 1 between them
		do {
			angular.copy(deck, $scope.cards);

			var t1 = $scope.randomCard();
			var t2 = $scope.randomCard();

		} while ((t1.value === t2.value) || (Math.abs(t1.value - t2.value) === 1));

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

		// Win - In between the cards
		if ($scope.card3.value > $scope.card1.value && $scope.card3.value < $scope.card2.value) {
			$scope.gameStatusMsg = "$" + $scope.bet * 1.5;

			// Set card border / result indicator
			$scope.card3Border = $scope.winBorder

			$scope.gamesWon++;
			$scope.dollarsWon += $scope.bet;
			incrementData["Wins"] = 1;
			incrementData["DollarsWon"] = $scope.bet;

			$scope.gameResults.push(true);

			$scope.awardCurrency($scope.bet * 1.5)

			$scope.updateCurrentWinStreak()
		}
		// Loss - Same as high or low card (i.e. "post")
		else if ($scope.card3.value === $scope.card1.value || $scope.card3.value === $scope.card2.value) {
			$scope.gameStatusMsg = "$0";

			// Set card borders / result indicators
			$scope.card3Border = $scope.postBorder
			if ($scope.card1.value === $scope.card3.value) {
				$scope.card1Border = $scope.postBorder
			}
			else {
				$scope.card2Border = $scope.postBorder
			}

			$scope.gamesLost++;

			incrementData["Posts"] = 1;
			incrementData["Losses"] = 1;

			$scope.gameResults.push(false);

			$scope.consumeCurrency($scope.bet)

			// Reset win streak and update global stats (track average streak achieved by user)
			$scope.resetStreak()
		}
		// Loss - Outside the cards
		else {
			$scope.gameStatusMsg = "$" + $scope.bet * 0.5;

			// Set card border / result indicator
			$scope.card3Border = $scope.lossBorder

			$scope.gamesWon++;
			$scope.dollarsWon += $scope.bet * 0.5;
			incrementData["Wins"] = 1;
			incrementData["DollarsWon"] = $scope.bet * 0.5;

			$scope.gameResults.push(false);

			$scope.consumeCurrency($scope.bet * 0.5)

			$scope.updateCurrentWinStreak()
		}

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

	$scope.onLogin = function () {
		console.log("onLogin")
		// Prevent multiple simultanious logins, or Mobile Safari's busted form validation
		if ($scope.loggingIn || $scope.loginForm.$invalid) {
			return;
		}

		$scope.loggingIn = true;

		console.log("UniversalId: " + $scope.universalId)

		_bc.authenticateUniversal(
			$scope.universalId,
			$scope.password,
			true,
			loginCallback
		);
	};

	$scope.freeMoney = function (amount) {

		var incrementData = { Refills: 1 };

		$scope.refills++;
		_bc.playerStatistics.incrementUserStats(
			incrementData,
			function (result) { console.log(true, "updatePlayerStatistics"); console.log(result.status, 200, "Expecting 200"); },
			0
		);

		$scope.awardCurrency(amount)

		$scope.updateUserBalance()

	};

	$scope.showHelp = function () {
		$mdDialog.show(
			$mdDialog.alert()
				.title('Acey Duecey Rules')
				.content("Two cards are shown. The player chooses a bet value and then flips the third card. If the third card is between the first two, the player wins 1.5x their bet. If it is outside, the player wins half their bet. But if the third card matches either the first or second card, the bet is lost. The game also has a Jackpot. While in a session, each time the player wins their Current Streak increases. But each time the player loses their bet, their Current Streak is reset to zero. If the player reaches the Streak goal, the Jackpot is won.")
				.ok('Close')
		);

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

	/**
	 * Listener for custom bet button click. Set the bet for the next hand.
	 * @param {number} customBet The bet amount.
	 */
	$scope.customBetClick = function (customBet) {
		$scope.bet = customBet
	}

	/**
	 * Checks the current state- the user can only bet at the start of a new hand.
	 * @returns True if a new hand is ready and the user can place a bet.
	 */
	$scope.canBet = function () {
		if ($scope.state === "DEAL") {
			return true
		}

		return false
	}

	/**
	 * Logs user out of brainCloud and returns to login screen.
	 */
	$scope.logout = function () {

		// When true- the profileId is cleared on logout. 
		// This prevents Reconnect Authentication as there will be no saved profile ID to reference.
		var forgetUser = true

		$mdSidenav('left').close();

		_bc.logout(forgetUser, response => {
			$scope.goToLoginMenu()
			console.log("Logout Response: " + response)
		})
	}

	$scope.initializeGame()
	//$scope.goToLoginMenu()
	$scope.reconnectUser()

}]);
