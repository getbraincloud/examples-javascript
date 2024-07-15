# Acey Deucey

Acey Deucey is a casino-style game in which players bet on whether a drawn card will be between two others. In general, the greater the gap between the two cards, the higher a bet should be. 

There are three outcomes when the third card is flipped:
<ol>
  <li>The card is between the other two. Win 1.5x bet.</li>
  <li>The card is outside the other two. Win 0.5x bet.</li>
  <li>The card matches one of the other two. Lose bet.</li>
</ol>

Unless the third card is between the other two (option 1) a portion of the money that is lost will contribute to the jackpot.

## Jackpot
A notable feature of this demo is the jackpot system. The jackpot is held by a Global Statistic, meaning that all users across the app can contribute to it (and collect it if they're lucky). It also uses brainCloud's RTT and Chat services so that its value will update in real time if there are multiple users playing at the same time.

To learn how to implement a similar jackpot system, check out this article: https://help.getbraincloud.com/en/articles/9611830-how-to-implement-a-global-jackpot

## Other Features
In addition to Global Statistics, RTT, and Chat, Acey Deucey demonstrates:
<ul>
  <li>How to authenticate, logout, and reconnect using Universal/Reconnect Authentication</li>
  <li>How to increment Player Statistics</li>
  <li>How to make Virtual Currency calls via Cloud Code</li>
  <li>How to update Global Leaderboards</li>
</ul>
