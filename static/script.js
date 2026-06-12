document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const voiceSelect = document.getElementById('voice-select');
    const generateBtn = document.getElementById('generate-btn');
    const audioContainer = document.getElementById('audio-container');
    const audioPlayer = document.getElementById('audio-player');
    const errorMessage = document.getElementById('error-message');
    const historyList = document.getElementById('history-list');

    generateBtn.addEventListener('click', async () => {
        const text = textInput.value.trim();
        const voice = voiceSelect.value;

        if (!text) {
            showError('Please enter some text to synthesize.');
            return;
        }

        // Reset UI
        hideError();
        audioContainer.classList.add('hidden');
        generateBtn.classList.add('loading');
        generateBtn.disabled = true;

        try {
            const response = await fetch('/api/synthesize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text, voice })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to generate audio');
            }

            // Get the audio blob
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            // Set up audio player
            audioPlayer.src = audioUrl;
            audioContainer.classList.remove('hidden');
            
            // Optionally auto-play
            audioPlayer.play().catch(e => console.log('Auto-play prevented:', e));
            
            // Refresh history
            loadHistory();

        } catch (error) {
            showError(error.message);
        } finally {
            generateBtn.classList.remove('loading');
            generateBtn.disabled = false;
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function hideError() {
        errorMessage.classList.add('hidden');
        errorMessage.textContent = '';
    }

    async function loadHistory() {
        try {
            const response = await fetch('/api/history');
            if (!response.ok) return;
            const history = await response.json();
            
            historyList.innerHTML = '';
            
            history.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                
                const textDiv = document.createElement('div');
                textDiv.className = 'history-text';
                textDiv.textContent = item.text;
                
                const metaDiv = document.createElement('div');
                metaDiv.className = 'history-meta';
                
                const voiceSpan = document.createElement('span');
                const voiceName = item.voice.split(':')[0].replace('en-US-', '');
                voiceSpan.textContent = `Voice: ${voiceName}`;
                
                const dateSpan = document.createElement('span');
                const date = new Date(item.created_at);
                dateSpan.textContent = date.toLocaleString();
                
                metaDiv.appendChild(voiceSpan);
                metaDiv.appendChild(dateSpan);
                
                historyItem.appendChild(textDiv);
                historyItem.appendChild(metaDiv);
                
                historyList.appendChild(historyItem);
            });
        } catch (error) {
            console.error('Failed to load history:', error);
        }
    }

    // Load history on initial page load
    loadHistory();
});
