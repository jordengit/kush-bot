// Import the discord.js module
const Discord = require('discord.js');
const Team = require('./team_setup');

// Create an instance of Discord that we will use to control the bot
const bot = new Discord.Client();

// Token for your bot, located in the Discord application console - https://discordapp.com/developers/applications/me/
const token = 'YOUR_TOKEN_ID_HERE'

// id for role channel's main statement
let role_id = '';

// Gets called when our bot is successfully logged in and connected
bot.on('ready', () => {
    console.log('Status: Running');
    const role_channel = bot.channels.find('name', 'roles');
    role_channel.fetchMessages({limit: 1}).then(
        messages => {
            array = messages.array();
            array[0].delete()
        }
    )
    role_channel.send('Use +role to add or -role to remove a role.\n\nBias Roles: A3_Coop, A3_DC, Kush(Fujin), Kush(Shield), Kush(Delay)\n\nExample: +role A3_DC or -role A3_Coop.');
    role_channel.fetchMessages({count: 1}).then(
        messages => {
            array = messages.array();
            role_id = array[0].id;
        }
    )
    // Clean up bot_playground messages
    const bot_playground_channel = bot.channels.find('name', 'bot_playground');
    bot_playground_channel.fetchMessages()
    .then(msg => {
        let msgArr = msg.array();
        let msgCt = msgArr.length;
        for (i = 0; i<msgCt; i++) {
            
            msgArr[i].delete().catch(
                (err) => {
                    if (err.message == 'Unknown Message') {
                        return
                    }
                });
            }
        }
    )
});
// Create an event listener for new guild members
bot.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find('name', 'general');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}`);
  });

// Event to listen to messages sent to the server where the bot is located
bot.on('message', message => {
    // So the bot doesn't reply to itself
    if (message.author.bot) return;  

    if (message.channel.id === bot.channels.find('name', 'bot_playground').id && message.content === '^pdcguide') {
        message.channel.send({embed: {
            color: 3447003,
            author: {
                name: 'PAD Calculator Guide',
                icon_url: 'http://icons.iconarchive.com/icons/pelfusion/long-shadow-media/512/Calculator-icon.png'
            },
            fields: [{
                name: 'Step 1 - ^padcalc sub1 sub2 sub3 sub4 dk_no1 dk_no2 dk_3 dk_4 dk_5 dk_6',
                value: '**A.** Example - ^padcalc haku haku haku verd 2 1 1 1 2 2\n**B.** Possible sub inputs: haku, verd, amatsu, yuna\n**C.** Possible dragon killer numbers: 0, 1, 2, 3'
            }, {
                name: 'Step 2 - ^enemyinfo totalhp def currenthp% dmgvoid dmgabsorb dmgmultiplier dragontype? attribute',
                value: '**A.** Example - ^enemyinfo 3000000 2500 100 500000 0 0.25 y r\n**B.** Note that damage reduction is when dmgmultiplier is 0-1 while burst is when dmgmultiplier is 1 or greater'
            }, {
                name: 'Step 3 - ^boardinfo Total Combo, TPA no. for each attribute, No. of enhanced orbs per combo for green, dark and fire respectively',
                value: '**A.** Example - ^boardinfo 7 , 2 2 1 0 2 , 1 0 0 0 2 , [0,0] [3] [4,2]\n**B.** Note that for OE, commas are unseparated by space\n**C.** If for instance there is no red combo and thus no enhanced orbs, for OE type in [] instead\n**D.** In the case where there is a mixture of TPA matches and 3-orb matches, place the number of enhanced orbs of the TPA matches before the 3-orb matches'
            }],
            footer: {
                text: '© 2017 xBlitz All Rights Reserved'
            }
        }
        });
    }

    // Handling padcalc requests
    if (message.channel.id === bot.channels.find('name', 'bot_playground').id && message.content.substring(0,8) === '^padcalc') {
        var padcalc_bool = true;
        var enemytest_bool = true;
        var boardtest_bool = true;
        
        // Obtaining teaminfo from user
        const subinfo = message.content.substring(9);
        var subarray = subinfo.split(" ");

        // Performing padcalc value checks
        if (subarray.length != 10) {
            message.reply('Incorrect number of values added, sorry!');    
            padcalc_bool = false;        
        }
        for (i=0; i<4; i++) {
            if (subarray[i] === 'haku' || subarray[i] === 'amatsu' || subarray[i] === 'verd' || subarray[i] === 'yuna') {
            }
            else {fsd
                j = i+1
                message.reply('Sub No. ' + j + ' is invalid, sorry!');
                padcalc_bool = false;
            }
        }
        for (i = 4; i < 10; i++) {
            if (subarray[i] === '0' || subarray[i] === '1' || subarray[i] === '2' || subarray[i] === '3') 
            {
                subarray[i] = parseInt(subarray[i]);
            }
            else {
                j = i+1
                message.reply('Sub No.' + j +' has an invalid number of dragon killers, sorry!');
                padcalc_bool = false;              
            }
        }
        if (padcalc_bool === true) {
            // Fetch data from native database, followed by creating
            // user_team object for reference later on.
            var user_team = new Team(subarray);
            var enemyarray = [];
            
            // Acknowledge receipt of team info
            message.reply('Nice team! Provide enemy info below:');
            message.channel.awaitMessages(m => m.author.id === message.author.id, {maxMatches: 1, time: 60000, errors: ['time']})
            .then(collected => 
                {
                    if (collected.first().content.substring(0,10) == '^enemyinfo') {
                        const enemyinfo = collected.first().content.substring(11);
                        enemyarray = enemyinfo.split(' ');

                        // Perform checks for new info received
                        if (enemyarray.length != 8) {
                            message.reply('Incorrect number of values added, sorry!');   
                            enemytest_bool = false; 
                        }
                        else {
                            for (i=0; i<6; i++) {
                            try {
                                enemyarray[i] = parseFloat(enemyarray[i]);
                            }
                            catch(e) {
                                console.log(e);
                                q = i+1
                                message.reply('The value at the position ' + q + ' is not a number, sorry!');  
                                enemytest_bool = false;  
                            }
                            if (enemyarray[i] < 0) {
                                k = i+1
                                message.reply('The value at the position ' + q + ' should be > 0, sorry!');
                                enemytest_bool = false;                                                      
                            }
                        }
                        if (enemyarray[2] > 100) {
                            message.reply('The current HP% exceeds 100 currently');        
                            enemytest_bool = false;                    
                        }
                        if (enemyarray[6] != 'y' && enemyarray[6] != 'n') {
                            message.reply('Cannot understand if enemy is a dragon or not... Sorry!');
                            enemytest_bool = false;
                        }
                        if (enemyarray[7] != 'r' && enemyarray[7] != 'b' && enemyarray[7] != 'g' && enemyarray[7] != 'd' && enemyarray[7] != 'l') {
                            enemytest_bool = false;
                            message.reply('Invalid attribute added, sorry!');
                        }
                        }
                        
                    }
                    else {
                        message.reply('False input!');
                        enemytest_bool = false;
                    }

                    if (enemytest_bool === true) {
                        var boardarray = [];
                        message.reply('Easy peasy~ Finally, tell me your board!');
                        
                        // Awaits new message for 1min
                        message.channel.awaitMessages(m => m.author.id === message.author.id, {maxMatches: 1, time: 60000, errors: ['time']})
                        .then(async (collected2) => 
                            {
                                if (collected2.first().content.substring(0,10) == '^boardinfo') {
                                    var boardinfo = collected2.first().content.substring(11);
                                    boardarray = boardinfo.split(' , ');
                
                                    // Perform checks and conversions for new info received
                                    if (boardarray.length != 4) {
                                        message.reply('Incorrect number of set of values added, sorry!'); 
                                        boardtest_bool = false;   
                                    }
                                    else {
                                        try {
                                            boardarray[0] = parseInt(boardarray[0]);
                                        }
                                        catch(e) {
                                            console.log(e);
                                            message.reply('The combo number is invalid');
                                            boardtest_bool = false;
                                        }
                                        for (i=1; i<3; i++) {
                                            boardarray[i] = boardarray[i].split(' ');
                                            if (boardarray[i].length != 5) {
                                                z = i+1
                                                message.reply('Incorrect number of elements in position ' + z);
                                                boardtest_bool = false;
                                                break;
                                            }
                                            for (j=0; j<5; j++) {
                                                try {
                                                    boardarray[i][j] = parseInt(boardarray[i][j]);                                            
                                                }
                                                catch(e) {
                                                    console.log(e);
                                                    r = i+1
                                                    q = j+1
                                                    message.reply('The value at the position [' + r + ',' + q + '] is not a number, sorry!');  
                                                    boardtest_bool = false;  
                                                }
                                            }
                                        }
                                        boardarray[3] = boardarray[3].split(' ');
                                        for (j=0; j<boardarray[3].length; j++) {
                                            a = boardarray[3][j].slice(1,-1);
                                            try {
                                                if (a.includes(',')) {
                                                    boardarray[3][j] = a.split(',');
                                                    for (i=0; i<boardarray[3][j].length;i++) {
                                                        boardarray[3][j][i] = parseInt(boardarray[3][j][i]);
                                                    }
                                                }
                                                else if (a.length === 1) {
                                                    boardarray[3][j] = [parseInt(a)]
                                                }
                                                else if (a === '[]') {
                                                    boardarray[3][j] = []
                                                }
                                                else {
                                                    message.reply('Something wrong with OE segment, sorry!');
                                                    boardtest_bool = false;
                                                }
                                            }
                                            catch(e) {
                                                q = k+1
                                                message.reply('Something wrong with OE segment, sorry!'); 
                                                boardtest_bool = false;
                                            }
                                        }
                                    }
                                }
                                else {
                                    message.reply('False input!');
                                    boardtest_bool = false;
                                }
                                
                                if (boardtest_bool == true) {
                                    /*
                                    PAD Damage Calculator:
                                    example of card 1 haku:
                                        dark att:
                                            (1+no.of.darkoeawk*0.05)*(1.5^no.of.tpa.awk*1.25*no.of.tpacombos*(no.ofdarkoe*0.06+1)+no.of.nontpacomobos*(no.ofdarkoe*0.06+1))
                                            *1.5^no.of.dk*2^no.of7cawk(if >7c)*atk_haku*(1+0.25*(no.ofcombo-1)
                                    */

                                    var is7c = false;
                                    var isdrag = false;
                                    var darkoe_awk = 0;
                                    var redoe_awk = 0;
                                    var greenoe_awk = 0;
                                    var enemyhp = enemyarray[0]*enemyarray[2]/100;
                                    var enemyhpp = enemyarray[2];
                                    var leadmulti = 1.0;

                                    if (boardarray[0]>4 && boardarray[0]<10) {
                                        leadmulti = 2*(boardarray[0]-4)
                                    }
                                    else if (boardarray >= 10) {
                                        leadmulti = 144.0
                                    }
                                    
                                    if (boardarray[0] > 6) {
                                        is7c = true;
                                    }
                                    if (enemyarray[6] === 'y') {
                                        isdrag = true;
                                    }
                                    for (var sub in user_team) {
                                        if (user_team.hasOwnProperty(sub)) {
                                            darkoe_awk += parseInt(user_team[sub].darkoe);
                                            redoe_awk += parseInt(user_team[sub].redoe);
                                            greenoe_awk += parseInt(user_team[sub].greenoe);
                                        }
                                    }
                                    for (var sub in user_team) {
                                        var tpamulti = 0;
                                        var nontpamulti = 0;
                                        var dmgmulti = 1.0;
                                        var finaldmg = 0.0;
                                        var effectivedmg = 0.0

                                        // let m = await message.channel.send({files: [new Discord.Attachment(user_team[sub].url, 'sub.png')]})

                                        // Performing calculations for dark,fire and green which have the OE awakening effects
                                        if (user_team[sub].att === 'd') {
                                            const tpa_no = boardarray[2][4];
                                            for (j=0;j<tpa_no;j++) {
                                                tpamulti += 1+0.06*boardarray[3][2][j];
                                            }
                                            tpamulti = tpamulti*1.25*1.5**user_team[sub].tpa;
                                            for (k=tpa_no; k<boardarray[1][4]; k++) {
                                                nontpamulti += 1+0.06*boardarray[3][2][k];
                                            }
                                            dmgmulti = (1+darkoe_awk*0.05)*(tpamulti+nontpamulti)*(1+0.25*(boardarray[0]-1));
                                        }
                                        else if (user_team[sub].att === 'r') {
                                            const tpa_no = boardarray[2][0];
                                            for (j=0;j<tpa_no;j++) {
                                                tpamulti += 1+0.06*boardarray[3][0][j];
                                            }
                                            tpamulti = tpamulti*1.25*1.5**user_team[sub].tpa;
                                            for (k=tpa_no; k<boardarray[1][0]; k++) {
                                                nontpamulti += 1+0.06*boardarray[3][0][k];
                                            }
                                            dmgmulti = (1+redoe_awk*0.05)*(tpamulti+nontpamulti)*(1+0.25*(boardarray[0]-1));
                                        }
                                        else if (user_team[sub].att === 'g') {
                                            const tpa_no = boardarray[2][2];
                                            for (j=0;j<tpa_no;j++) {
                                                tpamulti += 1+0.06*boardarray[3][1][j];
                                            }
                                            tpamulti = tpamulti*1.25*1.5**user_team[sub].tpa;
                                            for (k=tpa_no; k<boardarray[1][0]; k++) {
                                                nontpamulti += 1+0.06*boardarray[3][1][k];
                                            }
                                            dmgmulti = (1+greenoe_awk*0.05)*(tpamulti+nontpamulti)*(1+0.25*(boardarray[0]-1));
                                        }
                                        // Performing calculations for the other attributes that do not have OE effects
                                        else {
                                            var att_no = -1;
                                            switch(user_team[sub].att) {
                                                case 'b':
                                                    att_no = 1;
                                                    break;
                                                case 'l':
                                                    att_no = 3;
                                                    break;
                                            }
                                            const tpa_no = boardarray[2][att_no];
                                            tpamulti = 1.25*1.5**user_team[sub].tpa*tpa_no;
                                            nontpamulti = boardarray[1][att_no]-tpa_no
                                            dmgmulti = (tpamulti+nontpamulti)*(1+0.25*(boardarray[0]-1));
                                        }
                                        if (is7c) {
                                            dmgmulti = dmgmulti*2**user_team[sub].sevenc;
                                        }
                                        // if (isdrag) {
                                        //     dmgmulti = dmgmulti*1.5**user_team[sub].dk_no
                                        // }
                                        
                                        finaldmg = (leadmulti**2*dmgmulti*user_team[sub].atk).toFixed(0);
                                        var finaldmgstr = finaldmg.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                       
                                        // Printing damage, as well as calculating effective 
                                        // damage after performing enemy analyses
                                        switch (user_team[sub].att) {
                                            case 'r':
                                                if (enemyarray[7] == 'b') {
                                                    effectivedmg = finaldmg*0.5
                                                }
                                                else if (enemyarray[7] == 'g') {
                                                    effectivedmg = finaldmg*2
                                                }
                                                else {
                                                    effectivedmg = finaldmg
                                                }
                                                break
                                            case 'b':
                                                if (enemyarray[7] == 'g') {
                                                    effectivedmg = finaldmg*0.5
                                                }
                                                else if (enemyarray[7] == 'r') {
                                                    effectivedmg = finaldmg*2
                                                }
                                                else {
                                                    effectivedmg = finaldmg
                                                }
                                                break
                                            case 'g':
                                                if (enemyarray[7] == 'r') {
                                                    effectivedmg = finaldmg*0.5
                                                }
                                                else if (enemyarray[7] == 'b') {
                                                    effectivedmg = finaldmg*2
                                                }
                                                else {
                                                    effectivedmg = finaldmg
                                                }
                                                break
                                            case 'l':
                                                if (enemyarray[7] == 'd') {
                                                    effectivedmg = finaldmg*2
                                                }
                                                else {
                                                    effectivedmg = finaldmg
                                                }
                                                break
                                            case 'd':
                                                if (enemyarray[7] == 'l') {
                                                    effectivedmg = finaldmg*0.5
                                                }
                                                else {
                                                    effectivedmg = finaldmg
                                                }
                                                break
                                        }

                                        if (isdrag) {
                                            effectivedmg = finaldmg*1.5**user_team[sub].dk_no
                                        }
                                        effectivedmg = effectivedmg*enemyarray[5]-enemyarray[1];
                                        if (effectivedmg < 0.0) {
                                            effectivedmg = 0.0;
                                        }
                                        if (effectivedmg > enemyarray[4] && enemyarray[4] != 0.0) {
                                            effectivedmg = -effectivedmg;
                                        }
                                        else if (effectivedmg > enemyarray[3] && enemyarray[3] != 0.0) {
                                            effectivedmg = 0
                                        }
                                        enemyhp = enemyhp - effectivedmg;
                                        // In case damage absorb causes hp to exceed 100%, it gets absorbed up to 100% only
                                        if (enemyhp > enemyarray[0]) {
                                            enemyhp = enemyarray[0];
                                        }

                                        effectivedmgstr = effectivedmg.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        
                                        // Now the same thing for sub attributes
                                        // Performing calculations for dark,fire and green which have the OE awakening effects
                                        
                                        // Sub-att variables
                                        var s_tpamulti = 0;
                                        var s_nontpamulti = 0;
                                        var s_dmgmulti = 1.0;
                                        var s_finaldmg = 0.0;
                                        var s_effectivedmg = 0.0;
                                        
                                        if (user_team[sub].subatt === 'd') {
                                            const tpa_no = boardarray[2][4];
                                            for (j=0;j<tpa_no;j++) {
                                                s_tpamulti += 1+0.06*boardarray[3][2][j];
                                            }
                                            tpamulti = tpamulti*1.25*1.5**user_team[sub].tpa;
                                            for (k=tpa_no; k<boardarray[1][4]; k++) {
                                                s_nontpamulti += 1+0.06*boardarray[3][2][k];
                                            }
                                            s_dmgmulti = (1+darkoe_awk*0.05)*(s_tpamulti+s_nontpamulti)*(1+0.25*(boardarray[0]-1));
                                        }
                                        else if (user_team[sub].subatt === 'r') {
                                            const tpa_no = boardarray[2][0];
                                            for (j=0;j<tpa_no;j++) {
                                                s_tpamulti += 1+0.06*boardarray[3][0][j];
                                            }
                                            tpamulti = tpamulti*1.25*1.5**user_team[sub].tpa;
                                            for (k=tpa_no; k<boardarray[1][0]; k++) {
                                                s_nontpamulti += 1+0.06*boardarray[3][0][k];
                                            }
                                            s_dmgmulti = (1+redoe_awk*0.05)*(s_tpamulti+s_nontpamulti)*(1+0.25*(boardarray[0]-1));
                                        }
                                        else if (user_team[sub].subatt === 'g') {
                                            const tpa_no = boardarray[2][2];
                                            for (j=0;j<tpa_no;j++) {
                                                s_tpamulti += 1+0.06*boardarray[3][1][j];
                                            }
                                            tpamulti = tpamulti*1.25*1.5**user_team[sub].tpa;
                                            for (k=tpa_no; k<boardarray[1][0]; k++) {
                                                s_nontpamulti += 1+0.06*boardarray[3][1][k];
                                            }
                                            s_dmgmulti = (1+greenoe_awk*0.05)*(s_tpamulti+s_nontpamulti)*(1+0.25*(boardarray[0]-1));
                                        }
                                        // Performing calculations for the other attributes that do not have OE effects
                                        else if (user_team[sub].subatt === '') {
                                            dmgmulti = 0.0
                                        }
                                        else {
                                            var att_no = -1;
                                            switch(user_team[sub].subatt) {
                                                case 'b':
                                                    att_no = 1;
                                                    break;
                                                case 'l':
                                                    att_no = 3;
                                                    break;
                                            }
                                            const tpa_no = boardarray[2][att_no];
                                            s_tpamulti = 1.25*1.5**user_team[sub].tpa*tpa_no;
                                            s_nontpamulti = boardarray[1][att_no]-tpa_no
                                            s_dmgmulti = (s_tpamulti+s_nontpamulti)*(1+0.25*(boardarray[0]-1));
                                        }
                                        if (is7c) {
                                            s_dmgmulti = s_dmgmulti*2**user_team[sub].sevenc;
                                        }
                                        s_finaldmg = (leadmulti**2*s_dmgmulti*user_team[sub].atk)
                                        if (user_team[sub].att === user_team[sub].subatt) {
                                            s_finaldmg = 0.1*s_finaldmg;
                                        }
                                        else {
                                            s_finaldmg = s_finaldmg/3;
                                        }
                                        var s_finaldmgstr = s_finaldmg.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        
                                        switch (user_team[sub].subatt) {
                                            case 'r':
                                            if (enemyarray[7] == 'b') {
                                                s_effectivedmg = s_finaldmg*0.5
                                            }
                                            else if (enemyarray[7] == 'g') {
                                                s_effectivedmg = s_finaldmg*2
                                            }
                                            else {
                                                s_effectivedmg = s_finaldmg
                                            }
                                            break
                                        case 'b':
                                            if (enemyarray[7] == 'g') {
                                                s_effectivedmg = s_finaldmg*0.5
                                            }
                                            else if (enemyarray[7] == 'r') {
                                                s_effectivedmg = s_finaldmg*2
                                            }
                                            else {
                                                s_effectivedmg = s_finaldmg
                                            }
                                            break
                                        case 'g':
                                            if (enemyarray[7] == 'r') {
                                                s_effectivedmg = s_finaldmg*0.5
                                            }
                                            else if (enemyarray[7] == 'b') {
                                                s_effectivedmg = s_finaldmg*2
                                            }
                                            else {
                                                s_effectivedmg = s_finaldmg
                                            }
                                            break
                                        case 'l':
                                            if (enemyarray[7] == 'd') {
                                                s_effectivedmg = s_finaldmg*2
                                            }
                                            else {
                                                s_effectivedmg = s_finaldmg
                                            }
                                            break
                                        case 'd':
                                            if (enemyarray[7] == 'l') {
                                                s_effectivedmg = s_finaldmg*0.5
                                            }
                                            else {
                                                s_effectivedmg = s_finaldmg
                                            }
                                            break
                                        }

                                        if (isdrag) {
                                            s_effectivedmg = s_finaldmg*1.5**user_team[sub].dk_no
                                        }
                                        s_effectivedmg = s_effectivedmg*enemyarray[5]-enemyarray[1];
                                        if (s_effectivedmg < 0.0) {
                                            s_effectivedmg = 0.0;
                                        }
                                        if (s_effectivedmg > enemyarray[4] && enemyarray[4] != 0.0) {
                                            s_effectivedmg = -s_effectivedmg;
                                        }
                                        else if (s_effectivedmg > enemyarray[3] && enemyarray[3] != 0.0) {
                                            s_effectivedmg = 0
                                        }
                                        enemyhp = enemyhp - s_effectivedmg;
                                        // In case damage absorb causes hp to exceed 100%, it gets absorbed up to 100% only
                                        if (enemyhp > enemyarray[0]) {
                                            enemyhp = enemyarray[0];
                                        }

                                        s_effectivedmgstr = s_effectivedmg.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        message.channel.send({embed: {
                                            color: 3447003,
                                            image: {
                                                url: user_team[sub].url,
                                                width: 72
                                            },
                                            fields: [{
                                                name: 'Damage from Main Attribute',
                                                value: finaldmgstr
                                            }, {
                                                name: 'Effective Damage from Main Attribute',
                                                value: effectivedmgstr
                                            }, {
                                                name: 'Damage from Sub Attribute',
                                                value: s_finaldmgstr
                                            }, {
                                                name: 'Effective Damage from Sub Attribute',
                                                value: s_effectivedmgstr
                                            }
                                            ]
                                        }});
                                    }
                                    enemyhpp = enemyhp/enemyarray[0]*100
                                    var totaldmgdone = enemyarray[0]*100/enemyarray[2]-enemyhp

                                    totaldmgdone = totaldmgdone.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    enemyhp = enemyhp.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    enemyhpp = enemyhpp.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                                    message.channel.send({embed: {
                                        color: 3447003,
                                        author: {
                                            name: 'Post-Enemy Calculations',
                                            icon_url: 'http://www.puzzledragonx.com/en/img/book/2717.png'
                                        },
                                        fields: [{
                                            name: 'Total damage done to enemy: ',
                                            value: totaldmgdone
                                        }, {
                                            name: 'Remaining HP on enemy: ',
                                            value: enemyhp
                                        }, {
                                            name: 'Remaining HP % on enemy: ',
                                            value: enemyhpp
                                        }
                                    ]
                                    }});
                                }
                            }
                        )
                        .catch((err) => console.log(err));
                    }
                }
            )
            .catch(() => console.log('Time Out! Try keying in within a minute next time!'));
        }
    }

    // Handling roles channel messages
    if (message.channel.id === bot.channels.find('name', 'roles').id) {
        if (message.content.substring(0,5) === '+role') {
            var text = message.content.substring(6);
            if ( text === 'xBlitzBot' ) {
                message.reply('Access denied.');
            }
            else {
                let role = message.guild.roles.find("name", text);
                if (role != null) {
                    message.member.addRole(role);
                    // Reply to the user's message
                    message.reply('Added role for you!');
                }
                else {
                    message.reply('Invalid role :(');
                }
            }
        }
        else if (message.content.substring(0,5) === '-role') {
            var text = message.content.substring(6);
            if ( text === 'xBlitzBot' ) {
                message.reply('Access denied.');
            }
            else {
                let role = message.guild.roles.find("name", text);
                if (role != null) {
                    message.member.removeRole(role);
                    // Reply to the user's message
                    message.reply('Removed role for you!');
                }
                else {
                    message.reply('Invalid role :(');
                }
            }
        }
        else {
            message.reply('Invalid command :(');
        }
        message.channel.fetchMessages({after: role_id})
        .then(msg => {
            let msgArr = msg.array();
            let msgCt = msgArr.length;
            for (i = 0; i<msgCt; i++) {
                
                msgArr[i].delete(5000).catch(
                    (err) => {
                        if (err.message == 'Unknown Message') {
                            return
                        }
                    });
                }
            }
        )
        }
    }
);



/* Guide for ^padcalc function

    Input: ^padcalc sub1 sub2 sub3 sub4 dk_no1 dk_no2 dk_3 dk_4 dk_5 dk_6
        a. example - ^padcalc haku haku haku verd 2 1 1 1 2 2
        b. Possible sub inputs: haku, verd, amatsu, yuna
        c. Possible drag killer no: 0, 1, 2, 3
    Bot: 
        a. Fetch data of card from native database
            i.e. stats, awakenings, attribute
        b. Reply user, asking user for enemy information (could we 
        possibly await a reply?)
    Input: ^enemyinfo totalhp def currenthp% dmgvoid dmgabsorb dmgmulti 
            dragtype attribute
        a. example - ^enemyinfo 3000000 2500 100 500000 0 0.25 y r
        b. note that damage reduction is when dmgmulti is 0-1 while 
        burst is when dmgmulti is 1 or greater.
    Bot:
        a. If user replies with ^exit then cease command
        b. Else if user replies with legit information
            i.e. hp, def dmgmulti, dmgabsorb, dmgvoid > 0,
            attribute = r/b/g/l/d, dragtype = y/n, 0<=currenthp%<=100
        c. Then ask for board info
    Input: ^boardinfo combo number, tpa no., enhanced orb no. per combo for green, dark
            a. example - ^boardinfo 7 , 1 2 1 0 2 , 1 0 0 0 2 , [0] [3] [2,4]
    Bot:
        a. Perform calculations for given board
        b. Outputs a list of info, from dmg done (grouped by subs, lists
        by attribute), to hp% remaining, 
        c. Gives user options to ^exit, ^recalc, ^concalc, ^clearcalc,
        ^updateenemy
            i. ^recalc is to restart calculations from previous hp%, so
            bot expects ^boardinfo command or ^exit
            ii. ^concalc is to continue calculations from this hp%, so
            bot expects ^boardinfo command or ^exit
            iii. ^clearcal is to restart hp% original input value, so
            bot expects ^boardinfo command or ^exit
            iv. ^updateenemy is to modify enemy info, so bot expects
            ^enemyinfo

PAD Damage Calculator:
    example of card 1 haku:
        dark att:
            (1+no.of.darkoeawk*0.05)*(1.5^no.of.tpa.awk*1.25*no.of.tpacombos*(no.ofdarkoe*0.06+1)+no.of.nontpacomobos*(no.ofdarkoe*0.06+1))
            *1.5^no.of.dk*2^no.of7cawk(if >7c)*atk_haku*(1+0.25*(no.ofcombo-1)
*/
bot.login(token);