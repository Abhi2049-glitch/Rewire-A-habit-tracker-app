let habits = [];

function loadHabits() {
    const saved = localStorage.getItem('habits');
    if (saved) {
        habits = JSON.parse(saved);
        resetDailyCompletions();
    }
    renderHabits();
    updateProgress();
}

function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

function resetDailyCompletions() {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem('lastReset');
    
    if (lastReset !== today) {
        habits.forEach(habit => {
            habit.completedToday = false;
        });
        localStorage.setItem('lastReset', today);
        saveHabits();
    }
}

function addHabit() {
    const nameInput = document.getElementById('habitName');
    const emojiInput = document.getElementById('habitEmoji');
    
    const name = nameInput.value.trim();
    const emoji = emojiInput.value.trim();
    
    if (!name) {
        alert('Please enter a habit name!');
        return;
    }
    
    const habit = {
        id: Date.now(),
        name: name,
        emoji: emoji || '⭐',
        streak: 0,
        completedToday: false,
        lastCompleted: null
    };
    
    habits.push(habit);
    saveHabits();
    renderHabits();
    updateProgress();
    
    nameInput.value = '';
    emojiInput.value = '';
    nameInput.focus();
}

function completeHabit(id) {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;
    
    const today = new Date().toDateString();
    
    if (!habit.completedToday) {
        habit.completedToday = true;
        
        const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted).toDateString() : null;
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (lastCompleted === yesterday || lastCompleted === today) {
            habit.streak++;
        } else if (!lastCompleted) {
            habit.streak = 1;
        } else {
            habit.streak = 1;
        }
        
        habit.lastCompleted = today;
    }
    
    saveHabits();
    renderHabits();
    updateProgress();
    checkAllCompleted();
}

function deleteHabit(id) {
    if (confirm('Are you sure you want to delete this habit?')) {
        habits = habits.filter(h => h.id !== id);
        saveHabits();
        renderHabits();
        updateProgress();
    }
}

function renderHabits() {
    const container = document.getElementById('habitsContainer');
    container.innerHTML = '';
    
    if (habits.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        
        const emptyEmoji = document.createElement('div');
        emptyEmoji.className = 'empty-state-emoji';
        emptyEmoji.textContent = '🌱';
        
        const emptyText = document.createElement('div');
        emptyText.className = 'empty-state-text';
        emptyText.textContent = 'Start building your habits!';
        
        emptyState.appendChild(emptyEmoji);
        emptyState.appendChild(emptyText);
        container.appendChild(emptyState);
        return;
    }
    
    habits.forEach(habit => {
        const card = document.createElement('div');
        card.className = 'habit-card';
        
        const emojiDiv = document.createElement('div');
        emojiDiv.className = 'habit-emoji';
        emojiDiv.textContent = habit.emoji;
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'habit-info';
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'habit-name';
        nameDiv.textContent = habit.name;
        
        const streakDiv = document.createElement('div');
        streakDiv.className = 'habit-streak';
        streakDiv.textContent = `🔥 ${habit.streak} day${habit.streak !== 1 ? 's' : ''}`;
        
        infoDiv.appendChild(nameDiv);
        infoDiv.appendChild(streakDiv);
        
        const completeBtn = document.createElement('button');
        completeBtn.className = `complete-btn ${habit.completedToday ? 'completed' : ''}`;
        completeBtn.textContent = habit.completedToday ? '✓ Done' : 'Complete';
        if (habit.completedToday) {
            completeBtn.disabled = true;
        }
        completeBtn.addEventListener('click', () => completeHabit(habit.id));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '×';
        deleteBtn.addEventListener('click', () => deleteHabit(habit.id));
        
        card.appendChild(emojiDiv);
        card.appendChild(infoDiv);
        card.appendChild(completeBtn);
        card.appendChild(deleteBtn);
        
        container.appendChild(card);
    });
}

function updateProgress() {
    if (habits.length === 0) {
        document.getElementById('progressFill').style.width = '0%';
        document.querySelector('.progress-text').textContent = '0%';
        return;
    }
    
    const completed = habits.filter(h => h.completedToday).length;
    const percentage = Math.round((completed / habits.length) * 100);
    
    document.getElementById('progressFill').style.width = percentage + '%';
    document.querySelector('.progress-text').textContent = percentage + '%';
}

function checkAllCompleted() {
    if (habits.length > 0 && habits.every(h => h.completedToday)) {
        document.getElementById('congratsMessage').classList.remove('hidden');
        
        setTimeout(() => {
            document.getElementById('congratsMessage').classList.add('hidden');
        }, 4000);
    }
}

document.getElementById('addHabitBtn').addEventListener('click', addHabit);

document.getElementById('habitName').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addHabit();
    }
});

document.getElementById('habitEmoji').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addHabit();
    }
});

document.getElementById('congratsMessage').addEventListener('click', (e) => {
    if (e.target.id === 'congratsMessage') {
        e.target.classList.add('hidden');
    }
});

loadHabits();
