export async function getUserLocation(){
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocalização não é suportada pelo seu navegador"));
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    reject(new Error("Erro ao obter localização: " + error.message));
                }
            );
        }
    });
}

export function exportTasksToJson(tasks) {
    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  
  export async function copyTask(task) {
    const text = `Tarefa: ${task.title}\nHora: ${task.hora || ''}\nConcluída: ${task.done ? 'Sim' : 'Não'}${task.location ? `\nLocalização: ${task.location.lat}, ${task.location.lng}` : ''}`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }
  
  
  export function listenTaskByVoice(onResult, onError) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const errorMsg = 'Reconhecimento de voz não suportado neste navegador';
      console.error(errorMsg);
      onError && onError('Reconhecimento de voz não suportado');
      return null;
    }

    console.log('SpeechRecognition disponível:', SpeechRecognition);

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        console.log('Reconhecimento de voz iniciado - fale agora');
      };


    recognition.onresult = (event) => {
        console.log('Resultado recebido:', event);
        const transcript = event.results[0][0].transcript;
        console.log('Texto reconhecido:', transcript);
      onResult(transcript);
    };
    recognition.onerror = (event) => {
      onError && onError(event.error);  
    };
    recognition.start();  
    return recognition;
  } 
   
  export async function shareTask(task) {
    if (!navigator.share) {
      throw new Error('Web Share API não suportada neste navegador/dispositivo.');
    }
    console.log('Compartilhando tarefa:', task);
    console.log('Tarefa para compartilhar:', task.title);
    const text = `Tarefa: ${task.title}\nHora: ${task.hora || ''}\nConcluída: ${task.done ? 'Sim' : 'Não'}${task.location ? `\nLocalização: ${task.location.lat}, ${task.location.lng}` : ''}`;
    const shareData = {
      title: task.title || 'Tarefa',
      text,
    };
    await navigator.share(shareData);
  }
