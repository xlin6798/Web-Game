var waves;

function initialize() {
    battleMenu.style.display = "none";
    mainMenu.style.display = "none";
}

function save() {
    var save = {
        player_cname: cname,
        player_level: level,
        player_exp: exp,
        player_health: health,
        player_attack: attack,
        player_defense: defense,
        player_gold: gold,
        atkLevel: WeaponLvl,
        defLevel: ShieldLvl,
        current_level: questLevel,
    }
    localStorage.setItem("save", JSON.stringify(save));
    console.log("save");
}

function load() {
    var savegame = JSON.parse(localStorage.getItem("save"));
    if (savegame != null && savegame != undefined) {
        cname = savegame.player_cname;
        level = savegame.player_level;
        exp = savegame.player_exp;
        health = savegame.player_health;
        attack = savegame.player_attack;
        defense = savegame.player_defense;
        gold = savegame.player_gold;
        WeaponLvl = savegame.atkLevel;
        ShieldLvl = savegame.defLevel;
        questLevel = savegame.current_level;
        loadStatus = true;
        gameMenu();
        battleMenu.style.display = "none";
    } else {
        loadStatus = false;
        initialize();
    }
}

function selectChamp(champ, atk, def, hp) {
    cname = champ;
    level = 1;
    attack = atk;
    defense = def;
    health = hp;
    gold = 0;
    questLevel = 1;
    WeaponLvl = 0;
    ShieldLvl = 0;
    exp = 0;
    save();
    gameMenu();
}

function gameMenu() {
    checkLevel();
    battleMenu.style.display = "none";
    mainMenu.style.display = "block";
    selectPlayer.style.display = "none";
    Player_Champ.style = "background: url(images/" + cname + ".jpg); background-size:cover; background-repeat: no-repeat;";
    Player_Name.innerHTML = cname;
    Player_Level.innerHTML = level;
    playerStatsCalc();
    Player_Health.innerHTML = playerStatsCalc('hp');
    playerLevel.value = exp;
    playerLevel.max = 90 + 90 * Math.pow(1.6, level - 1);
    Player_Level.innerHTML = "Lvl. " + level;
    Player_Attack.innerHTML = playerStatsCalc('atk') + parseInt(getInfo('Weapon', 'attack'));
    Player_Defense.innerHTML = playerStatsCalc('def') + parseInt(getInfo('Shield', 'armor'));
    Player_WeaponLevel.innerHTML = getInfo('Weapon', 'level');
    Player_ShieldLevel.innerHTML = getInfo('Shield', 'level');
    Player_Gold.innerHTML = gold;
    Player_Weapon.innerHTML = getInfo('Weapon', 'name');
    Player_Shield.innerHTML = getInfo('Shield', 'name');
    weaponImg.src = "images/" + getInfo('Weapon', 'name') + ".png";
    shieldImg.src = "images/" + getInfo('Shield', 'name') + ".png";
    weaponGold = getInfo("Weapon", "cost") + " Gold";
    shieldGold = getInfo("Weapon", "cost") + " Gold";
    CurrentQuestLevel.innerHTML = questLevel;
    mainMenu.style = "background: url(images/" + cname + ".jpg); background-size:cover; background-repeat: no-repeat;";
}

function playerStatsCalc(x) {
    if (cname == "Annie") {
        if (x == "hp") {
            return health + level * 100;
        }
        if (x == "atk") {
            return attack + level * 11;
        }
        if (x == "def") {
            return defense + level * 9;
        }
    } else {
        if (x == "hp") {
            return health + level * 130;
        }
        if (x == "atk") {
            return attack + level * 7;
        }
        if (x == "def") {
            return defense + level * 15;
        }
    }
}

function checkLevel() {
    while (exp >= 90 + 90 * Math.pow(1.6, level - 1)) {
        exp -= 90 + 90 * Math.pow(1.6, level - 1);
        level++;
        checkLevel();
    }
}

