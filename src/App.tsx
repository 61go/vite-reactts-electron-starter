import React, { useState } from 'react';
import './index.css';
// import { writeFile } from 'fs';

const App: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [translate, setTranslate] = useState('waiting to reply...');
  const handleStartRecording = async () => {
    console.log('Starting recording...');
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder1 = new MediaRecorder(stream);
    setMediaRecorder(mediaRecorder1);
    const audioChunks: Blob[] = [];
    mediaRecorder1!.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder1!.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      console.log('Audio saved to:', audioBlob);
      console.log('Audio saved to:', audioUrl);
      const buffer = await fetch(audioUrl).then((res) => res.arrayBuffer());
      const audioArray = new Uint8Array(buffer);
      // const audioFile = new Blob([audioArray], { type: 'audio/wav' });
      // console.log('Audio saved to:', audioFile);

      // const audioBuffer = Buffer.from(audioArray);
      window.Main.writeFile(audioArray);

      // 完善代码，我想把文件存放在D:/wav/output.wav
      // const filePath = 'D:/wav/output.wav';
      // // 写入文件系统
      // const buffer = await fetch(audioUrl).then((res) => res.arrayBuffer());
      // const audioArray = new Uint8Array(buffer);
      // const audioFile = new Blob([audioArray], { type: 'audio/wav' });
      // const reader = new FileReader();
      // reader.onload = () => {
      //   const arrayBuffer = reader.result as ArrayBuffer;
      //   writeFile(filePath, Buffer.from(arrayBuffer), (err) => {
      //     if (err) {
      //       console.error('Error writing file:', err);
      //     } else {
      //       console.log('Audio saved to:', filePath);
      //     }
      //   });
      // };
      // reader.readAsArrayBuffer(audioFile);

      // const filePath = 'output.wav';
      // const buffer = await fetch(audioUrl).then((res) => res.arrayBuffer());
      // const audioFile = new File([buffer], filePath, { type: 'audio/wav' });
      // const reader = new FileReader();
      // reader.onload = () => {
      //   const arrayBuffer = reader.result as ArrayBuffer;
      //   const audioArray = new Uint8Array(arrayBuffer);
      //   const audioBlob = new Blob([audioArray], { type: 'audio/wav' });
      //   const audioUrl = URL.createObjectURL(audioBlob);
      //   const audio = new Audio(audioUrl);
      //   audio.play();
      // };
      // reader.readAsArrayBuffer(audioBlob);

      // console.log('Audio saved to:', filePath);
      audioChunks.length = 0;
      setIsRecording(false);
    };

    mediaRecorder1!.start();
    console.log('Recording started');
  };

  const handleStopRecording = () => {
    mediaRecorder!.stop();
    console.log('Recording stopped');
    setIsRecording(false);
  };

  return (
    <div className="App">
      <h1>Electron Recording App</h1>
      <button
        className="py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={handleStartRecording}
        disabled={isRecording}
      >
        模拟开始说话
      </button>
      <hr />
      <button
        className="py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={handleStopRecording}
        disabled={!isRecording}
      >
        模拟停止说话
      </button>
      <hr />
      <div className="border-2 bg-amber-50 h-1/4 w-2/3">
        <p>{translate}</p>
      </div>
    </div>
  );
};
export default App;
