import { useHistory } from 'react-router-dom';

import illustrationImg from '../assets/images/illustration.svg'
import illustrationDarkImg from '../assets/images/illustration-dark.svg'
import logoImg from '../assets/images/logo.svg'
import logoDarkImg from '../assets/images/logo-dark.svg'
import darklightImg from '../assets/images/dark-theme.png'
import googleIconImg from '../assets/images/google-icon-t.svg'
import signIn from '../assets/images/sign-in.svg'

import { Button } from '../components/Button/index';

import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';
import { useTheme } from '../hooks/useTheme';

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();

  const { theme, toggleTheme } = useTheme();

  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent){
    event.preventDefault();

    if(roomCode.trim() === ''){
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if(!roomRef.exists()) {
      alert('Room does not exists.');
      return;
    }

    if(roomRef.val().endedAt) {
      alert('Room already closed.');
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth" className={theme}>
      <aside className={theme}>
        {theme === 'dark' ? (
          <img src={illustrationDarkImg} alt="Ilustração simbolizando perguntas e respostas" />
        ) : (
          <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        )}
        <strong>Toda pergunta tem <br /> uma resposta.</strong>
        <p className={theme}>Aprenda, compartilhe e tire as dúvidas <br /> da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <div>
            {theme === 'dark' ? (
              <img src={logoDarkImg} alt="Letmeask" />
            ) : (
              <img src={logoImg} alt="Letmeask" />
            )}
            
            <img src={darklightImg} alt="Mude o tema para sua preferência" onClick={toggleTheme} />
          </div>
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
             type="text"
             placeholder="Digite o código da sala"
             onChange={event => setRoomCode(event.target.value)}
             value={roomCode}
             />
             <Button type="submit">
               <img src={signIn} alt="Logo de entrar" width="20px" height="20px" />
               Entrar na sala
             </Button>
          </form>
        </div>
      </main>
    </div>
  )
}