function getInfo(x, y) {
    if (y == "cost") {
        if (x == "Weapon") {
            if (WeaponLvl == 7)
                return "Max Level";
            else
                return (eval(cname + x)[eval(x + "Lvl") + 1][y]);
        } else {
            if (ShieldLvl == 7)
                return "Max Level";
            else
                return (eval(cname + x)[eval(x + "Lvl") + 1][y]);
        }
    } else {
        return (eval(cname + x)[eval(x + "Lvl")][y]);
    }
}

function play() {
    waves = 3 + Math.floor(questLevel/5);
    minionHp = 10 + Math.round((questLevel * 50 * Math.pow(1.2, questLevel-1)) / (questLevel));
    minionAtk = 3 + Math.round((questLevel * 10 * Math.pow(1.05, questLevel-1)) / (questLevel));
    minionDef = 1 + Math.round((questLevel * 6 * Math.pow(1.05, questLevel-1)) / (questLevel));
    bossHp = 50 + Math.round((questLevel * 120 * Math.pow(1.2, questLevel-1)) / (questLevel));
    bossAtk = 5 + Math.round((questLevel * 25 * Math.pow(1.1, questLevel-1)) / (questLevel));
    bossDef = 3 + Math.round((questLevel * 28* Math.pow(1.1, questLevel-1)) / (questLevel));
    champHealth = health;
    monsterHealth.max = minionHp;
    monsterHealth.value = minionHp;
    ChampionHealth.max = health;
    ChampionHealth.value = health;
    mainMenu.style.display = "none";
    battleMenu.style.display = "block";
    monsterImg.src = "images/Minion.png"
    championImg.src = "images/" + cname + ".jpg";
    wave = 1;
    currentMonsterHp = minionHp;
    currentMonsterAtk = minionAtk;
    currentMonsterDef = minionDef;
}

function newWave() {
    if (wave == waves) {
        currentMonsterHp = bossHp;
        currentMonsterAtk = bossAtk;
        currentMonsterDef = bossDef;
        console.log (bossHp + " " + bossAtk + " " + bossDef);
        if (questLevel <= 16)
            monsterImg.src = "images/boss" + questLevel + ".png";
        else
            monsterImg.src = "images/boss" + 16 + ".png";
    } else {
        currentMonsterHp = minionHp;
        currentMonsterAtk = minionAtk;
        currentMonsterDef = minionDef;
    }
    monsterHealth.max = currentMonsterHp;
    monsterHealth.value = currentMonsterHp;
}

function attackMove() {
    currentMonsterHp = currentMonsterHp - attackMultipler(currentMonsterDef) * (playerStatsCalc('atk') + parseInt(getInfo('Weapon', 'attack')));
    monsterHealth.value = currentMonsterHp;
    //console.log(attackMultipler(currentMonsterDef));
    //console.log(currentMonsterHp);
    if (currentMonsterHp > 0) {
        champHealth = champHealth - attackMultipler(playerStatsCalc('def') + parseInt(getInfo('Shield', 'armor'))) * currentMonsterAtk;
        //console.log(champHealth);
        //console.log(" | " + attackMultipler(playerStatsCalc('def') + parseInt(getInfo('Shield', 'armor'))));
        ChampionHealth.value = champHealth;
        if (champHealth <= 0) {
            save();
            gameMenu();
        }
    } else {
        if (wave < waves) {
            gold += 15 + Math.round((questLevel * 10 * Math.pow(1.11, questLevel-1)) / questLevel);
            exp += 10 + Math.round((questLevel * 25 * Math.pow(1.4, questLevel-1)) / questLevel);
            wave++;
            newWave();
        } else {
            gold += 50 + Math.round((questLevel * 50 * Math.pow(1.15, questLevel-1)) / questLevel);
            exp += 10 + Math.round((questLevel * 70 * Math.pow(1.4, questLevel-1)) / questLevel);
            questLevel++;
            save();
            gameMenu();
        }
    }
}

function attackMultipler(armor) {
    return (100 / (100 + armor));
}

function levelUp(x) {
    if (gold >= getInfo(x, "cost")) {
        gold -= getInfo(x, "cost");
        if (x == "Weapon") {
            WeaponLvl++;
        } else {
            ShieldLvl++;
        }
    }
    save();
    gameMenu();
}

function resetGame() {
    location.reload();
    localStorage.clear();
}