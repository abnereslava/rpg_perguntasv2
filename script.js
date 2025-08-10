document.addEventListener('DOMContentLoaded', () => {

    // ######################################################################
    // ### ÁREA DE CONFIGURAÇÃO DAS ARTES (AVATARES) ###
    // QUANDO TIVER SUAS ARTES, BASTA MUDAR OS LINKS (URLS) NESTA SEÇÃO
    // ######################################################################

    const placeholderUrl = (text, w = 250, h = 200, color = '333') => `https://via.placeholder.com/${w}x${h}/${color}/FFFFFF?text=${encodeURIComponent(text)}`;

    let answerLocked = false;

// === HERÓIS PERSONALIZADOS (carregados automaticamente pelo padrão de nomes) ===
    let playerAvatarSets = [];
    const totalHeroes = 12; // Quantidade atual de heróis que você já colocou na pasta

    for (let i = 1; i <= totalHeroes; i++) {
        playerAvatarSets.push({
            name: `Herói ${i}`,
            value: `h${i}`,
            pose_padrao: `artes/heroi${i}-padrao.png`,
            pose_derrota: `artes/heroi${i}-derrota.png`
        });
    }

    // Lista de NPCs por tipo (1 a 10 para cada tipo)
    const npcTypes = {
        contemplativo: Array.from({ length: 10 }, (_, i) => `artes/npc-contemplativo${i+1}.png`),
        chorao: Array.from({ length: 10 }, (_, i) => `artes/npc-chorao${i+1}.png`),
        maligno: Array.from({ length: 10 }, (_, i) => `artes/npc-maligno${i+1}.png`)
    };

    const bgList = Array.from({ length: 7 }, (_, i) => `artes/bg${i+1}.png`);

    // Frases
    const eventTexts = {
        contemplativo: [
            "Obrigado pela ajuda! Nosso vilarejo estava sendo ameaçado por este vilão!",
            "Obrigado! Você é nosso herói!",
            "Uau! Você é forte. Nunca vi ninguém assim!",
            "Um dia eu vou treinar para ser forte como você!",
            "Obrigado! Nunca esquecerei seu nome!",
            "Prossiga com cuidado, viajante. Há muitos inimigos por aqui.",
            "Ouvi rumores de monstros vindo das montanhas...",
            "Tome cuidado, há inimigos à frente!",
            "Não confie em todos que você encontra pelo caminho.",
            "Você salvou minha vida, sou eternamente grato!"
        ],
        chorao: [
            "Não acredito no que você fez com ele(a). Ele(a) era da minha família!",
            "Eu o(a) conheci quando ainda era do bem. É uma pena que tenha tido esse fim.",
            "Obrigado, mas foi tarde demais. Ele(a) destruiu a minha aldeia.",
            "Obrigado! Finalmente alguém vingou a minha família.",
            "Ele(a) era o(a) meu(minha) único(a) amigo(a)... por que você fez isso?",
            "Ele não era assim... a maldição o(a) consumiu.",
            "Eu o(a) conheci quando ele(a) era um(a) jovem guerreiro(a) cheio(a) de esperança. É triste ver no que ele(a) se tornou.",
            "Antes de se tornar um monstro, ele(a) me salvou de um incêndio. Eu nunca pensei que ele(a) teria um fim como este.",
            "Agradeço, mas o que ele(a) fez não pode ser desfeito.",
            "Eu vi o mal tomar conta dele(a). Acredite ou não, no passado, ele(a) já foi uma pessoa boa."
        ],
        maligno: [
            "Você pode ter vencido esta batalha, mas a guerra está longe de acabar.",
            "Não acredito! O que você fez com meu(minha) discipulo(a)?",
            "Você está se tornando um problema para a liga dos vilões. Precisaremos exterminá-lo(a)!",
            "Você... não me esquecerei de seu rosto!",
            "Você é muito forte. Melhor me afastar, não é boa ideia lutar com você agora.",
            "Então você é o herói de quem todos falam... bem, logo deixará de ter tanta sorte.",
            "Ha, ha, há! Sim. Era eu quem o(a) estava controlando. Mas em breve você não terá a mesma sorte!",
            "Você pode ter vencido essa, mas não vencerá a próxima!",
            "Ainda não acabou! Meu próximo servo acabará com você!",
            "Você foi muito bem, mas agora já conhecemos todas as suas táticas!"
        ]
    };

    // Controle de NPCs usados
    let npcsUsados = new Set();

    // === VILÕES PERSONALIZADOS ===
    const villainAvatarSets = [
        { name: "BABY BOT", value: "v1", pose_padrao: "artes/vilao-babybot-padrao.png", pose_derrota: "artes/vilao-babybot-derrota.png", pose_vitoria: "artes/vilao-babybot-vitoria.png" },
        { name: "BAD BUNNY", value: "v2", pose_padrao: "artes/vilao-badbunny-padrao.png", pose_derrota: "artes/vilao-badbunny-derrota.png", pose_vitoria: "artes/vilao-badbunny-vitoria.png" },
        { name: "BALLET ALIEN", value: "v3", pose_padrao: "artes/vilao-balletalien-padrao.png", pose_derrota: "artes/vilao-balletalien-derrota.png", pose_vitoria: "artes/vilao-balletalien-vitoria.png" },
        { name: "BOXING MUMMY", value: "v4", pose_padrao: "artes/vilao-boxingmummy-padrao.png", pose_derrota: "artes/vilao-boxingmummy-derrota.png", pose_vitoria: "artes/vilao-boxingmummy-vitoria.png" },
        { name: "DARKCRAFT", value: "v5", pose_padrao: "artes/vilao-darkcraft-padrao.png", pose_derrota: "artes/vilao-darkcraft-derrota.png", pose_vitoria: "artes/vilao-darkcraft-vitoria.png" },
        { name: "DARKLINGO", value: "v6", pose_padrao: "artes/vilao-darklingo-padrao.png", pose_derrota: "artes/vilao-darklingo-derrota.png", pose_vitoria: "artes/vilao-darklingo-vitoria.png" },
        { name: "DARK QUEEN", value: "v7", pose_padrao: "artes/vilao-darkqueen-padrao.png", pose_derrota: "artes/vilao-darkqueen-derrota.png", pose_vitoria: "artes/vilao-darkqueen-vitoria.png" },
        { name: "EVIL CAPY", value: "v8", pose_padrao: "artes/vilao-evilcapy-padrao.png", pose_derrota: "artes/vilao-evilcapy-derrota.png", pose_vitoria: "artes/vilao-evilcapy-vitoria.png" },
        { name: "EVIL DOLLY", value: "v9", pose_padrao: "artes/vilao-evildolly-padrao.png", pose_derrota: "artes/vilao-evildolly-derrota.png", pose_vitoria: "artes/vilao-evildolly-vitoria.png" },
        { name: "HERMI1", value: "v10", pose_padrao: "artes/vilao-hermi1-padrao.png", pose_derrota: "artes/vilao-hermi1-derrota.png", pose_vitoria: "artes/vilao-hermi1-vitoria.png" },
        { name: "LAWYER OGRE", value: "v11", pose_padrao: "artes/vilao-lawyerogre-padrao.png", pose_derrota: "artes/vilao-lawyerogre-derrota.png", pose_vitoria: "artes/vilao-lawyerogre-vitoria.png" },
        { name: "MEGA SINGER", value: "v12", pose_padrao: "artes/vilao-megasinger-padrao.png", pose_derrota: "artes/vilao-megasinger-derrota.png", pose_vitoria: "artes/vilao-megasinger-vitoria.png" },
        { name: "OLDWARF", value: "v13", pose_padrao: "artes/vilao-oldawrf-padrao.png", pose_derrota: "artes/vilao-oldawrf-derrota.png", pose_vitoria: "artes/vilao-oldawrf-vitoria.png" },
        { name: "PICK A SHOE", value: "v14", pose_padrao: "artes/vilao-pickashoe-padrao.png", pose_derrota: "artes/vilao-pickashoe-derrota.png", pose_vitoria: "artes/vilao-pickashoe-vitoria.png" },
        { name: "SPACE COWBOY", value: "v15", pose_padrao: "artes/vilao-spacecowboy-padrao.png", pose_derrota: "artes/vilao-spacecowboy-derrota.png", pose_vitoria: "artes/vilao-spacecowboy-vitoria.png" },
        { name: "STITCH FIGHTER", value: "v16", pose_padrao: "artes/vilao-stitchfighter-padrao.png", pose_derrota: "artes/vilao-stitchfighter-derrota.png", pose_vitoria: "artes/vilao-stitchfighter-vitoria.png" },
        { name: "SUNNY LEO", value: "v17", pose_padrao: "artes/vilao-sunnyleo-padrao.png", pose_derrota: "artes/vilao-sunnyleo-derrota.png", pose_vitoria: "artes/vilao-sunnyleo-vitoria.png" },
        { name: "SUPER NOT HERO", value: "v18", pose_padrao: "artes/vilao-supernothero-padrao.png", pose_derrota: "artes/vilao-supernothero-derrota.png", pose_vitoria: "artes/vilao-supernothero-vitoria.png" }
    ];


    // ######################################################################
    // ### FIM DA ÁREA DE CONFIGURAÇÃO ###
    // ######################################################################


    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');
    const transitionScreen = document.getElementById('transition-screen');
    const victoryScreen = document.getElementById('victory-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const startGameBtn = document.getElementById('start-game-btn');
    const addLevelBtn = document.getElementById('add-level-btn');
    const removeLevelBtn = document.getElementById('remove-level-btn');
    const addPlayerBtn = document.getElementById('addPlayerBtn');
    const levelSettingsContainer = document.getElementById('level-settings-container');
    const correctBtn = document.getElementById('correct-btn');
    const incorrectBtn = document.getElementById('incorrect-btn');
    const skipBtn = document.getElementById('skip-btn');
    // Elementos do modal de seleção de avatar
    const avatarModal = document.getElementById('avatar-selection-modal');
    const avatarGrid = document.getElementById('avatar-grid');
    let currentPlayerDivForAvatar = null;


    let gameState = {};
    let timerInterval = null;
    let levelCounter = 0;
    let playerCounter = 0;

    function createAvatarSelector(sets, className) {
        const select = document.createElement('select');
        select.className = className;
        sets.forEach(set => {
            const option = document.createElement('option');
            option.value = set.value;
            option.textContent = set.name;
            select.appendChild(option);
        });
        return select;
    }


    let players = [];
    let nextPlayerId = 1;
    let playerToUpdateAvatar = null;

    function updatePlayersDisplay() {
        const playersList = document.getElementById('players-list');
        playersList.innerHTML = '';
        players.forEach(player => {
            const card = document.createElement('div');
            card.className = 'player-card';
            card.innerHTML = `
                <img src="${player.avatar.pose_padrao}" alt="Avatar" data-id="${player.id}">
                <span>${player.name}</span>
                <button class="remove-player-btn" data-id="${player.id}">&times;</button>
            `;
            playersList.appendChild(card);
        });
        validateGameStart();
    }

    function validateGameStart() {
        const startGameBtn = document.getElementById('start-game-btn');
        const playerError = document.getElementById('player-error');
        const canStart = players.length >= 2;
        startGameBtn.disabled = !canStart;
        playerError.textContent = canStart ? '' : 'É necessário ter pelo menos 2 jogadores.';
    }

    function addPlayer() {
        const nameInput = document.getElementById('playerName');
        const name = nameInput.value.trim();
        if (!name || players.length >= 8) return;

        const usedAvatars = players.map(p => p.avatar.value);
        const availableAvatars = playerAvatarSets.filter(a => !usedAvatars.includes(a.value));
        if (availableAvatars.length === 0) {
            alert('Não há mais avatares disponíveis!');
            return;
        }

        const randomAvatar = availableAvatars[Math.floor(Math.random() * availableAvatars.length)];
        const newPlayer = { id: nextPlayerId++, name: name, avatar: randomAvatar, hp: parseInt(document.getElementById('player-hp').value) };
        players.push(newPlayer);
        nameInput.value = '';
        updatePlayersDisplay();
    }

    document.getElementById('addPlayerBtn').addEventListener('click', addPlayer);

    document.getElementById('players-list').addEventListener('click', e => {
        if (e.target.classList.contains('remove-player-btn')) {
            // Remover jogador
            const idToRemove = parseInt(e.target.dataset.id, 10);
            players = players.filter(p => p.id !== idToRemove);
            updatePlayersDisplay();
        } else if (e.target.tagName === 'IMG') {
            // Abrir modal para trocar avatar
            const idToUpdate = parseInt(e.target.dataset.id, 10);
            const player = players.find(p => p.id === idToUpdate);
            if (player) {
                openAvatarModal(player); // agora usa a versão corrigida do openAvatarModal
            }
        }
    });

    function openAvatarModal(player) {
        playerToUpdateAvatar = player;
        avatarGrid.innerHTML = '';

        const usedAvatars = players.filter(p => p.id !== player.id).map(p => p.avatar.value);

        playerAvatarSets.forEach(avatar => {
            const avatarOption = document.createElement('div');
            avatarOption.className = 'avatar-option-large';
            avatarOption.style.backgroundImage = `url('${avatar.pose_padrao}')`;
            avatarOption.dataset.value = avatar.value;

            if (usedAvatars.includes(avatar.value)) {
                avatarOption.classList.add('disabled');
            }

            avatarOption.addEventListener('click', () => {
                if (avatarOption.classList.contains('disabled')) return;
                playerToUpdateAvatar.avatar = avatar;
                updatePlayersDisplay();
                closeAvatarModal();
            });

            avatarGrid.appendChild(avatarOption);
        });

        avatarModal.classList.remove('hidden');
        avatarModal.style.display = 'flex';
    }

    function closeAvatarModal() {
        avatarModal.classList.add('hidden');
        avatarModal.style.display = 'none';
    }

    function updateAvatarAvailability() {
        const chosenAvatars = Array.from(document.querySelectorAll('.player-config'))
            .map(div => div.dataset.avatar)
            .filter(v => v);

        document.querySelectorAll('.avatar-option').forEach(option => {
            const avatarValue = option.dataset.value;
            if (chosenAvatars.includes(avatarValue) && !option.classList.contains('selected')) {
                option.classList.add('disabled');
            } else {
                option.classList.remove('disabled');
            }
        });
    }


    function removeLastPlayerConfig() {
        if (playerSetupContainer.children.length > 0) {
            playerSetupContainer.removeChild(playerSetupContainer.lastElementChild);
            playerCounter--;
        }
    }

    // --- Substituir função addLevelConfig por esta versão:
    function addLevelConfig() {
        levelCounter++;
        const levelDiv = document.createElement('div');
        levelDiv.classList.add('level-config');
        const defaultHP = levelCounter + 1;
        levelDiv.innerHTML = `
            <h4>Nível ${levelCounter}</h4>
            <input type="number" class="villain-hp" placeholder="HP do Vilão (acertos)" value="${defaultHP}" min="1">
            <input type="number" class="time-per-question" placeholder="Tempo por pergunta (s)" value="60" min="5">
        `;
        const usedAvatars = Array.from(document.querySelectorAll('.villain-avatar')).map(sel => sel.value);
        const availableAvatars = villainAvatarSets.filter(a => !usedAvatars.includes(a.value));
        const avatarSelect = createAvatarSelector(villainAvatarSets, 'villain-avatar');
        if (availableAvatars.length > 0) avatarSelect.value = availableAvatars[Math.floor(Math.random() * availableAvatars.length)].value;
        levelDiv.appendChild(avatarSelect);
        levelSettingsContainer.appendChild(levelDiv);
    }

    function removeLastLevelConfig() {
        if (levelSettingsContainer.children.length > 0) {
            levelSettingsContainer.removeChild(levelSettingsContainer.lastElementChild);
            levelCounter--;
        }
    }

    function initializeGame() {
        if (players.length === 0) {
            alert("Por favor, adicione pelo menos um jogador.");
            return;
        }

        const questionsInput = document.getElementById('questions-list').value.split('\n').filter(q => q.trim() !== '');
        if (questionsInput.length === 0) {
            alert("Por favor, insira pelo menos uma pergunta.");
            return;
        }
        if (document.getElementById('shuffle-questions').checked) shuffleArray(questionsInput);

        const levelConfigs = [];
        document.querySelectorAll('.level-config').forEach(div => {
            const avatarValue = div.querySelector('.villain-avatar').value;
            const avatarSet = villainAvatarSets.find(s => s.value === avatarValue);
            levelConfigs.push({
                villainName: avatarSet.name,
                maxVillainHP: parseInt(div.querySelector('.villain-hp').value),
                timePerQuestion: parseInt(div.querySelector('.time-per-question').value),
                avatar: avatarSet
            });
        });
        if (levelConfigs.length === 0) {
            alert("Por favor, adicione e configure pelo menos um nível.");
            return;
        }

        gameState = {
            players,
            questions: questionsInput,
            levels: levelConfigs,
            hpMode: document.getElementById('hp-mode').value,
            initialPlayerHP: parseInt(document.getElementById('player-hp').value),
            resetHpOnLevelUp: document.getElementById('reset-hp-on-level-up').checked,
            currentLevelIndex: 0,
            currentPlayerIndex: 0,
            currentQuestionIndex: 0,
            sharedPlayerHP: parseInt(document.getElementById('player-hp').value),
            currentVillainHP: 0
        };

        setupScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        startLevel();
    }

    function startLevel() {
        const level = gameState.levels[gameState.currentLevelIndex];
        gameState.currentVillainHP = level.maxVillainHP;
        if (gameState.resetHpOnLevelUp && gameState.currentLevelIndex > 0) {
            if (gameState.hpMode === 'shared') gameState.sharedPlayerHP = gameState.initialPlayerHP;
            else gameState.players.forEach(p => p.hp = gameState.initialPlayerHP);
        }
        showTransition(`Nível ${gameState.currentLevelIndex + 1}: ${level.villainName}`, 3, startTurn);
        updateArt();
    }

    function startTurn() {
        updateUI();
        updateArt();

        if (gameState.currentQuestionIndex >= gameState.questions.length) {
            shuffleArray(gameState.questions);
            gameState.currentQuestionIndex = 0;
        }

        startTimer();
    }


    function nextTurn() {
        let attempts = 0;
        do {
            gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
            attempts++;
        } while (gameState.players[gameState.currentPlayerIndex].hp <= 0 && attempts < gameState.players.length * 2)

        if (gameState.players.every(p => p.hp <= 0)) {
            gameOver();
            return;
        }
        gameState.currentQuestionIndex++;
        const nextPlayerName = gameState.players[gameState.currentPlayerIndex].name;
        showTransition(`Prepare-se, ${nextPlayerName}!`, 5, startTurn);
    }

    function handleAnswer(isCorrect) {
        if (answerLocked) return;
        answerLocked = true;

        clearInterval(timerInterval);
        disableTeacherControls(true);

        if (isCorrect) {
            gameState.currentVillainHP--;
            triggerHitEffect('villain-art');
        } else {
            if (gameState.hpMode === 'shared') {
                gameState.sharedPlayerHP--;
            } else {
                gameState.players[gameState.currentPlayerIndex].hp--;
            }
            triggerHitEffect('player-art');
        }

        updateUI();

        setTimeout(() => {
            if (gameState.currentVillainHP <= 0) {
                levelWon();
                answerLocked = false;
                return;
            }

            const currentPlayerDefeated = gameState.hpMode === 'individual' && gameState.players[gameState.currentPlayerIndex].hp <= 0;
            const allPlayersDefeated = gameState.hpMode === 'shared'
                ? gameState.sharedPlayerHP <= 0
                : gameState.players.every(p => p.hp <= 0);

            if (allPlayersDefeated) {
                gameOver();
                answerLocked = false;
                return;
            }

            if (currentPlayerDefeated) {
                const defeatedPlayerName = gameState.players[gameState.currentPlayerIndex].name;
                showTransition(`${defeatedPlayerName} foi derrotado(a)!`, 4, () => {
                    nextTurn();
                    answerLocked = false;
                });
            } else {
                nextTurn();
                answerLocked = false;
            }
        }, 1500);
    }

    function triggerRandomEvent(callback) {
        // Escolher tipo de NPC aleatório
        const tiposDisponiveis = Object.keys(npcTypes).filter(tipo => 
            npcTypes[tipo].some(npc => !npcsUsados.has(npc))
        );
        if (tiposDisponiveis.length === 0) {
            callback();
            return;
        }
        const tipo = tiposDisponiveis[Math.floor(Math.random() * tiposDisponiveis.length)];

        // Escolher NPC não usado ainda
        const npcsDisponiveis = npcTypes[tipo].filter(npc => !npcsUsados.has(npc));
        const npcEscolhido = npcsDisponiveis[Math.floor(Math.random() * npcsDisponiveis.length)];
        npcsUsados.add(npcEscolhido);

        // Escolher background
        const bg = bgList[Math.floor(Math.random() * bgList.length)];

        // Escolher frase
        let frase = eventTexts[tipo][Math.floor(Math.random() * eventTexts[tipo].length)];
        const jogador = gameState.players[gameState.currentPlayerIndex].name;
        const inimigo = gameState.levels[gameState.currentLevelIndex].villainName;
        const proximoInimigo = gameState.levels[gameState.currentLevelIndex + 1]?.villainName || "";

        frase = frase.replace(/\[jogador\]/g, jogador)
                    .replace(/\[inimigo\]/g, inimigo)
                    .replace(/\[proximo\]/g, proximoInimigo);

        // Atualizar elementos
        document.getElementById("event-bg").style.backgroundImage = `url('${bg}')`;
        // Captura o herói que venceu antes de mudar de turno
        const vencedor = gameState.lastWinner || gameState.players[gameState.currentPlayerIndex];
        document.getElementById("event-player-art").style.backgroundImage =
            `url('${vencedor.avatar.pose_padrao}')`;
        document.getElementById("event-npc-art").style.backgroundImage = `url('${npcEscolhido}')`;

        // Efeito de digitação
        const dialogueText = document.getElementById("dialogue-text");
        dialogueText.textContent = "";
        let i = 0;
        const interval = setInterval(() => {
            dialogueText.textContent += frase.charAt(i);
            i++;
            if (i >= frase.length) clearInterval(interval);
        }, 40);

        // Mostrar overlay
        const overlay = document.getElementById("event-overlay");
        overlay.classList.remove("hidden");

        document.getElementById("next-dialogue-btn").onclick = () => {
            overlay.classList.add("hidden");
            callback();
        };
    }

    function levelWon() {
        // Salva o herói vencedor antes de trocar para o próximo jogador/nível
        gameState.lastWinner = gameState.players[gameState.currentPlayerIndex];
        
        const level = gameState.levels[gameState.currentLevelIndex];
        document.getElementById('victory-art').style.backgroundImage = `url('${level.avatar.pose_derrota}')`;
        document.getElementById('victory-message').textContent = `${level.villainName} FOI DERROTADO!`;
        victoryScreen.classList.remove('hidden');

        let nextPlayerIndex = gameState.currentPlayerIndex;
        let attempts = 0;
        do {
            nextPlayerIndex = (nextPlayerIndex + 1) % gameState.players.length;
            attempts++;
        } while (gameState.players[nextPlayerIndex].hp <= 0 && attempts < gameState.players.length * 2)
        gameState.currentPlayerIndex = nextPlayerIndex;

        gameState.currentLevelIndex++;
        if (gameState.currentLevelIndex >= gameState.levels.length) {
            setTimeout(() => {
                victoryScreen.classList.add('hidden');
                document.getElementById('final-victory-screen').classList.remove('hidden');
            }, 3000); // Mostra tela final após 3 segundos
        } else {
            // Avança para a próxima pergunta antes do próximo nível
            gameState.currentQuestionIndex++;
            if (gameState.currentQuestionIndex >= gameState.questions.length) {
                shuffleArray(gameState.questions);
                gameState.currentQuestionIndex = 0;
            }

            setTimeout(() => {
                victoryScreen.classList.add('hidden');

                // Se não for a última batalha e ainda houver NPCs, mostrar evento
                if (gameState.currentLevelIndex < gameState.levels.length - 1 && npcsUsados.size < 30) {
                    triggerRandomEvent(() => startLevel());
                } else {
                    startLevel();
                }
            }, 5000);
        }
    }

    function gameOver() {
        const level = gameState.levels[gameState.currentLevelIndex];
        document.getElementById('game-over-art').style.backgroundImage = `url('${level.avatar.pose_vitoria}')`;
        document.getElementById('game-over-message').textContent = `${level.villainName} venceu desta vez.`;
        const defeatedArtContainer = document.getElementById('defeated-players-art-container');
        defeatedArtContainer.innerHTML = '';
        gameState.players.forEach(player => {
            const artDiv = document.createElement('div');
            artDiv.className = 'defeated-player-art';
            artDiv.style.backgroundImage = `url('${player.avatar.pose_derrota}')`;
            defeatedArtContainer.appendChild(artDiv);
        });
        gameOverScreen.classList.remove('hidden');
    }

    function updateArt() {
        const level = gameState.levels[gameState.currentLevelIndex];
        const player = gameState.players[gameState.currentPlayerIndex];
        document.getElementById('villain-art').style.backgroundImage = `url('${level.avatar.pose_padrao}')`;
        document.getElementById('player-art').style.backgroundImage = `url('${player.avatar.pose_padrao}')`;
    }

    function updateUI() {
        const level = gameState.levels[gameState.currentLevelIndex];
        const player = gameState.players[gameState.currentPlayerIndex];

        if (gameState.currentQuestionIndex >= gameState.questions.length) {
            shuffleArray(gameState.questions);
            gameState.currentQuestionIndex = 0;
        }

        document.getElementById('villain-name-display').textContent = level.villainName;
        document.getElementById('villain-hp-text').textContent = `HP: ${gameState.currentVillainHP} / ${level.maxVillainHP}`;
        const villainHpPercent = (gameState.currentVillainHP / level.maxVillainHP) * 100;
        document.getElementById('villain-hp-bar').style.width = `${villainHpPercent}%`;

        document.getElementById('turn-indicator').textContent = `É a vez de: ${player.name}`;
        document.getElementById('question-display').textContent = gameState.questions[gameState.currentQuestionIndex];

        if (gameState.hpMode === 'shared') {
            document.getElementById('player-hp-text').textContent = `HP do Time: ${gameState.sharedPlayerHP} / ${gameState.initialPlayerHP}`;
            const playerHpPercent = (gameState.sharedPlayerHP / gameState.initialPlayerHP) * 100;
            document.getElementById('player-hp-bar').style.width = `${playerHpPercent}%`;
        } else {
            document.getElementById('player-hp-text').textContent = `HP de ${player.name}: ${player.hp} / ${gameState.initialPlayerHP}`;
            const playerHpPercent = (player.hp / gameState.initialPlayerHP) * 100;
            document.getElementById('player-hp-bar').style.width = `${playerHpPercent}%`;
        }

        document.getElementById('timer-display').textContent = level.timePerQuestion;
        disableTeacherControls(false);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function startTimer() {
        let timeLeft = gameState.levels[gameState.currentLevelIndex].timePerQuestion;
        const timerDisplay = document.getElementById('timer-display');
        timerDisplay.textContent = timeLeft;
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerDisplay.textContent = "TEMPO ESGOTADO!";
                handleAnswer(false);
            }
        }, 1000);
    }

    function disableTeacherControls(disabled) {
        correctBtn.disabled = disabled;
        incorrectBtn.disabled = disabled;
    }

    function showTransition(message, duration, callback) {
        const msgElement = document.getElementById('transition-message');
        const timerElement = document.getElementById('transition-timer');
        msgElement.textContent = message;
        timerElement.textContent = duration;
        transitionScreen.classList.remove('hidden');

        // Atualiza barra de progresso
        const progressBar = document.getElementById('level-progress-bar');
        if (progressBar) {
            progressBar.innerHTML = '';
            for (let i = 0; i < gameState.levels.length; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i < gameState.currentLevelIndex) dot.classList.add('completed');
                else if (i === gameState.currentLevelIndex) dot.classList.add('active');
                progressBar.appendChild(dot);
            }
        }

        let countdown = duration;
        const countdownInterval = setInterval(() => {
            countdown--;
            timerElement.textContent = countdown;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                transitionScreen.classList.add('hidden');
                if (callback) callback();
            }
        }, 1000);
    }


    // --- Atualizar showTransition para mostrar o primeiro jogador antes da primeira pergunta:
    function showTransition(message, duration, callback) {
        const msgElement = document.getElementById('transition-message');
        const timerElement = document.getElementById('transition-timer');
        msgElement.textContent = message;
        timerElement.textContent = duration;
        transitionScreen.classList.remove('hidden');
        let countdown = duration;
        const countdownInterval = setInterval(() => {
            countdown--;
            timerElement.textContent = countdown;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                transitionScreen.classList.add('hidden');
                if (callback) callback();
            }
        }, 1000);
    }

        // === Adicionar efeitos visuais de HIT ===
    function triggerHitEffect(target) {
        const element = document.getElementById(target);
        if (!element) return;
        element.classList.add('hit-effect');
        setTimeout(() => element.classList.remove('hit-effect'), 500);
    }

    startGameBtn.addEventListener('click', initializeGame);
    addLevelBtn.addEventListener('click', addLevelConfig);
    removeLevelBtn.addEventListener('click', removeLastLevelConfig);
    addPlayerBtn.addEventListener('click', addPlayer);
    correctBtn.addEventListener('click', () => handleAnswer(true));
    incorrectBtn.addEventListener('click', () => handleAnswer(false));
    skipBtn.addEventListener('click', () => {
        if (answerLocked) return;
        clearInterval(timerInterval);
        disableTeacherControls(true);
        gameState.currentQuestionIndex++;
        updateUI();
        startTimer();
        disableTeacherControls(false);
    });

    addLevelConfig();
    addPlayerConfig();
});

