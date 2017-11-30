function Sub(name, atk, rcv, dk_no, tpa, sevenc, att, subatt, darkoe, redoe, greenoe,url) {
    this.name = name
    this.atk = atk
    this.rcv = rcv
    this.dk_no = dk_no
    this.tpa = tpa
    this.sevenc = sevenc
    this.darkoe = darkoe
    this.redoe = redoe
    this.greenoe = greenoe
    this.att = att
    this.subatt = subatt
    this.url = url
}

function Team(teamarray) {
    this.lead1 = new Sub('kush', 2177*2.25,997*2.25,teamarray[4],0,0,'g','b',0,0,1,'http://puzzledragonx.com/en/img/book/3503.png');

    // Sub1
    if (teamarray[0] === 'haku') {
        this.sub1 = new Sub('haku',2590*2.25, 1040*2.25, teamarray[5],2,1,'d','r', 2,1,0,'http://puzzledragonx.com/en/img/book/3491.png');
    }
    else if (teamarray[0] === 'amatsu') {
        this.sub1 = new Sub('amatsu',2117,359, teamarray[5],0,2,'b','l',0,0,0,'http://puzzledragonx.com/en/img/book/3657.png');
    }
    else if (teamarray[0] === 'verd') {
        this.sub1 = new Sub('verd', 1962*2.25,1149*2.25,teamarray[5],1,1,'g','',0,0,2,'http://puzzledragonx.com/en/img/book/3763.png');
    }
    else if (teamarray[0] === 'yuna') {
        this.sub1 = new Sub('yuna', 2573*2.25,1193*2.25,teamarray[5],0,2,'l','b',0,0,0,'http://puzzledragonx.com/en/img/book/2766.png');
    }
    else {
        // throw "Invalid Sub";
        return;        
    }

    // Sub2
    if (teamarray[1] === 'haku') {
        this.sub2 = new Sub('haku',2590*2.25, 1040*2.25, teamarray[6],2,1,'d','r', 2,1,0,'http://puzzledragonx.com/en/img/book/3491.png');
    }
    else if (teamarray[1] === 'amatsu') {
        this.sub2 = new Sub('amatsu',2117,359, teamarray[6],0,2,'b','l',0,0,0,'http://puzzledragonx.com/en/img/book/3657.png');
    }
    else if (teamarray[1] === 'verd') {
        this.sub2 = new Sub('verd', 1962*2.25,1149*2.25,teamarray[6],1,1,'g','',0,0,2,'http://puzzledragonx.com/en/img/book/3763.png');
    }
    else if (teamarray[1] === 'yuna') {
        this.sub2 = new Sub('yuna', 2573*2.25,1193*2.25,teamarray[6],0,2,'l','b',0,0,0,'http://puzzledragonx.com/en/img/book/2766.png');
    }
    else {
        // throw "Invalid Sub";
        return;
    }

    // Sub3
    if (teamarray[2] === 'haku') {
        this.sub3 = new Sub('haku',2590*2.25, 1040*2.25, teamarray[7],2,1,'d','r', 2,1,0,'http://puzzledragonx.com/en/img/book/3491.png');
    }
    else if (teamarray[2] === 'amatsu') {
        this.sub3 = new Sub('amatsu',2117,359, teamarray[7],0,2,'b','l',0,0,0,'http://puzzledragonx.com/en/img/book/3657.png');
    }
    else if (teamarray[2] === 'verd') {
        this.sub3 = new Sub('verd', 1962*2.25,1149*2.25,teamarray[7],1,1,'g','',0,0,2,'http://puzzledragonx.com/en/img/book/3763.png');
    }
    else if (teamarray[2] === 'yuna') {
        this.sub3 = new Sub('yuna', 2573*2.25,1193*2.25,teamarray[7],0,2,'l','b',0,0,0,'http://puzzledragonx.com/en/img/book/2766.png');
    }
    else {
        // throw "Invalid Sub";
        return;        
    }

    // Sub4
    if (teamarray[3] === 'haku') {
        this.sub4 = new Sub('haku',2590*2.25, 1040*2.25, teamarray[8],2,1,'d','r', 2,1,0,'http://puzzledragonx.com/en/img/book/3491.png');
    }
    else if (teamarray[3] === 'amatsu') {
        this.sub4 = new Sub('amatsu',2117,359, teamarray[8],0,2,'b','l',0,0,0,'http://puzzledragonx.com/en/img/book/3657.png');
    }
    else if (teamarray[3] === 'verd') {
        this.sub4 = new Sub('verd', 1962*2.25,1149*2.25,teamarray[8],1,1,'g','',0,0,2,'http://puzzledragonx.com/en/img/book/3763.png');
    }
    else if (teamarray[3] === 'yuna') {
        this.sub4 = new Sub('yuna', 2573*2.25,1193*2.25,teamarray[8],0,2,'l','b',0,0,0,'http://puzzledragonx.com/en/img/book/2766.png');
    }
    else {
        // throw "Invalid Sub";
        return;        
    }


    this.lead2 = new Sub('kush',2177*2.25,997*2.25, teamarray[9],0,0,'g','b',0,0,1,'http://puzzledragonx.com/en/img/book/3503.png');
}

module.exports = Team;