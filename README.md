# 🌙 Your Celestial Guardian, Selene! 🌙
Selene is a discord bot that I have created to use for my personal server, to enhance my members' experience and make my server a haven for friendships to blossom.
<br /><br />

# 💫 Selene's Features 💫
- Selene sends an embed to a specific channel for any user that comes online through a social media platform. *`src/Events.js; lines 33-51`*
- Selene automatically applies and removes roles based off user reactions from a specific channel. *`src/Events.js; OnMessageReactionAdd / OnMessageReactionRemove`*
- Selene greets new members with an embed in a specific channel. *`src/Events.js; OnGuildMemberAdd`*
  - Following this, Selene will also alert the members of *any* special role changes that apply to them, whether from a reaction removal or not. *`src/Events.js; OnGuildMemberUpdate`*
- Selene is set to automatically restart daily at 6:00 AM EST through Heroku's app scheduler. *`src/out_source/DynoManager.js`*
- Selene accepts the argument *`--debug`* which tells her not to make any alerts and/or send any messages. *`src/_Startup.js; "Register All Events"`*
<br /><br />

# 🌑 Selene's Commands 🌑
## 1. `/help`
### This command provides the user with all of Selene's commands, and how they can be used.
<br />

## 2. `/create`
### `/create ticket`: Lets members report other users that violate the rules of my server.
### `/create report`: Lets members create a feedback / bug report.
<br />

## 3. `/set`
### `/set creator`: This allows my Cosmic Creators to set their personal creator link (link to their media's) so Selene can alert the Celestial Cartographers.
<br /><br />

# ✨ Commit Messages ✨
Most of the commit messages I use are codewords that Selene uses to have certain things happen within.

### `"debugging"`: Selene will start in a custom state, members can view this from within Discord by Selene's status and state.<br />
### `"hotfix"`: This commit message tells Selene to send a custom Hotfix ticket in the `#alerts` channel.<br />
### `"NoAlert"`: This tells Selene not to send any messages anywhere, this is usually used for small fixes or changes that I make, that does not impact members experiences.<br />
### `"Restart"`: No one should personally call this commit message, this message is received from *inside* her source code. It is sent when she happens to restart, whether it be a crash or the daily restart, and the last commit message is too old (no new commits). It tells Selene to not attempt to retrieve the last commit and make an alert about it. <br /><br />
Any message that does not include any of these codewords, tells Selene that she should send a `CHANGELOG` ticket in the `#alerts` channel, the changelog includes both the commit message and a custom message
that explains what was changed or added.<br /><br />
If Selene is unable to retrieve the last commit message for any reason, from being an expired token to being falsely started elsewhere, she will send me an alert from outside her code as well as sending
a message in the `#alerts` channel.
<br /><br />

# 🌟 Contributions 🌟
Since Selene is open source, I am very limited on how you can contribute. If you'd like, you may fork and make a pull request and add new features or enhancements that you see fit. Your input is always welcome !!
<br /><br />

# 🌌 Contact 🌌
If you have any questions, or you see any ways a user can abuse my bot, you can reach out to me directly through discord or email.
### Email: lunardemimoon@gmail.com
### Discord: lunardemimoon
