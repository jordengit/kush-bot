Guide for ^padcalc function

    Input: ^padcalc sub1 sub2 sub3 sub4 dk_no1 dk_no2 dk_3 dk_4
        a. example - ^padcalc haku haku haku verd 1 1 1 2
        b. Possible sub inputs: haku, verd, amatsu, yuna
        c. Possible drag killer no: 0, 1, 2, 3
    Bot: 
        a. Fetch data of card from native database
            i.e. stats, awakenings, attribute
        b. Reply user, asking user for enemy information (could we 
        possibly await a reply?)
    Input: ^enemyinfo totalhp def currenthp% dmgvoid dmgabsorb dmgmulti 
            dragtype attribute
        a. example - ^enemyinfo 3000000 2500 500000 0 0.25 y r
        b. note that damage reduction is when dmgmulti is 0-1 while 
        burst is when dmgmulti is 1 or greater.
    Bot:
        a. If user replies with ^exit then cease command
        b. Else if user replies with legit information
            i.e. hp, def dmgmulti, dmgabsorb, dmgvoid > 0,
            attribute = r/b/g/l/d, dragtype = y/n, 0<=currenthp%<=100
        c. Then ask for board info
    Input: ^boardinfo combo number, tpa no., enhanced orb no. per combo
            a. example - ^boardinfo 1 2 1 0 2 2 , 1 0 1 0 2 1, 1 0 2 0 4_4 0
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
